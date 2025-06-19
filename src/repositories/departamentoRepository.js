const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DepartamentoRepository {
    async obtenerTodos() {
        return await prisma.departamento.findMany();
    }
}

module.exports = new DepartamentoRepository();