/**
 * COMPONENTE APP - Punto de entrada principal de la aplicación React
 * 
 * Este es el componente raíz que configura:
 * - Enrutamiento de la SPA (Single Page Application)
 * - Tema global de Material-UI
 * - Configuración responsive para todos los dispositivos
 * - CSS baseline para normalización de estilos
 * 
 * Patrón de diseño: Composition Root - donde se configuran todas las dependencias
 */

import React from 'react';

// React Router para navegación SPA (Single Page Application)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de páginas/componentes principales
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

// Material-UI para temas y estilos globales
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Normaliza estilos CSS entre navegadores

import './App.css'; // Estilos CSS personalizados

/**
 * CONFIGURACIÓN DEL TEMA GLOBAL
 * 
 * Material-UI permite crear un tema personalizado que se aplica a todos los componentes.
 * El tema define colores, tipografías, breakpoints y estilos de componentes.
 */
const theme = createTheme({
    // PALETA DE COLORES
    palette: {
        primary: {
            main: '#1976d2', // Azul principal del sistema
        },
        secondary: {
            main: '#dc004e', // Color secundario (rojo/rosa)
        },
    },
    
    // BREAKPOINTS RESPONSIVE
    // Define los puntos de quiebre para diseño responsive
    breakpoints: {
        values: {
            xs: 0,    // Extra small: móviles en vertical
            sm: 600,  // Small: móviles grandes y tablets pequeñas
            md: 900,  // Medium: tablets
            lg: 1200, // Large: desktop
            xl: 1536, // Extra large: desktop grande
        },
    },
    
    // TIPOGRAFÍA RESPONSIVE
    // clamp() hace que el texto se escale automáticamente según el viewport
    typography: {
        h1: {
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', // Min: 2rem, Preferido: 5% viewport, Max: 3.5rem
        },
        h2: {
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
        },
        h3: {
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        },
        h4: {
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        },
        h5: {
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
        },
        h6: {
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        },
    },
    
    // CUSTOMIZACIÓN DE COMPONENTES GLOBALES
    // Permite sobrescribir estilos de componentes Material-UI
    components: {
        // Contenedores responsive
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '16px',  // Padding lateral por defecto
                    paddingRight: '16px',
                    // Media query CSS-in-JS para móviles
                    '@media (max-width: 600px)': {
                        paddingLeft: '8px',  // Menos padding en móviles
                        paddingRight: '8px',
                    },
                },
            },
        },
        
        // Botones optimizados para móviles
        MuiButton: {
            styleOverrides: {
                root: {
                    '@media (max-width: 600px)': {
                        minHeight: '44px', // Área táctil mínima recomendada (Apple/Google)
                        fontSize: '0.875rem', // Texto un poco más pequeño en móviles
                    },
                },
            },
        },
        
        // Botones de iconos responsive
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '@media (max-width: 600px)': {
                        padding: '8px', // Padding reducido en móviles
                    },
                },
            },
        },
    },
});

/**
 * COMPONENTE APP PRINCIPAL
 * 
 * Implementa el patrón Provider para:
 * - Proveer el tema a toda la aplicación
 * - Configurar el enrutamiento SPA
 * - Establecer la estructura base de navegación
 */
const App = () => {
    return (
        // PROVIDER DEL TEMA - Hace el tema disponible para todos los componentes hijo
        <ThemeProvider theme={theme}>
            {/* CssBaseline normaliza los estilos CSS entre diferentes navegadores */}
            <CssBaseline />
            
            {/* ROUTER - Habilita la navegación SPA sin recargar la página */}
            <Router>
                {/* DEFINICIÓN DE RUTAS */}
                <Routes>
                    {/* Ruta pública: Página de login */}
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Ruta pública: Página de registro */}
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Ruta privada: Dashboard principal (requiere autenticación) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Ruta por defecto: Redirige a login */}
                    {/* Navigate replace={true} reemplaza la entrada en el historial */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
