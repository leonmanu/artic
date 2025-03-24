const escuelaSheet = require('../database/escuela.sheet')
const utilidadesService = require('./utilidades.service')

const get = async () => {
    try {
        const registros = await escuelaSheet.get();

        if (!registros.length) {
            console.warn("No se encontraron registros.")
            return []
        }
        
        const registrosJson = utilidadesService.convertToJson(registros)
        return registrosJson

    } catch (error) {
        console.error("Error al procesar los datos:", error.message)
        return []
    }
}

const getColumna = async (clave) => {
    try {
        const registros = await escuelaSheet.getColumna(clave);

        if (!registros.length) {
            console.warn("No se encontraron registros.")
            return []
        }
        return registros

    } catch (error) {
        console.error("Error al procesar los datos1:", error.message)
        return []
    }
}

module.exports = {
    get,
    getColumna,
}