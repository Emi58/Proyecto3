const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.headers['x-authorization'];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: { token }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error en la autenticación' });
  }
};

module.exports = authMiddleware;