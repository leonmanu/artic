require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const path = require("path");
const session = require('express-session');
const passport = require('./config/passport.config');
const escuelaRouter = require('./routes/escuela.route');
const estudianteRouter = require('./routes/estudiante.route');
const traspasoRouter = require('./routes/traspaso.route');
const usuarioRouter = require('./routes/usuario.route');
const vacanteRouter = require('./routes/vacante.route');
const authRouter = require('./routes/auth.route');
const tareaRouter = require('./routes/tarea.route');
const cursoRouter = require('./routes/curso.route');
const { oauth2Callback } = require('./controllers/auth.controller');

const app = express();

app
    .use(express.static(__dirname + '/public'))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(
        session({
            secret: process.env.CLIENT_SECRET, // Cambia esto por algo seguro
            resave: false,
            saveUninitialized: false,
        }) 
    )
    .use(passport.initialize())
    .use(passport.session())
    .set("views", path.join(__dirname, "/views"))
    .set("view engine", "ejs")
    .use((req, res, next) => {
        res.locals.message = req.session.message || null; // Pasar el mensaje a las vistas
        delete req.session.message; // Borrar el mensaje después de usarlo
        next();
    })
    .get('/', (req, res) => {
        res.render('pages/inicio/inicio'); // Renderiza la vista inicio.ejs
    })
    //.use(require('./routes/estudiante.route'))
    .use('/estudiante', estudianteRouter)
    .use('/escuela', escuelaRouter)
    .use('/traspaso', traspasoRouter)
    .use('/usuario', usuarioRouter)
    .use('/tarea', tareaRouter)
    .use('/vacante', vacanteRouter)
    .use('/curso', cursoRouter)
    .use(authRouter) // Agrega las rutas de autenticación
    

    app.get('/oauth2callback', oauth2Callback);

module.exports = app;
