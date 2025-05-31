import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    typography: {
        // Responsive typography
        h1: {
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
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
    components: {
        // Componentes responsive globales
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    '@media (max-width: 600px)': {
                        paddingLeft: '8px',
                        paddingRight: '8px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '@media (max-width: 600px)': {
                        minHeight: '44px', // Tamaño táctil mínimo
                        fontSize: '0.875rem',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '@media (max-width: 600px)': {
                        padding: '8px',
                    },
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
