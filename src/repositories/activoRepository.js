const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ActivoRepository {
  async crear(datos, usuarioId) {
    try {
      return await prisma.activo.create({
        data: {
          tipo: datos.tipo,
          marca: datos.marca,
          modelo: datos.modelo,
          estado: datos.estado,
          ubicacion: datos.ubicacion,
          numeroSerie: datos.numeroSerie,
          fechaAdquisicion: datos.fechaAdquisicion,
          asignaciones: {
            create: {
              fechaAsignacion: new Date(),
              responsable: 'Sin asignar',
              usuarioId: Number(usuarioId)
              // Removemos departamentoId y personalId para que sean null
            }
          }
        }
      });
    } catch (error) {
      console.error('Error en ActivoRepository.crear:', error);
      throw error;
    }
  }

  obtenerTodos = async () => {
    return await prisma.activo.findMany({
      include: {
        asignaciones: true
      }
    });
  }

  obtenerPorId = async (id) => {
    return await prisma.activo.findUnique({
      where: { id: Number(id) },
      include: {
        asignaciones: true
      }
    });
  }

  actualizar = async (id, datos) => {
    const numericId = Number(id);
    
    try {
      if (datos.estado === 'Asignado' && datos.personalId) {
        // Obtener el departamento del personal seleccionado
        const personal = await prisma.personal.findUnique({
          where: { id: Number(datos.personalId) },
          include: { departamento: true }
        });

        if (!personal) {
          throw new Error('Personal no encontrado');
        }

        return await prisma.$transaction(async (prisma) => {
          // Actualizar el activo
          const activoActualizado = await prisma.activo.update({
            where: { id: numericId },
            data: {
              tipo: datos.tipo,
              marca: datos.marca,
              modelo: datos.modelo,
              estado: datos.estado,
              ubicacion: datos.ubicacion,
              numeroSerie: datos.numeroSerie,
              fechaAdquisicion: datos.fechaAdquisicion
            }
          });

          // Crear nueva asignación
          await prisma.asignacion.create({
            data: {
              fechaAsignacion: new Date(),
              responsable: `${personal.nombre} ${personal.apellidoPaterno}`,
              activoId: numericId,
              usuarioId: Number(datos.usuarioId),
              departamentoId: personal.departamentoId,
              personalId: personal.id
            }
          });

          return activoActualizado;
        });
      } else {
        // Si no está asignado, actualizar el activo y cerrar la asignación actual
        return await prisma.$transaction(async (prisma) => {
          // Actualizar el activo
          const activoActualizado = await prisma.activo.update({
            where: { id: numericId },
            data: {
              tipo: datos.tipo,
              marca: datos.marca,
              modelo: datos.modelo,
              estado: datos.estado,
              ubicacion: datos.ubicacion,
              numeroSerie: datos.numeroSerie,
              fechaAdquisicion: datos.fechaAdquisicion
            }
          });

          // Buscar la última asignación activa
          const ultimaAsignacion = await prisma.asignacion.findFirst({
            where: {
              activoId: numericId,
              fechaDevolucion: null
            },
            orderBy: {
              fechaAsignacion: 'desc'
            }
          });

          // Si existe una asignación activa, cerrarla
          if (ultimaAsignacion) {
            await prisma.asignacion.update({
              where: { id: ultimaAsignacion.id },
              data: { fechaDevolucion: new Date() }
            });

            // Crear nueva asignación con "Sin asignar"
            await prisma.asignacion.create({
              data: {
                fechaAsignacion: new Date(),
                responsable: 'Sin asignar',
                activo: {
                  connect: { id: numericId }
                },
                usuario: {
                  connect: { id: Number(datos.usuarioId) || 1 } // Asumiendo que el ID 1 es un usuario por defecto
                }
              }
            });
          }

          return activoActualizado;
        });
      }
    } catch (error) {
      console.error('Error en ActivoRepository.actualizar:', error);
      throw new Error(`Error al actualizar el activo: ${error.message}`);
    }
}

  eliminar = async (id) => {
    const numericId = Number(id);
    return await prisma.$transaction(async (prisma) => {
      // Eliminar asignaciones relacionadas
      await prisma.asignacion.deleteMany({
        where: { activoId: numericId }
      });
  
      // Eliminar mantenimientos relacionados
      await prisma.mantenimiento.deleteMany({
        where: { activoId: numericId }
      });
  
      // Eliminar auditorías relacionadas
      await prisma.auditoria.deleteMany({
        where: { activoId: numericId }
      });
  
      // Eliminar el activo
      await prisma.activo.delete({
        where: { id: numericId }
      });
  
      // Obtener todos los activos con ID mayor al eliminado
      const activosParaActualizar = await prisma.activo.findMany({
        where: {
          id: {
            gt: numericId
          }
        },
        orderBy: {
          id: 'asc'
        }
      });
  
      // Actualizar los IDs de los activos restantes
      for (const activo of activosParaActualizar) {
        await prisma.activo.update({
          where: { id: activo.id },
          data: { id: activo.id - 1 }
        });
  
        // Actualizar las referencias en las tablas relacionadas
        await prisma.asignacion.updateMany({
          where: { activoId: activo.id },
          data: { activoId: activo.id - 1 }
        });
  
        await prisma.mantenimiento.updateMany({
          where: { activoId: activo.id },
          data: { activoId: activo.id - 1 }
        });
  
        await prisma.auditoria.updateMany({
          where: { activoId: activo.id },
          data: { activoId: activo.id - 1 }
        });
      }
  
      return { success: true };
    });
  }
}

module.exports = new ActivoRepository();