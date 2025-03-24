const {Router} = require('express')
const router = Router()

const {
    get,
    usuarioAnalisis,
    formAlta,
    formAltaAdmin,
    post,
    logout
} = require('../controllers/usuario.controller')

router
    .get('/', get)
    .get('/usuarioAnalisis', usuarioAnalisis)
    .get('/alta', formAlta)
    .get('/altaAdmin', formAltaAdmin)
    .get('/logout', logout)
    .post('/alta', post)

module.exports = router