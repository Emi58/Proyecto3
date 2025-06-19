const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PersonalRepository {
    async obtenerTodos() {
        return await prisma.personal.findMany({
            include: {
                departamento: true,
                asignaciones: {
                    include: {
                        activo: true
                    }
                }
            }
        });
    }

    async obtenerPorRut(rut) {
        return await prisma.personal.findUnique({
            where: { rut },
            include: {
                departamento: true,
                asignaciones: {
                    include: {
                        activo: true
                    }
                }
            }
        });
    }

    async crear(datos) {
        return await prisma.personal.create({
            data: {
                rut: datos.rut,
                nombre: datos.nombre,
                apellidoPaterno: datos.apellidoPaterno,
                apellidoMaterno: datos.apellidoMaterno,
                departamentoId: datos.departamentoId
            },
            include: {
                departamento: true
            }
        });
    }

    async actualizar(rut, datos) {
        return await prisma.personal.update({
            where: { rut },
            data: {
                nombre: datos.nombre,
                apellidoPaterno: datos.apellidoPaterno,
                apellidoMaterno: datos.apellidoMaterno,
                departamentoId: datos.departamentoId
            },
            include: {
                departamento: true
            }
        });
    }

    async eliminar(rut) {
        return await prisma.personal.delete({
            where: { rut }
        });
    }
}

module.exports = new PersonalRepository();