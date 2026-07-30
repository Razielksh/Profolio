import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { cvService } from '../../services/api';
import './Dashboard.css';

// Se conectará directamente al backend vía cvService

// Miniatura del CV para la tarjeta
function CvMiniatura({ cv }) {
  const color = cv.estilos?.color || '#006654';
  const nombre = `${cv.personal?.nombre || ''}  ${cv.personal?.apellido || ''}`.trim() || 'Sin nombre';
  const titulo = cv.personal?.titulo || 'Sin título profesional';
  const habilidades = cv.habilidades || [];

  return (
    <div className="cv-miniatura" style={{ borderTopColor: color }}>
      <div className="cv-mini-header" style={{ borderBottomColor: color }}>
        <div className="cv-mini-name" style={{ color }}>{nombre || 'Jane Doe'}</div>
        <div className="cv-mini-role">{titulo || 'Título profesional'}</div>
      </div>
      <div className="cv-mini-lines">
        <div className="cv-mini-section-label" style={{ color }}>EXPERIENCIA</div>
        {(cv.experiencias || []).slice(0, 2).map((e, i) => (
          <div key={i} className="cv-mini-line-item">
            <span className="cv-mini-dot" style={{ background: color }}></span>
            <span className="cv-mini-text">{e.puesto} – {e.empresa}</span>
          </div>
        ))}
        {(cv.experiencias || []).length === 0 && <div className="cv-mini-placeholder"></div>}
        <div className="cv-mini-section-label" style={{ color, marginTop: '6px' }}>HABILIDADES</div>
        <div className="cv-mini-skills">
          {habilidades.slice(0, 4).map((h, i) => (
            <span key={i} className="cv-mini-badge" style={{ borderColor: color, color }}>{h}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo') || 'null');
  const esNormal = !usuarioActivo?.rol || usuarioActivo?.rol === 'Usuario' || usuarioActivo?.rol === 'Reclutador';
  const nombreMostrar = esNormal
    ? (usuarioActivo?.nombre || usuarioActivo?.name || 'Usuario')
    : 'Admin';

  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [ordenDesc, setOrdenDesc] = useState(true);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null); // id del CV a eliminar

  const cargarCvs = () => {
    setLoading(true);
    cvService.getMyCvs()
      .then(data => {
        setCvs(data || []);
        setError(null);
      })
      .catch(err => {
        console.error('Error al obtener CVs:', err);
        setError(err.message || 'Error al cargar tus CVs');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarCvs();
  }, []);

  const cvsFiltrados = cvs
    .filter(cv => {
      const q = busqueda.toLowerCase();
      const nombre = (cv.nombreContacto || '').toLowerCase();
      const titulo = (cv.titulo || '').toLowerCase();
      const prof = (cv.tituloProfesional || '').toLowerCase();
      return nombre.includes(q) || titulo.includes(q) || prof.includes(q);
    })
    .sort((a, b) => {
      return ordenDesc ? b.id - a.id : a.id - b.id;
    });

  const handleEliminar = async (id) => {
    try {
      await cvService.deleteCv(id);
      setConfirmarEliminar(null);
      cargarCvs();
    } catch (err) {
      alert(err.message || 'Error al eliminar el CV');
    }
  };

  const handleEditar = (id) => {
    navigate(`/creacion-doc?cvId=${id}`);
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Encabezado */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">¡Bienvenido de nuevo, {nombreMostrar}!</h1>
            <p className="dashboard-subtitle">
              {cvs.length === 0
                ? 'Crea tu primer currículum y empieza a destacar.'
                : `Tienes ${cvs.length} CV${cvs.length !== 1 ? 's' : ''} guardado${cvs.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
          <Link to="/creacion-doc" className="btn-crear-cv" style={{ textDecoration: 'none', display: 'inline-block' }}>
            + Crear nuevo CV
          </Link>
        </div>

        {/* Toolbar de búsqueda y filtros */}
        {cvs.length > 0 && (
          <div className="dashboard-toolbar">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar CVs por nombre o título..."
                className="search-input"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button onClick={() => setBusqueda('')} className="search-clear-btn">×</button>
              )}
            </div>

            <div className="toolbar-right">
              <button className="btn-filtro" onClick={() => setOrdenDesc(prev => !prev)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {ordenDesc
                    ? <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="10" y2="18" /></>
                    : <><line x1="4" y1="18" x2="20" y2="18" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="6" x2="10" y2="6" /></>
                  }
                </svg>
                {ordenDesc ? 'Más reciente' : 'Más antiguo'}
              </button>
            </div>
          </div>
        )}

        {/* Grid de CVs o estado vacío */}
        {cvsFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#006654" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            {busqueda ? (
              <>
                <h2 className="empty-title">Sin resultados</h2>
                <p className="empty-subtitle">No hay CVs que coincidan con "{busqueda}".</p>
                <button onClick={() => setBusqueda('')} className="btn-crear-cv" style={{ border: 'none', cursor: 'pointer' }}>
                  Ver todos los CVs
                </button>
              </>
            ) : (
              <>
                <h2 className="empty-title">Aún no tienes ningún CV</h2>
                <p className="empty-subtitle">Crea tu primer currículum y empieza a destacar.</p>
                <Link to="/creacion-doc" className="btn-crear-cv" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  + Crear mi primer CV
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="cvs-grid">
            {cvsFiltrados.map(cv => (
              <div key={cv.id} className="cv-card">
                {/* Vista previa miniatura */}
                <div className="cv-card-preview" onClick={() => handleEditar(cv.id)}>
                  <CvMiniatura cv={cv} />
                </div>

                {/* Info y acciones */}
                <div className="cv-card-footer">
                  <div className="cv-card-info">
                    <div className="cv-card-titulo">{cv.titulo || 'CV sin título'}</div>
                    <div className="cv-card-fecha">
                      {cv.fechaActualizacion ? `Actualizado: ${cv.fechaActualizacion}` : 'Borrador'}
                    </div>
                  </div>
                  <div className="cv-card-actions">
                    <button
                      className="cv-action-btn cv-action-edit"
                      onClick={() => handleEditar(cv.id)}
                      title="Editar CV"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      className="cv-action-btn cv-action-delete"
                      onClick={() => setConfirmarEliminar(cv.id)}
                      title="Eliminar CV"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6M14 11v6"></path>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de confirmación de eliminación */}
      {confirmarEliminar && (
        <div className="modal-overlay" onClick={() => setConfirmarEliminar(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon-danger">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              </svg>
            </div>
            <h3 className="modal-title">¿Eliminar este CV?</h3>
            <p className="modal-desc">Esta acción no se puede deshacer. El CV será eliminado permanentemente.</p>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setConfirmarEliminar(null)}>
                Cancelar
              </button>
              <button className="modal-btn-confirm" onClick={() => handleEliminar(confirmarEliminar)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
