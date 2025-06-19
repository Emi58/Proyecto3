// Validar autenticación al inicio
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

async function cargarPersonal() {
    try {
        const response = await fetch('/api/personal', {
            headers: {
                'x-authorization': token
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar personal');
        }
        const personal = await response.json();
        const tbody = document.getElementById('personalTableBody');
        tbody.innerHTML = '';

        // Modificar la parte donde se crea la fila de la tabla
        personal.forEach(persona => {
            const asignacionesActivas = persona.asignaciones.filter(asig => !asig.fechaDevolucion);
            const primerActivo = asignacionesActivas.length > 0 
                ? `${asignacionesActivas[0].activo.tipo} ${asignacionesActivas[0].activo.marca}` 
                : 'Sin activos';
            const cantidadActivos = asignacionesActivas.length;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatearRut(persona.rut)}</td>
                <td>${persona.nombre}</td>
                <td>${persona.apellidoPaterno}</td>
                <td>${persona.apellidoMaterno}</td>
                <td>${persona.departamento.nombre}</td>
                <td class="activos-cell" onclick="verActivos('${persona.rut}')">
                    ${primerActivo} ${cantidadActivos > 1 ? `(+${cantidadActivos - 1} más)` : ''}
                </td>
                <td>
                    <button onclick="editarPersonal('${persona.rut}')" class="btn-edit">Editar</button>
                    <button onclick="eliminarPersonal('${persona.rut}')" class="btn-delete">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar personal:', error);
    }
}

function verActivos(rut) {
    window.location.href = `activos-personal.html?rut=${rut}`;
}

async function eliminarPersonal(rut) {
    if (confirm('¿Está seguro de que desea eliminar esta persona?')) {
        try {
            const response = await fetch(`/api/personal/${rut}`, {
                method: 'DELETE',
                headers: {
                    'x-authorization': token
                }
            });

            if (response.ok) {
                cargarPersonal();
            } else {
                const error = await response.json();
                alert('Error al eliminar el personal: ' + (error.error || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el personal');
        }
    }
}

function editarPersonal(rut) {
    localStorage.setItem('editandoPersonalRut', rut);
    window.location.href = 'nuevo-personal.html';
}

document.getElementById('nuevoPersonalBtn').addEventListener('click', () => {
    localStorage.removeItem('editandoPersonalRut');
    window.location.href = 'nuevo-personal.html';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

cargarPersonal();