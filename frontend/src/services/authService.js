import axios from 'axios';

const API_URL = 'https://gestitic.com/api';

// Configurar axios para incluir credenciales en todas las peticiones
axios.defaults.withCredentials = true;

// Diccionario de traducciones de mensajes de error
const errorTranslations = {
    // Validaciones de contraseña
    'The password field must be at least 8 characters.': 'La contraseña debe tener al menos 8 caracteres.',
    'The password field is required.': 'La contraseña es obligatoria.',
    'The password field confirmation does not match.': 'La confirmación de contraseña no coincide.',
    'The password must be at least 8 characters.': 'La contraseña debe tener al menos 8 caracteres.',
    'The password confirmation does not match.': 'La confirmación de contraseña no coincide.',
    
    // Validaciones de email
    'The email field is required.': 'El email es obligatorio.',
    'The email field must be a valid email address.': 'El email debe tener un formato válido.',
    'The email has already been taken.': 'Este email ya está registrado en el sistema.',
    'The email must be a valid email address.': 'El email debe tener un formato válido.',
    
    // Validaciones de nombre
    'The name field is required.': 'El nombre es obligatorio.',
    'The nombre field is required.': 'El nombre es obligatorio.',
    'The apellidos field is required.': 'Los apellidos son obligatorios.',
    
    // Validaciones generales
    'The given data was invalid.': 'Los datos proporcionados no son válidos.',
    'Validation failed': 'Error de validación',
    'These credentials do not match our records.': 'Las credenciales proporcionadas son incorrectas.',
    'The provided credentials are incorrect.': 'Las credenciales proporcionadas son incorrectas.',
    
    // Validaciones de equipamiento
    'The numero serie has already been taken.': 'Ya existe un equipo con este número de serie.',
    'The id ubicacion field is required.': 'La ubicación es obligatoria.',
    'The modelo field is required.': 'El modelo es obligatorio.',
    'The estado field is required.': 'El estado es obligatorio.',
    
    // Otros mensajes comunes
    'Network Error': 'Error de conexión. Verifica tu conexión a internet.',
    'Server Error': 'Error del servidor. Inténtalo más tarde.',
    'Unauthorized': 'No tienes autorización para realizar esta acción.'
};

// Función para traducir mensajes de error
const translateError = (message) => {
    if (typeof message !== 'string') return message;
    
    // Buscar traducción exacta
    if (errorTranslations[message]) {
        return errorTranslations[message];
    }
    
    // Buscar traducciones por patrones
    for (const [englishPattern, spanishTranslation] of Object.entries(errorTranslations)) {
        if (message.includes(englishPattern) || englishPattern.includes(message)) {
            return spanishTranslation;
        }
    }
    
    return message; // Si no hay traducción, devolver el mensaje original
};

// Configurar interceptor para manejar errores
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const errorData = error.response.data;
            
            // Si hay errores de validación, traducir y devolver el primer error
            if (errorData.errors) {
                const errors = errorData.errors;
                let translatedErrors = {};
                
                // Traducir todos los errores
                for (const [field, messages] of Object.entries(errors)) {
                    translatedErrors[field] = messages.map(msg => translateError(msg));
                }
                
                // Devolver el primer error traducido
                const firstErrorField = Object.keys(translatedErrors)[0];
                const firstError = translatedErrors[firstErrorField][0];
                
                return Promise.reject({ 
                    message: firstError,
                    errors: translatedErrors,
                    originalError: errorData
                });
            }
            
            // Traducir mensaje de error general
            if (errorData.message) {
                const translatedMessage = translateError(errorData.message);
                return Promise.reject({
                    ...errorData,
                    message: translatedMessage
                });
            }
            
            return Promise.reject(errorData);
        } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            return Promise.reject({ message: 'Error de red. Por favor, verifica tu conexión.' });
        } else {
            // Algo pasó al configurar la petición
            const translatedMessage = translateError(error.message);
            return Promise.reject({ message: translatedMessage });
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