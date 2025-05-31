/**
 * Servicio para gestión de equipamiento e incidencias
 * Contiene todas las operaciones CRUD (Create, Read, Update, Delete) 
 * para equipos e incidencias del sistema
 */

import api from './api';

export const equipmentService = {
  
  // ========== MÉTODOS PARA EQUIPAMIENTO ==========
  
  /**
   * Crear nuevo equipamiento
   * @param {Object} equipmentData - Datos del equipo (modelo, número serie, ubicación, etc.)
   * @returns {Promise<Object>} - Respuesta con el equipo creado
   */
  createEquipment: async (equipmentData) => {
    try {
      // POST: Envía datos al servidor para crear un nuevo recurso
      const response = await api.post('/equipamiento', equipmentData);
      return response.data; // Devuelve solo los datos, no toda la respuesta HTTP
    } catch (error) {
      throw error; // Re-lanza el error para que lo maneje el componente
    }
  },

  /**
   * Obtener todo el equipamiento
   * @returns {Promise<Array>} - Array con todos los equipos
   */
  getEquipment: async () => {
    try {
      // GET: Obtiene datos del servidor sin modificarlos
      const response = await api.get('/equipamiento');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener equipamiento por ID específico
   * @param {number} id - ID del equipo a buscar
   * @returns {Promise<Object>} - Datos del equipo encontrado
   */
  getEquipmentById: async (id) => {
    try {
      // Template literals (${}) para construir URLs dinámicas
      const response = await api.get(`/equipamiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar equipamiento existente
   * @param {number} id - ID del equipo a actualizar
   * @param {Object} equipmentData - Nuevos datos del equipo
   * @returns {Promise<Object>} - Equipo actualizado
   */
  updateEquipment: async (id, equipmentData) => {
    try {
      // PUT: Actualiza completamente un recurso existente
      const response = await api.put(`/equipamiento/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar equipamiento
   * @param {number} id - ID del equipo a eliminar
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  deleteEquipment: async (id) => {
    try {
      // DELETE: Elimina un recurso del servidor
      const response = await api.delete(`/equipamiento/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ========== MÉTODOS PARA INCIDENCIAS ==========

  /**
   * Crear nueva incidencia
   * @param {Object} incidenceData - Datos de la incidencia (título, descripción, prioridad, etc.)
   * @returns {Promise<Object>} - Incidencia creada
   */
  createIncidence: async (incidenceData) => {
    try {
      const response = await api.post('/incidencias', incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener todas las incidencias del sistema
   * @returns {Promise<Array>} - Array con todas las incidencias
   */
  getIncidences: async () => {
    try {
      const response = await api.get('/incidencias');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar estado/datos de una incidencia
   * @param {number} id - ID de la incidencia
   * @param {Object} incidenceData - Nuevos datos (estado, descripción, etc.)
   * @returns {Promise<Object>} - Incidencia actualizada
   */
  updateIncidence: async (id, incidenceData) => {
    try {
      const response = await api.put(`/incidencias/${id}`, incidenceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar incidencia del sistema
   * @param {number} id - ID de la incidencia a eliminar
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  deleteIncidence: async (id) => {
    try {
      const response = await api.delete(`/incidencias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 