import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import logo from '../assets/logo.webp';

const MotionPaper = motion(Paper);

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    password_confirmation: '',
    rol: 'usuario'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Función para validar campos en tiempo real
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es obligatorio.';
        } else if (value.length > 255) {
          error = 'El nombre no puede tener más de 255 caracteres.';
        }
        break;
        
      case 'apellidos':
        if (!value.trim()) {
          error = 'Los apellidos son obligatorios.';
        } else if (value.length > 255) {
          error = 'Los apellidos no pueden tener más de 255 caracteres.';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'El email es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'El email debe tener un formato válido.';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria.';
        } else if (value.length < 8) {
          error = 'La contraseña debe tener al menos 8 caracteres.';
        }
        break;
        
      case 'password_confirmation':
        if (!value) {
          error = 'La confirmación de contraseña es obligatoria.';
        } else if (value !== formData.password) {
          error = 'La confirmación de contraseña no coincide.';
        }
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validar el campo en tiempo real
    const fieldError = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
    
    // Si es confirmación de contraseña, también revalidar la contraseña
    if (name === 'password' && formData.password_confirmation) {
      const confirmError = validateField('password_confirmation', formData.password_confirmation);
      setFieldErrors(prev => ({
        ...prev,
        password_confirmation: confirmError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar todos los campos antes de enviar
    const errors = {};
    Object.keys(formData).forEach(field => {
      const fieldError = validateField(field, formData[field]);
      if (fieldError) {
        errors[field] = fieldError;
      }
    });

    // Validación adicional de confirmación de contraseña
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'La confirmación de contraseña no coincide.';
    }

    // Si hay errores, mostrarlos y no enviar
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setError(firstError);
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: alpha(theme.palette.divider, 0.3),
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`,
        padding: { xs: 1, sm: 2 }
      }}
    >
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={8}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: { xs: '400px', sm: '500px', md: '1000px' },
          minHeight: { xs: 'auto', md: '600px' },
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: { xs: 'flex', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            padding: { xs: 2, md: 4 },
            minHeight: { xs: '120px', md: 'auto' }
          }}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            src={logo}
            alt="Logo"
            style={{
              width: '100%',
              maxWidth: '180px',
              height: 'auto',
              filter: 'brightness(0) invert(1)'
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            padding: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: 600,
                color: theme.palette.text.primary,
                textAlign: 'center'
              }}
            >
              Crear Cuenta
            </Typography>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.nombre}
                helperText={fieldErrors.nombre}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.apellidos}
                helperText={fieldErrors.apellidos}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}
            >
              <TextField
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirmar Contraseña"
                name="password_confirmation"
                type={showPassword ? 'text' : 'password'}
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.password_confirmation}
                helperText={fieldErrors.password_confirmation}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '10px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.5)}`
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'REGISTRARSE'
              )}
            </Button>

            <Box
              sx={{
                mt: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Iniciar sesión
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </MotionPaper>
    </Box>
  );
};

export default RegisterPage;

