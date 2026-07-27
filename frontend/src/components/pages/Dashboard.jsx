import React from 'react';
import Navbar from '../Navbar';
import './Dashboard.css';

// Datos de ejemplo (estáticos, sin funcionalidad)
const cvs = [
  {
    id: 1,
    titulo: 'Frontend Developer',
    estado: 'PÚBLICO',
    modificado: 'hace 2 días',
    vistas: 142,
    pdf: true,
  },
  {
    id: 2,
    titulo: 'UX Designer Portfolio',
    estado: 'BORRADOR',
    modificado: 'hace 1 semana',
    vistas: 0,
    pdf: false,
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Encabezado */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">¡Bienvenido de nuevo, Usuario!</h1>
            <p className="dashboard-subtitle">Aquí están tus CVs recientes y borradores.</p>
          </div>
          <button className="btn-crear-cv">
            + Crear nuevo CV
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="dashboard-toolbar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Buscar CVs..." className="search-input" />
          </div>

          <div className="toolbar-right">
            <button className="btn-filtro">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filtrar
            </button>
            <button className="btn-filtro">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="14" y2="12" />
                <line x1="4" y1="18" x2="10" y2="18" />
              </svg>
              Ordenar
            </button>
          </div>
        </div>

        {/* Grid de CVs */}
        <div className="cv-grid">
          {cvs.map((cv) => (
            <div key={cv.id} className="cv-card">
              {/* Vista previa del CV */}
              <div className="cv-preview">
                <div className="cv-preview-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>

              {/* Info del CV */}
              <div className="cv-info">
                <div className="cv-titulo-row">
                  <h3 className="cv-titulo">{cv.titulo}</h3>
                  <button className="cv-menu-btn">⋮</button>
                </div>
                <div className="cv-meta">
                  <span className={`cv-badge ${cv.estado === 'PÚBLICO' ? 'badge-publico' : 'badge-borrador'}`}>
                    {cv.estado}
                  </span>
                  <span className="cv-modificado">Modificado {cv.modificado}</span>
                </div>
                <div className="cv-stats">
                  <span className="cv-stat">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {cv.vistas} vistas
                  </span>
                  {cv.pdf && (
                    <span className="cv-stat">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      PDF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Tarjeta "Plantilla en blanco" */}
          <div className="cv-card cv-card-blank">
            <div className="cv-preview cv-preview-blank">
              <div className="blank-plus-btn">+</div>
              <p className="blank-label">Empieza desde cero</p>
            </div>
            <div className="cv-info">
              <h3 className="cv-titulo">Plantilla en blanco</h3>
              <p className="cv-blank-desc">Crea un diseño único adaptado exactamente a tus necesidades.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
