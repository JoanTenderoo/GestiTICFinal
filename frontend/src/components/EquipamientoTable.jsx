import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Paper,
    CircularProgress,
    Alert,
    Tooltip,
    Chip,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Typography,
    useTheme,
    alpha,
    styled,
    useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import { equipmentService } from '../services/equipmentService';
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
    '& .equipamiento-title': {
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

const estados = [
    'operativo',
    'averiado',
    'reparacion',
    'retirado'
];

const EquipamientoTable = () => {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [equipoToDelete, setEquipoToDelete] = useState(null);
    const user = authService.getCurrentUser();
    const isAdmin = [user?.rol, user?.usuario?.rol].some(r => r === 'administrador' || r === 'admin');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const data = await equipmentService.getEquipment();
                setEquipos(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar el equipamiento');
                setLoading(false);
            }
        };
        fetchEquipos();

        // Cargar ubicaciones al montar el componente
        const fetchUbicaciones = async () => {
            try {
                const data = await locationService.getLocations();
                setUbicaciones(data);
            } catch (error) {
                setUbicaciones([]);
            }
        };
        fetchUbicaciones();
    }, []);

    const getEstadoColor = (estado) => {
        const colores = {
            operativo: 'success',
            averiado: 'error',
            reparacion: 'warning',
            retirado: 'default'
        };
        return colores[estado] || 'default';
    };

    const handleOpenEditModal = (equipo) => {
        setEditForm({
            id_equipamiento: equipo.id_equipamiento,
            id_ubicacion: equipo.id_ubicacion || '',
            modelo: equipo.modelo,
            numero_serie: equipo.numero_serie,
            estado: equipo.estado,
            observaciones: equipo.observaciones || ''
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
            await equipmentService.updateEquipment(editForm.id_equipamiento, editForm);
            setSnackbar({ open: true, message: 'Equipamiento actualizado correctamente', severity: 'success' });
            setOpenEditModal(false);
            setEditForm(null);
            // Refrescar equipamiento
            const data = await equipmentService.getEquipment();
            setEquipos(data);
            // Disparar evento de actualización
            window.dispatchEvent(new Event('updateEquipamiento'));
        } catch (error) {
            let errorMsg = error.message || 'Error al actualizar el equipamiento';
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            }
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleOpenDeleteModal = (equipo) => {
        setEquipoToDelete(equipo);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setEquipoToDelete(null);
    };

    const handleDeleteEquipo = async () => {
        if (!equipoToDelete) return;
        setSaving(true);
        try {
            const result = await equipmentService.deleteEquipment(equipoToDelete.id_equipamiento);
            setSnackbar({ open: true, message: 'Equipamiento eliminado correctamente', severity: 'success' });
            setOpenDeleteModal(false);
            setEquipoToDelete(null);
            // Refrescar equipamiento
            const equiposData = await equipmentService.getEquipment();
            setEquipos(equiposData);
            // Disparar evento de actualización
            window.dispatchEvent(new Event('updateEquipamiento'));
        } catch (error) {
            let errorMsg = error.message || 'Error al eliminar el equipamiento';
            // Detectar error de integridad referencial (clave foránea)
            if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                if (error.response.data.message.includes('a foreign key constraint fails') || error.response.data.message.includes('Integrity constraint violation')) {
                    errorMsg = 'No se puede eliminar el equipamiento porque tiene incidencias asociadas. Elimina o reasigna esas incidencias primero.';
                }
            }
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            setOpenDeleteModal(false);
            setEquipoToDelete(null);
        } finally {
            setSaving(false);
        }
    };

    // Enriquecer los equipos con el nombre de la ubicación
    const equiposConUbicacion = useMemo(() => {
        return equipos.map(eq => {
            const ubicacion = ubicaciones.find(u => u && u.id_ubicacion === eq.id_ubicacion);
            return {
                ...eq,
                nombre_ubicacion: ubicacion ? ubicacion.nombre : 'Sin asignar'
            };
        });
    }, [equipos, ubicaciones]);

    const columns = useMemo(() => {
        const baseColumns = [
            { field: 'modelo', headerName: 'Modelo', flex: 1, minWidth: 120 },
            { field: 'numero_serie', headerName: 'Nº Serie', flex: 1, minWidth: 100, hide: isMobile },
            { field: 'nombre_ubicacion', headerName: 'Ubicación', flex: 1, minWidth: 100 },
            { 
                field: 'estado', 
                headerName: 'Estado', 
                flex: 1, 
                minWidth: 80, 
                renderCell: (params) => (
                    <Chip label={params.value} color={getEstadoColor(params.value)} size="small" />
                ) 
            },
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

    const filteredEquipos = useMemo(() => {
        if (!searchText) return equipos;
        return equipos.filter(eq =>
            (eq.modelo && eq.modelo.toLowerCase().includes(searchText.toLowerCase())) ||
            (eq.numero_serie && eq.numero_serie.toLowerCase().includes(searchText.toLowerCase())) ||
            (eq.estado && eq.estado.toLowerCase().includes(searchText.toLowerCase())) ||
            (eq.observaciones && eq.observaciones.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [searchText, equipos]);

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
                <Typography variant="h6" className="equipamiento-title" gutterBottom>
                    Equipamiento Registrado
                </Typography>
            <Box mb={2}>
                <TextField
                    label="Buscar en equipamiento..."
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    fullWidth
                />
            </Box>
                <Box sx={{ width: '100%', flexGrow: 1, minHeight: 0 }}>
            <DataGrid
                rows={filteredEquipos.map(eq => {
                    const eqUbic = equiposConUbicacion.find(e => e.id_equipamiento === eq.id_equipamiento);
                    return eqUbic || eq;
                })}
                columns={columns}
                getRowId={row => row.id_equipamiento}
                pageSize={8}
                rowsPerPageOptions={[8, 16, 32]}
                disableSelectionOnClick
                autoHeight={false}
                localeText={{
                    noRowsLabel: 'Todavía no hay datos',
                    toolbarColumns: 'Columnas', 
                    toolbarFilters: 'Filtros', 
                    toolbarDensity: 'Densidad', 
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
                    {editForm ? 'Editar Equipamiento' : 'Nuevo Equipamiento'}
                </DialogTitle>
                <DialogContent>
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="ubicacion-edit-label">Ubicación</InputLabel>
                            <Select
                                labelId="ubicacion-edit-label"
                                name="id_ubicacion"
                                value={editForm?.id_ubicacion || ''}
                                label="Ubicación"
                                onChange={handleEditChange}
                            >
                                <MenuItem value=""><em>Ninguna</em></MenuItem>
                                {ubicaciones.map((u) => (
                                    <MenuItem key={u.id_ubicacion} value={u.id_ubicacion}>
                                        {u.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            required
                            label="Modelo"
                            name="modelo"
                            value={editForm?.modelo || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Número de serie"
                            name="numero_serie"
                            value={editForm?.numero_serie || ''}
                            onChange={handleEditChange}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="estado-edit-label">Estado</InputLabel>
                            <Select
                                labelId="estado-edit-label"
                                name="estado"
                                value={editForm?.estado || ''}
                                label="Estado"
                                onChange={handleEditChange}
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

            {/* Modal de confirmación de eliminación */}
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
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    ¿Eliminar equipamiento?
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: 'white', fontSize: '1rem' }}>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar este equipamiento? Esta acción no se puede deshacer.
                    </Typography>
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                            {equipoToDelete?.modelo} - {equipoToDelete?.numero_serie}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'white', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <Button 
                        onClick={handleCloseDeleteModal} 
                        variant="text" 
                        sx={{ color: '#1565C0' }} 
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteEquipo} 
                        variant="contained" 
                        color="error" 
                        disabled={saving}
                    >
                        {saving ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledBox>
    );
};

export default EquipamientoTable; 