import React, { useState } from 'react';
import Navbar from '../Navbar';
import './Perfil.css';

export default function Perfil() {
  const [showModalDelete, setShowModalDelete] = useState(false);

  return (
    <div className="perfil-page">
      <Navbar />

      <div className="perfil-body">
        {/* Columna Izquierda - Avatar & Datos básicos */}
        <aside className="perfil-sidebar">
          <div className="perfil-avatar-circle">
            <span>JD</span>
          </div>
          <h2 className="perfil-sidebar-name">Jane Doe</h2>
          <p className="perfil-sidebar-email">jane.doe@example.com</p>
        </aside>

        {/* Columna Derecha - Tarjeta con formulario */}
        <main className="perfil-content">
          <div className="perfil-card">
            {/* Sección: Información Personal */}
            <section className="perfil-section">
              <h3 className="perfil-section-title">INFORMACIÓN PERSONAL</h3>
              <hr className="perfil-divider" />

              <div className="perfil-form-row">
                <div className="perfil-form-group">
                  <label className="perfil-label">Nombre completo</label>
                  <input type="text" className="perfil-input" defaultValue="Jane Doe" />
                </div>
                <div className="perfil-form-group">
                  <label className="perfil-label">Correo electrónico</label>
                  <input type="email" className="perfil-input disabled-input" defaultValue="jane.doe@example.com" disabled />
                </div>
              </div>

              <div className="perfil-form-row">
                <div className="perfil-form-group half-width">
                  <label className="perfil-label">Teléfono</label>
                  <input type="text" className="perfil-input" defaultValue="+1 (555) 000-0000" />
                </div>
              </div>
            </section>

            {/* Sección: Cambiar Contraseña */}
            <section className="perfil-section">
              <h3 className="perfil-section-title">CAMBIAR CONTRASEÑA</h3>
              <hr className="perfil-divider" />

              <div className="perfil-form-row">
                <div className="perfil-form-group half-width">
                  <label className="perfil-label">Contraseña actual</label>
                  <input type="password" className="perfil-input" />
                </div>
              </div>

              <div className="perfil-form-row">
                <div className="perfil-form-group">
                  <label className="perfil-label">Nueva contraseña</label>
                  <input type="password" className="perfil-input" />
                </div>
                <div className="perfil-form-group">
                  <label className="perfil-label">Confirmar contraseña</label>
                  <input type="password" className="perfil-input" />
                </div>
              </div>

              <div className="perfil-actions-row">
                <button type="button" className="btn-guardar-cambios">
                  Guardar cambios
                </button>
              </div>
            </section>

            {/* Sección: Zona de Peligro */}
            <section className="perfil-section danger-zone">
              <h3 className="perfil-section-title danger-title">ZONA DE PELIGRO</h3>
              <hr className="perfil-divider danger-divider" />

              <p className="danger-text">
                Una vez que elimines tu cuenta, no hay marcha atrás. Por favor, asegúrate.
              </p>

              <button type="button" className="btn-eliminar-cuenta" onClick={() => setShowModalDelete(true)}>
                Eliminar cuenta
              </button>
            </section>
          </div>
        </main>
      </div>

      {/* Modal de Confirmación de Eliminación (eliminar_cuenta_user.png) */}
      {showModalDelete && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-warning-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h2 className="modal-title">¿Eliminar tu cuenta?</h2>
            <p className="modal-body-text">
              Esta acción es permanente. Se borrarán todos tus CVs y datos. No hay marcha atrás.
            </p>

            <div className="modal-buttons">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowModalDelete(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-modal-delete">
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
