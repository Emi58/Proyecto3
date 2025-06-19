const fetch = require('node-fetch');

const loginUrl = 'http://localhost:3000/api/auth/login';
const activosUrl = 'http://localhost:3000/api/activos';

const username = 'admin';
const password = 'Prueba.1A2B';

async function login() {
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error('Login failed: ' + response.statusText);
  }
  const data = await response.json();
  return data.token;
}

async function crearActivo(token) {
  const nuevoActivo = {
    tipo: 'Monitor',
    marca: 'HP',
    modelo: '5420',
    estado: 'Nuevo',
    ubicacion: 'Bodega Informatica',
    numeroSerie: 'VFGS5GWL',
    fechaAdquisicion: '2024-12-23'
  };

  const response = await fetch(activosUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-authorization': token
    },
    body: JSON.stringify(nuevoActivo)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error('Error creating activo: ' + JSON.stringify(errorData));
  }

  const data = await response.json();
  console.log('Activo creado:', data);
}

async function main() {
  try {
    const token = await login();
    console.log('Token obtenido:', token);
    await crearActivo(token);
  } catch (error) {
    console.error(error);
  }
}

main();
