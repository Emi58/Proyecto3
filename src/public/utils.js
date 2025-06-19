// Funcion de utilidad para manejo de IDs
function validarId(id) {
    const numero = parseInt(id);
    if (isNaN(numero)) {
        throw new Error('ID inválido');
    }
    return numero;
}

function formatearRut(rut) {
    // Limpiar el RUT de puntos y guiones
    let valor = rut.replace(/\./g, '').replace(/-/g, '').trim();
    
    // Obtener el dígito verificador
    const dv = valor.slice(-1);
    // Obtener el cuerpo del RUT
    let numero = valor.slice(0, -1);
    
    // Formatear con puntos
    numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // Retornar RUT formateado
    return numero + "-" + dv;
}

function validarRut(rut) {
    if (typeof rut !== 'string' || !rut.trim()) {
        throw new Error('RUT inválido');
    }
    
    // Limpiar el RUT de puntos y guiones
    const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
    
    // Validar formato básico
    if (!/^[0-9]{7,8}[0-9K]$/i.test(rutLimpio)) {
        throw new Error('Formato de RUT inválido');
    }
    
    // Validar dígito verificador
    const dv = rutLimpio.charAt(rutLimpio.length - 1);
    const rutNumeros = rutLimpio.slice(0, -1);
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutNumeros.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumeros.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    
    if (dv.toUpperCase() !== dvCalculado) {
        throw new Error('RUT inválido: dígito verificador incorrecto');
    }
    
    // Retornar RUT formateado
    return formatearRut(rutLimpio);
}