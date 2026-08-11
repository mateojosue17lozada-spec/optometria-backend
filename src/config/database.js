const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_DATABASE || 'optometria_db',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection: !process.env.DB_USER,
        enableArithAbort: true,
    },
};

let pool = null;

const getConnection = async () => {
    try {
        if (pool) {
            console.log('✅ Usando conexión existente a SQL Server');
            return pool;
        }
        pool = await sql.connect(config);
        console.log('✅ Conectado a SQL Server Express');
        return pool;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        throw error;
    }
};

module.exports = {
    getConnection,
    sql,
};