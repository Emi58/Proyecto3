document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('isAdmin', data.isAdmin);
            localStorage.setItem('username', data.username);
            localStorage.setItem('name', data.name);
            window.location.href = '/inicio.html';
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al intentar iniciar sesión');
    }
});