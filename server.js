const app = require('./src/app');
const { getConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Probar conexión a base de datos y luego iniciar servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        await getConnection();
        console.log('✅ Conexión a base de datos establecida');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`📋 Pacientes: http://localhost:${PORT}/api/pacientes`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();