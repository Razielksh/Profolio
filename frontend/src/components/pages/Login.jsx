import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import { authService } from '../../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!email.trim()) nuevosErrores.email = 'El correo es obligatorio.';
    if (!password.trim()) nuevosErrores.password = 'La contraseña es obligatoria.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setLoading(true);

    try {
      const usuarioActivo = await authService.login(email.trim(), password.trim());

      if (onLogin) onLogin(usuarioActivo);

      // Redirigir según el rol del usuario
      if (usuarioActivo.rol === 'Admin') {
        navigate('/admin/usuarios');
      } else if (usuarioActivo.rol === 'Reclutador') {
        navigate('/reclutador/directorio');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.fieldErrors) {
        setErrores(err.fieldErrors);
      } else {
        setErrores({ general: err.message || 'Error al iniciar sesión. Inténtalo de nuevo.' });
      }
    } finally {
      setLoading(false);
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

          <form className="login-form" onSubmit={handleSubmit}>
            {errores.general && (
              <div className="form-error" style={{ marginBottom: '16px', fontSize: '0.9rem', fontWeight: '600' }}>
                ⚠️ {errores.general}
              </div>
            )}

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
                disabled={loading}
              />
              {errores.email && <p className="form-error">{errores.email}</p>}
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <Link to="/forgot" className="forgot-password-link">
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {errores.password && <p className="form-error">{errores.password}</p>}
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar sesión'}
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