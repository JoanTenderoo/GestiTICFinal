import api from './api';

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserRole: async (userId, newRole) => {
    try {
      const response = await api.put(`/usuarios/${userId}`, { rol: newRole });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 