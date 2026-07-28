import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../assets/profolio_icon.svg';
import './Navbar.css';

export default function Navbar({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        setDropdownOpen(false);
        localStorage.removeItem('usuario_activo');
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

            {/* Derecha: Perfil */}
            <div className="navbar-right">
                <div className="user-profile-wrapper">
                    <div className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        <span className="user-name">Perfil</span>
                    </div>

                    {dropdownOpen && (
                        <div className="dropdown-menu">
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