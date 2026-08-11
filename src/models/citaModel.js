const { getConnection, sql } = require('../config/database');

class CitaModel {
    // Obtener todas las citas con datos del paciente
    static async getAll() {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                c.id,
                c.paciente_id,
                p.nombre + ' ' + p.apellido AS paciente_nombre,
                p.cedula AS paciente_cedula,
                c.fecha,
                c.hora,
                c.motivo,
                c.estado,
                c.observaciones,
                c.created_at,
                c.updated_at
            FROM citas c
            INNER JOIN pacientes p ON c.paciente_id = p.id
            ORDER BY c.fecha DESC, c.hora ASC
        `);
        return result.recordset;
    }

    // Obtener cita por ID
    static async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    c.id,
                    c.paciente_id,
                    p.nombre + ' ' + p.apellido AS paciente_nombre,
                    p.cedula AS paciente_cedula,
                    c.fecha,
                    c.hora,
                    c.motivo,
                    c.estado,
                    c.observaciones,
                    c.created_at,
                    c.updated_at
                FROM citas c
                INNER JOIN pacientes p ON c.paciente_id = p.id
                WHERE c.id = @id
            `);
        return result.recordset[0];
    }

    // Crear cita
    static async create(data) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('paciente_id', sql.Int, data.paciente_id)
            .input('fecha', sql.Date, data.fecha)
            .input('hora', sql.Time, data.hora)
            .input('motivo', sql.NVarChar, data.motivo || null)
            .input('estado', sql.VarChar(20), data.estado || 'pendiente')
            .input('observaciones', sql.NVarChar, data.observaciones || null)
            .query(`
                INSERT INTO citas (paciente_id, fecha, hora, motivo, estado, observaciones)
                VALUES (@paciente_id, @fecha, @hora, @motivo, @estado, @observaciones);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        const newId = result.recordset[0].id;
        return await this.getById(newId);
    }

    // Actualizar cita
    static async update(id, data) {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('paciente_id', sql.Int, data.paciente_id)
            .input('fecha', sql.Date, data.fecha)
            .input('hora', sql.Time, data.hora)
            .input('motivo', sql.NVarChar, data.motivo || null)
            .input('estado', sql.VarChar(20), data.estado)
            .input('observaciones', sql.NVarChar, data.observaciones || null)
            .query(`
                UPDATE citas
                SET 
                    paciente_id = @paciente_id,
                    fecha = @fecha,
                    hora = @hora,
                    motivo = @motivo,
                    estado = @estado,
                    observaciones = @observaciones,
                    updated_at = GETDATE()
                WHERE id = @id
            `);
        return await this.getById(id);
    }

    // Eliminar cita
    static async delete(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM citas WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }

    // Obtener citas por rango de fechas (para calendario)
    static async getByDateRange(startDate, endDate) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('start', sql.Date, startDate)
            .input('end', sql.Date, endDate)
            .query(`
                SELECT 
                    c.id,
                    c.paciente_id,
                    p.nombre + ' ' + p.apellido AS paciente_nombre,
                    p.cedula AS paciente_cedula,
                    c.fecha,
                    c.hora,
                    c.motivo,
                    c.estado,
                    c.observaciones
                FROM citas c
                INNER JOIN pacientes p ON c.paciente_id = p.id
                WHERE c.fecha BETWEEN @start AND @end
                ORDER BY c.fecha, c.hora
            `);
        return result.recordset;
    }

    // Obtener citas de un paciente específico
    static async getByPaciente(pacienteId) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('paciente_id', sql.Int, pacienteId)
            .query(`
                SELECT 
                    id,
                    fecha,
                    hora,
                    motivo,
                    estado,
                    observaciones,
                    created_at,
                    updated_at
                FROM citas
                WHERE paciente_id = @paciente_id
                ORDER BY fecha DESC, hora ASC
            `);
        return result.recordset;
    }
}

module.exports = CitaModel;