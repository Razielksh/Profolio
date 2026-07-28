import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

const usuariosDefecto = [
  { nombre: 'Usuario Demo', email: 'user@ejemplo.com', password: 'password123', rol: 'Usuario' },
  { nombre: 'Admin Demo', email: 'admin@ejemplo.com', password: 'password123', rol: 'Admin' },
  { nombre: 'Reclutador Demo', email: 'reclutador@ejemplo.com', password: 'password123', rol: 'Reclutador' }
];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!email.trim()) nuevosErrores.email = 'El correo es obligatorio.';
    if (!password.trim()) nuevosErrores.password = 'La contraseña es obligatoria.';

    // Obtener lista de usuarios almacenada o inicializar con los por defecto
    const guardados = localStorage.getItem('usuarios_profolio');
    let listaUsuarios = [];

    if (guardados) {
      listaUsuarios = JSON.parse(guardados);
    } else {
      listaUsuarios = usuariosDefecto;
      localStorage.setItem('usuarios_profolio', JSON.stringify(usuariosDefecto));
    }

    // Buscar si el correo y la contraseña coinciden
    const usuarioEncontrado = listaUsuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password.trim()
    );

    if (email.trim() && password.trim() && !usuarioEncontrado) {
      nuevosErrores.general = 'Correo o contraseña incorrectos.';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0 && usuarioEncontrado) {
      // Guardar el usuario activo en localStorage
      localStorage.setItem('usuario_activo', JSON.stringify(usuarioEncontrado));

      if (onLogin) onLogin(usuarioEncontrado);

      // Redirigir según el rol del usuario
      if (usuarioEncontrado.rol === 'Admin') {
        navigate('/admin/usuarios');
      } else if (usuarioEncontrado.rol === 'Reclutador') {
        navigate('/reclutador/directorio');
      } else {
        navigate('/dashboard');
      }
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
              />
              {errores.password && <p className="form-error">{errores.password}</p>}
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