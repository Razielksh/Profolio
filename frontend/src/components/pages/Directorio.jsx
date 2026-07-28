import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Directorio.css';

const candidatosEjemplo = [
  {
    id: 1,
    nombre: 'Ana Martínez',
    cargo: 'Desarrolladora Full Stack',
    iniciales: 'AM',
    guardado: false,
    tags: ['React', 'Node.js', 'TypeScript']
  },
  {
    id: 2,
    nombre: 'Carlos Gómez',
    cargo: 'UX/UI Designer',
    iniciales: 'CG',
    guardado: true,
    tags: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 3,
    nombre: 'Laura Ramírez',
    cargo: 'Gerente de Proyectos',
    iniciales: 'LR',
    guardado: false,
    tags: ['Agile', 'Scrum', 'Jira', 'Liderazgo']
  },
  {
    id: 4,
    nombre: 'Diego Peña',
    cargo: 'Data Scientist',
    iniciales: 'DP',
    guardado: false,
    tags: ['Python', 'SQL', 'Machine Learning']
  }
];

export default function Directorio() {
  const [candidatos, setCandidatos] = useState(candidatosEjemplo);
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  const toggleBookmark = (id) => {
    setCandidatos(candidatos.map(c => c.id === id ? { ...c, guardado: !c.guardado } : c));
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
            <NavLink to="/reclutador/directorio" className="reclutador-nav-badge">
              Directorio
            </NavLink>
            <NavLink to="/reclutador/guardados" className="reclutador-nav-link">
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
        <h1 className="reclutador-title">Directorio de Profesionales</h1>

        {/* Buscador */}
        <div className="search-bar-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, cargo o habilidad..."
            className="search-bar-input"
          />
        </div>

        {/* Barra de Filtros y Ordenar */}
        <div className="toolbar-container">
          <div className="filter-pills">
            {['Todos', 'Por habilidad', 'Por título', 'Por ubicación'].map((f) => (
              <button
                key={f}
                className={`filter-pill ${filtroActivo === f ? 'filter-pill-active' : ''}`}
                onClick={() => setFiltroActivo(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <span className="sort-label">Ordenar por:</span>
            <select className="sort-select">
              <option>Relevancia</option>
              <option>Más recientes</option>
              <option>Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Grid de Candidatos */}
        <div className="candidates-grid">
          {candidatos.map((cand) => (
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
                  onClick={() => toggleBookmark(cand.id)}
                  title={cand.guardado ? 'Quitar de guardados' : 'Guardar CV'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={cand.guardado ? '#006654' : 'none'} stroke="#006654" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
              </div>

              {/* Tags de habilidades */}
              <div className="candidate-tags">
                {cand.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>

              {/* Botón Ver CV */}
              <Link to="/reclutador/ver-cv" className="btn-ver-cv">
                Ver CV
              </Link>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="directorio-pagination">
          <button className="page-btn">&lt;</button>
          <button className="page-btn page-active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <span className="pagination-dots">...</span>
          <button className="page-btn">8</button>
          <button className="page-btn">&gt;</button>
        </div>
      </main>
    </div>
  );
}
