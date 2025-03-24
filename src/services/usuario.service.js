const { vault } = require('googleapis/build/src/apis/vault');
const usuarioSheet = require('../database/usuario.sheet')
const utilidadesService = require('./utilidades.service');
const { admin } = require('googleapis/build/src/apis/admin');

const get = async () => {
    try {
        const registros = await usuarioSheet.get();

        if (!registros.length) {
            console.warn("No se encontraron registros.")
            return []
        }
        
        const registrosJson = utilidadesService.convertToJson(registros)
        return registrosJson

    } catch (error) {
        console.error("Error al procesar los datos:", error.message)
        return []
    }
}

const getColumna = async (clave) => {
    try {
        const registros = await usuarioSheet.getColumna(clave);

        if (!registros.length) {
            console.warn("No se encontraron registros.")
            return []
        }
        return registros

    } catch (error) {
        console.error("Error al procesar los datos1:", error.message)
        return []
    }
}

const getSiExiste = async (email, tipo) => {
    try {
        const registros = await get();
        const usuario = registros.find(row => row.email === email);

        if (!usuario) {
            return {
                value: false,
                admin: false,
                message: "Usuario no registrado."
            };
        }

        if (tipo !== "Escuela") {
            console.log("usuario.admin: ", usuario.admin)
            if (usuario.admin === 'TRUE') {
                return {
                    value: true,
                    admin: true,
                    message: "Usuario admin aprobado."
                };
            } else {
                return {
                    value: true,
                    admin: false,
                    message: "Usuario admin en espera de aprobación."
                };
            }
        }

        // Si es tipo 'Escuela'
        return {
            value: true,
            admin: false,
            message: "Usuario tipo Escuela aprobado.",
            usuario: usuario
        };
    } catch (error) {
        console.error("Error al verificar usuario:", error.message);
        return {
            value: false,
            message: "Error al verificar usuario."
        };
    }
};



// const getSiExiste = async (objeto) => {
//     try {
//         const columna = 'email'
//         const registros = await getColumna(columna);
//         console.log("objeto: ", objeto)
//         console.log("registros: ", registros)
//         const resultado = await registros.filter(row => row == objeto)
//         console.log("resultado: ", resultado)
//         console.log("resultado: ", resultado.length)
//         if (resultado.length > 0) {
//             return true
//         }
//         else{
//             return false
//         }

//     } catch (error) {
//         console.error("Error al procesar los datos2:", error.message)
//         return []
//     }
// }

const post = async (objeto) => {
    try {
        const registros = await usuarioSheet.post(objeto);

        return registros

    } catch (error) {
        console.error("Error al procesar los datos:", error.message)
        return registros
    }
}


module.exports = {
    get,
    getColumna,
    getSiExiste,
    post
}