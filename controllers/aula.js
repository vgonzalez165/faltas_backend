const Aula = require('../models/aula');
const { checkString } = require('../helpers/check')

// Mensajes de error
const ERROR_NO_CODIGO = 'Falta el código del aula';
const ERROR_NO_NOMBRE_AULA = 'Falta el nombre del aula';
const ERROR_FORMATO_CODIGO = 'El formato del código no es correcto';
const ERROR_FORMATO_NOMBRE = 'El formato del nombre no es correcto';

const saveAula = ( {codigo, nombre} ) => {
    // Comprobación de los campos
    let errores = [];
    if ( !codigo || !nombre )   errores.push(ERROR_NO_CODIGO);
    if ( !nombre )              errores.push(ERROR_NO_NOMBRE_AULA);
    if ( !checkString(codigo) ) errores.push(ERROR_FORMATO_CODIGO);
    if ( !checkString(nombre) ) errores.push(ERROR_FORMATO_NOMBRE);
    
    if ( errores.length == 0 ) {
        const aula = new Aula({
            codigo,
            nombre
        });
        return aula
                .save()
                .then( () => {
                    return Promise.resolve({status:true, aula});
                    } )
                .catch( () => {
                    return Promise.resolve({ status: false,
                                             aula: { codigo, nombre }});
                    } )
    } else {
        return Promise.resolve({ status: false, 
                                 aula: { codigo, nombre }, 
                                 errores})
    }
}



// --------------------------------------------------------------------------
// POST /api/aula   
// Registra un conjunto de aulas en la base de datos
const aulaPost = (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data)) {
            res.status(400).json({ msg: 'Los datos deben enviarse en un array' });
        } else {
            let failed = [];
            let added = [];
            Promise
                .all(data.map( item => saveAula(item) ))
                .then( data => {
                    data.forEach( ({status, aula}) => {
                        if (status) added.push(aula)
                            else failed.push(aula);
                    })
                    res.status(200).json({
                        success: true,
                        total: data.length,
                        num_added: added.length,
                        num_failed: failed.length,
                        added,
                        failed
                    })
                })
                .catch( error => {
                    console.log(error);
                    res.status(400).json({ msg: "Error al guardar las aulas en la base de datos" });
                })
            }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

// --------------------------------------------------------------------------
// GET /api/aula/    
// Devuelve un array con todas las aulas que hay en la base de datos
const aulaGet = async (req, res) => {
    try {
        const aulas = await Aula.find();
        res.status(200).json(aulas);
    } catch (error) {
        console.log(error)
        res.status(400).json({msg: "Error al obtener las aulas"});
    }
}

// --------------------------------------------------------------------------
// GET /api/aula/:id
// Devuelve los datos de un único aula a partir de su identificador
const aulaGetById = async(req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const aula = await Aula.findOne({_id: id});
        console.log(aula);
        if (aula) {
            res.status(200).json(aula);
        } else {
            res.status(400).json({ msg: 'Aula no encontrada '})
        }
    } catch (error){
        console.log(error);
        res.status(400).json({msg: 'Get Aula. Error al acceder a la base de datos'});
    }
}

// --------------------------------------------------------------------------
// DELETE /api/aula/:id
// Elimina el aula cuyo identificador se pasa como parámetro
const aulaDelete = async(req, res) => {
    const id = req.params.id;
    try {
        const del = await Aula.deleteOne({_id: id});
        if (del.deletedCount) {
            res.status(200).json({msg: `Se ha eliminado el aula con id ${id}`})
        } else {
            res.status(300).json({msg: `No se ha encontrado aula con el id ${id}`});
        }
    } catch (error) {
        res.status(400).json({
            msg: `Error al borrar el aula con id ${id}`
        });
    }
}

const aulaPut = async(req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    if ( !nombre ) {
        return res.status(400).json({ msg: "No se han enviado campos actualizables" });
    }

    try {
        const aula = await Aula.findOneAndUpdate( {_id: id}, { nombre } );
        res.status(200).json({ 
                            success: true,
                            msg: "Actualizado",
                            data: {
                                _id: id,
                                nombre
                            }
                        
                        });

    } catch (error) {
        res.status(400).json({ msg: "ERROR"});
    }
}


module.exports = {
    aulaGet,
    aulaGetById,
    aulaPost,
    aulaPut,
    aulaDelete
}