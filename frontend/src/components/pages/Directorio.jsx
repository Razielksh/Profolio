import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './Directorio.css';

// Candidatos de ejemplo por defecto
const candidatosDemo = [
  {
    id: 'demo_1',
    nombre: 'Ana Martínez',
    cargo: 'Desarrolladora Full Stack',
    iniciales: 'AM',
    tags: ['React', 'Node.js', 'TypeScript'],
    ubicacion: 'Ciudad de México'
  },
  {
    id: 'demo_2',
    nombre: 'Carlos Gómez',
    cargo: 'UX/UI Designer',
    iniciales: 'CG',
    tags: ['Figma', 'Prototyping', 'User Research'],
    ubicacion: 'Guadalajara'
  },
  {
    id: 'demo_3',
    nombre: 'Laura Ramírez',
    cargo: 'Gerente de Proyectos',
    iniciales: 'LR',
    tags: ['Agile', 'Scrum', 'Jira', 'Liderazgo'],
    ubicacion: 'Monterrey'
  },
  {
    id: 'demo_4',
    nombre: 'Diego Peña',
    cargo: 'Data Scientist',
    iniciales: 'DP',
    tags: ['Python', 'SQL', 'Machine Learning'],
    ubicacion: 'Querétaro'
  }
];

export default function Directorio() {
  const [candidatos, setCandidatos] = useState([]);
  const [guardadosIds, setGuardadosIds] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [orden, setOrden] = useState('Relevancia');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  // Cargar CVs reales creados por usuarios y guardados del reclutador
  useEffect(() => {
    // 1. Cargar CVs del usuario desde localStorage ('profolio_cvs_lista')
    const cvsGuardados = JSON.parse(localStorage.getItem('profolio_cvs_lista') || '[]');
    
    // Convertir los CVs guardados por usuarios al formato de candidatos del directorio
    const cvsTransformados = cvsGuardados.map(cv => {
      const nombreCompleto = `${cv.personal?.nombre || ''} ${cv.personal?.apellido || ''}`.trim() || cv.titulo || 'Candidato Sin Nombre';
      const cargo = cv.personal?.titulo || cv.titulo || 'Profesional';
      
      // Obtener iniciales sencillas
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
        tags: cv.habilidades || [],
        ubicacion: cv.personal?.ubicacion || ''
      };
    });

    // Unir los CVs del usuario con los de demo (evitando duplicados por ID)
    const idsExistentes = new Set(cvsTransformados.map(c => c.id));
    const listaCompleta = [...cvsTransformados, ...candidatosDemo.filter(d => !idsExistentes.has(d.id))];

    setCandidatos(listaCompleta);

    // 2. Cargar IDs de CVs guardados por el reclutador
    const idsGuardados = JSON.parse(localStorage.getItem('profolio_cvs_guardados_reclutador') || '["demo_2"]');
    setGuardadosIds(idsGuardados);
  }, []);

  // Alternar guardar/quitar CV favorito para el reclutador
  const toggleBookmark = (id) => {
    let nuevosGuardados;
    if (guardadosIds.includes(id)) {
      nuevosGuardados = guardadosIds.filter(gId => gId !== id);
    } else {
      nuevosGuardados = [...guardadosIds, id];
    }
    setGuardadosIds(nuevosGuardados);
    localStorage.setItem('profolio_cvs_guardados_reclutador', JSON.stringify(nuevosGuardados));
  };

  // Filtrado de candidatos por texto de búsqueda y categoría
  const candidatosFiltrados = candidatos.filter(c => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = 
      c.nombre.toLowerCase().includes(texto) ||
      c.cargo.toLowerCase().includes(texto) ||
      c.tags.some(t => t.toLowerCase().includes(texto));

    if (!coincideTexto) return false;

    if (filtroActivo === 'Por habilidad') return c.tags.length > 0;
    if (filtroActivo === 'Por título') return c.cargo.trim().length > 0;
    if (filtroActivo === 'Por ubicación') return c.ubicacion && c.ubicacion.trim().length > 0;

    return true;
  });

  // Ordenamiento básico
  const candidatosOrdenados = [...candidatosFiltrados].sort((a, b) => {
    if (orden === 'Nombre (A-Z)') {
      return a.nombre.localeCompare(b.nombre);
    }
    return 0; // Relevancia / Más recientes (orden por defecto)
  });

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(candidatosOrdenados.length / itemsPorPagina));
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const candidatosPagina = candidatosOrdenados.slice(inicio, inicio + itemsPorPagina);

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
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
          />
        </div>

        {/* Barra de Filtros y Ordenar */}
        <div className="toolbar-container">
          <div className="filter-pills">
            {['Todos', 'Por habilidad', 'Por título', 'Por ubicación'].map((f) => (
              <button
                key={f}
                className={`filter-pill ${filtroActivo === f ? 'filter-pill-active' : ''}`}
                onClick={() => { setFiltroActivo(f); setPaginaActual(1); }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <span className="sort-label">Ordenar por:</span>
            <select
              className="sort-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="Relevancia">Relevancia</option>
              <option value="Nombre (A-Z)">Nombre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Grid de Candidatos */}
        {candidatosPagina.length > 0 ? (
          <div className="candidates-grid">
            {candidatosPagina.map((cand) => {
              const estaGuardado = guardadosIds.includes(cand.id);

              return (
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
                      title={estaGuardado ? 'Quitar de guardados' : 'Guardar CV'}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={estaGuardado ? '#006654' : 'none'}
                        stroke="#006654"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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
                  <Link to={`/reclutador/ver-cv?cvId=${cand.id}`} className="btn-ver-cv">
                    Ver CV
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="empty-title">No se encontraron profesionales</h2>
            <p className="empty-subtitle">Intenta cambiar los términos de búsqueda o filtros.</p>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="directorio-pagination">
            <button
              className="page-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`page-btn ${paginaActual === num ? 'page-active' : ''}`}
                onClick={() => setPaginaActual(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
