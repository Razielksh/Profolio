import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

export default function New_password() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        if (!password.trim()) {
            nuevosErrores.password = 'La contraseña es obligatoria.';
        } else if (password.length < 8) {
            nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
        }

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
                            Asegura tu futuro profesional
                        </h1>
                        <p className="hero-subtitle">
                            Recupera el acceso a tu cuenta y continua creando que destacan en el mercado laboral. Tu progreso siempre está a salvo.
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
                            <label htmlFor="password" className="form-label">
                                Nueva contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errores.password && <p className="form-error">{errores.password}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Confirmar contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Mínimo 8 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errores.password && <p className="form-error">{errores.password}</p>}
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Reestablecer contraseña
                        </button>
                    </form>
                </div>

                <div className="login-register-footer">
                    <Link to="/" className="register-link">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}