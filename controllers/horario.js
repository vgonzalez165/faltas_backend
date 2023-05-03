const Usuario = require('../models/usuarios');
const Aula = require('../models/aula');
const Grupo = require('../models/grupo');
const Horario = require('../models/horario');

const {fechaToDia} = require('../helpers/fecha');




const { default: mongoose } = require('mongoose');

// Gruarda un horario individual en la base de datos
const saveHorario = async( { cod_profesor, 
                             dia, 
                             hora, 
                             cod_asignatura, 
                             cod_grupo, 
                             cod_aula, 
                             tipo} ) => {

    // Comprobación de los campos
    let errores = [];

    // Verificamos que el formato de los campos es correcto
    if ( !cod_profesor || !dia || !hora ) errores.push("Falta campo obligatorio (cod_profesor, dia u hora)");
    if ( tipo != 'LEC' && tipo != 'G') errores.push("Falta el campo tipo o su formato es incorrecto (LEC o G)");
    if ( tipo == "LEC" && !cod_grupo && !cod_aula) errores.push("Las horas lectivas requieren los campos cod_grupo y cod_aula");

    // Verificamos que el formato de día y hora sea correcto
    if (!'LMXJV'.split('').includes(dia)) errores.push('El formato de día no es correcto');
    if (!'1 2 3 4 5 6 V1 V2 V3 V4 V5 V6'.split(' ').includes(hora.toUpperCase())) errores.push('El formato de hora no es correcto');

    // Localizamos el profesor, grupo y aula a partir de su código
    const profesor = await Usuario.findOne({codigo: cod_profesor});
    if (!profesor) errores.push('Profesor no encontrado');
    
    let grupo;
    let aula;
    // Verificaciones cuando la hora es lectiva
    if (tipo == 'LEC') {
        // Verificamos que el grupo y aula existan
        grupo = await Grupo.findOne({codigo: cod_grupo});
        aula = await Aula.findOne({codigo: cod_aula});
        if (!grupo) errores.push('Grupo no encontrado');
        if (!aula) errores.push('Aula no encontrado');

        // Verificamos que no se haya registrado ya un horario en misma hora, día y aula
        const registrado = await Horario.findOne( { dia,
                                                    hora,
                                                    aula: aula._id} );
        if (registrado) errores.push('Ya se ha registrado un horario en ese mismo dia, hora y aula');
    }

    // Verificaciones cuando la hora es de guardia
    if (tipo == 'G') {
        // Verificamos que no se haya registrado ya un horario en misma hora, día y profesor
        const registrado = await Horario.findOne( { dia,
                                                    hora,
                                                    usuario: profesor._id} );
        if (registrado) errores.push('Ya se ha registrado un horario de guardia en ese profesor, día y hora');
    }

    // Si no hay errores se guarda la solicitud
    if (errores.length == 0) {
        const horarioData = {
            usuario: new mongoose.Types.ObjectId(profesor._id),
            tipo,
            hora, 
            dia
        }
        if ( tipo == 'LEC' ){
            horarioData.aula = aula?  new mongoose.Types.ObjectId(aula._id)  : '';
            horarioData.grupo = grupo? new mongoose.Types.ObjectId(grupo._id) : '';
        }
        const horario = new Horario( horarioData );
            
        return horario
                    .save()
                    .then( (data) => {
                        return Promise.resolve({status:true, horario});
                    })
                    .catch( () => {
                        return Promise.resolve({status: false, horario});
                    })
    } else {
        return Promise.resolve({ status: false,
                                 horario: { cod_profesor, 
                                            dia, 
                                            hora, 
                                            cod_asignatura, 
                                            cod_grupo, 
                                            cod_aula, 
                                            tipo,
                                            errores
                                          },
                                 errores
                                 });
    }
}

// --------------------------------------------------------------------------
// POST /api/horario   
// Registra un conjunto de horarios en la base de datos
const horarioPost = (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data)) {
            res.status(400).json({ msg: 'Los datos deben enviarse en un array' });
        } else {
            let failed = [];
            let added = [];
            Promise
                .all(data.map( item => saveHorario(item) ))
                .then( data => {
                    data.forEach( ({status, horario}) => {
                        if (status) added.push(horario)
                            else failed.push(horario);
                    })
                    res.status(200).json({
                        success: true,
                        total: data.length,
                        num_added: added.length,
                        num_failed: failed.length,
                        added: added,
                        failed
                    })
                })
                .catch( error => {
                    console.log(error);
                    res.status(400).json({ msg: "Error al guardar los horarios en la base de datos" });
                })
            }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}



// --------------------------------------------------------------------------
// GET /api/horario/:id
// Devuelve el horario cuyo identificador se indique
const horarioGetById = async(req, res) => {
    const id = req.params.id;
    try {
        const horario = await Horario
                                .findOne({_id:id})
                                .populate('usuario')
                                .populate('grupo')
                                .populate('aula');
        if (horario) {
            res.status(200).json(horario);
        } else {
            res.status(400).json({msg: 'Horario no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Grupo. Error al acceder a la base de datos'});
    }
}


 

// --------------------------------------------------------------------------
// GET /api/horario/profesor/:usuario/fecha/:fecha
// Devuelve el horario de un profesor en una fecha determinada
const horarioGetByDate = async(req, res) => {
    const id_usuario = req.params.usuario;
    const dia = fechaToDia(req.params.fecha);
    console.log(`-> Dia: ${dia}`);

    try {
        const horario = await Horario
                                .find({usuario:id_usuario, dia: dia})
                                .populate('aula')
                                .populate('grupo')
        if (horario) {
            res.status(200).json(horario);
        } else {
            res.status(400).json({msg: 'Horario no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Horario. Error al acceder a la base de datos'});
    }
}

// --------------------------------------------------------------------------
// GET /api/horario/profesor/:usuario
// Devuelve el horario semanal de un profesor
const horarioGetByTeacher = async(req, res) => {
    const id_usuario = req.params.usuario;

    try {
        const horario = await Horario
                                .find({ usuario:id_usuario })
                                .populate('aula')
                                .populate('grupo')
        if (horario) {
            res.status(200).json(horario);
        } else {
            res.status(400).json({msg: 'Horario no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Horario por fecha. Error al acceder a la base de datos'});
    }
}

// --------------------------------------------------------------------------
// GET /api/horario/profesor/:usuario/dia/:dia
// Devuelve el horario de un profesor en un día de la semana determinado (L, M, X, J, V)
const horarioGetByDay = async(req, res) => {
    
    const usuario = req.params.usuario;
    const dia = req.params.dia?.toUpperCase();
    try {
        const horario = await Horario
                                .find({usuario:usuario, dia: dia})
                                .populate('aula')
                                .populate('grupo')
        if (horario) {
            res.status(200).json(horario);
        } else {
            res.status(400).json({msg: 'Horario no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Horario por día. Error al acceder a la base de datos'});
    }
}

// Devuelve el listado de profesores que tienen guardia el día de la semana que se indique
const horarioGetGuardiaByDay = async(req, res) => {
    const dia = req.params.dia?.toUpperCase();
    try {
        const horario = await Horario
                                .find({dia: dia, tipo: 'G'})
                                .populate('aula')
                                .populate('grupo')
        if (horario) {
        res.status(200).json(horario);
        } else {
        res.status(400).json({msg: 'Horario no encontrado'})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Horario por día. Error al acceder a la base de datos'});
    }
}


// Devuelve el listado de profesores que tienen guardia el día de la semana que se indique
const horarioGetGuardiaByDayHour = async(req, res) => {
    const hora = req.params.hora;
    const dia = req.params.dia?.toUpperCase();
    try {
        const horario = await Horario
                                .find({dia, hora, tipo: 'G'})
                                .populate('aula')
                                .populate('grupo')
        if (horario) {
        res.status(200).json(horario);
        } else {
        res.status(400).json({msg: 'Horario no encontrado'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Get Horario por día. Error al acceder a la base de datos'});
    }
}


// TODO: Realmente hay que dejar opción de cambiar el horario???????????
const horarioPut = (req, res) => {
    res.status(200).json({
        msg: "horario PUT"
    })
}

// TODO: Igual para esto
const horarioDelete = (req, res) => {
    res.status(200).json({
        msg: "horario DELETE"
    })
}

module.exports = {
    horarioGetById,
    horarioGetByDate,
    horarioGetByTeacher,
    horarioGetByDay,
    horarioGetGuardiaByDay,
    horarioGetGuardiaByDayHour,
    horarioPost,
    horarioPut,
    horarioDelete
}