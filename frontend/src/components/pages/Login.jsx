import React from 'react';
import { Link } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

export default function Login() {
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

      {/* Columna Derecha - Formulario */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">Bienvenido de nuevo</h2>
            <p className="login-card-subtitle">
              Introduce tus datos para acceder a tus CVs.
            </p>
          </div>

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
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
                <a href="#forgot" className="forgot-password-link">
                  ¿Has olvidado tu contraseña?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="login-register-footer">
          <span>¿No tienes cuenta? </span>
          <Link to="/crear-cuenta" className="register-link">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}