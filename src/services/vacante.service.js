const vacanteSheet = require('../database/vacante.sheet');
const cursoService = require('../services/curso.service');
const utilidadesService = require('./utilidades.service');

/**
 * Obtener todas las vacantes.
 */
const get = async () => {
    try {
        const vacantes = await vacanteSheet.get();
        return utilidadesService.convertToJson(vacantes);
    } catch (error) {
        console.error("vacanteService/get: Error al obtener las vacantes:", error.message);
        throw error;
    }
};

/**
 * Obtener todas las vacantes de una escuela.
 */
const getPorEscuelaClave = async (user) => {

    try {
        const registros = await get();

        if (!registros.length) {
            console.warn("No se encontraron vacantes.");
            return "";
        }

        // Filtrar cursos por ID de escuela
        const filtrados = registros.filter(row => row.escuelaClave === user.clave)

        //const resultadosJson = utilidadesService.convertToJson(filtrados)
        //console.log("filtrados  ",filtrados[0])

        return filtrados;

    } catch (error) {
        console.error("vacanteService/getPorEscuelaClave: Error al obtener las vacantes:", error.message);
        throw error;
    }
};

/**
 * Obtener todas las vacantes.
 */
const getPorEscuelaCurso = async (cursoClave, escuelaClave) => {

    try {
        const registros = await get();

        if (!registros.length) {
            console.warn("No se encontraron vacantes.");
            return "";
        }

        // Filtrar cursos por ID de escuela
        console.log("Registros: ", registros[0])
        const filtrados = registros.filter(row => row.cursoClave === cursoClave && row.escuelaClave === escuelaClave)

        //const resultadosJson = utilidadesService.convertToJson(filtrados)
        //console.log("filtrados  ",filtrados[0])

        return filtrados[0];

    } catch (error) {
        console.error("Error al obtener las vacantes:", error.message);
        throw error;
    }
};

/**
 * Agregar una nueva vacante.
 * @param {Object} data - Datos de la vacante.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */ 
    const post = async (data, user) => {
        try {
            const { 
                capacidad,
                vacantes, 
                ...cursoData 
            } = data;

            // Intentar crear el curso
            const nuevoCurso = await cursoService.post(cursoData, user);
            const ultimoId = await getUltimoId();

            const vacanteData = await {
                ...data,
                id: ultimoId + 1,
                escuelaClave: nuevoCurso.curso.get('escuelaClave'),
                cursoClave: nuevoCurso.curso.get('clave'),
                usuarioCreacion: user.email,
                fechaCreacion: new Date().toISOString(),
            };

            // Si el curso se crea correctamente, crear la vacante
            const resultado = await vacanteSheet.post(vacanteData);
            
            return resultado.toObject();
        } catch (error) {
            console.error("Error al agregar la vacante:", error.message);
            throw error; // Relanzar el error para que se maneje en el controlador
        }
    };

/**
 * Modificar una vacante existente.
 * @param {Number} rowNumber - Índice de la fila a modificar.
 * @param {Object} data - Datos actualizados de la vacante.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */
const update = async (cursoClave, data, user) => {
    try {
        const vacanteProcesada = {
            ...data,
            usuarioModificacion: user.clave,
        };

        const resultado = await vacanteSheet.update(cursoClave, vacanteProcesada)
        return resultado;
    } catch (error) {
        console.error("vacanteService: Error al modificar la vacante:", error.message)
        throw error
    }
};

/**
 * Eliminar una vacante (marcar como inactiva).
 * @param {Number} rowNumber - Índice de la fila a eliminar.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */
const remove = async (rowNumber, emailUsuario) => {
    try {
        const resultado = await vacanteSheet.remove(rowNumber);
        return resultado;
    } catch (error) {
        console.error("Error al eliminar la vacante:", error.message);
        throw error;
    }
};

async function getUltimoId(vacantes) {
    const registros = await get()
    
    if (registros.length === 0) {
        return 0; // o puedes retornar undefined o algún otro valor que indique que no hay registros
    }

    const indice = registros.length;
    const resultado = parseInt(registros[indice - 1].id)

    return resultado;
}

module.exports = { get, post, update, remove, getUltimoId, getPorEscuelaCurso,getPorEscuelaClave };