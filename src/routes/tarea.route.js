const {Router} = require('express')
const router = Router()

const {
    get
} = require('../controllers/tarea.controller')

router
    .get('/', get)

module.exports = router