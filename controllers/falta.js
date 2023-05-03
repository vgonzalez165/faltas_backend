const { fechaToDia } = require('../helpers/fecha');
const Falta = require('../models/falta');
const Horario = require('../models/horario');

const { default: mongoose } = require('mongoose');

// const faltaPost = (req,res) => {
//     res.status(200).json({msg: "POST Falta"})
// }


// --------------------------------------------------------------------------
// POST /api/falta/profesor/:user/fecha/:fecha/hora/:hora
// Registra una falta en la aplicación. Una falta es una combinación de un profesor, más una fecha y una hora
const faltaPost = async(req, res) => {
    const { usuario, fecha, hora } = req.params;
    const { tarea, guardia } = req.body;

    const dia = fechaToDia(fecha);
    // Se mira qué tiene el profesor a esa hora 
    try {
        const horario = await Horario.findOne ({usuario, dia, hora});
        
        if (!horario) {
            return res.status(400).json({
                                        success: false,
                                        msg: 'El profesor indicado no tiene clase a esa hora'
                                        })
        }
        
        // Si es una guardia simplemente lo guardo en la BD de faltas
        if ( horario.tipo?.toUpperCase() == 'G' ) {
            console.log("tiene guardia");
            const falta = new Falta({
                fecha,
                hora,
                profesor: usuario,
                tipo: 'G'
            });
            falta.save()
                .then(() => {
                    res.status(200).json({
                                        success: true,
                                        data: falta
                    })
                })
                .catch( () => {
                    res.status(400).json({
                        success: false,
                        msg: "Se ha producido un error al registrar la falta"
                        })
                })
        } else {
            console.log("Es una hora LECTIVA");
            const falta = new Falta({
                fecha,
                hora,
                tipo: 'LEC',
                profesor: usuario,
                aula: horario.aula,
                grupo: horario.grupo,
                tarea,
                guardia
            });
            falta
                .save()
                .then( () => {
                    res.status(200).json({
                                        success: true,
                                        msg: "Se ha registrado correctamente la falta",
                                        data: falta
                                    });
                })
                .catch( () => {
                    res.status(400).json({
                        success: false,
                        msg: "Se ha producido un error al registrar la falta"
                        });
                })
        }
    } catch (error){
        console.log(error);
        res.status(400).json({
            success: false,
            msg: "Se ha producido un error al registrar la falta"
            });
    }
}

const faltaPostDay = async(req, res) => {
    res.status(200).json({msg: "PENDIENTE DE IMPLEMENTAR"});
}


// GET /api/falta/profesor/:usuario
const faltaGetByUsuario = async(req, res) => {
    const usuario = req.params.usuario; 
    try {
        const faltas = await Falta.find({profesor: usuario});
        res.status(200).json(faltas);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al obtener los datos" });
    }
}

// GET /api/falta/profesor/:usuario/fecha/:fecha
const faltaGetByUsuarioFecha = async(req, res) => {
    const { usuario, fecha } = req.params; 

    try {
        const faltas = await Falta.find({profesor: usuario, fecha});
        res.status(200).json(faltas);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al obtener los datos" });
    }
}

// GET /api/falta/fecha/:fecha
const faltaGetByFecha = async(req, res) => {
    const { fecha } = req.params; 

    try {
        const faltas = await Falta.find({ fecha });
        res.status(200).json(faltas);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error al obtener los datos" });
    }
}


// DELETE /api/falta/:id
const faltaDelete = async(req, res) => {
    const id = req.params.id;
    try {
        const del = await Falta.deleteOne({_id: id});
        if (del.deletedCount) {
            res.status(200).json({msg: `Se ha eliminado la falta con id ${id}`})
        } else {
            res.status(300).json({msg: `No se ha encontrado la falta con el id ${id}`});
        }
    } catch (error) {
        res.status(400).json({
            msg: `Error al borrar la falta con id ${id}`
        });
    }
}



module.exports = {
    faltaPost,
    faltaPostDay,
    faltaGetByUsuario,
    faltaGetByUsuarioFecha,
    faltaGetByFecha,
    faltaDelete
}