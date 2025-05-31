import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Snackbar, Alert, Modal, IconButton, Fade,
  Paper, useTheme, alpha, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import ComputerIcon from '@mui/icons-material/Computer';
import CloseIcon from '@mui/icons-material/Close';
import { locationService } from '../services/locationService';
import { equipmentService } from '../services/equipmentService';

const MotionPaper = motion(Paper);

const estados = [
  'operativo',
  'averiado',
  'reparacion',
  'retirado'
];

const AddEquipment = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_ubicacion: '',
    modelo: '',
    numero_serie: '',
    estado: 'operativo',
    observaciones: ''
  });
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchUbicaciones = async () => {
      setLoadingUbicaciones(true);
      try {
        console.log('Cargando ubicaciones...');
        const data = await locationService.getLocations();
        console.log('Ubicaciones cargadas:', data);
        setUbicaciones(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        setUbicaciones([]);
        setSnackbar({
          open: true,
          message: 'Error al cargar ubicaciones: ' + (error.message || 'Error desconocido'),
          severity: 'error'
        });
      } finally {
        setLoadingUbicaciones(false);
      }
    };
    
    if (open) {
      fetchUbicaciones();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'id_ubicacion') {
      const ubicacion = ubicaciones.find(u => u.id_ubicacion === value);
      setFormData(prev => ({ 
        ...prev, 
        id_ubicacion: ubicacion ? ubicacion.id_ubicacion : '' 
      }));
    } else {
    setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await equipmentService.createEquipment(formData);
      setSnackbar({
        open: true,
        message: 'Equipamiento creado exitosamente',
        severity: 'success'
      });
      setFormData({
        id_ubicacion: '',
        modelo: '',
        numero_serie: '',
        estado: 'operativo',
        observaciones: ''
      });
      setOpen(false);
      window.dispatchEvent(new Event('updateEquipamiento'));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Error al guardar el equipamiento',
        severity: 'error'
      });
    }
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
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.15)}`,
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
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            borderRadius: '12px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ComputerIcon sx={{ color: theme.palette.success.main, fontSize: 32 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Nuevo Equipamiento
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
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              p: { xs: 2, sm: 3 },
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`
            }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.success.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1rem', sm: '1.2rem' }
              }}>
                <ComputerIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} /> Nuevo Equipamiento
              </Typography>
              <IconButton 
                onClick={() => setOpen(false)}
                sx={{
                  color: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.1)
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="ubicacion-label">Ubicación</InputLabel>
                <Select
                  labelId="ubicacion-label"
                  name="id_ubicacion"
                  value={formData.id_ubicacion}
                  label="Ubicación"
                  onChange={handleChange}
                  disabled={loadingUbicaciones}
                >
                  <MenuItem value=""><em>Ninguna</em></MenuItem>
                  {loadingUbicaciones && (
                    <MenuItem disabled>
                      <em>Cargando ubicaciones...</em>
                    </MenuItem>
                  )}
                  {!loadingUbicaciones && ubicaciones.length === 0 && (
                    <MenuItem disabled>
                      <em>No hay ubicaciones disponibles. Crea una ubicación primero.</em>
                    </MenuItem>
                  )}
                  {!loadingUbicaciones && ubicaciones.length > 0 && ubicaciones.map((ubicacion) => (
                    <MenuItem key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                      {ubicacion.nombre} - {ubicacion.edificio} ({ubicacion.aula})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                required
                label="Número de serie"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                margin="normal"
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  name="estado"
                  value={formData.estado}
                  label="Estado"
                  onChange={handleChange}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '10px',
                  background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: theme.palette.success.contrastText,
                  boxShadow: `0 4px 16px ${alpha(theme.palette.success.main, 0.4)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                    boxShadow: `0 6px 24px ${alpha(theme.palette.success.main, 0.5)}`
                  }
                }}
              >
                Guardar Equipamiento
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

export default AddEquipment; 