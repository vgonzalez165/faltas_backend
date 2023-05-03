const { Router } = require('express');

const {
    faltaPost,
    faltaGetByUsuario,
    faltaGetByUsuarioFecha,
    faltaGetByFecha,
    faltaPostDay,
    faltaDelete
} = require('../controllers/falta');
const { validarJWTAdmin, validarJWTJefeEstudiosOrSelf, validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/profesor/:usuario/fecha/:fecha/hora/:hora', 
    validarJWTJefeEstudiosOrSelf,
    faltaPost);
router.post(
    '/profesor/:usuario/fecha/:fecha', 
    validarJWTJefeEstudiosOrSelf,
    faltaPostDay)
router.get(
    '/profesor/:usuario', 
    validarJWT,
    faltaGetByUsuario);                      // Devuelve todas las faltas de un usuario
router.get(
    '/profesor/:usuario/fecha/:fecha', 
    validarJWT,
    faltaGetByUsuarioFecha);    // Devuelve todas las faltas de un usuario en una fecha determinada
router.get(
    '/fecha/:fecha', 
    validarJWT,
    faltaGetByFecha);                             // Devuelve todas las faltas en una fecha

// TODO: ¿Quién puede borrar una falta? ¿Cómo implementamos el middleware?
router.delete(
    '/:id', 
    faltaDelete);


module.exports = router;