const path = require('path');
const express = require('express');
const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const activoController = require('./controllers/activoController');
const validationMiddleware = require('./middleware/validationMiddleware');
const activoSchema = require('./schemas/activoSchema');
const personalController = require('./controllers/personalController');
const departamentoController = require('./controllers/departamentoController');
const asignacionController = require('./controllers/asignacionController');

const app = express();
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Imagen', express.static(path.join(__dirname, '..', 'Imagen')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas de autenticación
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authMiddleware, authController.logout);

// Rutas de activos
app.get('/api/activos', authMiddleware, activoController.obtenerActivos);
app.get('/api/activos/:id', authMiddleware, activoController.obtenerActivoPorId);
app.post('/api/activos', [authMiddleware, validationMiddleware(activoSchema)], activoController.crearActivo);
app.put('/api/activos/:id', [authMiddleware, validationMiddleware(activoSchema)], activoController.actualizarActivo);
app.delete('/api/activos/:id', authMiddleware, activoController.eliminarActivo);

// Rutas de Personal
app.get('/api/personal', authMiddleware, personalController.obtenerPersonal);
app.get('/api/personal/:rut', authMiddleware, personalController.obtenerPersonalPorRut);
app.post('/api/personal', authMiddleware, personalController.crearPersonal);
app.put('/api/personal/:rut', authMiddleware, personalController.actualizarPersonal);
app.delete('/api/personal/:rut', authMiddleware, personalController.eliminarPersonal);

// Ruta de Departamentos
app.get('/api/departamentos', authMiddleware, departamentoController.obtenerDepartamentos);
app.put('/api/asignaciones/:id', authMiddleware, asignacionController.actualizarAsignacion);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});