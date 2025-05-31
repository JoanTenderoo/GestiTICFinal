import api from './api';

export const equipmentService = {
  // Crear nuevo equipamiento
  createEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/equipamiento', equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todo el equipamiento
  getEquipment: async () => {
    try {
      const response = await api.get('/equipamiento');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener equipamiento por ID
  getEquipmentById: async (id) => {
    try {
      const response = await api.get(`/equipamiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar equipamiento
  updateEquipment: async (id, equipmentData) => {
    try {
      const response = await api.put(`/equipamiento/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar equipamiento
  deleteEquipment: async (id) => {
    try {
      const response = await api.delete(`/equipamiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva incidencia
  createIncidence: async (incidenceData) => {
    try {
      const response = await api.post('/incidencias', incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las incidencias
  getIncidences: async () => {
    try {
      const response = await api.get('/incidencias');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar incidencia
  updateIncidence: async (id, incidenceData) => {
    try {
      const response = await api.put(`/incidencias/${id}`, incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar incidencia
  deleteIncidence: async (id) => {
    try {
      const response = await api.delete(`/incidencias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 