const { PrismaClient } = require('@prisma/client');
const activoRepository = require('../repositories/activoRepository');

const prisma = new PrismaClient();

const crearActivo = async (req, res) => {
  try {
    const datos = {
      tipo: req.body.tipo,
      marca: req.body.marca,
      modelo: req.body.modelo,
      estado: req.body.estado,
      ubicacion: req.body.ubicacion,
      numeroSerie: req.body.numeroSerie,
      fechaAdquisicion: new Date(req.body.fechaAdquisicion)
    };

    // Validar que todos los campos requeridos estén presentes
    const camposRequeridos = ['tipo', 'marca', 'modelo', 'estado', 'ubicacion', 'numeroSerie', 'fechaAdquisicion'];
    for (const campo of camposRequeridos) {
      if (!datos[campo]) {
        return res.status(400).json({ 
          error: `El campo ${campo} es requerido`,
          campo: campo
        });
      }
    }

    // Verificar si el número de serie ya existe
    const activoExistente = await prisma.activo.findUnique({
      where: { numeroSerie: datos.numeroSerie }
    });

    if (activoExistente) {
      return res.status(400).json({
        error: 'El número de serie ya está registrado',
        campo: 'numeroSerie'
      });
    }

    const activo = await activoRepository.crear(datos, Number(req.usuario.id));
    res.status(201).json(activo);
  } catch (error) {
    console.error('Error en crearActivo:', error);
    res.status(500).json({ 
      error: 'Error al crear el activo',
      detalles: error.message
    });
  }
};

const obtenerActivos = async (req, res) => {
  try {
    const activos = await activoRepository.obtenerTodos();
    res.json(activos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los activos' });
  }
};

const obtenerActivoPorId = async (req, res) => {
  try {
    const activo = await activoRepository.obtenerPorId(Number(req.params.id));
    if (!activo) {
      return res.status(404).json({ error: 'Activo no encontrado' });
    }
    res.json(activo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el activo' });
  }
};

const actualizarActivo = async (req, res) => {
  try {
    if (!req.usuario.isAdmin) {
      return res.status(403).json({ error: 'No tiene permisos para esta operación' });
    }
    
    // Agregar el ID del usuario cuando el estado es 'Asignado'
    const datosActualizacion = { ...req.body };
    if (datosActualizacion.estado === 'Asignado') {
      datosActualizacion.usuarioId = req.usuario.id;
    } else {
      datosActualizacion.usuarioId = 1; // ID del usuario por defecto para activos sin asignar
    }
    
    const activo = await activoRepository.actualizar(req.params.id, datosActualizacion);
    res.json(activo);
  } catch (error) {
    console.error('Error en actualizarActivo:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el activo',
      detalles: error.message
    });
  }
};

const eliminarActivo = async (req, res) => {
  try {
    if (!req.usuario.isAdmin) {
      return res.status(403).json({ error: 'No tiene permisos para esta operación' });
    }
    
    await activoRepository.eliminar(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el activo' });
  }
};

module.exports = {
  crearActivo,
  obtenerActivos,
  obtenerActivoPorId,
  actualizarActivo,
  eliminarActivo
};