const PacienteModel = require('../models/pacienteModel');

class PacienteController {
    // GET /api/pacientes
    static async getAll(req, res) {
        try {
            const pacientes = await PacienteModel.getAll();
            res.json({
                success: true,
                data: pacientes,
                total: pacientes.length
            });
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener pacientes',
                error: error.message
            });
        }
    }

    // GET /api/pacientes/:id
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const paciente = await PacienteModel.getById(id);
            if (!paciente) {
                return res.status(404).json({
                    success: false,
                    message: 'Paciente no encontrado'
                });
            }
            res.json({
                success: true,
                data: paciente
            });
        } catch (error) {
            console.error('Error en getById:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener paciente',
                error: error.message
            });
        }
    }

    // POST /api/pacientes
    static async create(req, res) {
        try {
            const paciente = await PacienteModel.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Paciente creado exitosamente',
                data: paciente
            });
        } catch (error) {
            console.error('Error en create:', error);
            // Error por duplicado de cédula
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({
                    success: false,
                    message: 'La cédula ya está registrada'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al crear paciente',
                error: error.message
            });
        }
    }

    // PUT /api/pacientes/:id
    static async update(req, res) {
        try {
            const { id } = req.params;
            const paciente = await PacienteModel.update(id, req.body);
            if (!paciente) {
                return res.status(404).json({
                    success: false,
                    message: 'Paciente no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Paciente actualizado exitosamente',
                data: paciente
            });
        } catch (error) {
            console.error('Error en update:', error);
            if (error.message.includes('UNIQUE')) {
                return res.status(400).json({
                    success: false,
                    message: 'La cédula ya está registrada'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al actualizar paciente',
                error: error.message
            });
        }
    }

    // DELETE /api/pacientes/:id
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PacienteModel.delete(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Paciente no encontrado'
                });
            }
            res.json({
                success: true,
                message: 'Paciente eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error en delete:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar paciente',
                error: error.message
            });
        }
    }
}

module.exports = PacienteController;