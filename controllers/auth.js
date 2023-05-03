const { response, request } = require('express');
const Usuario = require('../models/usuarios');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate_jwt');
const jwt = require('jsonwebtoken');


const loginPost = async(req, res) => {
    const { username, pass } = req.body;
    if ( !username || !pass ) {
        res.status(401).json({
            msg: 'Falta campo obligatorio'
        })
    } else {
        const usuario = await Usuario.findOne({username});
        if ( usuario && usuario.estado ) {
            // Validamos la contraseña
            const validPass = bcryptjs.compareSync(pass, usuario.pass);
            if (!validPass) {
                res.status(401).json({
                    msg: "La contraseña no es correcta"
                })
            } else {
                const token = await generateJWT(usuario._id, usuario.username, usuario.rol);
                res.status(200).json({
                    id: usuario._id,
                    token
                })
            }
        } else {
            res.status(401).json({
                msg: "El usuario no existe o ha sido borrado"
            })
        }
    }
}


const tokenGet = async (req=request, res=response) => {
    
    const usuarioId = req.params.id;
    const old_token = req.headers.authorization;

    // Decodificamos el token
    const decodedToken = jwt.decode(old_token, {
        complete: true
       });

    // Buscamos al usuario en la base de datos
    const usuario = await Usuario.findOne({_id: usuarioId});

    // Si coincide el token con el usuario 
    if ( usuario._id == decodedToken.payload.uid) {
        const token = await generateJWT(usuario._id, usuario.username, usuario.rol);
                    res.status(200).json({
                        id: usuario._id,
                        token
                    })
    } else {
        res.status(400).json({msg: 'No coincide id de usuario con el del token'})
    }

}

module.exports = {
    loginPost,
    tokenGet
}