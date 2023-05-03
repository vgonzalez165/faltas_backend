// Almacena las aulas del centro
//      codigo: código del aula             I102
//      uso: uso que se le da al aula (?)   IFC01S (CAR)
//      nombre: nombre del aula             Aula I102
//      desc: descripción del aula          ???????

const { Schema, model } = require('mongoose');

const AulaSchema = Schema({
    codigo: {
        type: String,
        required: [ true, 'El código de aula es obligatorio' ],
        unique: true
    },
    // uso: {
    //     type: String,
    // },
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ],
        unique: true,
    },
    // desc: {
    //     type: String,
    // },
})

module.exports = model( 'Aula', AulaSchema );
