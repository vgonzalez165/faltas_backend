const { Router } = require('express');
// const { check } = require('express-validator');

const {
    grupoPost,
    grupoGet,
    grupoGetById,
    grupoDelete,
    grupoPut
} = require('../controllers/grupo');
const { validarJWTAdmin, validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
    validarJWTAdmin,
    grupoPost);
router.get('/', 
    validarJWT,
    grupoGet);
router.get('/:id', 
    validarJWT,
    grupoGetById);
router.delete('/:id',
    validarJWTAdmin,
    grupoDelete);
    
router.put('/:id', grupoPut);
// router.get('/')

module.exports = router;