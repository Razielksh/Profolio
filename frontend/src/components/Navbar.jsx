import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../assets/profolio_icon.svg';
import './Navbar.css';
import { authService } from '../services/api';

export default function Navbar({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Obtener datos del usuario activo desde props o localStorage
    const savedUser = JSON.parse(localStorage.getItem('usuario_activo') || '{}');
    const user = currentUser || savedUser;

    const nombreMostrar = user?.nombre || user?.name || 'Usuario';
    const emailMostrar = user?.email || 'usuario@profolio.com';

    const getIniciales = (nombre) => {
        if (!nombre) return 'US';
        return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        authService.logout();
        if (onLogout) onLogout();
        navigate('/');
    };

    return (
        <header className="navbar">
            {/* Izquierda: Logo + links */}
            <div className="navbar-left">
                <div className="navbar-brand">
                    <img src={profolioIcon} alt="Profolio" className="navbar-logo-icon" />
                    <span className="navbar-brand-name">Profolio</span>
                </div>

                <nav className="navbar-links">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
                    >
                        Mis CVs
                    </NavLink>
                    <NavLink
                        to="/plantillas"
                        className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
                    >
                        Plantillas
                    </NavLink>
                </nav>
            </div>

            {/* Derecha: Perfil del usuario activo */}
            <div className="navbar-right">
                <div className="user-profile-wrapper">
                    <div className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <div className="user-avatar-badge">
                            {getIniciales(nombreMostrar)}
                        </div>
                        <span className="user-name">{nombreMostrar}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-user-header" style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', marginBottom: '6px' }}>
                                <p style={{ fontWeight: '600', color: '#1F2937', margin: 0, fontSize: '0.9rem' }}>{nombreMostrar}</p>
                                <p style={{ color: '#6B7280', margin: 0, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emailMostrar}</p>
                            </div>

                            <Link to="/perfil" className="dropdown-item profile-btn" onClick={() => setDropdownOpen(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Ver perfil
                            </Link>

                            <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}