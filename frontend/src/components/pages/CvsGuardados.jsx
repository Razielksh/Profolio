import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Directorio.css';

const initialSaved = [
  {
    id: 1,
    nombre: 'Laura Gómez',
    cargo: 'Desarrolladora Full Stack Senior',
    iniciales: 'LG',
    tags: ['React', 'Node.js', 'AWS']
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    cargo: 'UX/UI Designer',
    iniciales: 'CR',
    tags: ['Figma', 'UI Design', 'Research']
  }
];

export default function CvsGuardados() {
  const [savedCandidates, setSavedCandidates] = useState(initialSaved);

  const handleRemoveSaved = (id) => {
    setSavedCandidates(savedCandidates.filter(c => c.id !== id));
  };

  return (
    <div className="reclutador-page">
      {/* Header Reclutador */}
      <header className="reclutador-navbar">
        <div className="reclutador-nav-left">
          <div className="brand-logo">
            <img src={profolioIcon} alt="Logo Profolio" className="brand-icon" />
            <span className="brand-name">Profolio</span>
          </div>

          <nav className="reclutador-nav-links">
            <NavLink to="/reclutador/directorio" className="reclutador-nav-link">
              Directorio
            </NavLink>
            <NavLink to="/reclutador/guardados" className="reclutador-nav-badge">
              CVs Guardados
            </NavLink>
          </nav>
        </div>

        <div className="reclutador-nav-right">
          <Link to="/perfil" className="reclutador-profile-btn" title="Perfil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="reclutador-main">
        <h1 className="reclutador-title">CVs Guardados</h1>
        <p className="reclutador-subtitle">Gestiona los perfiles que has guardado para futuras referencias.</p>

        {savedCandidates.length > 0 ? (
          <div className="candidates-grid">
            {savedCandidates.map((cand) => (
              <div key={cand.id} className="candidate-card">
                <div className="candidate-card-header">
                  <div className="candidate-info">
                    <div className="candidate-avatar">
                      {cand.iniciales}
                    </div>
                    <div>
                      <h3 className="candidate-name">{cand.nombre}</h3>
                      <p className="candidate-role">{cand.cargo}</p>
                    </div>
                  </div>

                  <button
                    className="bookmark-btn"
                    onClick={() => handleRemoveSaved(cand.id)}
                    title="Quitar de guardados"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#006654" stroke="#006654" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                <div className="candidate-tags">
                  {cand.tags.map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>

                <Link to="/reclutador/ver-cv" className="btn-ver-cv">
                  Ver CV
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío (guardados_reclutador_vacio.png) */
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#006654" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2 className="empty-title">Aún no has guardado ningún CV</h2>
            <p className="empty-subtitle">Explora el directorio y guarda los perfiles que te interesen.</p>
            <Link to="/reclutador/directorio" className="btn-filtro" style={{ border: '1.5px solid #006654', color: '#006654', fontWeight: 600, padding: '10px 24px', textDecoration: 'none' }}>
              Explorar directorio
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
