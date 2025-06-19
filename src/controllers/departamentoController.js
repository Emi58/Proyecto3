const departamentoRepository = require('../repositories/departamentoRepository');

const obtenerDepartamentos = async (req, res) => {
    try {
        const departamentos = await departamentoRepository.obtenerTodos();
        res.json(departamentos);
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
};

module.exports = {
    obtenerDepartamentos
};