import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemIcon, ListItemText, Divider, 
  Typography, Avatar, useTheme, alpha, Tooltip, IconButton,
  Drawer, useMediaQuery, AppBar, Toolbar
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportIcon from '@mui/icons-material/Report';
import LogoutIcon from '@mui/icons-material/Logout';
import ComputerIcon from '@mui/icons-material/Computer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const MotionListItem = motion(ListItem);

const Sidebar = ({ user, onSelectView, selectedView }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const [mobileOpen, setMobileOpen] = useState(false);
    
    const userName = user?.usuario?.nombre || 'Usuario';
    const userEmail = user?.usuario?.email || 'usuario@email.com';
    const userAvatar = user?.usuario?.avatarUrl || null;
    const userRol = user?.usuario?.rol || 'Sin rol';

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuItemClick = (viewId) => {
        onSelectView(viewId);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const menuItems = [
        { id: 'incidencias', label: 'Incidencias', icon: <ReportIcon /> },
        { id: 'ubicaciones', label: 'Ubicaciones', icon: <LocationOnIcon /> },
        { id: 'equipamiento', label: 'Equipamiento', icon: <ComputerIcon /> }
    ];

    const sidebarContent = (
        <Box 
            sx={{ 
                width: { xs: 280, lg: 280 },
                background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: '#fff',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Close button para móvil */}
            {isMobile && (
                <IconButton
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: '#fff',
                        zIndex: 1
                    }}
                >
                    <CloseIcon />
                </IconButton>
            )}

            <Box>
                <Box 
                    sx={{ 
                        p: { xs: 2, lg: 3 },
                        pt: { xs: 4, lg: 3 },
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                        borderBottom: `1px solid ${alpha('#fff', 0.1)}`
                    }}
                >
                    <Avatar 
                        sx={{ 
                            width: { xs: 60, lg: 80 },
                            height: { xs: 60, lg: 80 },
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
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '1rem', lg: '1.25rem' },
                            textAlign: 'center'
                        }}
                    >
                        {userName}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            opacity: 0.8,
                            mt: 0.5,
                            color: alpha('#fff', 0.9),
                            fontSize: { xs: '0.75rem', lg: '0.875rem' },
                            textAlign: 'center',
                            wordBreak: 'break-word'
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
                            backdropFilter: 'blur(10px)',
                            fontSize: { xs: '0.6rem', lg: '0.75rem' }
                        }}
                    >
                        {userRol.toUpperCase()}
                    </Typography>
                </Box>

                <List sx={{ mt: 2, px: { xs: 1, lg: 2 } }}>
                    {menuItems.map((item, index) => (
                        <MotionListItem
                            key={item.id}
                            button
                            selected={selectedView === item.id}
                            onClick={() => handleMenuItemClick(item.id)}
                            sx={{
                                mx: 1,
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
                                minWidth: { xs: 35, lg: 40 }
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: selectedView === item.id ? 600 : 400,
                                        color: selectedView === item.id ? '#fff' : alpha('#fff', 0.7),
                                        fontSize: { xs: '0.875rem', lg: '1rem' }
                                    }
                                }}
                            />
                        </MotionListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ p: { xs: 1, lg: 2 } }}>
                <Divider sx={{ bgcolor: alpha('#fff', 0.1), mb: 2 }} />
                <MotionListItem 
                    button 
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        mx: 1,
                        '&:hover': {
                            background: alpha('#fff', 0.1),
                            transform: 'translateX(5px)'
                        }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ListItemIcon sx={{ 
                        color: alpha('#fff', 0.7), 
                        minWidth: { xs: 35, lg: 40 }
                    }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Cerrar sesión"
                        sx={{
                            '& .MuiTypography-root': {
                                color: alpha('#fff', 0.7),
                                fontSize: { xs: '0.875rem', lg: '1rem' }
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
                        fontSize: { xs: '0.6rem', lg: '0.75rem' }
                    }}
                >
                    © 2024 GestiTIC v1.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <AppBar 
                    position="fixed" 
                    sx={{ 
                        zIndex: theme.zIndex.drawer + 1,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            GestiTIC
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Desktop Sidebar */}
            {!isMobile ? (
                <Box 
                    component={motion.div}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    sx={{ position: 'sticky', top: 0 }}
                >
                    {sidebarContent}
                </Box>
            ) : (
                /* Mobile Drawer */
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile
                    }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 280,
                            border: 'none'
                        },
                    }}
                >
                    {sidebarContent}
                </Drawer>
            )}
        </>
    );
};

export default Sidebar; 