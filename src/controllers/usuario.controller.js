const req = require('express/lib/request')
const usuarioService = require('../services/usuario.service')
const escuelaService = require('../services/escuela.service')

const get =  async (req, res) => {
    const registros = await escuelaService.get()
    
    res.render("pages/escuela/escuelaList", {escuelas: registros})
}

const usuarioAnalisis = async (req, res) => {
    const user = req.session.user;
    const email = user.email;
    const nameJson = user.name.split(' ');
    const tipo = nameJson[0]; // Identificamos el tipo por el primer nombre
    const nivel = nameJson[1]

    try {
        const resultado = await usuarioService.getSiExiste(email, tipo);
        //console.log("resultado: " + resultado.usuario.clave)

        if (!resultado.value) { // Usuario no existe
            if (tipo === 'Escuela') {
                return res.redirect("/usuario/alta")
            } else {
                return res.redirect("/usuario/altaAdmin")
            }
        }

        if (!resultado.admin) {
            if (tipo === 'Escuela') {
                user.clave = resultado.usuario.clave
                req.session.message = resultado.message;
                return res.redirect("/tarea")

            } else {
                req.session.message = resultado.message; // Guardar el mensaje en la sesión para mostrarlo
                return res.redirect("/"); // Redirige al inicio con el mensaje
            }
        }
        else{
            return res.redirect("/vacante/list") // Usuario existe y es admin
        }

    } catch (error) {
        console.error("Error al analizar el usuario:", error.message);
        res.status(500).send("Ocurrió un error al procesar la solicitud.");
    }
};


const post = (req, res) => {
    const user = req.session.user;
    const email = user.email;
    const nameJson = user.name.split(' ');
    const tipo = nameJson[0]; // Identificamos el tipo por el primer nombre
    const nivel = nameJson[1]

    const obj = req.body
    const resultado = usuarioService.post(obj, nameJson)
    if (tipo === 'Escuela') {
        if(nivel === 'Secundaria'){
            req.session.message = "Regitrado correctamente, vuelva a ingresar";
            return res.redirect("/")
        } else {
            return res.redirect("/estudiante/salientes/" + obj.clave)
        }
    } else {
        req.session.message = "Usuario admin en espera de aprobación."
        return res.redirect("/")
    }
}

const formAlta =  async (req, res) => {
    const id = req.session.user.id;
    const claveEscuelas = await escuelaService.getColumna('clave')
    const usuarioPorID = await usuarioService.getPorIdGoogle(id)
    console.log(usuarioPorID)


    const user = usuarioPorID || req.session.user
    res.render('pages/usuario/formAlta', {user, claveEscuelas})
}

const formAltaAdmin =  async (req, res) => {
    const user = req.session.user
    res.render('pages/usuario/formAltaAdmin', {user})
}


const logout =  async (req, res) => {
    // Destruir la sesión del usuario
    req.logout((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        req.session.destroy(() => {
            res.redirect('/'); // Redirigir a la página de inicio o login
        });
    });
}

module.exports = {
    get,
    post,
    usuarioAnalisis,
    formAlta,
    formAltaAdmin,
    logout
}