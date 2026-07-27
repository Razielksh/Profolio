import React from 'react';
import { Link } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

export default function Create_account() {
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
                            Crea un currículum profesional que te consiga empleo.
                        </h1>
                        <p className="hero-subtitle">
                            Herramientas intuitivas, plantillas de vanguardia y orientación en cada paso.
                        </p>
                    </div>
                </div>
            </div>

            <div className="login-form-wrapper">
                <div className="login-card">
                    <div className="login-card-header">
                        <h2 className="login-card-title">Crea tu cuenta</h2>
                        <p className="login-card-subtitle">
                            únete a miles de profesionales construyendo su futuro hoy
                        </p>
                    </div>

                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label htmlFor="email" className="form-label">
                                    Correo electrónico
                                </label>
                            </div>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="nombre@ejemplo.com"
                            />
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label htmlFor="password" className="form-label">
                                    Contraseña
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Mínimo 8 carácteres"
                            />
                        </div>

                        <button type="submit" className="login-submit-btn">
                            Crear cuenta
                        </button>
                    </form>
                </div>

                <div className="login-register-footer">
                    <span>¿Ya tienes cuenta? </span>
                    <Link to="/" className="register-link">
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}