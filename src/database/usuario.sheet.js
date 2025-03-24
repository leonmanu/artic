const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const googleId = '1u--FiGgUcA5Q7Zvd8Nw1TGR6wknUZUJsYxIJNroh4Jc';

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

/**
 * Obtiene todos los registros de la hoja 'escuela'.
 * @returns {Array} Lista completa de registros como objetos.
 */
async function get() {
    try {
        const documento = new GoogleSpreadsheet(googleId, serviceAccountAuth);
        await documento.loadInfo();
        const sheet = documento.sheetsByTitle['usuario'];
        
        const registros = await sheet.getRows();

        return registros;
    } catch (error) {
        console.error("Error al acceder al documento:", error);
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
        const documento = new GoogleSpreadsheet(googleId, serviceAccountAuth);

        // Cargar la información del documento
        await documento.loadInfo();
        const sheet = documento.sheetsByTitle['usuario'];

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
        console.error("Error al obtener la columna:", error);
        throw error;
    }
}

// Agregar una nueva fila a la hoja
async function post(data) {
    try {
        const documento = new GoogleSpreadsheet(googleId, serviceAccountAuth);
        
        await documento.loadInfo();
        const sheet = documento.sheetsByTitle['usuario']; // Seleccionamos la hoja por título

        // Agregar una nueva fila
        const newRow = await sheet.addRow(data);

        //console.log("Nueva fila agregada:", newRow);
        return newRow;
    } catch (error) {
        console.error("Error al agregar una nueva fila:", error);
    }
}


module.exports = { 
    get, 
    getColumna,
    post
};
