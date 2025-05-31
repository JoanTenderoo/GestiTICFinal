import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, alpha, Container } from '@mui/material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Sidebar from './Sidebar';
import IncidenciasTable from './IncidenciasTable';
import AddLocation from './AddLocation';
import AddEquipment from './AddEquipment';
import AddIncidence from './AddIncidence';
import EditUsuarios from './EditUsuarios';
import UbicacionesTable from './UbicacionesTable';
import EquipamientoTable from './EquipamientoTable';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';
import { locationService } from '../services/locationService';
import {
    Warning as WarningIcon,
    LocationOn as LocationIcon,
    Computer as ComputerIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';

// Crear eventos personalizados para cada tipo de actualización
const updateEvents = {
    incidencias: new Event('updateIncidencias'),
    ubicaciones: new Event('updateUbicaciones'),
    equipamiento: new Event('updateEquipamiento')
};

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const StatsCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    
    return (
        <MotionPaper
        elevation={0}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        sx={{
                p: 2,
                height: 140,
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                borderRadius: '16px',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(color, 0.3)}`,
            },
        }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
    >
            <Box sx={{ 
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    mb: 1
                }}>
            <Box
                sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                }}
            >
                        {React.cloneElement(icon, { sx: { color: 'white', fontSize: 24 } })}
            </Box>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: 'white',
                            fontWeight: 500,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '1rem'
                        }}
                    >
                {title}
            </Typography>
        </Box>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700, 
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'right'
                    }}
                >
                    <CountUp end={value} duration={2.5} />
        </Typography>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                    backdropFilter: 'blur(10px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    transform: 'translate(-30%, 30%)',
                    backdropFilter: 'blur(10px)',
                }}
            />
        </MotionPaper>
);
};

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const user = authService.getCurrentUser();
    const [selectedView, setSelectedView] = React.useState('incidencias');
    const [stats, setStats] = React.useState({
        incidencias: 0,
        ubicaciones: 0,
        equipamiento: 0
    });
    const [refreshKey, setRefreshKey] = React.useState({
        incidencias: 0,
        ubicaciones: 0,
        equipamiento: 0
    });
    const isAdmin = [user?.rol, user?.usuario?.rol].some(r => r === 'administrador' || r === 'admin');

    const fetchStats = async () => {
        try {
            const [incidencias, ubicaciones, equipamiento] = await Promise.all([
                equipmentService.getIncidences(),
                locationService.getLocations(),
                equipmentService.getEquipment()
            ]);
            setStats({
                incidencias: incidencias.length,
                ubicaciones: ubicaciones.length,
                equipamiento: equipamiento.length
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    React.useEffect(() => {
        fetchStats();

        // Añadir listeners para cada tipo de actualización
        const handleIncidenciasUpdate = () => {
            setRefreshKey(prev => ({ ...prev, incidencias: prev.incidencias + 1 }));
            fetchStats();
        };

        const handleUbicacionesUpdate = () => {
            setRefreshKey(prev => ({ ...prev, ubicaciones: prev.ubicaciones + 1 }));
            fetchStats();
        };

        const handleEquipamientoUpdate = () => {
            setRefreshKey(prev => ({ ...prev, equipamiento: prev.equipamiento + 1 }));
            fetchStats();
        };

        window.addEventListener('updateIncidencias', handleIncidenciasUpdate);
        window.addEventListener('updateUbicaciones', handleUbicacionesUpdate);
        window.addEventListener('updateEquipamiento', handleEquipamientoUpdate);

        // Limpiar los listeners cuando el componente se desmonte
        return () => {
            window.removeEventListener('updateIncidencias', handleIncidenciasUpdate);
            window.removeEventListener('updateUbicaciones', handleUbicacionesUpdate);
            window.removeEventListener('updateEquipamiento', handleEquipamientoUpdate);
        };
    }, []);

    const userName = user?.usuario?.nombre || 'Usuario';
    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            maxHeight: '100vh', // Altura máxima del viewport
            background: '#f7f8fa',
            overflow: 'hidden' // Prevenir overflow
        }}>
            <Sidebar user={user} onSelectView={setSelectedView} selectedView={selectedView} />
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    pt: { xs: 10, lg: 4 }, // Extra top padding en móviles para el AppBar
                    height: '100vh', // Altura fija del viewport
                    overflow: 'auto', // Scroll solo cuando sea necesario
                    background: 'linear-gradient(135deg, #f7f8fa 0%, #ffffff 100%)',
                    width: { xs: '100%', lg: 'calc(100% - 280px)' },
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Container maxWidth="xl" sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    pb: 2 // Padding bottom para separar del final
                }}>
                    <MotionBox
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{ mb: { xs: 1, sm: 2 } }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: { xs: 1, sm: 2 },
                            mb: { xs: 1, sm: 2 },
                            p: { xs: 1, sm: 1.5 },
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <DashboardIcon sx={{ 
                                fontSize: { xs: 24, sm: 28 },
                                color: theme.palette.primary.main
                            }} />
                            <Typography 
                                variant="h4" 
                                fontWeight={700}
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                }}
                            >
                                Dashboard
                </Typography>
                        </Box>
                    </MotionBox>
                
                    <Grid container spacing={{ xs: 1, sm: 2 }} mb={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatsCard
                            title="Incidencias"
                            value={stats.incidencias}
                                icon={<WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />}
                                color={theme.palette.warning.main}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <StatsCard
                            title="Ubicaciones"
                            value={stats.ubicaciones}
                                icon={<LocationIcon sx={{ color: theme.palette.info.main, fontSize: 24 }} />}
                                color={theme.palette.info.main}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <StatsCard
                            title="Equipamiento"
                            value={stats.equipamiento}
                                icon={<ComputerIcon sx={{ color: theme.palette.success.main, fontSize: 24 }} />}
                                color={theme.palette.success.main}
                        />
                    </Grid>
                </Grid>

                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Grid container spacing={{ xs: 1, sm: 2 }} mb={{ xs: 1, sm: 2 }}>
                    {isAdmin && (
                        <>
                            <Grid item xs={12} sm={6} lg={3}>
                                <AddLocation />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <AddEquipment />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <AddIncidence />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <EditUsuarios />
                            </Grid>
                        </>
                    )}
                    {!isAdmin && (
                        <Grid item xs={12}>
                            <AddIncidence />
                        </Grid>
                    )}
                </Grid>
                    </MotionBox>
                    
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                    >
                        <Paper 
                            elevation={0}
                            sx={{ 
                                p: { xs: 2, sm: 3 },
                                borderRadius: '16px',
                                background: 'white',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0 // Importante para el flex
                            }}
                        >
                    {selectedView === 'incidencias' && <IncidenciasTable key={refreshKey.incidencias} />}
                    {selectedView === 'ubicaciones' && <UbicacionesTable key={refreshKey.ubicaciones} />}
                    {selectedView === 'equipamiento' && <EquipamientoTable key={refreshKey.equipamiento} />}
                </Paper>
                    </MotionBox>
                    
                    {/* Footer */}
                    <Box sx={{ 
                        mt: 2,
                        py: 1,
                        textAlign: 'center',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        opacity: 0.7
                    }}>
                        © 2024 GestiTIC v1.0 - Sistema de Gestión de Equipamiento IT
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
