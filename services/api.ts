import axios from 'axios';

const API_BASE_URL = 'https://adamix.net/medioambiente';

export const api = {
  // Videos Educativos
  getVideos: async (category?: string) => {
    try {
      const url = category 
        ? `${API_BASE_URL}/videos?categoria=${category}`
        : `${API_BASE_URL}/videos`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  },

  // Áreas Protegidas
  getProtectedAreas: async (tipo?: string, busqueda?: string) => {
    try {
      let url = `${API_BASE_URL}/areas_protegidas`;
      const params = new URLSearchParams();
      
      if (tipo && tipo !== '') {
        params.append('tipo', tipo);
      }
      
      if (busqueda && busqueda.trim() !== '') {
        params.append('busqueda', busqueda.trim());
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching protected areas:', error);
      return [];
    }
  },

  // Equipo del Ministerio
  getTeam: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/equipo`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      return [];
    }
  },
  
  submitVolunteer: async (data: {
    cedula: string;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    telefono: string;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/voluntarios`, data, {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      // Manejo específico de errores
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const { status, data } = error.response;
        
        if (status === 409) {
          // Conflicto - Ya existe un registro
          throw new Error(data.error || 'Ya existe una solicitud con estos datos.');
        } else if (status === 400) {
          // Bad Request - Datos inválidos
          throw new Error('Datos inválidos. Por favor verifica la información.');
        } else if (status === 404) {
          // Not Found - Recurso no encontrado
          throw new Error('El servicio no está disponible en este momento.');
        } else {
          throw new Error(`Error del servidor (${status}): ${data.error || 'Error desconocido'}`);
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Algo más causó el error
        throw new Error('Error al enviar la solicitud. Por favor intenta nuevamente.');
      }
    }
  }
};