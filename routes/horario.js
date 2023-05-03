const { Router } = require('express');
// const { check } = require('express-validator');

const {
    horarioPost,
    horarioGetById,
    horarioGetByDate,
    horarioGetByTeacher,
    horarioGetByDay,
    horarioGetGuardiaByDay,
    horarioGetGuardiaByDayHour,
    horarioDelete,
    horarioPut
} = require('../controllers/horario');
const { validarJWTAdmin, validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
    validarJWTAdmin,
    horarioPost);
router.get('/profesor/:usuario/fecha/:fecha', 
    validarJWT,
    horarioGetByDate);
router.get('/profesor/:usuario', 
    validarJWT,
    horarioGetByTeacher);
router.get('/profesor/:usuario/dia/:dia', 
    validarJWT,
    horarioGetByDay);
router.get('/guardia/dia/:dia', 
    validarJWT,
    horarioGetGuardiaByDay);
router.get('/guardia/dia/:dia/hora/:hora', 
    validarJWT,
    horarioGetGuardiaByDayHour);
router.get('/:id', 
    validarJWT,
    horarioGetById);
router.put('/', 
    validarJWTAdmin,
    horarioPut);
router.delete('/',
    validarJWTAdmin,
    horarioDelete);

// router.get('/')

module.exports = router;