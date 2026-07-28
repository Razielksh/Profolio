import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './GestionUsuarios.css';

const initialUsers = [
  { id: 1, nombre: 'Ana García', email: 'ana.garcia@ejemplo.com', rol: 'Admin', activo: true, fecha: '12 Oct 2023', avatar: null, iniciales: 'AG' },
  { id: 2, nombre: 'Carlos Mendoza', email: 'carlos.m@ejemplo.com', rol: 'Usuario', activo: true, fecha: '15 Oct 2023', avatar: null, iniciales: 'CM' },
  { id: 3, nombre: 'Lucía Torres', email: 'ltorres@ejemplo.com', rol: 'Reclutador', activo: false, fecha: '20 Oct 2023', avatar: null, iniciales: 'LT' },
  { id: 4, nombre: 'Javier Ruíz', email: 'jruiz@ejemplo.com', rol: 'Usuario', activo: true, fecha: '22 Oct 2023', avatar: null, iniciales: 'JR' },
  { id: 5, nombre: 'Elena Gómez', email: 'elena.g@ejemplo.com', rol: 'Usuario', activo: true, fecha: '25 Oct 2023', avatar: null, iniciales: 'EG' },
  { id: 6, nombre: 'Miguel Quiroga', email: 'mquiroga@ejemplo.com', rol: 'Reclutador', activo: false, fecha: '28 Oct 2023', avatar: null, iniciales: 'MQ' },
  { id: 7, nombre: 'Sofía Blanco', email: 's.blanco@ejemplo.com', rol: 'Admin', activo: true, fecha: '01 Nov 2023', avatar: null, iniciales: 'SB' },
];

export default function GestionUsuarios() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para controlar los diferentes Modales
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalSuspend, setShowModalSuspend] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  // Estado del formulario de nuevo/editar usuario
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRol, setFormRol] = useState('Usuario');

  // Abrir modal de creación
  const handleOpenCreate = () => {
    setFormName('');
    setFormEmail('');
    setFormRol('Usuario');
    setShowModalCreate(true);
  };

  // Abrir modal de edición
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormName(user.nombre);
    setFormEmail(user.email);
    setFormRol(user.rol);
    setShowModalEdit(true);
  };

  // Abrir modal de suspensión al dar clic en el toggle de estado
  const handleToggleState = (user) => {
    setSelectedUser(user);
    setShowModalSuspend(true);
  };

  // Abrir modal de eliminación
  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowModalDelete(true);
  };

  return (
    <div className="admin-page">
      {/* Header Admin */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <div className="brand-logo">
            <img src={profolioIcon} alt="Logo Profolio" className="brand-icon" />
            <span className="brand-name">Profolio</span>
          </div>

          <nav className="admin-nav-links">
            <NavLink to="/admin/usuarios" className="admin-nav-badge">
              Usuarios
            </NavLink>
            <NavLink to="/admin/plantillas" className="admin-nav-link">
              Plantillas
            </NavLink>
          </nav>
        </div>

        <div className="admin-nav-right">
          <Link to="/perfil" className="admin-profile-btn" title="Perfil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="admin-main">
        <div className="admin-header-row">
          <h1 className="admin-title">Gestión de Usuarios</h1>
          <button className="btn-nuevo-usuario" onClick={handleOpenCreate}>
            + Nuevo usuario
          </button>
        </div>

        {/* Barra de búsqueda y filtro de tabla */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Buscar usuarios..." className="admin-search-input" />
          </div>

          <div className="admin-filter-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <select className="admin-select">
              <option>Todos</option>
              <option>Admin</option>
              <option>Usuario</option>
              <option>Reclutador</option>
            </select>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="admin-table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha registro</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  {/* Usuario / Avatar */}
                  <td>
                    <div className="user-info-cell">
                      <div className={`user-avatar-circle ${user.rol.toLowerCase()}`}>
                        {user.iniciales}
                      </div>
                      <span className="user-name-text">{user.nombre}</span>
                    </div>
                  </td>

                  {/* Correo */}
                  <td className="email-cell">{user.email}</td>

                  {/* Rol */}
                  <td>
                    <span className={`rol-badge rol-${user.rol.toLowerCase()}`}>
                      {user.rol}
                    </span>
                  </td>

                  {/* Estado / Switch Toggle */}
                  <td>
                    <button
                      type="button"
                      className={`toggle-switch ${user.activo ? 'active' : ''}`}
                      onClick={() => handleToggleState(user)}
                    >
                      <span className="switch-thumb"></span>
                    </button>
                  </td>

                  {/* Fecha registro */}
                  <td className="date-cell">{user.fecha}</td>

                  {/* Acciones */}
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => handleOpenEdit(user)} title="Editar usuario">
                        ✏️
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleOpenDelete(user)} title="Eliminar usuario">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer de Paginación */}
          <div className="admin-table-footer">
            <span className="results-count">Mostrando 1 a 7 de 45 resultados</span>
            <div className="pagination">
              <button className="page-btn">&lt;</button>
              <button className="page-btn page-active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">&gt;</button>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL 1: NUEVO USUARIO --- */}
      {showModalCreate && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h2 className="admin-modal-title">Crear nuevo usuario</h2>
            <form className="admin-modal-form" onSubmit={(e) => { e.preventDefault(); setShowModalCreate(false); }}>
              <div className="admin-form-group">
                <label className="admin-label">Nombre completo</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Ej. Ana García"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Correo electrónico</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="nombre@ejemplo.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Rol</label>
                <select
                  className="admin-input"
                  value={formRol}
                  onChange={(e) => setFormRol(e.target.value)}
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Admin">Admin</option>
                  <option value="Reclutador">Reclutador</option>
                </select>
              </div>

              <div className="admin-modal-buttons">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModalCreate(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDITAR USUARIO --- */}
      {showModalEdit && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h2 className="admin-modal-title">Editar usuario</h2>
            <form className="admin-modal-form" onSubmit={(e) => { e.preventDefault(); setShowModalEdit(false); }}>
              <div className="admin-form-group">
                <label className="admin-label">Nombre completo</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Correo electrónico</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Rol</label>
                <select
                  className="admin-input"
                  value={formRol}
                  onChange={(e) => setFormRol(e.target.value)}
                >
                  <option value="Usuario">Usuario</option>
                  <option value="Admin">Admin</option>
                  <option value="Reclutador">Reclutador</option>
                </select>
              </div>

              <div className="admin-modal-buttons">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModalEdit(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-save">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: SUSPENDER USUARIO (suspender_user_admin.png) --- */}
      {showModalSuspend && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-alert-card">
            <div className="modal-icon-wrapper orange-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h2 className="admin-modal-title">¿Suspender a {selectedUser?.nombre}?</h2>
            <p className="admin-modal-body">
              Esta acción suspenderá el acceso del usuario temporalmente.
            </p>

            <div className="admin-modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowModalSuspend(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-suspend"
                onClick={() => {
                  setUsers(users.map(u => u.id === selectedUser.id ? { ...u, activo: !u.activo } : u));
                  setShowModalSuspend(false);
                }}
              >
                Suspender usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ELIMINAR USUARIO (eliminar_user_admin.png) --- */}
      {showModalDelete && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-alert-card">
            <div className="modal-icon-wrapper red-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h2 className="admin-modal-title">¿Eliminar a {selectedUser?.nombre}?</h2>
            <p className="admin-modal-body">
              Esta acción eliminará permanentemente la cuenta y todos sus datos.
            </p>

            <div className="admin-modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowModalDelete(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={() => {
                  setUsers(users.filter(u => u.id !== selectedUser.id));
                  setShowModalDelete(false);
                }}
              >
                Eliminar usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
