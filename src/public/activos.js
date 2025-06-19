// Validar autenticación al inicio
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}

async function cargarActivos() {
    try {
        const response = await fetch('/api/activos', {
            headers: {
                'x-authorization': token  
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar activos');
        }
        const activos = await response.json();
        const tbody = document.getElementById('activosTableBody');
        tbody.innerHTML = '';

        activos.forEach(activo => {
            const asignacion = activo.asignaciones && activo.asignaciones.length > 0 
                ? activo.asignaciones[activo.asignaciones.length - 1].responsable 
                : 'Sin asignar';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activo.id}</td>
                <td>${activo.tipo}</td>
                <td>${activo.marca}</td>
                <td>${activo.modelo}</td>
                <td>${activo.estado}</td>
                <td>${activo.ubicacion}</td>
                <td>${activo.numeroSerie}</td>
                <td>${new Date(activo.fechaAdquisicion).toLocaleDateString()}</td>
                <td>${asignacion}</td>
                <td>
                    <button onclick="editarActivo(${activo.id})" class="btn-edit">Editar</button>
                    <button onclick="eliminarActivo(${activo.id})" class="btn-delete">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar activos:', error);
    }
}

async function eliminarActivo(id) {
    // Asegura que ID sea un número
    if (confirm('¿Está seguro de que desea eliminar este activo?')) {
        try {
            const response = await fetch(`/api/activos/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-authorization': token
                }
            });

            if (response.ok) {
                // Recarga la lista de activos
                cargarActivos();
            } else {
                const error = await response.json();
                alert('Error al eliminar el activo: ' + (error.error || 'Error desconocido'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el activo');
        }
    }
}

function editarActivo(id) {
    // Asegura que ID sea un número
    localStorage.setItem('editandoActivoId', id);
    window.location.href = 'nuevo-activo.html';
}

document.getElementById('nuevoActivoBtn').addEventListener('click', () => {
    localStorage.removeItem('editandoActivoId');
    window.location.href = 'nuevo-activo.html';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redireccionar a la página de login
    window.location.href = 'index.html';
});

cargarActivos();


let activosFiltrados = [];
let columnasFiltradas = new Set();
let ordenAscendente = true;

let filtrosSeleccionados = {
    'Tipo': new Set(),
    'Estado': new Set(),
    'Ubicacion': new Set() 
};

document.getElementById('filtroBtn').addEventListener('click', () => {
    const menu = document.createElement('div');
    menu.className = 'filtro-menu';
    menu.style.position = 'absolute';
    menu.style.zIndex = '1000';

    // Crear secciones de filtro para cada categoría
    const categorias = {
        'Tipo': obtenerValoresUnicos('tipo'),
        'Estado': obtenerValoresUnicos('estado'),
        'Ubicacion': obtenerValoresUnicos('ubicacion')
    };

    Object.entries(categorias).forEach(([categoria, valores]) => {
        const seccion = document.createElement('div');
        seccion.className = 'filtro-seccion';
        
        const titulo = document.createElement('div');
        titulo.className = 'filtro-titulo';
        titulo.textContent = categoria;
        seccion.appendChild(titulo);

        valores.forEach(valor => {
            const opcion = document.createElement('div');
            opcion.className = 'filtro-opcion';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = filtrosSeleccionados[categoria].has(valor);
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    filtrosSeleccionados[categoria].add(valor);
                } else {
                    filtrosSeleccionados[categoria].delete(valor);
                }
                aplicarFiltrosAvanzados();
            });

            const label = document.createElement('label');
            label.textContent = valor;
            
            opcion.appendChild(checkbox);
            opcion.appendChild(label);
            seccion.appendChild(opcion);
        });

        menu.appendChild(seccion);
    });

    const boton = document.getElementById('filtroBtn');
    const rect = boton.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
    // Calcular si hay suficiente espacio a la derecha
    const espacioDisponible = windowWidth - rect.right;
    
    if (espacioDisponible >= 220) { // 220px es el ancho mínimo del menú
        menu.style.left = `${rect.width}px`;
        menu.style.top = '0';
    } else {
        menu.style.right = `${rect.width}px`;
        menu.style.top = '0';
    }

    // Agregar el menú como hijo del botón
    boton.style.position = 'relative';
    boton.appendChild(menu);

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== boton) {
            menu.remove();
        }
    });
});

function obtenerValoresUnicos(campo) {
    const valores = new Set();
    const filas = document.getElementById('activosTableBody').getElementsByTagName('tr');
    Array.from(filas).forEach(fila => {
        const valor = fila.cells[obtenerIndiceColumna(campo)].textContent;
        valores.add(valor);
    });
    return Array.from(valores).sort();
}

function obtenerIndiceColumna(campo) {
    const mapeo = {
        'tipo': 1,
        'estado': 4,
        'ubicacion': 5,
        'asignacion': 8
    };
    return mapeo[campo];
}

function aplicarFiltrosAvanzados() {
    const filas = document.getElementById('activosTableBody').getElementsByTagName('tr');
    Array.from(filas).forEach(fila => {
        let mostrarFila = true;
        Object.entries(filtrosSeleccionados).forEach(([categoria, valores]) => {
            if (valores.size > 0) {
                const indice = obtenerIndiceColumna(categoria.toLowerCase());
                const valorCelda = fila.cells[indice].textContent;
                if (!valores.has(valorCelda)) {
                    mostrarFila = false;
                }
            }
        });
        fila.style.display = mostrarFila ? '' : 'none';
    });
}

document.getElementById('eliminarFiltroBtn').addEventListener('click', () => {
    columnasFiltradas.clear();
    // Limpiar los checkboxes del menú de filtros si existen
    const checkboxes = document.querySelectorAll('.filtro-opcion input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    // Mostrar todas las filas
    const tbody = document.getElementById('activosTableBody');
    const filas = tbody.getElementsByTagName('tr');
    for (let fila of filas) {
        fila.style.display = '';
    }
    
    aplicarFiltros();
});

document.getElementById('ordenarBtn').addEventListener('click', () => {
    ordenAscendente = !ordenAscendente;
    ordenarActivos();
});

function aplicarFiltros() {
    const tabla = document.getElementById('activosTable');
    const filas = tabla.getElementsByTagName('tr');

    // Mostrar/ocultar columnas según filtros
    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName(i === 0 ? 'th' : 'td');
        for (let j = 0; j < celdas.length - 1; j++) { // -1 para excluir la columna de acciones
            const columna = filas[0].getElementsByTagName('th')[j].textContent;
            celdas[j].style.display = columnasFiltradas.size === 0 || columnasFiltradas.has(columna) ? '' : 'none';
        }
    }
}

function ordenarActivos() {
    const tbody = document.getElementById('activosTableBody');
    const filas = Array.from(tbody.getElementsByTagName('tr'));

    filas.sort((a, b) => {
        const idA = parseInt(a.cells[0].textContent);
        const idB = parseInt(b.cells[0].textContent);
        return ordenAscendente ? idA - idB : idB - idA;
    });

    filas.forEach(fila => tbody.appendChild(fila));
}

// Funcionalidad del menú de exportación
const exportarBtn = document.getElementById('exportarBtn');
const exportMenu = document.getElementById('exportMenu');

exportarBtn.addEventListener('click', () => {
    exportMenu.classList.toggle('show');
});

// Cerrar el menú cuando se hace clic fuera de él
document.addEventListener('click', (event) => {
    if (!exportarBtn.contains(event.target) && !exportMenu.contains(event.target)) {
        exportMenu.classList.remove('show');
    }
});

// Función para exportar a Excel
document.getElementById('exportExcel').addEventListener('click', () => {
    const tabla = document.getElementById('activosTable');
    let data = '';
    
    // Obtener encabezados (excluyendo la columna de acciones)
    const headers = Array.from(tabla.querySelectorAll('th')).slice(0, -1);
    data += headers.map(header => header.textContent).join(',') + '\n';
    
    // Obtener datos de las filas visibles
    const filas = Array.from(tabla.querySelectorAll('tbody tr'));
    filas.forEach(fila => {
        if (fila.style.display !== 'none') {
            const celdas = Array.from(fila.querySelectorAll('td')).slice(0, -1);
            data += celdas.map(celda => celda.textContent).join(',') + '\n';
        }
    });
    
    // Crear y descargar el archivo CSV
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    exportMenu.classList.remove('show');
});

// Función para exportar a PDF
document.getElementById('exportPDF').addEventListener('click', () => {
    const tabla = document.getElementById('activosTable');
    let contenido = '<table style="width:100%; border-collapse: collapse;">';
    
    // Agregar encabezados (excluyendo la columna de acciones)
    contenido += '<thead><tr>';
    const headers = Array.from(tabla.querySelectorAll('th')).slice(0, -1);
    headers.forEach(header => {
        contenido += `<th style="border: 1px solid #ddd; padding: 8px;">${header.textContent}</th>`;
    });
    contenido += '</tr></thead><tbody>';
    
    // Agregar datos de las filas visibles
    const filas = Array.from(tabla.querySelectorAll('tbody tr'));
    filas.forEach(fila => {
        if (fila.style.display !== 'none') {
            contenido += '<tr>';
            const celdas = Array.from(fila.querySelectorAll('td')).slice(0, -1);
            celdas.forEach(celda => {
                contenido += `<td style="border: 1px solid #ddd; padding: 8px;">${celda.textContent}</td>`;
            });
            contenido += '</tr>';
        }
    });
    contenido += '</tbody></table>';
    
    // Crear el PDF
    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
        <html>
            <head>
                <title>Activos</title>
            </head>
            <body>
                <h1>Listado de Activos</h1>
                ${contenido}
            </body>
        </html>
    `);
    ventana.document.close();
    ventana.print();
    exportMenu.classList.remove('show');
});