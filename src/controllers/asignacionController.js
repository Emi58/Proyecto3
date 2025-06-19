const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const actualizarAsignacion = async (req, res) => {
    try {
        const asignacionId = parseInt(req.params.id);
        const fechaDevolucion = new Date();

        const asignacionActualizada = await prisma.asignacion.update({
            where: { id: asignacionId },
            data: { fechaDevolucion }
        });

        await prisma.$transaction(async (prisma) => { 
            // Actualizar estado del activo a 'Sin asignar' en lugar de 'Baja'
            await prisma.activo.update({ 
                where: { id: asignacionActualizada.activoId }, 
                data: { estado: 'Sin asignar' } 
            }); 

            // Crear nueva asignación con "Sin asignar" 
            await prisma.asignacion.create({ 
                data: { 
                    fechaAsignacion: new Date(), 
                    responsable: 'Sin asignar',
                    usuario: {
                        connect: { id: req.usuario.id }
                    },
                    activo: {
                        connect: { id: asignacionActualizada.activoId }
                    }
                } 
            }); 
        });

        res.json(asignacionActualizada);
    } catch (error) {
        console.error('Error al actualizar asignación:', error);
        res.status(500).json({ error: 'Error al actualizar la asignación' });
    }
};


module.exports = {
    actualizarAsignacion
};