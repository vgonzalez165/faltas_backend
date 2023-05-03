const Server = require('./models/server');
require('dotenv').config();

const server = new Server();

server.listen();


/*

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

let app = express();
// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
const PORT = 3000;
app.listen( PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});


// Clave para el JWT
const secret = 'This 1s S3cr3T';

function generateAccessToken(username) {
    return jwt.sign({
        exp: Math.floor( Date.now()/1000 + (60 * 60 * 24) ),        
        username
    }, secret); // Caducidad de 1 día
  }

function isValidToken(token, username) {
    try {
        const json = jwt.verify(token, secret);
        console.log("***");
        console.log(json);
        return (json.username == username);
    } catch (e) {
        return false;
    }
}


// Variables simulan la BASE DE DATOS
let users=[{
    nombre: "Administrador",
    apellidos: "Dam Daw",
    username: "admin",
    mail: "admin@educa.jcyl.es",
    username: "admin",
    pass: "1234",
    rol: "admin"
}];


// POST /api/login       ----------------------------------------------------------------

app.post('/api/login', (req, res) => {
    const {username, pass} = req.body;

    if (users.find( item => (item.username==username) && (item.pass==pass))) {
        let token = generateAccessToken(username);
        console.log("SI");
        res.status(200).json({token:token});
    } else {
        console.log("NO");
        res.status(401).json({success: 'false', msg: 'no vale'});
    }
});

// GET /api/token/:id
app.get('/api/token/:username', (req, res) => {
    const username = req.params.username;
    const token = req.headers.authorization?.split(' ')[1];
    // Comprobamos el token
    const user = users.find( item => item.username == username );
    if ( user  && token ) {
        if (isValidToken(token, username)) {
            res.status(200).json(
                    {   id: user.id,
                        token: generateAccessToken(username)
                    }
                );
        } else {
            res.status(401).json({success: 'false', msg: 'Error de autenticación'});
        }
    } else {
        console.log("No");
        res.status(400).json({success: 'false', msg: 'Usuario no existe o token no enviado'});
    }
})

// POST /api/user       ----------------------------------------------------------------
app.post('/api/user', (req, res) => {
    const data = req.body;

    if (!Array.isArray(data)) {
        res.status(400).json({msg: 'Los datos deben enviarse en un array'});
    } else {
        let errors = [];
        let added = [];
        data.forEach( item => {
            let {nombre, apellidos, codigo, mail, pass, rol='profesor'} = item;
            if (!nombre || !apellidos || !codigo || !mail || !pass) {
                console.log("Falta un campo obligatorio");
                errors.push(item);
            } else if ( (rol != 'profesor') && (rol != 'admin') && (rol != 'jefe_estudios') ) {
                console.log("El rol debe ser profesor, admin o jefe_estudios");
                errors.push(item);
            } else if (users.find( item => item.codigo == codigo)) {
                console.log("Código ya existente");
                errors.push(item);
            } else {
                const id = randomUUID();
                added.push({
                    id,
                    nombre,
                    apellidos,
                    codigo,
                    mail,
                    username: mail.split('@')[0],
                    pass,
                    rol
                });
                users.push({
                    id,
                    nombre,
                    apellidos,
                    codigo,
                    mail,
                    username: mail.split('@')[0],
                    pass,
                    rol
                });
            }
        })
        res.status(200).json({
            success: true,
            total: data.length,
            num_added: added.length,
            num_failed: errors.length,
            added: added,
            failed: errors
        })
    }
})
*/