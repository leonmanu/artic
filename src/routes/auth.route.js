const express = require('express');
const passport = require('../config/passport.config');

const router = express.Router();

// Ruta para iniciar sesión con Google
router.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account', // Forzar selección de cuenta
    })
);

// Ruta de callback de Google
router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })
);

// Ruta protegida (requiere autenticación)
router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('¡Bienvenido al Dashboard!');
    } else {
        res.redirect('/usuario/usuarioAnalisis');
    }
});

module.exports = router;
