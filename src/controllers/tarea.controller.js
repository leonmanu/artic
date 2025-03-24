const req = require('express/lib/request')
const escuelaService = require('../services/escuela.service')

const get =  async (req, res) => {
    const user = req.session.user

    res.render("pages/tarea/tarea", {user})
}

module.exports = {
    get
}