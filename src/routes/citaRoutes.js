const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/citaController');

// GET /api/citas - Listar todas
router.get('/', CitaController.getAll);

// GET /api/citas/rango - Rango de fechas (query: ?start=YYYY-MM-DD&end=YYYY-MM-DD)
router.get('/rango', CitaController.getByDateRange);

// GET /api/citas/paciente/:pacienteId - Citas de un paciente
router.get('/paciente/:pacienteId', CitaController.getByPaciente);

// GET /api/citas/:id - Obtener una cita
router.get('/:id', CitaController.getById);

// POST /api/citas - Crear
router.post('/', CitaController.create);

// PUT /api/citas/:id - Actualizar
router.put('/:id', CitaController.update);

// DELETE /api/citas/:id - Eliminar
router.delete('/:id', CitaController.delete);

module.exports = router;