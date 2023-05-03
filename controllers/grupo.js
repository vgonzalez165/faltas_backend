const Grupo = require('../models/grupo');
const { checkString } = require('../helpers/check')

const saveGrupo = ( {codigo, nombre} ) => {
    // Comprobación de los campos
    let error = false;
    let errores = [];
    if ( !codigo ) errores.push('El campo código es obligatorio');
    if ( !checkString(codigo) ) errores.push('El campo código tiene un formato incorrecto');
    if ( !checkString(nombre) ) errores.push('El campo nombre tiene un formato incorrecto');
    
    if ( errores.length == 0) {
        const grupo = new Grupo({
            codigo,
            nombre
        });
        return grupo
                .save()
                .then( (data) => {
                    return Promise.resolve({status:true, grupo});
                    } )
                .catch( () => {
                    return Promise.resolve({status: false, grupo: {codigo, nombre}});
                    } )
    } else {
        return Promise.resolve({ status: false,
                                 grupo: {codigo, nombre},
                                 errores
                                })
    }
}

// --------------------------------------------------------------------------
// POST /api/grupo    
// Registra un conjunto de gruposen la base de datos
const grupoPost = (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data)) {
            res.status(400).json({ msg: "Los datos deben enviarse en un array" });
        } else {
            let failed = [];
            let added = [];
            Promise
                .all( data.map( item => saveGrupo(item) ) )
                .then( data=> {
                    data.forEach( ({status, grupo}) => {
                        if (status) added.push(grupo)
                            else failed.push(grupo);
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
                    res.status(400).json({ msg: "Error al guardar los grupos en la base de datos" });
                })
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
}

// --------------------------------------------------------------------------
// GET /api/grupo/    
// Devuelve un array con todos los grupos que hay en la base de datos
const grupoGet = async(req, res) => {
    try {
        const grupos = await Grupo.find();
        res.status(200).json(grupos);
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Error al obtener los grupos"});
    }
}

// --------------------------------------------------------------------------
// GET /api/grupo/:id
// Devuelve los datos de un único grupo a partir de su identificador
const grupoGetById = async(req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const grupo = await Grupo.findOne({_id: id});
        console.log(grupo);
        if (grupo) {
            res.status(200).json(grupo);
        } else {
            res.status(400).json({msg: 'Grupo no encontrado'})
        }
    } catch {
        res.status(400).json({msg: 'Get Grupo. Error al acceder a la base de datos'});
    }
}

// --------------------------------------------------------------------------
// DELETE /api/grupo/:id
// Elimina el aula cuyo identificador se pasa como parámetro
const grupoDelete = async(req, res) => {
    const id = req.params.id;
    try {
        const del = await Grupo.deleteOne({_id: id});
        if (del.deletedCount) {
            res.status(200).json({msg: `Se ha eliminado el grupo con id ${id}`})
        } else {
            res.status(300).json({msg: `No se ha encontrado grupo con el id ${id}`});
        }
    } catch (error) {
        res.status(400).json({
            msg: `Error al borrar el grupo con id ${id}`
        })
    }
}


// const grupoPut = (req, res) => {
//     res.status(200).json({
//         msg: "grupo PUT"
//     })
// }


const grupoPut = async(req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    if ( !nombre ) {
        return res.status(400).json({ msg: "No se han enviado campos actualizables" });
    }

    try {
        const grupo = await Grupo.findOneAndUpdate( {_id: id}, { nombre } );
        res.status(200).json({ 
                            success: true,                
                            msg: "Se ha actualizado el grupo",
                            data: { _id: id, codigo: grupo.codigo, nombre: grupo.nombre}
                        });

    } catch (error) {
        res.status(400).json({ msg: "Error al actualizar el grupo"});
    }
}




module.exports = {
    grupoGet,
    grupoGetById,
    grupoPost,
    grupoPut,
    grupoDelete
}


