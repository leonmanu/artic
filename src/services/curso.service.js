const cursoSheet = require('../database/curso.sheet');
const utilidadesService = require('./utilidades.service');

/**
 * Obtener todos los cursos de la hoja "cursos".
 */
const get = async () => {
    try {
        const cursos = await cursoSheet.get();

        if (!cursos.length) {
            console.warn("No se encontraron cursos.");
            return [];
        }

        return utilidadesService.convertToJson(cursos);
    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};

/**
 * Obtener todos los cursos de la hoja "cursos".
 */
const getPorClave = async (clave) => {
    try {
        const cursos = await get();

        if (!cursos.length) {
            console.warn("No se encontraron cursos.");
            return "";
        }

        // Filtrar cursos por ID de escuela
        const filtrados = cursos.filter(curso => curso.clave === clave)
        //const resultadosJson = utilidadesService.convertToJson(filtrados)

        return filtrados[0];
    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return "";
    }
};

/**
 * Obtener cursos filtrados por ID de escuela.
 * @param {string} idEscuela - ID de la escuela a filtrar.
 */
const getPorEscuelaClave = async (user) => {
    try {
        const cursos = await get();

        if (!cursos.length) {
            console.warn("No se encontraron cursos.");
            return [];
        }

        // Filtrar cursos por ID de escuela
        const filtrados = cursos.filter(row => row.escuelaClave === user.clave)

        return filtrados;
    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};

/**
 * Obtener cursos filtrados por grado.
 * @param {number} grado - Grado a filtrar (1 a 6).
 */
const getPorGrado = async (grado) => {
    try {
        const cursos = await get();

        if (!cursos.length) {
            console.warn("No se encontraron cursos.");
            return [];
        }

        // Filtrar cursos por grado
        const filtrados = cursos.filter(curso => curso.grado === grado);

        return filtrados;
    } catch (error) {
        console.error("Error al procesar los datos:", error.message);
        return [];
    }
};

/**
 * Agregar un nuevo curso.
 * @param {Object} curso - Datos del curso a agregar.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */
const post = async (curso, user) => {
    try {
        if (!curso || Object.keys(curso).length === 0) {
            throw new Error('No hay datos válidos para procesar.');
        }

        const cursos = await get();
        const clave = curso.grado + "-" + curso.division;
        const siExiste = await getSiExiste(clave, user.clave, cursos);

        if (siExiste) {
            // Lanzar un error con un mensaje específico
            throw new Error(`Ya existe un curso ${curso.grado}° ${curso.division}°.`);
        }

        const ultimoId = await getUltimoId(cursos);
        const cursoProcesado = {
            ...curso,
            id: ultimoId + 1,
            usuarioCreacion: user.email,
            escuelaClave: user.clave,
            clave: clave,
            fechaCreacion: new Date().toISOString(),
        };

        const resultado = await cursoSheet.post(cursoProcesado);
        return { curso: resultado, accion: 'agregado', message: 'Curso agregado correctamente.' };
    } catch (error) {
        console.error("Error al agregar el curso:", error.message);
        throw error; // Relanzar el error para que se maneje en el llamador
    }
};

/**
 * Modificar un curso existente.
 * @param {number} rowNumber - Índice de la fila a modificar.
 * @param {Object} curso - Datos actualizados del curso.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */
const update = async (curso, user) => {
    try {
        if (!curso || Object.keys(curso).length === 0) {
            throw new Error('No hay datos válidos para procesar.');
        }

        // Agregar propiedades adicionales
        const cursoProcesado = {
            ...curso,
            fechaModificacion: new Date().toISOString(),
            usuarioModificacion: user.email
        };

        const resultado = await cursoSheet.update(curso.rowNumber, cursoProcesado);
        return { curso: resultado, accion: 'modificado' };
    } catch (error) {
        console.error("Error al modificar el curso:", error.message);
        throw error;
    }
};

/**
 * Eliminar un curso (marcar como inactivo).
 * @param {number} rowNumber - Índice de la fila a eliminar.
 * @param {string} emailUsuario - Correo del usuario que realiza la acción.
 */
const remove = async (rowNumber, emailUsuario) => {
    try {
        const cursoProcesado = {
            fechaBaja: new Date().toISOString(),
            usuarioBaja: emailUsuario
        };

        const resultado = await cursoSheet.update(rowNumber, cursoProcesado);
        return { curso: resultado, accion: 'eliminado' };
    } catch (error) {
        console.error("Error al eliminar el curso:", error.message);
        throw error;
    }
};

async function getUltimoId(cursos) {
    const registros = cursos
    
    if (registros.length === 0) {
        return 0; // o puedes retornar undefined o algún otro valor que indique que no hay registros
    }

    const indice = registros.length;
    const resultado = parseInt(registros[indice - 1].id)

    return resultado;
}

const getSiExiste = async (clave, escuelaClave, cursos) => {
    const registros = cursos;

    // Verificar si existe algún registro con la clave y sin fecha de baja
    const existe = registros.some(row => row.clave === clave && row.escuelaClave === escuelaClave && !row.fechaBaja)

    console.log("getSiExiste:", existe, "clave:", clave)
    return existe; // Devuelve true o false
};

module.exports = {
    get,
    getPorEscuelaClave,
    getPorGrado,
    post,
    update,
    remove,
    getPorClave,
    getUltimoId,
    getSiExiste
};