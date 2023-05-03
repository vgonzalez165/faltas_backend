const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    apellidos: {
        type: String,
        required: [ true, 'Los apellidos son obligatorios' ]
    },
    codigo: {
        type: String,
        required: [ true, 'El código es obligatorio' ],
        unique: true,
    },
    mail: {
        type: String,
        required: [ true, 'El correo electrónico es obligatorio' ],
        unique: true,
    },
    pass: {
        type: String,
        required: [ true, "La contraseña es obligatoria" ]
    },
    rol: {
        type: String,
        required: true,
        enum: [ 'admin', 'profesor', 'jefe_estudios' ],
        default: 'profesor'
    },
    estado: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
        required: true,
    }

})

module.exports = model( 'Usuario', UsuarioSchema );


// {
//     nombre: String,     // Nombre del usuario
//     apellidos: String,  // Apellidos del usuario
//     codigo: String,     // Código de profesor
//     mail: String,       // Correo electrónico. Tiene que ser de @educa.jcyl.es
//     pass: String,       // Contraseña
//     rol: String         // Opcional. "admin"|"profesor"|"jefe_estudios"
// },