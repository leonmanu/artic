const express = require('express');
const vacanteController = require('../controllers/vacante.controller');

const router = express.Router();

// Rutas para vacantes
router.get('/showForm/:cursoClave?', vacanteController.showForm);
router.get('/', vacanteController.getPorEscuelaClave);
router.get('/list', vacanteController.get);
router.post('/post', vacanteController.post);
router.post('/put/:cursoClave', vacanteController.update);
router.delete('/:cursoClave', vacanteController.remove);

module.exports = router;