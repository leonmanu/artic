const { getCredenciales } = require('./credenciales.sheet');

/**
 * Obtener todas las filas de la hoja "vacantes".
 */
async function get() {
    try {
        const sheet = await getCredenciales('vacante');
        return await sheet.getRows();
    } catch (error) {
        console.error("Error al acceder al documento:", error);
        throw error;
    }
}

/**
 * Agregar una nueva vacante a la hoja.
 * @param {Object} data - Datos de la vacante.
 * @returns {Object} Vacante agregada.
 */
async function post(objeto) {
    try {
        const sheet = await getCredenciales('vacante');
        const newRow = await sheet.addRow(objeto);
        return newRow;
    } catch (error) {
        console.error("Error al agregar una nueva vacante:", error);
        throw error;
    }
}

/**
 * Modificar una vacante existente en la hoja.
 * @param {Number} rowNumber - Índice de la fila a modificar.
 * @param {Object} data - Datos actualizados de la vacante.
 * @returns {Object} Vacante modificada.
 */
async function update(cursoClave, data) {
    try {
        const sheet = await getCredenciales('vacante');
        const rows = await sheet.getRows();
        const rowNumber = data.rowNumber;
        

        // if (rowNumber <= 0 || rowNumber > rows.length) {
        //     throw new Error(`Índice de fila ${rowNumber} fuera de rango. Total filas: ${rows.length}`);
        // }
        console.log("rows::: ", rows.length)
        const row = rows[rowNumber - 2]; // Índice basado en 1
        console.log("row::: ", row)
        if (!row) {
            throw new Error(`No se encontró la fila con índice ${rowNumber}`);
        }

        //console.log("datos:: ", data)

        // Actualizar las columnas con los nuevos valores
        row._worksheet._headerValues.forEach((column, index) => {
            if (data[column] !== undefined) {
                row._rawData[index] = data[column];
            }
        });

        await row.save(); // Guarda los cambios en la hoja
        console.log(`Vacante ${rowNumber} modificada exitosamente.`);
        return row;
    } catch (error) {
        console.error(`vacanteSheet: Error al modificar la vacante ${rowNumber}:`, error.message);
        throw error;
    }
}

/**
 * Eliminar una vacante (marcar como inactiva).
 * @param {Number} rowNumber - Índice de la fila a eliminar.
 * @returns {Object} Vacante eliminada.
 */
async function remove(rowNumber) {
    try {
        const sheet = await getCredenciales('vacante');
        const rows = await sheet.getRows();

        if (rowNumber <= 0 || rowNumber > rows.length) {
            throw new Error(`Índice de fila ${rowNumber} fuera de rango. Total filas: ${rows.length}`);
        }

        const row = rows[rowNumber - 2]; // Índice basado en 1
        if (!row) {
            throw new Error(`No se encontró la fila con índice ${rowNumber}`);
        }

        // Marcar la fecha de baja
        row.fechaBaja = new Date().toISOString();
        await row.save();

        console.log(`Vacante ${rowNumber} eliminada exitosamente.`);
        return row;
    } catch (error) {
        console.error(`Error al eliminar la vacante ${rowNumber}:`, error.message);
        throw error;
    }
}

module.exports = { get, post, update, remove };