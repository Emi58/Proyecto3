// Validar autenticación al inicio
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

// Validar si se esta editando un activo existente
const editandoActivoId = localStorage.getItem('editandoActivoId') ? parseInt(localStorage.getItem('editandoActivoId')) : null;

//función cargarDatosActivo
async function cargarDatosActivo() {
    if (editandoActivoId) {
        try {
            const response = await fetch(`/api/activos/${editandoActivoId}`, {
                headers: {
                    'x-authorization': token
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar el activo');
            }

            const activo = await response.json();
            // Rellenar formulario con los datos existentes
            Object.keys(activo).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    if (key === 'fechaAdquisicion') {
                        input.value = new Date(activo[key]).toISOString().split('T')[0];
                    } else {
                        input.value = activo[key];
                    }
                }
            });

            // Mostrar personal asignado si el estado es 'Asignado'
            if (activo.estado === 'Asignado' && activo.asignaciones && activo.asignaciones.length > 0) {
                const ultimaAsignacion = activo.asignaciones[activo.asignaciones.length - 1];
                document.getElementById('personalAsignadoRow').style.display = 'flex';
                await cargarPersonal();
                document.getElementById('personalAsignado').value = ultimaAsignacion.personalId;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los datos del activo');
            localStorage.removeItem('editandoActivoId'); // Limpiar el ID en caso de error
            window.location.href = 'activos.html';
        }
    }
}

// Llama la función al cargar la página
cargarDatosActivo();

// En el evento submit del formulario
// Función para cargar el personal
async function cargarPersonal() {
    try {
        const response = await fetch('/api/personal', {
            headers: {
                'x-authorization': token
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar el personal');
        }

        const personal = await response.json();
        const selectPersonal = document.getElementById('personalAsignado');
        
        // Limpiar opciones existentes excepto la primera
        while (selectPersonal.options.length > 1) {
            selectPersonal.remove(1);
        }

        // Agregar el nuevo personal
        personal.forEach(persona => {
            const option = document.createElement('option');
            option.value = persona.id;
            option.textContent = `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`;
            selectPersonal.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el personal');
    }
}

// Agregar evento para mostrar/ocultar el campo de personal asignado
document.getElementById('estado').addEventListener('change', async function() {
    const personalRow = document.getElementById('personalAsignadoRow');
    const personalSelect = document.getElementById('personalAsignado');
    
    if (this.value === 'Asignado') {
        personalRow.style.display = 'flex';
        personalSelect.required = true;
        await cargarPersonal(); // Cargar lista de personal
    } else {
        personalRow.style.display = 'none';
        personalSelect.required = false;
        personalSelect.value = ''; // Limpiar la selección de personal
        
        // Agregar opción 'Sin asignar' al inicio de la lista
        const sinAsignarOption = document.createElement('option');
        sinAsignarOption.value = '';
        sinAsignarOption.textContent = 'Sin asignar';
        personalSelect.insertBefore(sinAsignarOption, personalSelect.firstChild);
        
        // Si se está editando, intentar mantener el personal seleccionado
        if (editandoActivoId) {
            try {
                const response = await fetch(`/api/activos/${editandoActivoId}`, {
                    headers: {
                        'x-authorization': token
                    }
                });
                if (response.ok) {
                    const activo = await response.json();
                    if (activo.asignaciones && activo.asignaciones.length > 0) {
                        const ultimaAsignacion = activo.asignaciones[activo.asignaciones.length - 1];
                        personalSelect.value = ultimaAsignacion.personalId || '';
                    }
                }
            } catch (error) {
                console.error('Error al obtener la asignación actual:', error);
            }
        }
    }
});

// Modificar el evento submit del formulario para incluir el personal asignado
document.getElementById('nuevoActivoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = {
            tipo: document.getElementById('tipo').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            estado: document.getElementById('estado').value,
            ubicacion: document.getElementById('ubicacion').value,
            numeroSerie: document.getElementById('numeroSerie').value,
            fechaAdquisicion: new Date(document.getElementById('fechaAdquisicion').value).toISOString()
        };

        // Agregar el personal asignado si el estado es 'Asignado'
        if (formData.estado === 'Asignado') {
            const personalId = document.getElementById('personalAsignado').value;
            if (personalId) {
                formData.personalId = personalId;
            }
            // Si no hay personalId, se tratará como 'Sin asignar' en el backend
        }

        // Valida campos requeridos
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                alert(`Por favor complete el campo ${key}`);
                return;
            }
        }

        const url = editandoActivoId ? `/api/activos/${editandoActivoId}` : '/api/activos';
        const method = editandoActivoId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-authorization': token
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {    
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al procesar la solicitud');
        } else {
            localStorage.removeItem('editandoActivoId');
            window.location.href = 'activos.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});