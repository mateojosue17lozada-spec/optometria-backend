const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

// GET /api/pacientes - Listar todos
router.get('/', PacienteController.getAll);

// GET /api/pacientes/:id - Obtener uno
router.get('/:id', PacienteController.getById);

// POST /api/pacientes - Crear
router.post('/', PacienteController.create);

// PUT /api/pacientes/:id - Actualizar
router.put('/:id', PacienteController.update);

// DELETE /api/pacientes/:id - Eliminar
router.delete('/:id', PacienteController.delete);

module.exports = router;