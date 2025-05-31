import api from './api';

export const locationService = {
  // Crear una nueva ubicación
  createLocation: async (locationData) => {
    try {
      const response = await api.post('/ubicaciones', locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las ubicaciones
  getLocations: async () => {
    try {
      const response = await api.get('/ubicaciones');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una ubicación por ID
  getLocationById: async (id) => {
    try {
      const response = await api.get(`/ubicaciones/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una ubicación
  updateLocation: async (id, locationData) => {
    try {
      const response = await api.put(`/ubicaciones/${id}`, locationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una ubicación
  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`/ubicaciones/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        throw new Error('No se puede eliminar la ubicación porque tiene equipamiento asociado. Por favor, elimine o reubique el equipamiento primero.');
      }
      throw new Error(error.response?.data?.message || 'Error al eliminar la ubicación');
    }
  }
}; 