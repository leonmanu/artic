const {Router} = require('express')
const router = Router()

const {
    get
} = require('../controllers/escuela.controller')

router
    .get('/', get)

module.exports = router