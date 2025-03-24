const { getCredenciales } = require('./credenciales.sheet');

/**
 * Obtiene todas las filas de la hoja "escuela" y las devuelve como objetos.
 * @returns {Array} Lista de objetos que representan las filas.
 */
async function get() {
    try {
        // Obtener la hoja "escuela" usando las credenciales
        const sheet = await getCredenciales('escuela');
        const rows = await sheet.getRows();

        // Mapear los registros a objetos basados en los encabezados
        const registros = rows.map(row => {
            const obj = {};
            sheet.headerValues.forEach(header => {
                obj[header] = row[header] || null;
            });
            return obj;
        });

        return registros;
    } catch (error) {
        console.error("Error al acceder al documento:", error.message);
        throw error;
    }
}

/**
 * Obtiene los valores de una columna específica reduciendo el tráfico.
 * @param {String} columnName - El nombre de la columna a extraer.
 * @returns {Array} Lista de valores de la columna.
 */
async function getColumna(columnName) {
    try {
        // Obtener la hoja "escuela" usando las credenciales
        const sheet = await getCredenciales('escuela');

        // Cargar encabezados
        await sheet.loadHeaderRow();
        const columnIndex = sheet.headerValues.indexOf(columnName);

        if (columnIndex === -1) {
            throw new Error(`La columna '${columnName}' no existe en la hoja.`);
        }

        // Definir el rango de celdas para esa columna
        const range = {
            startColumnIndex: columnIndex,
            endColumnIndex: columnIndex + 1,
            startRowIndex: 1, // Ignorar encabezados
            endRowIndex: sheet.rowCount, // Hasta el final de las filas llenas
        };

        // Cargar los valores de las celdas en el rango
        await sheet.loadCells(range);
        const columnValues = [];

        for (let rowIndex = 1; rowIndex < sheet.rowCount; rowIndex++) {
            const cell = sheet.getCell(rowIndex, columnIndex);
            if (cell.value) {
                columnValues.push(cell.value); // Solo valores no nulos
            }
        }

        return columnValues;
    } catch (error) {
        console.error("Error al obtener la columna:", error.message);
        throw error;
    }
}

module.exports = { get, getColumna };
