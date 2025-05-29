import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    styled,
    useTheme,
    alpha,
    Zoom,
    Fade
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Computer as ComputerIcon,
    Schedule as ScheduleIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { incidenceService } from '../services/equipmentService';
import { locationService } from '../services/locationService';
import authService from '../services/authService';
import { equipmentService } from '../services/equipmentService';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    minHeight: '100vh',
    '& .incidencias-title': {
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
        borderRadius: '20px',
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: 'hidden'
    },
    '& .MuiDialogTitle-root': {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        color: '#fff',
        padding: theme.spacing(2, 3),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
        backgroundColor: alpha(theme.palette.background.default, 0.8)
    }
}));

const InfoBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '16px',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.08)
    }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
        fontSize: '1.2rem'
    }
}));

const estados = [
    'pendiente',
    'en_proceso',
    'resuelta',
    'cerrada'
];
const prioridades = [
    'baja',
    'media',
    'alta',
    'urgente'
];

const StyledEditDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(10px)'
    },
    '& .MuiDialogTitle-root': {
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        color: '#fff',
        padding: theme.spacing(2, 3),
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem'
        }
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
        backgroundColor: 'transparent'
    },
    '& .MuiFormControl-root': {
        marginBottom: theme.spacing(2),
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
            }
        }
    }
}));

const AnimatedFormControl = motion(FormControl);
const AnimatedTextField = motion(TextField);

const DetailCard = styled(Box)(({ theme }) => ({
    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
    borderRadius: '24px',
    padding: theme.spacing(3),
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`
    }
}));

const DetailHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

const DetailSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    background: alpha(theme.palette.primary.main, 0.03),
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: alpha(theme.palette.primary.main, 0.05)
    }
}));

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
    background: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.05)}`
}));

const DetailIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    color: '#fff',
    flexShrink: 0
}));

const DetailInfo = styled(Box)(({ theme }) => ({
    flex: 1,
    minWidth: 0
}));

const DetailTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(0.5)
}));

const DetailText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    lineHeight: 1.5
}));

const ModernDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        background: theme.palette.background.paper,
        boxShadow: 'none',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden'
    }
}));

const DialogHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const InfoContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing(3)
}));

const InfoCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '12px',
    background: alpha(theme.palette.background.paper, 0.6),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'all 0.2s ease',
    '&:hover': {
        background: alpha(theme.palette.background.paper, 0.8),
        transform: 'translateY(-2px)'
    }
}));

const InfoHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
        fontSize: '1.2rem'
    }
}));

const InfoContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: '8px',
    background: alpha(theme.palette.background.paper, 0.5),
    '&:hover': {
        background: alpha(theme.palette.background.paper, 0.8)
    }
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 500
}));

const InfoValue = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    fontWeight: 400
}));

const IncidenciasTable = () => {
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [searchText, setSearchText] = useState('');
    const user = authService.getCurrentUser();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [incidenciaToDelete, setIncidenciaToDelete] = useState(null);
    
    const isAdmin = [user?.rol, user?.usuario?.rol].some(r => r === 'administrador' || r === 'admin');
    const theme = useTheme();

    useEffect(() => {
        const fetchIncidencias = async () => {
            try {
                const data = await incidenceService.getIncidencias();
                setIncidencias(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las incidencias');
                setLoading(false);
            }
        };
        fetchIncidencias();
    }, []);

    useEffect(() => {
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

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const data = await equipmentService.getEquipments();
                setEquipos(data);
            } catch (error) {
                setEquipos([]);
            }
        };
        fetchEquipos();
    }, []);

    const getEstadoColor = (estado) => {
        const colores = {
            pendiente: 'warning',
            en_proceso: 'info',
            resuelta: 'success',
            cerrada: 'default'
        };
        return colores[estado] || 'default';
    };

    const getPrioridadColor = (prioridad) => {
        const colores = {
            baja: 'success',
            media: 'info',
            alta: 'warning',
            urgente: 'error'
        };
        return colores[prioridad] || 'default';
    };

    const handleOpenModal = (incidencia) => {
        setSelectedIncidencia(incidencia);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedIncidencia(null);
    };

    const handleOpenEditModal = (incidencia) => {
        setEditForm({
            id_incidencia: incidencia.id_incidencia,
            titulo: incidencia.titulo,
            descripcion: incidencia.descripcion,
            estado: incidencia.estado,
            prioridad: incidencia.prioridad,
            fecha_inicio: incidencia.fecha_inicio ? incidencia.fecha_inicio.slice(0, 16) : '',
            id_equipamiento: incidencia.equipamiento?.id_equipamiento || '',
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
            const formDataToSend = {
                ...editForm,
                fecha_inicio: new Date(editForm.fecha_inicio).toISOString(),
            };
            await incidenceService.updateIncidence(editForm.id_incidencia, formDataToSend);
            setSnackbar({ open: true, message: 'Incidencia actualizada correctamente', severity: 'success' });
            setOpenEditModal(false);
            setEditForm(null);
            // Refrescar incidencias
            const data = await incidenceService.getIncidencias();
            setIncidencias(data);
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Error al actualizar la incidencia', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleOpenDeleteModal = (incidencia) => {
        setIncidenciaToDelete(incidencia);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setIncidenciaToDelete(null);
    };

    const handleDeleteIncidencia = async () => {
        if (!incidenciaToDelete) return;
        setSaving(true);
        try {
            await incidenceService.deleteIncidence(incidenciaToDelete.id_incidencia);
            setSnackbar({ open: true, message: 'Incidencia eliminada correctamente', severity: 'success' });
            setOpenDeleteModal(false);
            setIncidenciaToDelete(null);
            // Refrescar incidencias
            const data = await incidenceService.getIncidencias();
            setIncidencias(data);
            // Disparar evento de actualización para estadísticas
            window.dispatchEvent(new Event('updateIncidencias'));
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Error al eliminar la incidencia', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // Filtro de búsqueda global
    const filteredIncidencias = useMemo(() => {
        if (!searchText) return incidencias;
        return incidencias.filter((inc) => {
            const equipo = inc.equipamiento ? `${inc.equipamiento.modelo} ${inc.equipamiento.numero_serie}` : '';
            const ubicacion = ubicaciones.find(u => String(u.id_ubicacion) === String(inc.equipamiento?.id_ubicacion));
            const ubicacionNombre = ubicacion ? ubicacion.nombre : '';
            return (
                inc.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
                inc.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
                inc.estado.toLowerCase().includes(searchText.toLowerCase()) ||
                inc.prioridad.toLowerCase().includes(searchText.toLowerCase()) ||
                equipo.toLowerCase().includes(searchText.toLowerCase()) ||
                ubicacionNombre.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [searchText, incidencias, ubicaciones]);

    // Función para asegurar que tenemos una fila válida
    const safeRow = (params) => {
        if (!params || !params.row) return null;
        return params.row;
    };

    // Columnas para DataGrid
    const columns = [
        { field: 'titulo', headerName: 'Título', flex: 1, minWidth: 150 },
        {
            field: 'usuario',
            headerName: 'Usuario',
            flex: 1,
            minWidth: 120,
            renderCell: (params) =>
                params.row && params.row.usuario
                    ? `${params.row.usuario.nombre} ${params.row.usuario.apellidos}`
                    : 'N/A'
        },
        {
            field: 'equipo',
            headerName: 'Equipo',
            flex: 1,
            minWidth: 120,
            renderCell: (params) =>
                params.row && params.row.equipamiento
                    ? params.row.equipamiento.modelo
                    : 'N/A'
        },
        { field: 'descripcion', headerName: 'Descripción', flex: 2, minWidth: 200, renderCell: (params) => (
            <Tooltip title={params.value}><span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 200 }}>{params.value}</span></Tooltip>
        ) },
        { field: 'estado', headerName: 'Estado', flex: 1, minWidth: 100, renderCell: (params) => (
            <Chip label={params.value} color={getEstadoColor(params.value)} size="small" />
        ) },
        { field: 'prioridad', headerName: 'Prioridad', flex: 1, minWidth: 100, renderCell: (params) => (
            <Chip label={params.value} color={getPrioridadColor(params.value)} size="small" />
        ) },
        {
            field: 'fecha_inicio',
            headerName: 'Fecha',
            flex: 1,
            minWidth: 110,
            renderCell: (params) =>
                params.row && params.row.fecha_inicio
                    ? new Date(params.row.fecha_inicio).toLocaleDateString()
                    : ''
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            flex: 1,
            minWidth: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const row = safeRow(params);
                if (!row) return null;
                return (
                <Box display="flex" gap={1}>
                    <Tooltip title="Ver detalles">
                            <IconButton size="small" onClick={() => handleOpenModal(row)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    {isAdmin && (
                        <>
                            <Tooltip title="Editar">
                                    <IconButton size="small" onClick={() => handleOpenEditModal(row)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                                    <IconButton size="small" onClick={() => handleOpenDeleteModal(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
                );
            }
        }
    ];

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
        <StyledBox>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
            <Typography variant="h6" className="incidencias-title" gutterBottom>
                Incidencias Registradas
            </Typography>
            <Box mb={2}>
                <TextField
                    label="Buscar en incidencias..."
                    variant="outlined"
                    size="small"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ height: 420, width: '100%' }}>
                <DataGrid
                    rows={filteredIncidencias}
                    columns={columns}
                    getRowId={row => row.id_incidencia}
                    pageSize={8}
                    rowsPerPageOptions={[8, 16, 32]}
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbar }}
                        localeText={{ 
                            toolbarColumns: 'Columnas', 
                            toolbarFilters: 'Filtros', 
                            toolbarDensity: 'Densidad', 
                            toolbarExport: 'Exportar' 
                        }}
                        sx={{
                            '& .MuiDataGrid-toolbarContainer': {
                                padding: '8px 16px',
                                backgroundColor: 'transparent'
                            },
                            '& .MuiButton-root': {
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                }
                            }
                        }}
                />
            </Box>
            </MotionBox>

            <ModernDialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="lg"
                fullWidth
                TransitionComponent={Zoom}
                transitionDuration={300}
            >
                <DialogHeader>
                    <VisibilityIcon sx={{ color: theme.palette.primary.main }} />
                    <Box>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                            {selectedIncidencia?.titulo}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            Detalles de la incidencia
                        </Typography>
                    </Box>
                </DialogHeader>
                <DialogContent sx={{ p: 0 }}>
                    <AnimatePresence>
                        {selectedIncidencia && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <InfoContainer>
                                    {/* Estado y Prioridad */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <InfoCard>
                                            <InfoHeader>
                                                <ScheduleIcon />
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                                                    Estado y Prioridad
                                                </Typography>
                                            </InfoHeader>
                                            <InfoContent>
                                                <InfoRow>
                                                    <InfoLabel>Estado</InfoLabel>
                                                    <Chip
                                                        label={selectedIncidencia.estado}
                                                        color={getEstadoColor(selectedIncidencia.estado)}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </InfoRow>
                                                <InfoRow>
                                                    <InfoLabel>Prioridad</InfoLabel>
                                                    <Chip
                                                        label={selectedIncidencia.prioridad}
                                                        color={getPrioridadColor(selectedIncidencia.prioridad)}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </InfoRow>
                                            </InfoContent>
                                        </InfoCard>
                                    </motion.div>

                                    {/* Fecha y Usuario */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <InfoCard>
                                            <InfoHeader>
                                                <PersonIcon />
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                                                    Información General
                                                </Typography>
                                            </InfoHeader>
                                            <InfoContent>
                                                <InfoRow>
                                                    <InfoLabel>Fecha de Inicio</InfoLabel>
                                                    <InfoValue>
                                                        {selectedIncidencia.fecha_inicio ? 
                                                            new Date(selectedIncidencia.fecha_inicio).toLocaleString() : 
                                                            'N/A'}
                                                    </InfoValue>
                                                </InfoRow>
                                                <InfoRow>
                                                    <InfoLabel>Usuario</InfoLabel>
                                                    <InfoValue>
                                                        {selectedIncidencia.usuario ? 
                                                            `${selectedIncidencia.usuario.nombre} ${selectedIncidencia.usuario.apellidos}` : 
                                                            'N/A'}
                                                    </InfoValue>
                                                </InfoRow>
                                            </InfoContent>
                                        </InfoCard>
                                    </motion.div>

                                    {/* Descripción */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <InfoCard>
                                            <InfoHeader>
                                                <DescriptionIcon />
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                                                    Descripción
                                                </Typography>
                                            </InfoHeader>
                                            <InfoContent>
                                                <InfoRow>
                                                    <InfoValue sx={{ width: '100%' }}>
                                                        {selectedIncidencia.descripcion}
                                                    </InfoValue>
                                                </InfoRow>
                                            </InfoContent>
                                        </InfoCard>
                                    </motion.div>

                                    {/* Equipo */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <InfoCard>
                                            <InfoHeader>
                                                <ComputerIcon />
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                                                    Equipo
                                                </Typography>
                                            </InfoHeader>
                                            <InfoContent>
                                                {selectedIncidencia.equipamiento ? (
                                                    <>
                                                        <InfoRow>
                                                            <InfoLabel>Modelo</InfoLabel>
                                                            <InfoValue>{selectedIncidencia.equipamiento.modelo}</InfoValue>
                                                        </InfoRow>
                                                        <InfoRow>
                                                            <InfoLabel>Número de Serie</InfoLabel>
                                                            <InfoValue>{selectedIncidencia.equipamiento.numero_serie}</InfoValue>
                                                        </InfoRow>
                                                    </>
                                                ) : (
                                                    <InfoRow>
                                                        <InfoValue>N/A</InfoValue>
                                                    </InfoRow>
                                                )}
                                            </InfoContent>
                                        </InfoCard>
                                    </motion.div>

                                    {/* Ubicación */}
                                    {selectedIncidencia.equipamiento?.id_ubicacion && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <InfoCard>
                                                <InfoHeader>
                                                    <LocationIcon />
                                                    <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main }}>
                                                        Ubicación
                                                    </Typography>
                                                </InfoHeader>
                                                <InfoContent>
                                                    {(() => {
                                                        const ubicacion = ubicaciones.find(u => 
                                                            String(u.id_ubicacion) === String(selectedIncidencia.equipamiento.id_ubicacion)
                                                        );
                                                        return ubicacion ? (
                                                            <>
                                                                <InfoRow>
                                                                    <InfoLabel>Nombre</InfoLabel>
                                                                    <InfoValue>{ubicacion.nombre}</InfoValue>
                                                                </InfoRow>
                                                                <InfoRow>
                                                                    <InfoLabel>Edificio</InfoLabel>
                                                                    <InfoValue>{ubicacion.edificio}</InfoValue>
                                                                </InfoRow>
                                                                <InfoRow>
                                                                    <InfoLabel>Planta</InfoLabel>
                                                                    <InfoValue>{ubicacion.planta}</InfoValue>
                                                                </InfoRow>
                                                                <InfoRow>
                                                                    <InfoLabel>Aula</InfoLabel>
                                                                    <InfoValue>{ubicacion.aula}</InfoValue>
                                                                </InfoRow>
                                                                {ubicacion.observaciones && (
                                                                    <InfoRow>
                                                                        <InfoLabel>Observaciones</InfoLabel>
                                                                        <InfoValue>{ubicacion.observaciones}</InfoValue>
                                                                    </InfoRow>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <InfoRow>
                                                                <InfoValue>Ubicación no encontrada</InfoValue>
                                                            </InfoRow>
                                                        );
                                                    })()}
                                                </InfoContent>
                                            </InfoCard>
                                        </motion.div>
                                    )}
                                </InfoContainer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Button 
                        onClick={handleCloseModal} 
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </ModernDialog>

            <StyledEditDialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Zoom}
                transitionDuration={300}
            >
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>
                        <EditIcon /> Editar Incidencia
                    </DialogTitle>
                    <DialogContent>
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatedFormControl 
                                    fullWidth 
                                    margin="normal" 
                                    required
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <InputLabel id="equipo-edit-label">Equipo</InputLabel>
                                    <Select
                                        labelId="equipo-edit-label"
                                        name="id_equipamiento"
                                        value={editForm?.id_equipamiento || ''}
                                        label="Equipo"
                                        onChange={handleEditChange}
                                    >
                                        <MenuItem value=""><em>Ninguno</em></MenuItem>
                                        {equipos.map((eq) => (
                                            <MenuItem key={eq.id_equipamiento || eq.id} value={eq.id_equipamiento || eq.id}>
                                                {eq.modelo} ({eq.numero_serie})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </AnimatedFormControl>

                                <AnimatedTextField
                                    fullWidth
                                    required
                                    label="Título"
                                    name="titulo"
                                    value={editForm?.titulo || ''}
                                    onChange={handleEditChange}
                                    margin="normal"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                />

                                <AnimatedTextField
                                    fullWidth
                                    required
                                    label="Descripción"
                                    name="descripcion"
                                    value={editForm?.descripcion || ''}
                                    onChange={handleEditChange}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                />

                                <AnimatedFormControl 
                                    fullWidth 
                                    margin="normal" 
                                    required
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
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
                                </AnimatedFormControl>

                                <AnimatedFormControl 
                                    fullWidth 
                                    margin="normal" 
                                    required
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <InputLabel id="prioridad-edit-label">Prioridad</InputLabel>
                                    <Select
                                        labelId="prioridad-edit-label"
                                        name="prioridad"
                                        value={editForm?.prioridad || ''}
                                        label="Prioridad"
                                        onChange={handleEditChange}
                                    >
                                        {prioridades.map((p) => (
                                            <MenuItem key={p} value={p}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </AnimatedFormControl>

                                <AnimatedTextField
                                    fullWidth
                                    required
                                    label="Fecha de inicio"
                                    name="fecha_inicio"
                                    type="datetime-local"
                                    value={editForm?.fecha_inicio || ''}
                                    onChange={handleEditChange}
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </DialogContent>
                    <DialogActions 
                        sx={{ 
                            p: 2, 
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}
                    >
                        <Button 
                            onClick={handleCloseEditModal} 
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                mr: 1
                            }}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                                }
                            }}
                            disabled={saving}
                        >
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogActions>
                </form>
            </StyledEditDialog>

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
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>¿Eliminar incidencia?</DialogTitle>
                <DialogContent sx={{ backgroundColor: 'white', fontSize: '1rem' }}>
                    <Typography>¿Estás seguro de que deseas eliminar esta incidencia? Esta acción no se puede deshacer.</Typography>
                    <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">{incidenciaToDelete?.titulo}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: 'white', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <Button onClick={handleCloseDeleteModal} variant="text" sx={{ color: '#1565C0' }} disabled={saving}>Cancelar</Button>
                    <Button onClick={handleDeleteIncidencia} variant="contained" color="error" disabled={saving}>{saving ? 'Eliminando...' : 'Eliminar'}</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StyledBox>
    );
};

export default IncidenciasTable;
