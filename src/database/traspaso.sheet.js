const { getCredenciales } = require('./credenciales.sheet');

/**
 * Obtener todas las filas de la hoja "traspaso".
 */
async function get() {
    try {
        const sheet = await getCredenciales('traspaso');
        return await sheet.getRows();
    } catch (error) {
        console.error("Error al acceder al documento:", error);
        throw error;
    }
}

/**
 * Agregar una nueva fila a la hoja.
 */
/**
 * Agrega una nueva fila a la hoja.
 * @param {Object} data - Datos del registro.
 * @returns {Object} Registro agregado.
 */
async function post(data) {
    try {
        const sheet = await getCredenciales('traspaso');
        const newRow = await sheet.addRow(data);
        return newRow;
    } catch (error) {
        console.error("Error al agregar una nueva fila:", error);
        throw error;
    }
}

/**
 * Agregar múltiples filas a la hoja "traspaso".
 * @param {Array} data - Array de objetos para agregar.
 */
async function postArray(data) {
    try {
        const sheet = await getCredenciales('traspaso');
        const responses = await Promise.allSettled(
            data.map(async registro => {
                if (!registro || Object.keys(registro).length === 0) {
                    throw new Error("Registro vacío o inválido.");
                }
                await sheet.addRow(registro);
            })
        );

        const errores = responses.filter(res => res.status === 'rejected');
        if (errores.length) {
            console.error(`${errores.length} registros fallaron.`);
        }

        return {
            value: errores.length === 0,
            message: errores.length 
                ? `${errores.length} registros fallaron.` 
                : "Todos los registros se agregaron correctamente."
        };
    } catch (error) {
        console.error("Error crítico al procesar registros:", error.message);
        return {
            value: false,
            message: error.message,
        };
    }
}

/**
 * Modifica una fila existente en la hoja utilizando directamente el índice `rowNumber`.
 * @param {Number} rowNumber - Índice de la fila a modificar.
 * @param {Object} data - Datos actualizados.
 * @returns {Object} Fila modificada.
 */
async function update(rowNumber, data) {
    try {
        const sheet = await getCredenciales('traspaso');
        const rows = await sheet.getRows();

        if (rowNumber <= 0 || rowNumber > rows.length) {
            throw new Error(`Índice de fila ${rowNumber} fuera de rango. Total filas: ${rows.length}`);
        }

        const row = rows[rowNumber - 2]; // Índice basado en 1
        if (!row) {
            throw new Error(`No se encontró la fila con índice ${rowNumber}`);
        }

        // Actualizar las columnas con los nuevos valores

        try {
            // Recorremos los encabezados y actualizamos las columnas de la fila
            row._worksheet._headerValues.forEach((column, index) => {
                if (data[column] !== undefined) { // Solo actualizamos si hay datos disponibles
                    row._rawData[index] = data[column]; // Actualización en _rawData
                }
            });
        
            // Guardar cambios
            await row.save();
            console.log("Fila actualizada exitosamente.");
        } catch (error) {
            console.error("Error al actualizar la fila:", error.message);
        }
        


        await row.save(); // Guarda los cambios en la hoja
        console.log(`Fila ${rowNumber} modificada exitosamente.`);
        return row;
    } catch (error) {
        console.error(`Error al modificar la fila ${rowNumber}:`, error.message);
        throw error;
    }
}


module.exports = { get, post, postArray, update };
