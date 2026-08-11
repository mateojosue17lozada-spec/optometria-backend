const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: '*', // Para desarrollo, luego limitaremos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
// const examenRoutes = require('./routes/examenRoutes');
// const productoRoutes = require('./routes/productoRoutes');

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);
// app.use('/api/examenes', examenRoutes);
// app.use('/api/productos', productoRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API Optometría - Sistema Integrador',
        version: '1.0.0',
        endpoints: {
            pacientes: '/api/pacientes',
            citas: '/api/citas',
            examenes: '/api/examenes',
            productos: '/api/productos',
            health: '/health'
        }
    });
});

// Middleware de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;