import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Login.css';

const usuariosDefecto = [
    { nombre: 'Usuario Demo', email: 'user@ejemplo.com', password: 'Password123!', rol: 'Usuario' },
    { nombre: 'Admin Demo', email: 'admin@ejemplo.com', password: 'Password123!', rol: 'Admin' },
    { nombre: 'Reclutador Demo', email: 'reclutador@ejemplo.com', password: 'Password123!', rol: 'Reclutador' }
];

export default function Create_account() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevosErrores = {};

        // Expresiones regulares para validar correo y contraseña
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const tieneMayuscula = /[A-Z]/;
        const tieneNumero = /[0-9]/;
        const tieneEspecial = /[^A-Za-z0-9]/;

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
        } else if (
            password.length < 8 ||
            !tieneMayuscula.test(password) ||
            !tieneNumero.test(password) ||
            !tieneEspecial.test(password)
        ) {
            nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
        }

        // Obtener usuarios guardados
        const guardados = localStorage.getItem('usuarios_profolio');
        let listaUsuarios = guardados ? JSON.parse(guardados) : [...usuariosDefecto];

        // Verificar si el correo ya existe
        if (email.trim() && listaUsuarios.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
            nuevosErrores.email = 'Este correo ya está registrado.';
        }

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
            const nuevoUsuario = {
                nombre: nombre.trim(),
                email: email.trim(),
                password: password.trim(),
                rol: 'Usuario'
            };

            listaUsuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios_profolio', JSON.stringify(listaUsuarios));

            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            navigate('/');
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
                                onChange={(e) => setNombre(e.target.value)}
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
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Mínimo 8 caracteres, mayúscula, número y especial"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errores.password && <p className="form-error">{errores.password}</p>}
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