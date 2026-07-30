import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Directorio.css';

const candidatosDemo = [
  {
    id: 'demo_1',
    nombre: 'Ana Martínez',
    cargo: 'Desarrolladora Full Stack',
    iniciales: 'AM',
    tags: ['React', 'Node.js', 'TypeScript']
  },
  {
    id: 'demo_2',
    nombre: 'Carlos Gómez',
    cargo: 'UX/UI Designer',
    iniciales: 'CG',
    tags: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 'demo_3',
    nombre: 'Laura Ramírez',
    cargo: 'Gerente de Proyectos',
    iniciales: 'LR',
    tags: ['Agile', 'Scrum', 'Jira', 'Liderazgo']
  },
  {
    id: 'demo_4',
    nombre: 'Diego Peña',
    cargo: 'Data Scientist',
    iniciales: 'DP',
    tags: ['Python', 'SQL', 'Machine Learning']
  }
];

export default function CvsGuardados() {
  const [savedCandidates, setSavedCandidates] = useState([]);

  useEffect(() => {
    // 1. Obtener IDs guardados por el reclutador
    const idsGuardados = JSON.parse(localStorage.getItem('profolio_cvs_guardados_reclutador') || '["demo_2"]');

    // 2. Obtener todos los CVs disponibles (usuarios + demo)
    const cvsUsuario = JSON.parse(localStorage.getItem('profolio_cvs_lista') || '[]');
    const cvsTransformados = cvsUsuario.map(cv => {
      const nombreCompleto = `${cv.personal?.nombre || ''} ${cv.personal?.apellido || ''}`.trim() || cv.titulo || 'Candidato Sin Nombre';
      const cargo = cv.personal?.titulo || cv.titulo || 'Profesional';
      const partes = nombreCompleto.split(' ').filter(Boolean);
      let iniciales = 'US';
      if (partes.length >= 2) {
        iniciales = (partes[0][0] + partes[1][0]).toUpperCase();
      } else if (partes.length === 1) {
        iniciales = partes[0].slice(0, 2).toUpperCase();
      }

      return {
        id: cv.id,
        nombre: nombreCompleto,
        cargo: cargo,
        iniciales: iniciales,
        tags: cv.habilidades || []
      };
    });

    const idsExistentes = new Set(cvsTransformados.map(c => c.id));
    const todosCandidatos = [...cvsTransformados, ...candidatosDemo.filter(d => !idsExistentes.has(d.id))];

    // 3. Filtrar únicamente los que el reclutador ha guardado
    const guardadosFiltrados = todosCandidatos.filter(c => idsGuardados.includes(c.id));
    setSavedCandidates(guardadosFiltrados);
  }, []);

  const handleRemoveSaved = (id) => {
    const nuevosGuardados = savedCandidates.filter(c => c.id !== id);
    setSavedCandidates(nuevosGuardados);

    const idsActualizados = nuevosGuardados.map(c => c.id);
    localStorage.setItem('profolio_cvs_guardados_reclutador', JSON.stringify(idsActualizados));
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

                <Link to={`/reclutador/ver-cv?cvId=${cand.id}`} className="btn-ver-cv">
                  Ver CV
                </Link>
              </div>
            ))}
          </div>
        ) : (
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
