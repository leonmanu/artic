const {Router} = require('express')
const router = Router()

const {
    get, postArray, postArrayEntrantes
} = require('../controllers/traspaso.controller')

router
    .get('/', get)
    .post('/postArray', postArray)
    .post('/postArrayEntrantes', postArrayEntrantes)

module.exports = router