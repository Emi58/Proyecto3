// Validar autenticación al inicio
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const editandoPersonalRut = localStorage.getItem('editandoPersonalRut');

document.querySelector('h1').textContent = editandoPersonalRut ? 'Editar Personal' : 'Nuevo Personal';

async function cargarDepartamentos() {
    try {
        const response = await fetch('/api/departamentos', {
            headers: {
                'x-authorization': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const departamentos = await response.json();
            const select = document.getElementById('departamento');
            
            departamentos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto.id;
                option.textContent = depto.nombre;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
    }
}

async function cargarDatosPersonal() {
    if (editandoPersonalRut) {
        try {
            const response = await fetch(`/api/personal/${editandoPersonalRut}`, {
                headers: {
                    'x-authorization': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                const persona = await response.json();
                document.getElementById('rut').value = persona.rut;
                document.getElementById('rut').readOnly = true;
                document.getElementById('nombre').value = persona.nombre;
                document.getElementById('apellidoPaterno').value = persona.apellidoPaterno;
                document.getElementById('apellidoMaterno').value = persona.apellidoMaterno;
                document.getElementById('departamento').value = persona.departamentoId;
            }
        } catch (error) {
            console.error('Error al cargar personal:', error);
            alert('Error al cargar los datos del personal');
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos();
    cargarDatosPersonal();
});

// Agregar después de los event listeners existentes

document.getElementById('rut').addEventListener('input', function(e) {
    let valor = e.target.value;
    
    // Eliminar caracteres no válidos
    valor = valor.replace(/[^0-9kK\-\.]/g, '');
    
    try {
        //formatear si hay suficientes caracteres
        if (valor.replace(/[^0-9kK]/g, '').length >= 2) {
            valor = formatearRut(valor);
        }
    } catch (error) {
        // Si hay error en el formateo, mantener el valor tal cual
        console.log('Error al formatear RUT:', error);
    }
    
    e.target.value = valor;
});

// Modificar la parte del submit del formulario
document.getElementById('nuevoPersonalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const rutInput = document.getElementById('rut');
        const rutFormateado = validarRut(rutInput.value);
        rutInput.value = rutFormateado; // Actualizar campo con el formato correcto
        
        const formData = {
            rut: rutFormateado,
            nombre: document.getElementById('nombre').value,
            apellidoPaterno: document.getElementById('apellidoPaterno').value,
            apellidoMaterno: document.getElementById('apellidoMaterno').value,
            departamentoId: validarId(document.getElementById('departamento').value)
        };

        const url = editandoPersonalRut ? `/api/personal/${editandoPersonalRut}` : '/api/personal';
        const method = editandoPersonalRut ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            localStorage.removeItem('editandoPersonalRut');
            window.location.href = 'personal.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || 'Error desconocido'}`);
        }
    } catch (error) {
        alert(error.message);
        return;
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});