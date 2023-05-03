const { response, request } = require('express');
const Usuario = require('../models/usuarios');
const bcryptjs = require('bcryptjs');
const {checkEmail, checkString} = require('../helpers/check');


// Guarda un usuario en la base de datos
const saveUsuario = ( {nombre, apellidos, mail, codigo, pass='1234', rol='profesor'} ) => {
    
    // Comprobación de los campos
    let errores = [];
    if ( !nombre ) errores.push('El campo nombre es obligatorio');
    if ( !apellidos ) errores.push('El campo apellidos es obligatorio');
    if ( !mail ) errores.push('El campo mail es obligatorio');
    if ( !codigo ) errores.push('El campo código es obligatorio');

    if ( !checkString(nombre) ) errores.push('El campo nombre tiene un formato incorrecto');
    if ( !checkString(apellidos) ) errores.push('El campo apellidos tiene un formato incorrecto');
    if ( !checkString(codigo) ) errores.push('El campo código tiene un formato incorrecto');
    if ( !checkString(rol) ) errores.push('El campo rol tiene un formato incorrecto');
    if (!checkEmail(mail)) errores.push('El campo mail tiene un formato incorrecto');

    if ( errores.length == 0 ) {
        const salt = bcryptjs.genSaltSync();
        const usuario = new Usuario({
            nombre,
            apellidos,
            mail,
            codigo,
            pass: bcryptjs.hashSync(pass, salt),
            rol,
            username: mail.split('@')[0]
        });

        return usuario
                .save()
                .then( (data) => {
                    return Promise.resolve({status:true, usuario});
                    } )
                .catch( () => {
                    return Promise.resolve({status: false, usuario: {nombre, apellidos, mail, codigo}});
                    } )
    } else {
        return Promise.resolve({ status: false, 
                                 usuario: {nombre, apellidos, mail, codigo},
                                 errores
                                });
    }
}

// --------------------------------------------------------------------------
// POST /api/usuario/    
// Registra un conjunto de usuarios en la base de datos
const usuariosPost = async ( req=request, res=response ) => {

    try {
        const data = req.body;
    
        if (!Array.isArray(data)) {
            res.status(400).json({ msg: 'Los datos deben enviarse en un array' });
        } else {
            let errors = [];
            let added = [];
    
            Promise
                .all(data.map( item => saveUsuario(item) ))
                .then( (data) => {
                    data.forEach( ({status, usuario}) => {
                        if (status) added.push(usuario)
                            else errors.push(usuario);
                    })
                    res.status(200).json({
                            success: true,
                            total: data.length,
                            num_added: added.length,
                            num_failed: errors.length,
                            added: added,
                            failed: errors
                    })
                })
                .catch( error => {
                    console.log(error);
                    res.status(400);
                })
        }
    } catch (error){
        res.status(500);
    }
}

// --------------------------------------------------------------------------
// GET /api/usuario/    
// Recoge el listado de usuarios de la base de datos
// TODO: implementar los query string: page, name, ....
const usuariosGet = async (req, res) => {
    // const { page, codigo, nombre, mail } = req.query;
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Error al obtener los datos"});
    }

}

// --------------------------------------------------------------------------
// GET /api/usuario/:id
// Devuelve los datos de un único usuario
const usuariosGetById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findOne({_id: id});
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(400).json({msg: 'Usuario no encontrado'})
        }
    } catch {
        res.status(400).json({msg: 'Error al acceder a la base de datos'});
    }
}


const usuariosPut = async(req, res) => {
    const id = req.params.id;
    const { nombre, apellidos, pass, rol } = req.body;

    // Comprobación de errores
    if ( !nombre && !apellidos && !pass && !rol ) {
        return res.status(400).json({ msg: "No se han enviado campos actualizables" });
    }
    if ( !checkString(nombre) ) {
        return res.status(400).json({ msg: "El formato del nombre es incorrecto" });
    }
    if ( !checkString(apellidos) ) {
        return res.status(400).json({ msg: "El formato de los apellidos es incorrecto" });
    }
    if ( !['admin', 'jefe_estudios', 'profesor'].includes(rol) ) {
        return res.status(400).json({ msg: "El valor del rol no es válido" });
    }

    // Actualizamos el registro
    const salt = bcryptjs.genSaltSync();
    try {
        const usuario = await Usuario.findOneAndUpdate( {_id: id}, { nombre, apellidos, pass: bcryptjs.hashSync(pass, salt), rol } );

        res.status(200).json({
                            success: true, 
                            msg: "Se ha actualizado el usuario", 
                            data: { _id: usuario._id,
                                    nombre: nombre ? nombre : usuario.nombre,
                                    apellidos: apellidos ? apellidos : usuario.apellidos,
                                    codigo: usuario.codigo,
                                    mail: usuario.mail,
                                    rol: rol ? rol : usuario.rol                                
                                }});

    } catch (error) {
        res.status(400).json({ 
                            success: false, 
                            msg: `Error al actualizar el usuario con id ${id}`
                            });
    }
}



const usuariosDelete = (req, res) => {
    res.status(200).json({msg: "Usuario DELETE. No implementado"});
}


















module.exports = {
    usuariosPost,
    usuariosGet,
    usuariosGetById,
    usuariosDelete,
    usuariosPut
}