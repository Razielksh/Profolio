import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './GestionUsuarios.css';

const usuariosDefectoAdmin = [
  { id: 1, nombre: 'Ana García', email: 'ana.garcia@ejemplo.com', password: 'password123', rol: 'Admin', activo: true, fecha: '12 Oct 2023' },
  { id: 2, nombre: 'Carlos Mendoza', email: 'carlos.m@ejemplo.com', password: 'password123', rol: 'Usuario', activo: true, fecha: '15 Oct 2023' },
  { id: 3, nombre: 'Lucía Torres', email: 'ltorres@ejemplo.com', password: 'password123', rol: 'Reclutador', activo: false, fecha: '20 Oct 2023' },
  { id: 4, nombre: 'Javier Ruíz', email: 'jruiz@ejemplo.com', password: 'password123', rol: 'Usuario', activo: true, fecha: '22 Oct 2023' },
  { id: 5, nombre: 'Elena Gómez', email: 'elena.g@ejemplo.com', password: 'password123', rol: 'Usuario', activo: true, fecha: '25 Oct 2023' },
  { id: 6, nombre: 'Miguel Quiroga', email: 'mquiroga@ejemplo.com', password: 'password123', rol: 'Reclutador', activo: false, fecha: '28 Oct 2023' },
  { id: 7, nombre: 'Sofía Blanco', email: 's.blanco@ejemplo.com', password: 'password123', rol: 'Admin', activo: true, fecha: '01 Nov 2023' },
];

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const guardados = localStorage.getItem('usuarios_profolio');
    let listaExistente = guardados ? JSON.parse(guardados) : [];

    // Agregar los usuarios demo del admin si no están ya en la lista
    usuariosDefectoAdmin.forEach((demo) => {
      const yaExiste = listaExistente.some(
        (u) => u.email.toLowerCase() === demo.email.toLowerCase()
      );
      if (!yaExiste) {
        listaExistente.push(demo);
      }
    });

    localStorage.setItem('usuarios_profolio', JSON.stringify(listaExistente));
    setUsers(listaExistente);
  };

  const guardarListaEnStorage = (nuevaLista) => {
    setUsers(nuevaLista);
    localStorage.setItem('usuarios_profolio', JSON.stringify(nuevaLista));
  };

  // Crear usuario
  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre: formName.trim(),
      email: formEmail.trim(),
      password: formPassword.trim(),
      rol: formRol,
      activo: true,
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const nuevaLista = [...users, nuevo];
    guardarListaEnStorage(nuevaLista);
    setShowModalCreate(false);
  };

  // Editar usuario
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setFormError('Nombre y correo son obligatorios.');
      return;
    }

    const nuevaLista = users.map((u) => {
      if (u.id === selectedUser.id || u.email === selectedUser.email) {
        return { ...u, nombre: formName.trim(), email: formEmail.trim(), rol: formRol };
      }
      return u;
    });

    guardarListaEnStorage(nuevaLista);
    setShowModalEdit(false);
  };

  // Suspender/Activar usuario
  const handleConfirmSuspend = () => {
    const nuevaLista = users.map((u) => {
      if (u.id === selectedUser.id || u.email === selectedUser.email) {
        return { ...u, activo: !u.activo };
      }
      return u;
    });
    guardarListaEnStorage(nuevaLista);
    setShowModalSuspend(false);
  };

  // Eliminar usuario
  const handleConfirmDelete = () => {
    const nuevaLista = users.filter((u) => u.id !== selectedUser.id && u.email !== selectedUser.email);
    guardarListaEnStorage(nuevaLista);
    setShowModalDelete(false);
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
    setFormName(user.nombre);
    setFormEmail(user.email);
    setFormRol(user.rol || 'Usuario');
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

  // Filtrado de usuarios
  const usuariosFiltrados = users.filter((u) => {
    const coincideNombre = u.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideEmail = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideRol = roleFilter === 'Todos' || u.rol === roleFilter;
    return (coincideNombre || coincideEmail) && coincideRol;
  });

  // Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPerPage) || 1;
  const indiceInicio = (currentPage - 1) * itemsPerPage;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + itemsPerPage);

  const getIniciales = (nombre) => {
    if (!nombre) return 'US';
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
          <button
            className="admin-logout-btn"
            onClick={() => {
              localStorage.removeItem('usuario_activo');
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

        {/* Barra de búsqueda y filtro de tabla */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="Todos">Todos</option>
              <option value="Admin">Admin</option>
              <option value="Usuario">Usuario</option>
              <option value="Reclutador">Reclutador</option>
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
              {usuariosPaginados.map((user, idx) => (
                <tr key={user.id || idx}>
                  <td>
                    <div className="user-info-cell">
                      <div className={`user-avatar-circle ${(user.rol || 'usuario').toLowerCase()}`}>
                        {getIniciales(user.nombre)}
                      </div>
                      <span className="user-name-text">{user.nombre}</span>
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`rol-badge rol-${(user.rol || 'usuario').toLowerCase()}`}>
                      {user.rol || 'Usuario'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`toggle-switch ${user.activo !== false ? 'active' : ''}`}
                      onClick={() => handleToggleState(user)}
                    >
                      <span className="switch-thumb"></span>
                    </button>
                  </td>
                  <td className="date-cell">{user.fecha || '12 Oct 2023'}</td>
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
              {usuariosPaginados.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6B7280' }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer de Paginación */}
          <div className="admin-table-footer">
            <span className="results-count">
              Mostrando {usuariosFiltrados.length > 0 ? indiceInicio + 1 : 0} a {Math.min(indiceInicio + itemsPerPage, usuariosFiltrados.length)} de {usuariosFiltrados.length} resultados
            </span>
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              >
                &lt;
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
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
                disabled={currentPage === totalPaginas}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPaginas))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL 1: NUEVO USUARIO --- */}
      {showModalCreate && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h2 className="admin-modal-title">Crear nuevo usuario</h2>
            {formError && <p className="form-error" style={{ marginBottom: '12px' }}>{formError}</p>}
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
                  placeholder="password123"
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
            {formError && <p className="form-error" style={{ marginBottom: '12px' }}>{formError}</p>}
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
              Esta acción eliminará permanentemente la cuenta y todos sus datos.
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
