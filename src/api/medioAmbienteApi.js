// src/api/medioAmbienteApi.js
const BASE_URL = 'https://adamix.net/medioambiente';

const handle = async res => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.mensaje || data.error || 'Error en el servidor');
  }
  return data;
};

// POST /auth/register - Registrar nuevo usuario (CON CÉDULA Y MATRÍCULA)
export const registerApi = async (userData) => {
  // Preparar datos para enviar
  const dataToSend = {
    cedula: userData.cedula,
    nombre: userData.nombre,
    apellido: userData.apellido,
    correo: userData.correo,
    password: userData.password,
    telefono: userData.telefono,
    matricula: userData.matricula,
  };
  
  console.log('Enviando registro a API:', dataToSend);
  
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  
  return handle(res);
};

// ... resto de las funciones permanecen igual
export const loginApi = async ({ correo, clave }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave }),
  });
  return handle(res);
};

export const recoverPasswordApi = async (correo) => {
  const res = await fetch(`${BASE_URL}/auth/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  });
  return handle(res);
};

export const changePasswordApi = async ({ token, clave_actual, clave_nueva }) => {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ clave_actual, clave_nueva }),
  });
  return handle(res);
};

export const getServiciosApi = async () => {
  const res = await fetch(`${BASE_URL}/servicios`);
  return handle(res);
};

export const getCurrentUserApi = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handle(res);
};
