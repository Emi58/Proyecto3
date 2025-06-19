document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
}

// Agregar manejo de navegación
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Manejar clicks en enlaces del menú
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                return;
            }
            
            const token = localStorage.getItem('token');
            if (!token) {
                e.preventDefault();
                window.location.href = 'index.html';
            }
        });
    });
});