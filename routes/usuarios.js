const { Router } = require('express');
// const { check } = require('express-validator');

const {
    usuariosPost,
    usuariosPut,
    usuariosGet,
    usuariosDelete,
    usuariosGetById,
} = require('../controllers/usuarios');
const { validarJWT, validarJWTAdmin, validarJWTJefeEstudios } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
    validarJWTAdmin,
    usuariosPost);
router.get('/', 
    validarJWTJefeEstudios,
    usuariosGet);
router.get('/:id',
    validarJWT,
    usuariosGetById);
router.delete('/',
    validarJWTAdmin,
    usuariosDelete);
router.put('/:id',
    validarJWTAdmin,
    usuariosPut);

// router.get('/')

module.exports = router;