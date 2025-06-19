const { PrismaClient } = require('@prisma/client');
const { generateToken, hashPassword, verifyPassword } = require('../utils/crypto');
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { username }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no existe' });
    }

    if (!verifyPassword(password, usuario.password)) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generateToken();
    
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { token }
    });

    res.json({
      username: usuario.username,
      name: usuario.nombre,
      isAdmin: usuario.isAdmin,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const logout = async (req, res) => {
  try {
    await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { token: null }
    });
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  logout
};