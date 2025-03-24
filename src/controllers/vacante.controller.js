const vacanteService = require('../services/vacante.service');
const  cursoService = require('../services/curso.service')

/**
 * Obtener todas las vacantes.
 */

const showForm = async (req, res) => {
    try {
        const user = await req.session.user;
        const cursoClave = await req.params.cursoClave; // Capturar desde req.params

        let curso = null;
        let vacanteCurso = null;

        if (cursoClave) {
            // Buscar el curso por clave
            curso = await cursoService.getPorClave(cursoClave);

            if (curso) {
                // Buscar la vacante asociada al curso
                const vacante = await vacanteService.getPorEscuelaCurso(curso.clave, curso.escuelaClave);

                // Combinar datos del curso y la vacante
                vacanteCurso = {
                    ...curso,
                    capacidad: vacante.capacidad,
                    estudiantes: vacante.estudiantes,
                };
            }
        }


        // Renderizar la vista con los datos de la vacante
        res.render("pages/curso/cursoVacanteForm", { user, curso: vacanteCurso || curso });
    } catch (error) {
        console.error("Error en el controller GET:", error.message);
        res.status(500).send("Error al obtener las vacantes.");
    }
};

const get = async (req, res) => {
    try {
        const user = await req.session.user;
        const vacantes = await vacanteService.get();
        console.log("USER: ", user.admin)
        res.render("pages/curso/vacanteList", { vacantes, user });
    } catch (error) {
        console.error("Error en el controller GET:", error.message);
        res.status(500).send("Error al obtener las vacantes.");
    }
};

const getPorEscuelaClave = async (req, res) => {
    try {
        const user = await req.session.user;
        const vacantes = await vacanteService.getPorEscuelaClave(user);
        res.render("pages/curso/cursoVacanteList", { vacantes, user });
    } catch (error) {
        console.error("Error en el controller GET:", error.message);
        res.status(500).send("Error al obtener las vacantes.");
    }
};

/**
 * Agregar una nueva vacante.
 */
const post = async (req, res) => {
    try {
        const data = req.body;
        const user = await req.session.user;
        const resultado = await vacanteService.post(data, user);
        console.log("Resultado: ", resultado);
        res.status(201).json({ success: true, message: "Vacante agregada correctamente", cursoClave: resultado.cursoClave });
    } catch (error) {
        console.error("Error en el controller POST:", error.message);

        // Enviar el mensaje de error en formato JSON
        res.status(400).json({ 
            success: false, 
            message: error.message || "Error al agregar la vacante." 
        });
    }
}

/**
 * Modificar una vacante existente.
 */
const update = async (req, res) => {
    try {
        const user = await req.session.user;
        const cursoClave = await req.params.cursoClave;
        const data = req.body;
        const resultado = await vacanteService.update(cursoClave, data, user);
        res.status(200).send("Vacante modificada correctamente");
    } catch (error) {
        console.error("Error en el controller UPDATE:", error.message);
        res.status(500).send("Error al modificar la vacante.");
    }
};

/**
 * Eliminar una vacante.
 */
const remove = async (req, res) => {
    try {
        const rowNumber = req.params.rowNumber;
        const emailUsuario = req.session.user.email;
        const resultado = await vacanteService.remove(rowNumber, emailUsuario);
        res.status(200).send("Vacante eliminada correctamente");
    } catch (error) {
        console.error("Error en el controller REMOVE:", error.message);
        res.status(500).send("Error al eliminar la vacante.");
    }
};

module.exports = { showForm, get, getPorEscuelaClave, post, update, remove };