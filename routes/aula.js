const { Router } = require('express');
// const { check } = require('express-validator');

const {
    aulaPost,
    aulaGet,
    aulaGetById,
    aulaDelete,
    aulaPut
} = require('../controllers/aula');
const { validarJWTAdmin, validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
    validarJWTAdmin, 
    aulaPost);
router.get('/:id', 
    validarJWT,
    aulaGetById);
router.get('/',
    validarJWT,
    aulaGet);
router.delete('/:id',
    validarJWTAdmin,
    aulaDelete);
router.put('/:id',
    validarJWTAdmin,
    aulaPut);
// router.get('/')

module.exports = router;



