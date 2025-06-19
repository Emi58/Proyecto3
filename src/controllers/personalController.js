const personalRepository = require('../repositories/personalRepository');

const obtenerPersonal = async (req, res) => {
    try {
        const personal = await personalRepository.obtenerTodos();
        res.json(personal);
    } catch (error) {
        console.error('Error al obtener personal:', error);
        res.status(500).json({ error: 'Error al obtener el personal' });
    }
};

const obtenerPersonalPorRut = async (req, res) => {
    try {
        const personal = await personalRepository.obtenerPorRut(req.params.rut);
        if (personal) {
            res.json(personal);
        } else {
            res.status(404).json({ error: 'Personal no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener personal:', error);
        res.status(500).json({ error: 'Error al obtener el personal' });
    }
};

const crearPersonal = async (req, res) => {
    try {
        // Valida formato del RUT
        const rutLimpio = req.body.rut.replace(/[^0-9kK]/g, '').toUpperCase();
        if (!validarRUT(rutLimpio)) {
            return res.status(400).json({ error: 'RUT inválido' });
        }

        // Verifica si el RUT ya existe
        const personalExistente = await personalRepository.obtenerPorRut(rutLimpio);
        if (personalExistente) {
            return res.status(400).json({ error: 'El RUT ya está registrado' });
        }

        const personal = await personalRepository.crear({
            ...req.body,
            rut: rutLimpio
        });
        res.status(201).json(personal);
    } catch (error) {
        console.error('Error al crear personal:', error);
        res.status(500).json({ error: 'Error al crear el personal' });
    }
};

// Función para validar RUT chileno
function validarRUT(rut) {
    if (!/^[0-9]{7,8}[0-9K]$/i.test(rut)) return false;
    
    const dv = rut.charAt(rut.length - 1);
    const rutNumeros = rut.slice(0, -1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutNumeros.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumeros.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv.toUpperCase() === dvCalculado;
}

const actualizarPersonal = async (req, res) => {
    try {
        const personal = await personalRepository.actualizar(req.params.rut, req.body);
        res.json(personal);
    } catch (error) {
        console.error('Error al actualizar personal:', error);
        res.status(500).json({ error: 'Error al actualizar el personal' });
    }
};

const eliminarPersonal = async (req, res) => {
    try {
        const personal = await personalRepository.obtenerPorRut(req.params.rut);
        if (!personal) {
            return res.status(404).json({ error: 'Personal no encontrado' });
        }

        // Verificar si tiene activos asignados
        const asignacionesActivas = personal.asignaciones.filter(asig => !asig.fechaDevolucion);
        if (asignacionesActivas.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar el personal porque tiene activos asignados' });
        }

        await personalRepository.eliminar(req.params.rut);
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar personal:', error);
        res.status(500).json({ error: 'Error al eliminar el personal' });
    }
};

module.exports = {
    obtenerPersonal,
    obtenerPersonalPorRut,
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal
};