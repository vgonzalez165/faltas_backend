// Representa una hora dentro del horario
//  nombre: 1º ASIR

const { Schema, model } = require('mongoose');

const GrupoSchema = Schema({
    dia: {
        type: String,
        required: [ true, 'El día de la semana es obligatorio' ],
        enum: [ 'L', 'M', 'X', 'J', 'V' ],
    },
    hora: {
        type: String,
        required: [ true, 'La hora es obligatoria' ],
        enum: [ '1', '2', '3', '4', '5', '6', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', ],
    },
})

module.exports = model( 'Hora', GrupoSchema );
