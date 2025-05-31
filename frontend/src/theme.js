/**
 * CONFIGURACIÓN DEL TEMA DE MATERIAL-UI
 * 
 * Este archivo define el tema global de la aplicación que personaliza:
 * - Colores (paleta de colores del sistema)
 * - Tipografía (fuentes, tamaños, transformaciones)
 * - Componentes (estilos personalizados para botones, cards, etc.)
 * 
 * El tema se aplica automáticamente a todos los componentes Material-UI
 * a través del ThemeProvider en App.jsx
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // PALETA DE COLORES
  palette: {
    // Colores primarios del sistema
    primary: {
      main: '#1976d2', // Azul corporativo principal
      // Material-UI genera automáticamente las variantes:
      // light: versión más clara del color
      // dark: versión más oscura del color
      // contrastText: color de texto que contrasta con el fondo
    },
    
    // Colores de fondo globales
    background: {
      default: '#f7f8fa', // Fondo general de la aplicación (gris muy claro)
      paper: '#ffffff',   // Fondo de componentes tipo papel (blanco)
    },
  },
  
  // CONFIGURACIÓN DE TIPOGRAFÍA
  typography: {
    // Fuente principal del sistema
    // Poppins es una fuente moderna y legible
    // Fallback a Segoe UI (Windows) y sans-serif genérico
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    
    // Configuración específica para botones
    button: {
      textTransform: 'none', // Desactiva MAYÚSCULAS automáticas en botones
    },
  },
  
  // PERSONALIZACIÓN DE COMPONENTES
  // Permite sobrescribir estilos de componentes específicos de Material-UI
  components: {
    
    // BOTONES PERSONALIZADOS
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',    // Bordes más redondeados que el estándar
          padding: '8px 16px',    // Padding personalizado
          // Aquí se podrían añadir más estilos como:
          // fontWeight: 600,
          // boxShadow: 'none',
          // '&:hover': { /* estilos al hover */ }
        },
      },
    },
    
    // COMPONENTES PAPER (CONTENEDORES)
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Bordes más redondeados para look moderno
          // Paper es la base de Cards, Modals, Drawers, etc.
        },
      },
    },
    
    // TARJETAS (CARDS)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Coherente con Paper
          // Sombra personalizada usando Tailwind CSS shadows
          // Más sutil que la sombra por defecto de Material-UI
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

export default theme; 