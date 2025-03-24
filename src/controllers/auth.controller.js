const { google } = require('googleapis');
const oauth2 = google.oauth2('v2')

// Configurar el cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.NODE_ENV === 'production'
        ? 'https://articulacion.onrender.com/oauth2callback'
        : 'http://localhost:5000/oauth2callback'
);

/**
 * Callback de OAuth2: Intercambia el código por tokens
 */
const oauth2Callback = async (req, res) => {
    try {
        const { code } = req.query; // Obtener el código de autorización desde la URL

        // Intercambiar el código por tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Configurar las credenciales en el cliente OAuth2
        oauth2Client.setCredentials(tokens);

        // Obtener información del perfil del usuario
        const userInfoResponse = await oauth2.userinfo.get({ auth: oauth2Client });
        const userInfo = userInfoResponse.data; // Datos del usuario
        if (userInfo.hd === 'abc.gob.ar') {
            // Usuario autorizado
            req.session.user = userInfo;
            res.redirect('/dashboard'); // Redirigir al dashboard
        } else {
            // Usuario no autorizado, almacenar mensaje en la sesión
            req.session.message = 'El dominio de tu correo no está permitido.';
            res.redirect('/'); // Redirigir a la pantalla de inicio
        }
    } catch (error) {
        console.error('Error al procesar el código de autorización:', error);
        res.status(500).send('Error en la autenticación');
    }
};

module.exports = { oauth2Callback };
