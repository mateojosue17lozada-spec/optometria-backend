const CitaModel = require('../models/citaModel');

class CitaController {
    // GET /api/citas
    static async getAll(req, res) {
        try {
            const citas = await CitaModel.getAll();
            res.json({
                success: true,
                data: citas,
                total: citas.length
            });
        } catch (error) {
            console.error('Error en getAll citas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener citas',
                error: error.message
            });
        }
    }

    // GET /api/citas/:id
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cita = await CitaModel.getById(id);
            if (!cita) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                data: cita
            });
        } catch (error) {
            console.error('Error en getById cita:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener cita',
                error: error.message
            });
        }
    }

    // POST /api/citas
    static async create(req, res) {
        try {
            const { paciente_id, fecha, hora, motivo, estado, observaciones } = req.body;
            // Validaciones
            if (!paciente_id || !fecha || !hora) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios: paciente_id, fecha, hora'
                });
            }
            // Validar que el paciente existe (opcional, pero recomendado)
            // Aquí podrías llamar a PacienteModel.getById(paciente_id) si lo tuvieras importado

            const cita = await CitaModel.create({
                paciente_id,
                fecha,
                hora,
                motivo,
                estado,
                observaciones
            });
            res.status(201).json({
                success: true,
                message: 'Cita creada exitosamente',
                data: cita
            });
        } catch (error) {
            console.error('Error en create cita:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear cita',
                error: error.message
            });
        }
    }

    // PUT /api/citas/:id
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { paciente_id, fecha, hora, motivo, estado, observaciones } = req.body;
            if (!paciente_id || !fecha || !hora) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos obligatorios: paciente_id, fecha, hora'
                });
            }
            const cita = await CitaModel.update(id, {
                paciente_id,
                fecha,
                hora,
                motivo,
                estado,
                observaciones
            });
            if (!cita) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Cita actualizada exitosamente',
                data: cita
            });
        } catch (error) {
            console.error('Error en update cita:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar cita',
                error: error.message
            });
        }
    }

    // DELETE /api/citas/:id
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await CitaModel.delete(id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
            }
            res.json({
                success: true,
                message: 'Cita eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error en delete cita:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar cita',
                error: error.message
            });
        }
    }

    // GET /api/citas/paciente/:pacienteId
    static async getByPaciente(req, res) {
        try {
            const { pacienteId } = req.params;
            const citas = await CitaModel.getByPaciente(pacienteId);
            res.json({
                success: true,
                data: citas,
                total: citas.length
            });
        } catch (error) {
            console.error('Error en getByPaciente:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener citas del paciente',
                error: error.message
            });
        }
    }

    // GET /api/citas/rango?start=YYYY-MM-DD&end=YYYY-MM-DD
    static async getByDateRange(req, res) {
        try {
            const { start, end } = req.query;
            if (!start || !end) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requieren start y end como query params (YYYY-MM-DD)'
                });
            }
            const citas = await CitaModel.getByDateRange(start, end);
            res.json({
                success: true,
                data: citas,
                total: citas.length
            });
        } catch (error) {
            console.error('Error en getByDateRange:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener citas por rango',
                error: error.message
            });
        }
    }
}

module.exports = CitaController;