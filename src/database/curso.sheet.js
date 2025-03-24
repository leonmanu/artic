const { getCredenciales } = require('./credenciales.sheet');

/**
 * Obtener todas las filas de la hoja "cursos".
 */
async function get() {
    try {
        const sheet = await getCredenciales('curso');
        return await sheet.getRows();
    } catch (error) {
        console.error("Error al acceder al documento:", error);
        throw error;
    }
}

/**
 * Agregar un nuevo curso a la hoja.
 * @param {Object} data - Datos del curso.
 * @returns {Object} Curso agregado.
 */
async function post(data) {
    try {
        
        const sheet = await getCredenciales('curso');
        const newRow = await sheet.addRow(data);
        return newRow;
    } catch (error) {
        console.error("Error al agregar un nuevo curso:", error);
        throw error;
    }
}

/**
 * Modificar un curso existente en la hoja.
 * @param {Number} rowNumber - Índice de la fila a modificar.
 * @param {Object} data - Datos actualizados del curso.
 * @returns {Object} Curso modificado.
 */
async function update(rowNumber, data) {
    try {
        const sheet = await getCredenciales('curso');
        const rows = await sheet.getRows();

        // if (rowNumber <= 0 || rowNumber > rows.length) {
        //     throw new Error(`Índice de fila ${rowNumber} fuera de rango. Total filas: ${rows.length}`);
        // }

        const row = rows[rowNumber - 2]; // Índice basado en 1
        if (!row) {
            throw new Error(`No se encontró la fila con índice ${rowNumber}`);
        }

        // Actualizar las columnas con los nuevos valores
        row._worksheet._headerValues.forEach((column, index) => {
            if (data[column] !== undefined) {
                row._rawData[index] = data[column];
            }
        });

        await row.save(); // Guarda los cambios en la hoja
        console.log(`Curso ${rowNumber} modificado exitosamente.`);
        return row;
    } catch (error) {
        console.error(`Error al modificar el curso ${rowNumber}:`, error.message);
        throw error;
    }
}

/**
 * Eliminar un curso de la hoja.
 * @param {Number} rowNumber - Índice de la fila a eliminar.
 * @returns {Object} Curso eliminado.
 */
async function remove(rowNumber) {
    try {
        const sheet = await getCredenciales('curso');
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

        console.log(`Curso ${rowNumber} eliminado exitosamente.`);
        return row;
    } catch (error) {
        console.error(`Error al eliminar el curso ${rowNumber}:`, error.message);
        throw error;
    }
}

module.exports = { get, post, update, remove };