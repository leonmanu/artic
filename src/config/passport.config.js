const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs');

// Extrae los valores necesarios
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CALLBACK_URL = process.env.CALLBACK_URL

// Configura la estrategia de Google
passport.use(
    new GoogleStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URL,
            passReqToCallback: true,
            scope: ['email', 'profile'],
            prompt: 'select_account', // Para forzar la selección de cuenta
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('Perfil de usuario:', profile);
            // Aquí puedes verificar si el usuario ya existe en tu base de datos
            done(null, profile); // Puedes reemplazar profile con un objeto de usuario
        }
    )
);

// Serialización de usuario
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialización de usuario
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
