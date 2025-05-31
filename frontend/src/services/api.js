/**
 * Configuración centralizada de Axios para peticiones HTTP
 * Este archivo configura la instancia principal de Axios que usarán todos los servicios
 */

import axios from 'axios';
import authService from './authService';

// Configuración de URL base según el entorno
// En desarrollo usará localhost, en producción usará la URL del servidor
const API_URL = import.meta.env.VITE_API_URL || 'https://gestitic.com/api';

// Creamos una instancia personalizada de axios con configuración base
const api = axios.create({
    baseURL: API_URL, // URL base para todas las peticiones
    headers: {
        'Content-Type': 'application/json', // Indicamos que enviamos/recibimos JSON
    },
});

// INTERCEPTOR DE PETICIONES (request interceptor)
// Se ejecuta ANTES de enviar cada petición al servidor
api.interceptors.request.use(
    (config) => {
        // Obtener el token de autenticación del usuario logueado
        const authHeader = authService.getAuthHeader();
        
        // Si hay token, lo añadimos a las cabeceras de la petición
        if (authHeader.Authorization) {
            config.headers.Authorization = authHeader.Authorization;
        }
        
        return config; // Devolvemos la configuración modificada
    },
    (error) => {
        // Si hay error en la configuración de la petición
        return Promise.reject(error);
    }
);

// INTERCEPTOR DE RESPUESTAS (response interceptor) 
// Se ejecuta DESPUÉS de recibir cada respuesta del servidor
api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa (2xx), la devolvemos tal cual
    async (error) => {
        // Si recibimos error 401 (No autorizado), significa que el token expiró
        if (error.response?.status === 401) {
            authService.logout(); // Limpiamos los datos del usuario
            window.location.href = '/login'; // Redirigimos al login
        }
        return Promise.reject(error); // Propagamos el error
    }
);

export default api; 