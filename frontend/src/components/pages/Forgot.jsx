import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

export default function Forgot() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        if (!email.trim()) nuevosErrores.email = 'El correo es obligatorio.';
        setErrores(nuevosErrores);

    };

    return (
        <div className="login-container">
            {/* Columna Izquierda - Hero / Branding */}
            <div className="login-hero">
                <div className="login-hero-overlay"></div>
                <div className="login-hero-content">
                    <div className="brand-logo">
                        <img src={profolioIcon} alt="Logo Profolio" className="brand-icon" />
                        <span className="brand-name">Profolio</span>
                    </div>

                    <div className="hero-text-block">
                        <h1 className="hero-title">
                            Recupera tu acceso
                        </h1>
                        <p className="hero-subtitle">
                            Retoma la creación de tu curriculum profesional de manera rápida y segura.
                        </p>
                    </div>
                </div>
            </div>

            {/* Columna Derecha - Formulario */}
            <div className="login-form-wrapper">
                <div className="login-card">
                    <div className="login-card-header">
                        <h2 className="login-card-title">¿Olvidaste tu contraseña?</h2>
                        <p className="login-card-subtitle">
                            Introduce tu correo y te enviaremos un enlace para restablecerla.
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="nombre@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errores.email && <p className="form-error">{errores.email}</p>}
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Enviar enlace
                        </button>
                    </form>
                </div>

                <div className="login-register-footer">
                    <span>¿Ya recordaste tu contraseña?</span>
                    <Link to="/" className="forgot-password-link">
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}