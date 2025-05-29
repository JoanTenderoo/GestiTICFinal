import api from './api';

export const equipmentService = {
  getEquipments: async () => {
    try {
      const response = await api.get('/equipamiento');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEquipment: async (id) => {
    try {
      const response = await api.delete(`/equipamiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEquipment: async (id, equipmentData) => {
    try {
      const response = await api.put(`/equipamiento/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const incidenceService = {
  createIncidence: async (incidenceData) => {
    try {
      const response = await api.post('/incidencias', incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getIncidencias: async () => {
    try {
      const response = await api.get('/incidencias');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateIncidence: async (id, incidenceData) => {
    try {
      const response = await api.put(`/incidencias/${id}`, incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteIncidence: async (id) => {
    try {
      const response = await api.delete(`/incidencias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 