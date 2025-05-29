import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Configurar axios para incluir credenciales en todas las peticiones
axios.defaults.withCredentials = true;

// Configurar interceptor para manejar errores
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const errorData = error.response.data;
            console.error('Error de respuesta:', errorData);
            
            // Si hay errores de validación, devolver el primer error
            if (errorData.errors) {
                const firstError = Object.values(errorData.errors)[0][0];
                return Promise.reject({ message: firstError });
            }
            
            return Promise.reject(errorData);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            console.error('Error de red:', error.request);
            return Promise.reject({ message: 'Error de red. Por favor, verifica tu conexión.' });
        } else {
            // Algo pasó al configurar la petición
            console.error('Error:', error.message);
            return Promise.reject({ message: 'Error al procesar la petición.' });
        }
    }
);

const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                // Configurar el token en las cabeceras de axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                nombre: userData.nombre,
                apellidos: userData.apellidos,
                email: userData.email,
                password: userData.password,
                password_confirmation: userData.password_confirmation,
                rol: userData.rol || 'usuario',
                departamento: userData.departamento || 'General'
            });
            return response.data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    },

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return { Authorization: `Bearer ${user.token}` };
        }
        return {};
    },

    async changePassword(email, newPassword) {
        try {
            const response = await axios.post(`${API_URL}/change-password`, {
                email,
                password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async requestPasswordReset(email) {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {
                email
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(token, password, password_confirmation) {
        try {
            const response = await axios.post(`${API_URL}/reset-password`, {
                token,
                password,
                password_confirmation
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authService; 