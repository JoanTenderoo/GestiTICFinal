import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Modal,
    IconButton,
    Fade,
    Paper,
    useTheme,
    alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    AddLocationAlt as AddLocationAltIcon,
    LocationOn as LocationOnIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { locationService } from '../services/locationService';

const MotionPaper = motion(Paper);

const AddLocation = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    edificio: '',
    planta: '',
    aula: '',
    observaciones: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await locationService.createLocation(formData);
      setSnackbar({
        open: true,
        message: 'Ubicación creada exitosamente',
        severity: 'success'
      });
      setFormData({
        nombre: '',
        edificio: '',
        planta: '',
        aula: '',
        observaciones: ''
      });
      setOpen(false);
      window.dispatchEvent(new Event('updateUbicaciones'));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Error al guardar la ubicación',
        severity: 'error'
      });
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
        borderColor: theme.palette.info.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.info.main,
      },
    },
  };

  return (
    <>
      <MotionPaper
        elevation={0}
        onClick={() => setOpen(true)}
        sx={{
          p: 3,
          height: 140,
          cursor: 'pointer',
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.15)}`,
          },
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          gap: 2
        }}>
          <Box sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            borderRadius: '12px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AddLocationAltIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Añadir Ubicación
          </Typography>
        </Box>
      </MotionPaper>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          p: { xs: 1, sm: 2 } 
        }}
      >
        <Fade in={open}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            sx={{
              width: '100%',
              maxWidth: { xs: '95vw', sm: 500 },
              maxHeight: { xs: '90vh', sm: 'auto' },
              bgcolor: 'background.paper',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <Box sx={{
              p: 3,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `linear-gradient(90deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`
            }}>
              <Typography variant="h6" sx={{
                color: theme.palette.info.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                <LocationOnIcon /> Nueva Ubicación
              </Typography>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  color: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.1)
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
              {['nombre', 'edificio', 'planta', 'aula'].map((field) => (
              <TextField
                  key={field}
                fullWidth
                required
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                onChange={handleChange}
                margin="normal"
                  sx={inputStyles}
                />
              ))}

              <TextField
                fullWidth
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                sx={inputStyles}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '10px',
                  background: `linear-gradient(90deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: theme.palette.info.contrastText,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.info.main, 0.4)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.info.dark} 0%, ${theme.palette.info.main} 100%)`,
                    boxShadow: `0 6px 24px ${alpha(theme.palette.info.main, 0.5)}`
                  }
                }}
              >
                Guardar Ubicación
              </Button>
          </Box>
          </MotionPaper>
        </Fade>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddLocation;
