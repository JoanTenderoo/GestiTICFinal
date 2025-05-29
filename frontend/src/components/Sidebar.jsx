import React from 'react';
import { 
  Box, List, ListItem, ListItemIcon, ListItemText, Divider, 
  Typography, Avatar, useTheme, alpha, Tooltip, IconButton 
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportIcon from '@mui/icons-material/Report';
import LogoutIcon from '@mui/icons-material/Logout';
import ComputerIcon from '@mui/icons-material/Computer';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const MotionListItem = motion(ListItem);

const Sidebar = ({ user, onSelectView, selectedView }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const userName = user?.usuario?.nombre || 'Usuario';
    const userEmail = user?.usuario?.email || 'usuario@email.com';
    const userAvatar = user?.usuario?.avatarUrl || null;
    const userRol = user?.usuario?.rol || 'Sin rol';

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'incidencias', label: 'Incidencias', icon: <ReportIcon /> },
        { id: 'ubicaciones', label: 'Ubicaciones', icon: <LocationOnIcon /> },
        { id: 'equipamiento', label: 'Equipamiento', icon: <ComputerIcon /> }
    ];

    return (
        <Box 
            component={motion.div}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ 
                width: 280,
                background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: '#fff',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                height: '100vh',
                position: 'sticky',
                top: 0
            }}
        >
            <Box>
                <Box 
                    sx={{ 
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                        borderBottom: `1px solid ${alpha('#fff', 0.1)}`
                    }}
                >
                    <Avatar 
                        sx={{ 
                            width: 80,
                            height: 80,
                            mb: 2,
                            border: `2px solid ${alpha('#fff', 0.2)}`,
                            boxShadow: `0 0 20px ${alpha(theme.palette.primary.light, 0.3)}`,
                            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                        }}
                        src={userAvatar}
                    >
                        {!userAvatar && userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography 
                        variant="h6" 
                        fontWeight={700}
                        sx={{
                            background: 'linear-gradient(90deg, #fff 0%, #e3f2fd 100%)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {userName}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            opacity: 0.8,
                            mt: 0.5,
                            color: alpha('#fff', 0.9)
                        }}
                    >
                        {userEmail}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            mt: 1,
                            color: alpha('#fff', 0.7),
                            fontWeight: 500,
                            letterSpacing: 1,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: alpha('#fff', 0.1),
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {userRol.toUpperCase()}
                    </Typography>
                </Box>

                <List sx={{ mt: 2 }}>
                    {menuItems.map((item, index) => (
                        <MotionListItem
                            key={item.id}
                            button
                            selected={selectedView === item.id}
                            onClick={() => onSelectView(item.id)}
                            sx={{
                                mx: 2,
                                my: 0.5,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&.Mui-selected': {
                                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                                    '&:hover': {
                                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                                    }
                                },
                                '&:hover': {
                                    background: alpha('#fff', 0.1),
                                    transform: 'translateX(5px)'
                                }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ListItemIcon sx={{ 
                                color: selectedView === item.id ? '#fff' : alpha('#fff', 0.7),
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: selectedView === item.id ? 600 : 400,
                                        color: selectedView === item.id ? '#fff' : alpha('#fff', 0.7)
                                    }
                                }}
                            />
                        </MotionListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ p: 2 }}>
                <Divider sx={{ bgcolor: alpha('#fff', 0.1), mb: 2 }} />
                <MotionListItem 
                    button 
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: alpha('#fff', 0.1),
                            transform: 'translateX(5px)'
                        }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ListItemIcon sx={{ color: alpha('#fff', 0.7), minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Cerrar sesión"
                        sx={{
                            '& .MuiTypography-root': {
                                color: alpha('#fff', 0.7)
                            }
                        }}
                    />
                </MotionListItem>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: alpha('#fff', 0.5),
                        mt: 2,
                        display: 'block',
                        textAlign: 'center',
                        fontSize: '0.75rem'
                    }}
                >
                    © 2025 GestiTIC - Joan Tendero
                </Typography>
            </Box>
        </Box>
    );
};

export default Sidebar; 