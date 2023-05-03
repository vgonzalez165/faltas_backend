const { request, response } = require('express')
const jwt = require('jsonwebtoken')

// TODO: habrá que ordenar este código para no repetirlo tanto

const ERROR_NO_TOKEN = "No hay token en la petición";
const ERROR_PRIVILEGIOS = "El usuario no tiene suficientes privilegios";
const ERROR_VALIDAR_TOKEN = "Error al validar el token";

// Tareas que únicamente puede realizar un usuario con privilegios de administrador
const validarJWTAdmin = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: ERROR_NO_TOKEN })
    
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        if (decoded.rol != 'admin') {
            return res.status(401).json({ msg: ERROR_PRIVILEGIOS });
        } else {
            next();
        }
    } catch (err){
        return res.status(401).json({
            msg: ERROR_VALIDAR_TOKEN
        })
    }
}

// Tareas que únicamente puede realizar un jefe de estudios o administrador
const validarJWTJefeEstudios = (req,res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: ERROR_NO_TOKEN })
    
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        if (decoded.rol != 'jefe_estudios' && decoded.rol != 'admin') {
            return res.status(401).json({ msg: ERROR_PRIVILEGIOS });
        } else {
            next();
        }
    } catch (err){
        return res.status(401).json({
            msg: ERROR_VALIDAR_TOKEN
        })
    }
}

// Tareas que únicamente puede realizar un jefe de estudios, administrador o el propio usuario
const validarJWTJefeEstudiosOrSelf = (req,res, next) => {
    const token = req.header('Authorization');
    const id = req.params.usuario;

    if (!token) return res.status(401).json({ msg: ERROR_NO_TOKEN })
    
    try {
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        if (decoded.rol != 'jefe_estudios' && decoded.rol != 'admin') {
            return res.status(401).json({ msg: ERROR_PRIVILEGIOS });
        } else if (decoded.id != id) {
            return res.status(401).json({ msg: ERROR_PRIVILEGIOS });
        } else {
            next();
        }
    } catch (err){
        return res.status(401).json({
            msg: ERROR_VALIDAR_TOKEN
        })
    }
}


// Tareas que puede realizar cualquier usuario registrado en el sistema
const validarJWT = ( req=request, res=response, next ) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ msg: ERROR_NO_TOKEN })
    
    try {
        jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        next();
    } catch (err){
        return res.status(401).json({
            msg: ERROR_VALIDAR_TOKEN
        })
    }
}

module.exports = {
    validarJWT,
    validarJWTAdmin,
    validarJWTJefeEstudios,
    validarJWTJefeEstudiosOrSelf
}