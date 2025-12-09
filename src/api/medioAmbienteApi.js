// src/api/medioAmbienteApi.js
const BASE_URL = 'https://adamix.net/medioambiente/api';

const handle = async res => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.mensaje || data.error || 'Error en el servidor');
  }
  return data;
};

// POST /auth/register - Registrar nuevo usuario (CORREGIDO)
export const registerApi = async (userData) => {
  // La API espera 'cedula' como campo obligatorio
  const dataToSend = {
    cedula: userData.cedula || userData.matricula || '', // Usar matrícula si no hay cédula
    nombre: userData.nombre,
    apellido: userData.apellido,
    correo: userData.correo,
    password: userData.password,
    telefono: userData.telefono,
  };
  
  console.log('Enviando datos de registro a API:', dataToSend);
  
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  
  return handle(res);
};

// POST /auth/login - Iniciar sesión
export const loginApi = async ({ correo, clave }) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, clave }),
  });
  return handle(res); // { token, usuario }
};

// POST /auth/recover - Recuperar contraseña
export const recoverPasswordApi = async (correo) => {
  const res = await fetch(`${BASE_URL}/auth/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo }),
  });
  return handle(res);
};

// POST /auth/reset - Resetear contraseña
export const resetPasswordApi = async ({ token, clave_nueva }) => {
  const res = await fetch(`${BASE_URL}/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, clave_nueva }),
  });
  return handle(res);
};

// PUT /usuarios - (cambiar contraseña o actualizar perfil)
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

// GET /servicios - Listar servicios
export const getServiciosApi = async () => {
  const res = await fetch(`${BASE_URL}/servicios`);
  return handle(res); // array de servicios
};

// GET /auth/me - Obtener datos del usuario actual
export const getCurrentUserApi = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handle(res);
};
