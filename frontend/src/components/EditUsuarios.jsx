import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Modal,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Button,
  styled,
  Chip,
  TextField
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { userService } from '../services/userService';
import authService from '../services/authService';
import Tooltip from '@mui/material/Tooltip';

const MotionPaper = motion(Paper);

const StyledBox = styled(Box)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.05)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    '& .MuiDataGrid-cell': {
      borderColor: alpha(theme.palette.divider, 0.1)
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      borderRadius: '16px 16px 0 0'
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04)
      }
    }
  }
}));

const EditUsuarios = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const currentUser = authService.getCurrentUser();
  const [newRole, setNewRole] = useState('');
  const [searchText, setSearchText] = useState('');

  const normalizeRole = (role) => (role || '').toString().trim().toLowerCase();

  const canModifyUser = (user) => {
    if (!currentUser) return false;
    const currentRole = normalizeRole(currentUser.usuario?.rol);
    const currentId = currentUser.usuario?.id_usuario;
    const userRole = normalizeRole(user.rol);
    if (currentRole !== 'admin') return false;
    if (user.id_usuario === currentId) return false;
    if (userRole === 'usuario') return true;
    return false;
  };

  // Filtro de búsqueda global
  const filteredUsers = useMemo(() => {
    if (!searchText) return users;
    return users.filter((user) => {
      return (
        user.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [searchText, users]);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      setSnackbar({
        open: true,
        message: 'Error al cargar los usuarios',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenRoleModal = (user) => {
    if (!canModifyUser(user)) {
      setSnackbar({
        open: true,
        message: 'Solo puedes modificar usuarios normales',
        severity: 'error'
      });
      return;
    }
    setSelectedUser(user);
    setNewRole(user.rol);
    setOpenRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
    setSelectedUser(null);
    setNewRole('');
  };

  const handleOpenDeleteModal = (user) => {
    if (!canModifyUser(user)) {
      setSnackbar({
        open: true,
        message: 'Solo puedes eliminar usuarios normales',
        severity: 'error'
      });
      return;
    }
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async () => {
    try {
      await userService.updateUserRole(selectedUser.id_usuario, newRole);
      setSnackbar({
        open: true,
        message: 'Rol actualizado correctamente',
        severity: 'success'
      });
      fetchUsers();
      handleCloseRoleModal();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el rol',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(selectedUser.id_usuario);
      setSnackbar({
        open: true,
        message: 'Usuario eliminado correctamente',
        severity: 'success'
      });
      handleCloseDeleteModal();
      fetchUsers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error al eliminar el usuario',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns = [
    {
      field: 'nombre_completo',
      headerName: 'Nombre Completo',
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => `${row.nombre} ${row.apellidos}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => {
        const isAdmin = params.value === 'admin' || params.value === 'administrador';
        return (
          <Chip
            label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
            color={isAdmin ? 'primary' : 'default'}
            variant={isAdmin ? 'filled' : 'outlined'}
            size="small"
            icon={isAdmin ? <PeopleIcon /> : undefined}
          />
        );
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        const canModify = canModifyUser(params.row);
        return (
          <Box>
            <Tooltip title={canModify ? 'Editar usuario' : 'No permitido'}>
              <span>
                <IconButton
                  onClick={() => handleOpenRoleModal(params.row)}
                  color="primary"
                  size="small"
                  disabled={!canModify}
                  sx={{ borderRadius: 2 }}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={canModify ? 'Eliminar usuario' : 'No permitido'}>
              <span>
                <IconButton
                  onClick={() => handleOpenDeleteModal(params.row)}
                  color="error"
                  size="small"
                  disabled={!canModify}
                  sx={{ borderRadius: 2, ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  return (
    <>
      <MotionPaper
        elevation={0}
        onClick={handleOpen}
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
            <PeopleIcon sx={{ color: theme.palette.info.main, fontSize: 32 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Gestionar Usuarios
          </Typography>
        </Box>
      </MotionPaper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="usuarios-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: 1200,
            height: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 0,
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.100', borderTopLeftRadius: 16, borderTopRightRadius: 16, flexShrink: 0 }}>
            <Typography id="usuarios-modal-title" variant="h5" fontWeight={700} color="primary.main">
              Gestión de Usuarios
            </Typography>
            <IconButton onClick={handleClose} size="large" sx={{ color: 'grey.700' }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, flex: 1 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <StyledBox sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box mb={2}>
                <TextField
                  label="Buscar usuarios..."
                  variant="outlined"
                  size="small"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: theme.palette.background.paper,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    },
                  }}
                />
              </Box>
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                getRowId={(row) => row.id_usuario}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 25 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                disableColumnMenu
                hideFooterSelectedRowCount
                components={{ Toolbar: GridToolbar }}
                localeText={{ 
                  noRowsLabel: 'Todavía no hay datos',
                  toolbarColumns: 'Columnas', 
                  toolbarFilters: 'Filtros', 
                  toolbarDensity: 'Densidad', 
                  toolbarExport: 'Exportar' 
                }}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  '& .MuiDataGrid-toolbarContainer': {
                    padding: '8px 16px',
                    backgroundColor: 'transparent'
                  },
                  '& .MuiButton-root': {
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    minHeight: '56px !important',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: '300px',
                  },
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  },
                  '& .MuiDataGrid-cell[data-field="acciones"]': {
                    justifyContent: 'center'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    textAlign: 'center',
                    width: '100%'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    display: 'flex',
                    justifyContent: 'center'
                  },
                  '& .MuiDataGrid-overlay': {
                    backgroundColor: 'transparent'
                  }
                }}
              />
            </StyledBox>
          )}
        </Box>
      </Modal>

      <Dialog
        open={openRoleModal}
        onClose={handleCloseRoleModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', pb: 0 }}>Cambiar Rol de Usuario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Nuevo Rol</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Nuevo Rol"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleModal} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
          <Button onClick={handleRoleChange} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 700, pb: 0 }}>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar al usuario <b>{selectedUser?.nombre} {selectedUser?.apellidos}</b>?<br />
            <span style={{ color: '#888', fontSize: 13 }}>Esta acción no se puede deshacer.</span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained" sx={{ borderRadius: 2, fontWeight: 600 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 500 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditUsuarios; 