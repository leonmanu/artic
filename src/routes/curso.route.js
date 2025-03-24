const express = require('express');
const cursoController = require('../controllers/curso.controller');

const router = express.Router();

// Rutas para cursos
router.get('/showForm/:cursoClave?', cursoController.showForm);
router.get('/', cursoController.get);
router.get('/grado/:grado', cursoController.getPorGrado);
router.post('/', cursoController.post);
router.post('/put/:cursoClave', cursoController.update);
router.delete('/:cursoClave', cursoController.remove);

module.exports = router;