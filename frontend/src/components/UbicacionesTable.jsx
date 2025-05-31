import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Paper,
    CircularProgress,
    Alert,
    Tooltip,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Typography,
    useTheme,
    alpha,
    styled,
    useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { locationService } from '../services/locationService';
import authService from '../services/authService';
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    minHeight: '100vh',
    '& .ubicaciones-title': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginBottom: theme.spacing(3),
        fontSize: '1.5rem',
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        backgroundClip: 'text',
        textFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
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
    },
    '& .MuiTextField-root': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '12px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.2)
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main
            }
        }
    }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    },
    '& .MuiDialogTitle-root': {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        color: '#fff',
        padding: theme.spacing(2, 3)
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3)
    }
}));

const UbicacionesTable = () => {
    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [ubicacionToDelete, setUbicacionToDelete] = useState(null);
    const user = authService.getCurrentUser();
    const isAdmin = [user?.rol, user?.usuario?.rol].some(r => r === 'administrador' || r === 'admin');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const data = await locationService.getLocations();
                setUbicaciones(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las ubicaciones');
                setLoading(false);
            }
        };
        fetchUbicaciones();
    }, []);

    const handleOpenEditModal = (ubicacion) => {
        setEditForm({
            id_ubicacion: ubicacion.id_ubicacion,
            nombre: ubicacion.nombre,
            edificio: ubicacion.edificio,
            planta: ubicacion.planta,
            aula: ubicacion.aula,
            observaciones: ubicacion.observaciones || ''
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setEditForm(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await locationService.updateLocation(editForm.id_ubicacion, editForm);
            setSnackbar({ open: true, message: 'Ubicación actualizada correctamente', severity: 'success' });
            setOpenEditModal(false);
            setEditForm(null);
            // Refrescar ubicaciones
            const data = await locationService.getLocations();
            setUbicaciones(data);
            // Disparar evento de actualización
            window.dispatchEvent(new Event('updateUbicaciones'));
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Error al actualizar la ubicación', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleOpenDeleteModal = (ubicacion) => {
        setUbicacionToDelete(ubicacion);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setUbicacionToDelete(null);
    };

    const handleDeleteUbicacion = async () => {
        if (!ubicacionToDelete) return;
        setSaving(true);
        try {
            const result = await locationService.deleteLocation(ubicacionToDelete.id_ubicacion);
            setSnackbar({ open: true, message: 'Ubicación eliminada correctamente', severity: 'success' });
            setOpenDeleteModal(false);
            setUbicacionToDelete(null);
            // Refrescar ubicaciones
            const data = await locationService.getLocations();
            setUbicaciones(data);
            // Disparar evento de actualización
            window.dispatchEvent(new Event('updateUbicaciones'));
        } catch (error) {
            let errorMsg = error.message || 'Error al eliminar la ubicación';
            // Detectar error de integridad referencial (clave foránea)
            if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                if (error.response.data.message.includes('a foreign key constraint fails') || error.response.data.message.includes('Integrity constraint violation')) {
                    errorMsg = 'No se puede eliminar la ubicación porque tiene equipamiento asociado. Elimina o reasigna ese equipamiento primero.';
                }
            }
            setSnackbar({ 
                open: true, 
                message: errorMsg, 
                severity: 'error',
                autoHideDuration: 8000
            });
        } finally {
            setSaving(false);
            setOpenDeleteModal(false);
            setUbicacionToDelete(null);
        }
    };

    const columns = useMemo(() => {
        const baseColumns = [
            { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 120 },
            { field: 'edificio', headerName: 'Edificio', flex: 1, minWidth: 100, hide: isMobile },
            { field: 'planta', headerName: 'Planta', flex: 1, minWidth: 80, hide: isMobile },
            { field: 'aula', headerName: 'Aula', flex: 1, minWidth: 80 },
            { 
                field: 'observaciones', 
                headerName: 'Observaciones', 
                flex: 2, 
                minWidth: isMobile ? 120 : 180, 
                hide: isMobile,
                renderCell: (params) => (
                    <Tooltip title={params.value || ''}>
                        <span style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: 'block', 
                            maxWidth: isMobile ? 120 : 180 
                        }}>
                            {params.value}
                        </span>
                    </Tooltip>
                ) 
            }
        ];
        if (isAdmin) {
            baseColumns.push({
                field: 'acciones',
                headerName: 'Acciones',
                flex: 1,
                minWidth: isMobile ? 80 : 120,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Box display="flex" gap={isMobile ? 0.5 : 1}>
                        <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => handleOpenEditModal(params.row)}>
                                <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => handleOpenDeleteModal(params.row)}>
                                <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            });
        }
        return baseColumns;
    }, [isAdmin, isMobile]);

    const filteredUbicaciones = useMemo(() => {
        if (!searchText) return ubicaciones;
        return ubicaciones.filter(u =>
            (u.nombre && u.nombre.toLowerCase().includes(searchText.toLowerCase())) ||
            (u.edificio && u.edificio.toLowerCase().includes(searchText.toLowerCase())) ||
            (u.planta && u.planta.toLowerCase().includes(searchText.toLowerCase())) ||
            (u.aula && u.aula.toLowerCase().includes(searchText.toLowerCase())) ||
            (u.observaciones && u.observaciones.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [searchText, ubicaciones]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <StyledBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Typography variant="h6" className="ubicaciones-title" gutterBottom>
                    Ubicaciones Registradas
                </Typography>
            <Box mb={2}>
                <TextField
                    label="Buscar en ubicaciones..."
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    fullWidth
                />
            </Box>
                <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
            <DataGrid
                rows={filteredUbicaciones}
                columns={columns}
                getRowId={row => row.id_ubicacion}
                pageSize={8}
                rowsPerPageOptions={[8, 16, 32]}
                disableSelectionOnClick
                autoHeight={false}
                localeText={{
                    noRowsLabel: 'Todavía no hay datos',
                    toolbarColumns: 'Columnas', 
                    toolbarFilters: 'Filtros', 
                    toolbarDensidad: 'Densidad', 
                    toolbarExport: 'Exportar' 
                }}
                sx={{
                    height: '100%',
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
                    },
                    '& .MuiDataGrid-footerContainer': {
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }
                }}
            />
                </Box>
            </MotionBox>

            <StyledDialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editForm ? 'Editar Ubicación' : 'Nueva Ubicación'}
                </DialogTitle>
                <DialogContent>
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            required
                            label="Nombre"
                            name="nombre"
                            value={editForm?.nombre || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Edificio"
                            name="edificio"
                            value={editForm?.edificio || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Planta"
                            name="planta"
                            value={editForm?.planta || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Aula"
                            name="aula"
                            value={editForm?.aula || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Observaciones"
                            name="observaciones"
                            value={editForm?.observaciones || ''}
                            onChange={handleEditChange}
                            margin="normal"
                            multiline
                                rows={4}
                        />
                        </Box>
                    </MotionBox>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseEditModal} variant="outlined">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleEditSubmit} 
                        variant="contained" 
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </StyledDialog>

            <Dialog
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'none',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                    }
                }}
            >
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>¿Eliminar ubicación?</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'white', fontSize: '1rem' }}>
                    <Typography>¿Estás seguro de que deseas eliminar esta ubicación? Esta acción no se puede deshacer.</Typography>
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">{ubicacionToDelete?.nombre}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'white', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <Button onClick={handleCloseDeleteModal} variant="text" sx={{ color: '#1565C0' }} disabled={saving}>Cancelar</Button>
                    <Button onClick={handleDeleteUbicacion} variant="contained" color="error" disabled={saving}>{saving ? 'Eliminando...' : 'Eliminar'}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StyledBox>
    );
};

export default UbicacionesTable; 