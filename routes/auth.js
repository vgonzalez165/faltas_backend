const { Router } = require('express');
// const { check } = require('express-validator');

const {
    loginPost,
    tokenGet
} = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login',
    loginPost);
router.get('/token/:id',
    validarJWT,
    tokenGet);

module.exports = router;