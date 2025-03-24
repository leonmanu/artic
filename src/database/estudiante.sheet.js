const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const googleId = '1u--FiGgUcA5Q7Zvd8Nw1TGR6wknUZUJsYxIJNroh4Jc';

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function get() {
    try {
        const documento = new GoogleSpreadsheet(googleId, serviceAccountAuth)
        
        await documento.loadInfo()
        const sheet = documento.sheetsByTitle['estudiante'];
        const rows = await sheet.getRows() // Obtenemos todas las filas
        
        return rows
    } catch (error) {
        console.error("Error al acceder al documento:", error)
    }
}

module.exports = { get };
