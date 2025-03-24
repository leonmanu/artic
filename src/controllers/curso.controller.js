const cursoService = require('../services/curso.service');

const showForm = async (req, res) => {
    try {
        const user = await req.session.user;
        const cursoClave = await req.params.cursoClave; // Capturar desde req.params

        let curso = null;

        if (cursoClave) {
            // Buscar el curso por clave
            curso = await cursoService.getPorClave(cursoClave);
        }


        // Renderizar la vista con los datos de la vacante
        res.render("pages/curso/cursoForm", { user, curso });
    } catch (error) {
        console.error("Error en el controller GET:", error.message);
        res.status(500).send("Error al obtener las vacantes.");
    }
};

/**
 * Obtener todos los cursos y renderizar la vista de listado.
 */
const get = async (req, res) => {
    try {
        const user = await req.session.user;
        const cursos = await cursoService.getPorEscuelaClave(user);
        res.render("pages/curso/cursoList", { cursos, user });
    } catch (error) {
        console.error("Error en el controller GET:", error.message);
        res.status(500).send("Error al obtener los cursos.");
    }
};

/**
 * Obtener cursos filtrados por ID de escuela y renderizar la vista de listado.
 */
const getPorEscuelaClave = async (req, res) => {
    try {
        const idEscuela = req.params.idEscuela;
        const cursos = await cursoService.getPorEscuela(idEscuela);
        res.render("pages/curso/cursoList", { cursos });
    } catch (error) {
        console.error("Error en el controller GET por escuela:", error.message);
        res.status(500).send("Error al obtener los cursos por escuela.");
    }
};

/**
 * Obtener cursos filtrados por grado y renderizar la vista de listado.
 */
const getPorGrado = async (req, res) => {
    try {
        const grado = req.params.grado;
        const cursos = await cursoService.getPorGrado(grado);
        res.render("pages/curso/cursoList", { cursos });
    } catch (error) {
        console.error("Error en el controller GET por grado:", error.message);
        res.status(500).send("Error al obtener los cursos por grado.");
    }
};

/**
 * Agregar un nuevo curso.
 */
const post = async (req, res) => {
    try {
        const curso = req.body;
        const user = req.session.user;
        const resultado = await cursoService.post(curso, user);

        // Respuesta exitosa con un mensaje
        res.status(201).send("Curso agregado correctamente", resultado);
    } catch (error) {
        console.error("Error en el controller POST:", error.message);
        res.status(500).send("Error al agregar el curso.");
    }
};

/**
 * Modificar un curso existente.
 */
const update = async (req, res) => {
    console.log("cursoController -> update")
    try {
        //const rowNumber = req.params.rowNumber;
        const curso = req.body;
        const user = req.session.user;
        const resultado = await cursoService.update(curso, user);

        // Respuesta exitosa con un mensaje
        res.status(200).send("Curso modificado correctamente");
    } catch (error) {
        console.error("Error en el controller UPDATE:", error.message);
        res.status(500).send("Error al modificar el curso.");
    }
};

/**
 * Eliminar un curso (marcar como inactivo).
 */
const remove = async (req, res) => {
    try {
        const rowNumber = req.params.rowNumber;
        const emailUsuario = req.session.user.email;
        const resultado = await cursoService.remove(rowNumber, emailUsuario);

        // Respuesta exitosa con un mensaje
        res.status(200).send("Curso eliminado correctamente");
    } catch (error) {
        console.error("Error en el controller REMOVE:", error.message);
        res.status(500).send("Error al eliminar el curso.");
    }
};

module.exports = {
    showForm,
    get,
    getPorEscuelaClave,
    getPorGrado,
    post,
    update,
    remove
};