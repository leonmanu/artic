const { getCredenciales } = require('./credenciales.sheet');

/**
 * Obtener todas las filas de la hoja "traspaso".
 */
async function get() {
    try {
        const sheet = await getCredenciales('estadoTraspaso');
        return await sheet.getRows();
    } catch (error) {
        console.error("Error al acceder al documento:", error);
        throw error;
    }
}

module.exports = { get, };
