const traspasoSheet = require('../database/traspaso.sheet');
const utilidadesService = require('./utilidades.service');

/**
 * Obtener todos los registros de la hoja "traspaso".
 */
const get = async () => {
    try {
        const registros = await traspasoSheet.get();

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

/**
 * Obtener registros filtrados por clave de escuela.
 * @param {string} clave - Clave de la escuela a filtrar.
 */


const getPorEscuelaDestinoClave = async (clave) => {
    try {
        const registros = await get();

        if (!registros.length) {
            console.warn("No se encontraron registros.");
            return [];
        }

        // Filtrar registros por escuela origen
        const filtrados = registros.filter(row => row.escuelaDestino === clave);

        // Agrupar por documento y quedarse con el último registro
        const agrupados = filtrados.reduce((mapa, registro) => {
            if (!mapa[registro.documento] || registro.rowNumber > mapa[registro.documento].rowNumber) {
                mapa[registro.documento] = registro;
            }
            return mapa;
        }, {});

        // Convertir el mapa a un array
        return Object.values(agrupados);

    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};

const getPorEscuelaClave = async (clave) => {
    try {
        const registros = await get();

        if (!registros.length) {
            console.warn("No se encontraron registros.");
            return [];
        }

        // Filtrar registros por escuela origen
        const filtrados = registros.filter(row => row.escuelaOrigen === clave);

        // Agrupar por documento y quedarse con el último registro
        const agrupados = filtrados.reduce((mapa, registro) => {
            if (!mapa[registro.documento] || registro.rowNumber > mapa[registro.documento].rowNumber) {
                mapa[registro.documento] = registro;
            }
            return mapa;
        }, {});

        // Convertir el mapa a un array
        return Object.values(agrupados);

    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};


/**
 * Procesa un array de registros, agregando o modificando filas según la lógica definida.
 * @param {Array} arrayJson - Registros a procesar.
 * @param {String} emailUsuario - Correo del usuario que realiza la acción.
 */
const postArray = async (arrayJson, emailUsuario) => {
    //console.log("Servicio POST llamado con datos:", arrayJson);

    if (!arrayJson || !Array.isArray(arrayJson) || arrayJson.length === 0) {
        throw new Error('No hay datos válidos para procesar.');
    }

    const registrosProcesados = procesarRegistros(arrayJson, emailUsuario)

    const resultados = [];
    const errores = [];

    for (const registro of registrosProcesados) {
        try {
            if (registro.traspasoRow == 0 || (registro.traspasoRow > 0 && registro.estado == 3)) {
                // Caso 1: Agregar nueva fila
                registro.estado = 1
                const resultado = await traspasoSheet.post(registro);
                resultados.push({ registro, accion: 'agregado', resultado });
            } else if (registro.traspasoRow > 0 && registro.estado < 3) {
                // Caso 2: Modificar fila existente
                const resultado = await traspasoSheet.update(registro.traspasoRow, registro);
                resultados.push({ registro, accion: 'modificado', resultado });
            }
        } catch (error) {
            console.error("Error al procesar registro:", registro, error.message);
            errores.push({ registro, error: error.message });
        }
    }

    console.log(
        `${resultados.length} registros procesados correctamente, ${errores.length} errores.`
    );

    if (errores.length > 0) {
        throw new Error(
            `Se completó con errores: ${errores.length} registros fallaron.`
        );
    }

    return resultados;
}


const postArrayEntrantes = async (arrayJson, emailUsuario) => {
    //console.log("Servicio POST llamado con datos:", arrayJson);

    if (!arrayJson || !Array.isArray(arrayJson) || arrayJson.length === 0) {
        throw new Error('No hay datos válidos para procesar.');
    }

    const registrosProcesados = procesarRegistrosEntrantes(arrayJson, emailUsuario)

    const resultados = [];
    const errores = [];

    for (const registro of registrosProcesados) {
        try {
            if (registro.traspasoRow == 0 || (registro.traspasoRow > 0 && registro.estado == 3)) {
                // Caso 1: Agregar nueva fila
                const resultado = await traspasoSheet.post(registro);
                resultados.push({ registro, accion: 'agregado', resultado });
            } else if (registro.traspasoRow > 0 && registro.estado < 3) {
                // Caso 2: Modificar fila existente
                const resultado = await traspasoSheet.update(registro.traspasoRow, registro);
                resultados.push({ registro, accion: 'modificado', resultado });
            }
        } catch (error) {
            console.error("Error al procesar registro:", registro, error.message);
            errores.push({ registro, error: error.message });
        }
    }

    console.log(
        `${resultados.length} registros procesados correctamente, ${errores.length} errores.`
    );

    if (errores.length > 0) {
        throw new Error(
            `Se completó con errores: ${errores.length} registros fallaron.`
        );
    }

    return resultados;
}

/**
 * Agrega propiedades adicionales a los registros.
 * @param {Array} arrayJson - Registros originales.
 * @param {String} emailUsuario - Usuario que realiza la acción.
 * @returns {Array} Registros modificados.
 */
const procesarRegistros = (arrayJson, emailUsuario) => {
    const fechaActual = new Date().toISOString();
    return arrayJson.map(registro => ({
        ...registro,
        fecha: fechaActual,
        usuario: emailUsuario
    }));
};

const procesarRegistrosEntrantes = (arrayJson, emailUsuario) => {
    const fechaActual = new Date().toISOString();
    return arrayJson.map(registro => ({
        ...registro,
        fecha: fechaActual,
        usuarioFin: emailUsuario
    }));
};



module.exports = {
    get,
    postArray, 
    getPorEscuelaClave,
    getPorEscuelaDestinoClave, 
    postArrayEntrantes 
}
