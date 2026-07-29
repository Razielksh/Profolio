import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import { authService } from '../../services/api';
import './Login.css';

export default function Create_account() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});
    const [loading, setLoading] = useState(false);

    const validarCampos = (field, value, currentPassword = password, currentEmail = email, currentNombre = nombre) => {
        const nuevosErrores = { ...errores };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_]/;

        if (field === 'nombre') {
            if (!value.trim()) {
                nuevosErrores.nombre = 'El nombre es obligatorio.';
            } else {
                delete nuevosErrores.nombre;
            }
        }

        if (field === 'email') {
            if (!value.trim()) {
                nuevosErrores.email = 'El correo es obligatorio.';
            } else if (!emailRegex.test(value.trim())) {
                nuevosErrores.email = 'Ingresa un correo electrónico válido.';
            } else {
                delete nuevosErrores.email;
            }
        }

        if (field === 'password') {
            if (!value.trim()) {
                nuevosErrores.password = 'La contraseña es obligatoria.';
            } else if (value.length < 8) {
                nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
            } else if (!hasUppercase.test(value)) {
                nuevosErrores.password = 'La contraseña debe contener al menos una letra mayúscula.';
            } else if (!hasNumber.test(value)) {
                nuevosErrores.password = 'La contraseña debe contener al menos un número.';
            } else if (!hasSpecialChar.test(value)) {
                nuevosErrores.password = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...).';
            } else {
                delete nuevosErrores.password;
            }
        }

        setErrores(nuevosErrores);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevosErrores = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_]/;

        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio.';
        }

        if (!email.trim()) {
            nuevosErrores.email = 'El correo es obligatorio.';
        } else if (!emailRegex.test(email.trim())) {
            nuevosErrores.email = 'Ingresa un correo electrónico válido.';
        }

        if (!password.trim()) {
            nuevosErrores.password = 'La contraseña es obligatoria.';
        } else if (password.length < 6) {
            nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (!hasUppercase.test(password)) {
            nuevosErrores.password = 'La contraseña debe contener al menos una letra mayúscula.';
        } else if (!hasNumber.test(password)) {
            nuevosErrores.password = 'La contraseña debe contener al menos un número.';
        } else if (!hasSpecialChar.test(password)) {
            nuevosErrores.password = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...).';
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});
        setLoading(true);

        try {
            const usuarioActivo = await authService.register(nombre.trim(), email.trim(), password.trim());

            if (usuarioActivo.rol === 'Admin') {
                navigate('/admin/usuarios');
            } else if (usuarioActivo.rol === 'Reclutador') {
                navigate('/reclutador/directorio');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.fieldErrors) {
                const mappedErrors = {};
                if (err.fieldErrors.name) mappedErrors.nombre = err.fieldErrors.name;
                if (err.fieldErrors.email) mappedErrors.email = err.fieldErrors.email;
                if (err.fieldErrors.password) mappedErrors.password = err.fieldErrors.password;
                setErrores(mappedErrors);
            } else {
                setErrores({ general: err.message || 'Error al registrar la cuenta. Inténtalo de nuevo.' });
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

            <div className="login-form-wrapper">
                <div className="login-card">
                    <div className="login-card-header">
                        <h2 className="login-card-title">Crea tu cuenta</h2>
                        <p className="login-card-subtitle">
                            Únete a miles de profesionales construyendo su futuro hoy
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {errores.general && (
                            <div className="form-error" style={{ marginBottom: '16px', fontSize: '0.9rem', fontWeight: '600' }}>
                                ⚠️ {errores.general}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Nombre completo
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                placeholder="Ej. Juan Pérez"
                                value={nombre}
                                onChange={(e) => {
                                    setNombre(e.target.value);
                                    validarCampos('nombre', e.target.value);
                                }}
                                disabled={loading}
                            />
                            {errores.nombre && <p className="form-error">{errores.nombre}</p>}
                        </div>

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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    validarCampos('email', e.target.value);
                                }}
                                disabled={loading}
                            />
                            {errores.email && <p className="form-error">{errores.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Mínimo 6 caracteres (Mayúscula, número, especial)"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validarCampos('password', e.target.value);
                                }}
                                disabled={loading}
                            />
                            {errores.password && <p className="form-error">{errores.password}</p>}
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'Registrando...' : 'Crear cuenta'}
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