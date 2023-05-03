const jwt = require('jsonwebtoken');

const generateJWT = (uid, username, rol) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid, username, rol};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '72h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })
    } )
}

module.exports = {
    generateJWT
}