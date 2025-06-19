// Validar autenticación al inicio
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

const personalRut = new URLSearchParams(window.location.search).get('rut');

async function cargarActivosPersonal() {
    try {
        const response = await fetch(`/api/personal/${personalRut}`, {
            headers: {
                'x-authorization': token
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar los activos del personal');
        }
        const personal = await response.json();
        
        // Mostrar nombre del personal
        document.getElementById('nombrePersonal').textContent = 
            `${personal.nombre} ${personal.apellidoPaterno} ${personal.apellidoMaterno}`;

        const tbody = document.getElementById('activosTableBody');
        tbody.innerHTML = '';

        // Filtrar solo asignaciones activas (sin fecha de devolución)
        const asignacionesActivas = personal.asignaciones.filter(asig => !asig.fechaDevolucion);

        asignacionesActivas.forEach(asignacion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="activo-checkbox" data-id="${asignacion.id}"></td>
                <td>${asignacion.activo.tipo}</td>
                <td>${asignacion.activo.marca}</td>
                <td>${asignacion.activo.modelo}</td>
                <td>${asignacion.activo.estado}</td>
                <td>${asignacion.activo.ubicacion}</td>
                <td>${asignacion.activo.numeroSerie}</td>
                <td>${new Date(asignacion.fechaAsignacion).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });

        // Agregar event listeners para los checkboxes y el botón de desasignar
        const selectAllCheckbox = document.getElementById('selectAll');
        const desasignarBtn = document.getElementById('desasignarBtn');

        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.activo-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
            desasignarBtn.disabled = !e.target.checked;
        });

        document.getElementById('activosTableBody').addEventListener('change', (e) => {
            if (e.target.classList.contains('activo-checkbox')) {
                const checkboxes = document.querySelectorAll('.activo-checkbox');
                const checkedBoxes = document.querySelectorAll('.activo-checkbox:checked');
                selectAllCheckbox.checked = checkboxes.length === checkedBoxes.length;
                desasignarBtn.disabled = checkedBoxes.length === 0;
            }
        });

        desasignarBtn.addEventListener('click', async () => {
            const checkedBoxes = document.querySelectorAll('.activo-checkbox:checked');
            const asignacionIds = Array.from(checkedBoxes).map(cb => cb.dataset.id);
            
            if (asignacionIds.length === 0) return;
            
            if (confirm('¿Está seguro de que desea desasignar los activos seleccionados?')) {
                try {
                    const promises = asignacionIds.map(id =>
                        fetch(`/api/asignaciones/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-authorization': token
                            }
                        })
                    );

                    await Promise.all(promises);
                    alert('Activos desasignados exitosamente');
                    window.location.reload(); // Recargar la página para mostrar los cambios
                } catch (error) {
                    console.error('Error al desasignar activos:', error);
                    alert('Error al desasignar los activos');
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

cargarActivosPersonal();