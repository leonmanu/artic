const {Router} = require('express')
const router = Router()

const {
    get,
    acciones,
    salientes,
    entrantes,
    getPorEscuelaClave,
    getEntrantesPorEscuelaClave,
    getTodos
} = require('../controllers/estudiante.controller')

router
    .get('/', get)
    .get('/acciones', acciones)
    //.get('/salientes', salientes)
    //.get('/salientes/:claveEscuela?-:claveArticula?', getPorEscuelaClave)
    .get('/salientes/:claveEscuela?', getPorEscuelaClave)
    .get('/entrantes/:claveEscuela?', getEntrantesPorEscuelaClave)
    .get('/todos', getTodos)

module.exports = router