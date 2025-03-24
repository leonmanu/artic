const estadoTraspasoSheet = require('../database/estadoTraspaso.sheet');
const utilidadesService = require('./utilidades.service');

/**
 * Obtener todos los registros de la hoja "traspaso".
 */
const get = async () => {
    try {
        const registros = await estadoTraspasoSheet.get();

        //console.log("estadoTraspasoSheet: ", registros)

        if (!registros.length) {
            console.warn("No se encontraron registros.");
            return [];
        }

        return utilidadesService.convertToJson(registros);
    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};

module.exports = { get, };
