// Relaciona cada profesor y hora con su horario
//  id_usuario: id. del profesor                    (->IF67)
//  id_aula: id. del aula en que tiene clase        (->I102)
//  id_grupo: id. del grupo con que tiene clase     (->AS1A)
//  id_hora: id. de la hora                         (->V 5)
//  id_asignatura: id. de la asignatura             (->ISO)
//  tipo: si es lectiva o guardia                   (LEC)


const { Schema, model, default: mongoose } = require('mongoose');

const HorarioSchema = Schema({
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: [ true, 'El id de usuario(profesor) es obligatorio' ],
    },
    aula: {
        type: mongoose.Schema.ObjectId,
        ref: 'Aula',
    },
    grupo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Grupo',
    },
    hora: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'],
        required: [ true, 'La hora es obligatoria' ]
    },
    dia: {
        type: String,
        enum: ['L', 'M', 'X', 'J', 'V'],
        required: [ true, 'El día de la semana es obligatorio' ]
    },
    id_asignatura: {
        type: mongoose.Schema.ObjectId,
        ref: 'Asignatura',
    },
    tipo: {
        type: String,
        required: [ true, 'El tipo (lectiva,guardia) es obligatorio'],
        enum: [ 'LEC', 'G' ],
        default: 'LEC'
    }
})

module.exports = model( 'Horario', HorarioSchema );


// type: mongoose.Schema.ObjectId,
// ref: 'Modulo',
// require: true