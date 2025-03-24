const req = require('express/lib/request')
const escuelaService = require('../services/escuela.service')

const get =  async (req, res) => {
    const registros = await escuelaService.get()
    
    res.render("pages/escuela/escuelaList", {escuelas: registros})
}

module.exports = {
    get
}