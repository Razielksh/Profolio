import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import { userService, authService } from '../../services/api';
import './GestionUsuarios.css';

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const [selectedUser, setSelectedUser] = useState(null);

  // Modales
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalSuspend, setShowModalSuspend] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  // Formulario campos
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRol, setFormRol] = useState('Usuario');
  const [formError, setFormError] = useState('');

  // Cargar usuarios desde el Backend
  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const data = await userService.getUsers(
        currentPage - 1,
        itemsPerPage,
        searchTerm,
        roleFilter
      );
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setApiError(err.message || 'Error al conectar con la base de datos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, roleFilter]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Manejar cambio de filtros (reiniciar a página 1)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  // Helper para extraer rol legible
  const getRolLegible = (user) => {
    if (user.rol) return user.rol;
    const roles = user.roles || [];
    if (Array.isArray(roles)) {
      if (roles.includes('ROLE_ADMIN')) return 'Admin';
      if (roles.includes('ROLE_RECLUTADOR')) return 'Reclutador';
    }
    return 'Usuario';
  };

  // Crear usuario en DB
  const handleSaveCreate = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    setFormError('');
    try {
      await userService.createUser({
        nombre: formName.trim(),
        email: formEmail.trim(),
        password: formPassword.trim(),
        rol: formRol,
      });
      setShowModalCreate(false);
      cargarUsuarios();
    } catch (err) {
      setFormError(err.message || 'Error al guardar el usuario en la base de datos.');
    }
  };

  // Editar usuario en DB
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setFormError('Nombre y correo son obligatorios.');
      return;
    }

    setFormError('');
    try {
      await userService.updateUser(selectedUser.id, {
        nombre: formName.trim(),
        email: formEmail.trim(),
        rol: formRol,
      });
      setShowModalEdit(false);
      cargarUsuarios();
    } catch (err) {
      setFormError(err.message || 'Error al actualizar el usuario.');
    }
  };

  // Suspender/Activar usuario en DB
  const handleConfirmSuspend = async () => {
    if (!selectedUser) return;
    try {
      await userService.toggleUserStatus(selectedUser.id);
      setShowModalSuspend(false);
      cargarUsuarios();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado del usuario.');
    }
  };

  // Eliminar usuario en DB
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await userService.deleteUser(selectedUser.id);
      setShowModalDelete(false);
      // Si era el único en la página actual y no estamos en pág 1, retroceder
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else {
        cargarUsuarios();
      }
    } catch (err) {
      alert(err.message || 'Error al eliminar usuario.');
    }
  };

  // Abrir modales
  const handleOpenCreate = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRol('Usuario');
    setFormError('');
    setShowModalCreate(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormName(user.nombre || user.name || '');
    setFormEmail(user.email || '');
    setFormRol(getRolLegible(user));
    setFormError('');
    setShowModalEdit(true);
  };

  const handleToggleState = (user) => {
    setSelectedUser(user);
    setShowModalSuspend(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowModalDelete(true);
  };

  const getIniciales = (nombre) => {
    if (!nombre) return 'US';
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const indiceInicio = (currentPage - 1) * itemsPerPage;

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
          <button
            className="admin-logout-btn"
            onClick={() => {
              authService.logout();
              navigate('/');
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
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

        {apiError && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            ⚠️ {apiError}
          </div>
        )}

        {/* Barra de búsqueda y filtro de tabla */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o correo..."
              className="admin-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="admin-filter-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <select
              className="admin-select"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <option value="Todos">Todos los roles</option>
              <option value="Admin">Admin</option>
              <option value="Usuario">Usuario</option>
              <option value="Reclutador">Reclutador</option>
            </select>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
              ⏳ Cargando usuarios desde la base de datos...
            </div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const rolLegible = getRolLegible(user);
                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info-cell">
                            <div className={`user-avatar-circle ${rolLegible.toLowerCase()}`}>
                              {getIniciales(user.nombre)}
                            </div>
                            <span className="user-name-text">{user.nombre}</span>
                          </div>
                        </td>
                        <td className="email-cell">{user.email}</td>
                        <td>
                          <span className={`rol-badge rol-${rolLegible.toLowerCase()}`}>
                            {rolLegible}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`toggle-switch ${user.activo !== false ? 'active' : ''}`}
                            onClick={() => handleToggleState(user)}
                            title={user.activo !== false ? 'Activo (Clic para suspender)' : 'Inactivo (Clic para activar)'}
                          >
                            <span className="switch-thumb"></span>
                          </button>
                        </td>
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
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>
                        No se encontraron usuarios en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Footer de Paginación */}
              <div className="admin-table-footer">
                <span className="results-count">
                  Mostrando {totalItems > 0 ? indiceInicio + 1 : 0} a {Math.min(indiceInicio + itemsPerPage, totalItems)} de {totalItems} resultados
                </span>
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`page-btn ${currentPage === num ? 'page-active' : ''}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* --- MODAL 1: NUEVO USUARIO --- */}
      {showModalCreate && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h2 className="admin-modal-title">Crear nuevo usuario</h2>
            {formError && <p className="form-error" style={{ marginBottom: '12px', color: '#EF4444' }}>{formError}</p>}
            <form className="admin-modal-form" onSubmit={handleSaveCreate}>
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
                <label className="admin-label">Contraseña</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="Password123!"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
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
            {formError && <p className="form-error" style={{ marginBottom: '12px', color: '#EF4444' }}>{formError}</p>}
            <form className="admin-modal-form" onSubmit={handleSaveEdit}>
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

      {/* --- MODAL 3: SUSPENDER USUARIO --- */}
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

            <h2 className="admin-modal-title">¿Cambiar estado de {selectedUser?.nombre}?</h2>
            <p className="admin-modal-body">
              {selectedUser?.activo !== false
                ? 'Esta acción suspenderá el acceso del usuario temporalmente.'
                : 'Esta acción reactivará el acceso del usuario.'}
            </p>

            <div className="admin-modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowModalSuspend(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-suspend"
                onClick={handleConfirmSuspend}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ELIMINAR USUARIO --- */}
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
              Esta acción eliminará permanentemente la cuenta y todos sus datos de la base de datos.
            </p>

            <div className="admin-modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowModalDelete(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-delete"
                onClick={handleConfirmDelete}
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
