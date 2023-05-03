const { Schema, model, default: mongoose } = require('mongoose');

const FaltaSchema = Schema({
    fecha: {
        type: String,
        required: [ true, "La fecha es obligatoria" ]
    },
    hora: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
        required: [true, "La hora es obligatoria"]
    },
    profesor: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuario"
    },
    aula: {
        type: mongoose.Schema.ObjectId,
        ref: "Aula"
    },
    grupo: {
        type: mongoose.Schema.ObjectId,
        ref: "Grupo"
    },
    tarea: {
        type: String
    },
    guardia: {
        type: Boolean,
        default: false
    },
    tipo: {
        type: String,
        enum: ['LEC', 'G'],
        required: true
    }    
})

module.exports = model( 'Falta', FaltaSchema );
