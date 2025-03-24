const req = require('express/lib/request')
const estudianteService = require('../services/estudiante.service')
const escuelaService = require('../services/escuela.service')
const traspasoaService = require('../services/traspaso.service')
const estadoTraspasoService = require('../services/estadoTraspaso.service')

const get =  async (req, res) => {
    const registros = await estudianteService.get()
    const claveEscuelas = await escuelaService.getColumna('clave')
    
    res.render("pages/estudiante/estudianteList", {estudiantes: registros, claveEscuelas, user: req.session.user})
}

const getTodos =  async (req, res) => {
    const registros = await estudianteService.get()
    const traspasos = await traspasoaService.get()
    
    res.render("pages/estudiante/estudianteTodos", {estudiantes: registros, traspasos, user: req.session.user})
}

const getPorEscuelaClave =  async (req, res) => {
    const clave = req.params.claveEscuela
    const claveArticula = req.params.claveArticula
    const registros = await estudianteService.getPorEscuelaClave(clave)
    const claveEscuelas = await escuelaService.getColumna('clave')
    const traspasos = await traspasoaService.getPorEscuelaClave(clave)
    
    res.render("pages/estudiante/estudianteSalientes", {estudiantes: registros, clave, claveEscuelas, claveArticula, traspasos, user: req.session.user})
}

const getEntrantesPorEscuelaClave =  async (req, res) => {
    const clave = req.params.claveEscuela
    const claveArticula = req.params.claveArticula
    const registros = await estudianteService.get()
    const claveEscuelas = await escuelaService.getColumna('clave')
    const traspasos = await traspasoaService.getPorEscuelaDestinoClave(clave)
    const estadoTraspasos = await estadoTraspasoService.get()
    
    res.render("pages/estudiante/estudianteEntrantes", {estudiantes: registros, clave, claveEscuelas, claveArticula, traspasos, estadoTraspasos, user: req.session.user})
}

const acciones =  async (req, res) => {
    
    res.render("pages/estudiante/estudianteAcciones", {user: req.session.user})

}

const salientes =  async (req, res) => {
    const registros = await estudianteService.get()
    const claveEscuelas = await escuelaService.getColumna('clave')
    
    res.render("pages/estudiante/estudianteSalientes", {estudiantes: registros, claveEscuelas, user: req.session.user})
    
}

const entrantes =  async (req, res) => {
    
    res.render("pages/estudiante/estudianteEntrantes", {user: req.session.user})
    
}

module.exports = {
    get,
    acciones,
    salientes,
    entrantes,
    getPorEscuelaClave,
    getEntrantesPorEscuelaClave,
    getTodos
}