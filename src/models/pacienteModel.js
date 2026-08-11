const { getConnection, sql } = require('../config/database');

class PacienteModel {
    // Obtener todos los pacientes
    static async getAll() {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                SELECT 
                    id, nombre, apellido, cedula, telefono, email,
                    direccion, fecha_nacimiento, genero,
                    created_at, updated_at
                FROM pacientes
                ORDER BY apellido, nombre
            `);
        return result.recordset;
    }

    // Obtener paciente por ID
    static async getById(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    id, nombre, apellido, cedula, telefono, email,
                    direccion, fecha_nacimiento, genero,
                    created_at, updated_at
                FROM pacientes
                WHERE id = @id
            `);
        return result.recordset[0];
    }

    // Crear paciente
    static async create(data) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar(100), data.nombre)
            .input('apellido', sql.VarChar(100), data.apellido)
            .input('cedula', sql.VarChar(20), data.cedula)
            .input('telefono', sql.VarChar(20), data.telefono)
            .input('email', sql.VarChar(100), data.email)
            .input('direccion', sql.Text, data.direccion)
            .input('fecha_nacimiento', sql.Date, data.fecha_nacimiento)
            .input('genero', sql.Char(1), data.genero)
            .query(`
                INSERT INTO pacientes 
                    (nombre, apellido, cedula, telefono, email, direccion, fecha_nacimiento, genero)
                VALUES 
                    (@nombre, @apellido, @cedula, @telefono, @email, @direccion, @fecha_nacimiento, @genero);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        const newId = result.recordset[0].id;
        return await this.getById(newId);
    }

    // Actualizar paciente
    static async update(id, data) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar(100), data.nombre)
            .input('apellido', sql.VarChar(100), data.apellido)
            .input('cedula', sql.VarChar(20), data.cedula)
            .input('telefono', sql.VarChar(20), data.telefono)
            .input('email', sql.VarChar(100), data.email)
            .input('direccion', sql.Text, data.direccion)
            .input('fecha_nacimiento', sql.Date, data.fecha_nacimiento)
            .input('genero', sql.Char(1), data.genero)
            .query(`
                UPDATE pacientes
                SET 
                    nombre = @nombre,
                    apellido = @apellido,
                    cedula = @cedula,
                    telefono = @telefono,
                    email = @email,
                    direccion = @direccion,
                    fecha_nacimiento = @fecha_nacimiento,
                    genero = @genero,
                    updated_at = GETDATE()
                WHERE id = @id;
            `);
        return await this.getById(id);
    }

    // Eliminar paciente
    static async delete(id) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM pacientes WHERE id = @id');
        return result.rowsAffected[0] > 0;
    }
}

module.exports = PacienteModel;