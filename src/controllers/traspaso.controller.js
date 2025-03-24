const req = require('express/lib/request')
const traspasoService = require('../services/traspaso.service')
//const escuelaService = require('../services/escuela.service')

const get =  async (req, res) => {
    const registros = await traspasoService.get()
    //const claveEscuelas = await escuelaService.getColumna('clave')
    
    res.render("pages/traspaso/traspasoList", {registros})
}

const postArray = async (req, res) => {
    try {
        const arrayJson = req.body.datosModificados;
        const emailUsuario = req.session.user.email
        const resultados = await traspasoService.postArray(arrayJson, emailUsuario);

        // Respuesta exitosa con un mensaje
        res.status(201).send("Registro agregado correctamente");
    } catch (error) {
        console.error("Error en el controller POST:", error.message);
        res.status(500).send("Error al agregar el registro.");
    }
}

const postArrayEntrantes = async (req, res) => {
    try {
        const arrayJson = req.body.datosModificados;
        const emailUsuario = req.session.user.email
        const resultados = await traspasoService.postArrayEntrantes(arrayJson, emailUsuario);

        // Respuesta exitosa con un mensaje
        res.status(201).send("Registro agregado correctamente");
    } catch (error) {
        console.error("Error en el controller POST:", error.message);
        res.status(500).send("Error al agregar el registro.");
    }
}


module.exports = {
    get,
    postArray,
    postArrayEntrantes
}