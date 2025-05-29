import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import authService from '../services/authService';

const Header = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const userName = user?.nombre || 'Usuario';

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <h1>GESTITIC</h1>
                <div className="header-right">
                    <button className="logout-button" onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header; 