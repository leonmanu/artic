const estudianteSheet = require('../database/estudiante.sheet')
const utilidadesService = require('./utilidades.service')

const get = async () => {
    try {
        const registros = await estudianteSheet.get();

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

const getPorEscuelaClave = async (clave) => {
    //console.log("getPorEscuelaClave / clave: ", clave)
    try {
        const registros = await get()

        if (!registros.length) {
            console.warn("No se encontraron registros.")
            return []
        }

        const filtrados = await registros.filter(row => row.claveEscuela == clave)
        //console.log("estudiante.service -> filtrados: ", filtrados)
        
        //const registrosJson = utilidadesService.convertToJson(filtrados)
        return filtrados

    } catch (error) {
        console.error("Error al procesar los datos:", error.message)
        return []
    }
}

module.exports = {
    get,
    getPorEscuelaClave
}