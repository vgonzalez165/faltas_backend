// Representa un grupo de alumnos
//  codigo: AS1A
//  nombre: 1º ASIR

const { Schema, model } = require('mongoose');

const GrupoSchema = Schema({
    codigo: {
        type: String,
        required: [ true, 'El código de grupo es obligatorio' ],
        unique: true
    },
    nombre: {
        type: String,
    },
})

module.exports = model( 'Grupo', GrupoSchema );
