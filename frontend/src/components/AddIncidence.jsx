import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Snackbar, Alert, Modal, IconButton, Fade,
  Paper, useTheme, alpha, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import { equipmentService } from '../services/equipmentService';
import authService from '../services/authService';

const MotionPaper = motion(Paper);

const estados = [
  'pendiente',
  'en_proceso',
  'resuelta'
];
const prioridades = [
  'baja',
  'media',
  'alta',
  'urgente'
];

const AddIncidence = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState({
    id_incidencia: '',
    id_equipamiento: '',
    id_usuario: '',
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'media',
    fecha_inicio: new Date().toISOString().slice(0, 16)
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await equipmentService.getEquipment();
        setEquipos(data);
      } catch (error) {
        setEquipos([]);
      }
    };
    if (open) fetchEquipos();
  }, [open]);

  useEffect(() => {
    // Al abrir el modal, asigna el id_usuario automáticamente
    if (open) {
      const user = authService.getCurrentUser();
      setFormData((prev) => ({ ...prev, id_usuario: user?.usuario?.id_usuario || user?.id_usuario || '' }));
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await equipmentService.createIncidence(formData);
      setSnackbar({
        open: true,
        message: 'Incidencia creada exitosamente',
        severity: 'success'
      });
      setFormData({
        id_incidencia: '',
        id_equipamiento: '',
        id_usuario: '',
        titulo: '',
        descripcion: '',
        estado: 'pendiente',
        prioridad: 'media',
        fecha_inicio: new Date().toISOString().slice(0, 16)
      });
      setOpen(false);
      window.dispatchEvent(new Event('updateIncidencias'));
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Error al guardar la incidencia',
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
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.15)}`,
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
            backgroundColor: alpha(theme.palette.warning.main, 0.1),
            borderRadius: '12px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Nueva Incidencia
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
              background: `linear-gradient(90deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`
            }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.warning.main,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                <WarningIcon /> Nueva Incidencia
              </Typography>
              <IconButton 
                onClick={() => setOpen(false)}
                sx={{
                  color: theme.palette.warning.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.warning.main, 0.1)
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="equipo-label">Equipo</InputLabel>
                <Select
                  labelId="equipo-label"
                  name="id_equipamiento"
                  value={formData.id_equipamiento}
                  onChange={handleChange}
                  label="Equipo"
                  sx={{
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.warning.main
                    }
                  }}
                >
                  <MenuItem value=""><em>Ninguno</em></MenuItem>
                  {equipos.map((eq) => (
                    <MenuItem key={eq.id_equipamiento || eq.id} value={eq.id_equipamiento || eq.id}>
                      {eq.modelo} ({eq.numero_serie})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: theme.palette.warning.main
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                required
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: theme.palette.warning.main
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Estado"
                value="Pendiente"
                margin="normal"
                disabled
                helperText="El estado de las nuevas incidencias es siempre 'Pendiente'"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.warning.main, 0.05)
                  }
                }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  label="Prioridad"
                  sx={{
                    borderRadius: '8px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.warning.main
                    }
                  }}
                >
                  {prioridades.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="Fecha de inicio"
                name="fecha_inicio"
                type="datetime-local"
                value={formData.fecha_inicio}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: theme.palette.warning.main
                    }
                  }
                }}
              />

              <Button 
                type="submit" 
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.warning.main, 0.4)}`,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.warning.main, 0.6)}`,
                  }
                }}
              >
                Guardar Incidencia
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
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddIncidence; 