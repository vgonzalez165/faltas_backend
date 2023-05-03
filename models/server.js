const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
require('dotenv').config();
// const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        // this.port = process.env.PORT;
        this.port = process.env.PORT;
        // this.ciclosPath = '/api/ciclos'

        // Conectar a base de datos
        dbConnection()

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }


    middlewares() {
        // CORS 
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') );
    }

    routes() {
        // this.app.use('/api/login', require('../routes/login'));

        this.app.use('/api/auth', require('../routes/auth'));
        this.app.use('/api/usuario', require('../routes/usuarios'));
        this.app.use('/api/aula', require('../routes/aula'));
        this.app.use('/api/grupo', require('../routes/grupo'));
        this.app.use('/api/horario', require('../routes/horario'));
        this.app.use('/api/falta', require('../routes/falta'));


    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        })
    }
}

module.exports = Server;