import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './CreacionDoc.css';

// --- Utilidades para la librería de CVs en localStorage ---
const KEY_ALL_CVS = 'profolio_cvs_lista';

function getAllCvs() {
  return JSON.parse(localStorage.getItem(KEY_ALL_CVS) || '[]');
}

function saveCvToLibrary(cv) {
  const lista = getAllCvs();
  const idx = lista.findIndex(c => c.id === cv.id);
  if (idx >= 0) {
    lista[idx] = cv;
  } else {
    lista.push(cv);
  }
  localStorage.setItem(KEY_ALL_CVS, JSON.stringify(lista));
}

function defaultCvData(usuarioActivo) {
  return {
    personal: {
      nombre: usuarioActivo?.nombre ? usuarioActivo.nombre.split(' ')[0] : '',
      apellido: usuarioActivo?.nombre ? usuarioActivo.nombre.split(' ').slice(1).join(' ') : '',
      titulo: '',
      email: usuarioActivo?.email || '',
      telefono: '',
      ubicacion: '',
      linkedin: '',
      resumen: ''
    },
    experiencias: [],
    educacion: [],
    habilidades: [],
    estilos: { color: '#006654', font: 'Inter' }
  };
}

export default function CreacionDoc() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cvId = searchParams.get('cvId');

  const [activeSection, setActiveSection] = useState('personal');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo') || '{}');

  // Cargar datos del CV: si viene con cvId, cargamos ese; si no, nuevo vacío
  const getInitialData = () => {
    if (cvId) {
      const lista = getAllCvs();
      const found = lista.find(c => c.id === cvId);
      if (found) return found;
    }
    return { id: null, titulo: 'Mi CV', ...defaultCvData(usuarioActivo) };
  };

  const initial = getInitialData();

  const [cvTitulo, setCvTitulo] = useState(initial.titulo || 'Mi CV');
  const [personal, setPersonal] = useState(initial.personal);
  const [experiencias, setExperiencias] = useState(initial.experiencias || []);
  const [educacion, setEducacion] = useState(initial.educacion || []);
  const [habilidades, setHabilidades] = useState(initial.habilidades || []);
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [estilos, setEstilos] = useState(initial.estilos || { color: '#006654', font: 'Inter' });
  const [currentCvId] = useState(() => cvId || `cv_${Date.now()}`);

  // Auto-guardar borrador en localStorage cada vez que cambia algo
  useEffect(() => {
    const draft = { id: currentCvId, titulo: cvTitulo, personal, experiencias, educacion, habilidades, estilos };
    localStorage.setItem(`profolio_draft_${currentCvId}`, JSON.stringify(draft));
  }, [personal, experiencias, educacion, habilidades, estilos, cvTitulo, currentCvId]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handlePersonalChange = (field, val) => {
    setPersonal(prev => ({ ...prev, [field]: val }));
  };

  // Experiencia
  const handleAddExperiencia = () => {
    setExperiencias(prev => [...prev, {
      id: Date.now(),
      puesto: 'Nuevo Puesto',
      empresa: 'Nombre de Empresa',
      ubicacion: 'Ciudad, País',
      fecha: '2023 - Presente',
      descripcion: 'Describe tus responsabilidades y logros clave aquí.'
    }]);
  };

  const handleUpdateExperiencia = (id, field, val) => {
    setExperiencias(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleRemoveExperiencia = (id) => {
    setExperiencias(prev => prev.filter(e => e.id !== id));
  };

  // Educación
  const handleAddEducacion = () => {
    setEducacion(prev => [...prev, {
      id: Date.now(),
      titulo: 'Nuevo Título / Grado',
      colegio: 'Institución Educativa',
      fecha: 'Año de Graduación'
    }]);
  };

  const handleUpdateEducacion = (id, field, val) => {
    setEducacion(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleRemoveEducacion = (id) => {
    setEducacion(prev => prev.filter(e => e.id !== id));
  };

  // Habilidades
  const handleAddHabilidad = (e) => {
    e.preventDefault();
    if (nuevaHabilidad.trim() && !habilidades.includes(nuevaHabilidad.trim())) {
      setHabilidades(prev => [...prev, nuevaHabilidad.trim()]);
      setNuevaHabilidad('');
    }
  };

  const handleRemoveHabilidad = (hab) => {
    setHabilidades(prev => prev.filter(h => h !== hab));
  };

  // Guardar CV en la galería del usuario
  const handleGuardarCV = () => {
    const cvData = {
      id: currentCvId,
      titulo: cvTitulo,
      personal,
      experiencias,
      educacion,
      habilidades,
      estilos,
      fechaActualizacion: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    saveCvToLibrary(cvData);
    // Limpiar el borrador temporal
    localStorage.removeItem(`profolio_draft_${currentCvId}`);
    // Actualizar la URL con el ID del CV guardado (si era nuevo)
    if (!cvId) {
      navigate(`/creacion-doc?cvId=${currentCvId}`, { replace: true });
    }
    // Mostrar toast de confirmación
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  // Exportar PDF vía backend
  const handleDescargarPDF = async () => {
    setLoadingPdf(true);
    try {
      const cvData = { personal, experiencias, educacion, habilidades, estilos };
      const response = await fetch('http://localhost:8080/api/cv/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData)
      });

      if (!response.ok) throw new Error('Error al generar PDF en el servidor');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${personal.nombre || 'Mi'}_${personal.apellido || 'Curriculum'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Fallback a impresión local:', err);
      window.print();
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="editor-page">
      {/* Toast de guardado */}
      {savedToast && (
        <div className="saved-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          CV guardado correctamente
        </div>
      )}

      {/* Navbar Superior del Editor */}
      <header className="editor-navbar">
        <div className="editor-nav-left">
          <Link to="/dashboard" className="back-btn" title="Volver al inicio">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>

          <div className="brand-logo">
            <img src={profolioIcon} alt="Logo Profolio" className="brand-icon-sm" />
            <span className="brand-name-sm">Profolio</span>
          </div>

          {/* Título editable del CV */}
          <input
            type="text"
            className="cv-title-input"
            value={cvTitulo}
            onChange={(e) => setCvTitulo(e.target.value)}
            placeholder="Nombre de este CV..."
          />
        </div>

        <div className="editor-nav-right">
          <button className="btn-guardar-cv" onClick={handleGuardarCV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Guardar CV
          </button>

          <button className="btn-descargar-pdf" onClick={handleDescargarPDF} disabled={loadingPdf}>
            {loadingPdf ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Generando...
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Descargar PDF
              </span>
            )}
          </button>

          <Link to="/perfil" className="profile-pill-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Perfil
          </Link>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="editor-body">
        {/* Columna Izquierda - Formularios Acordeón */}
        <aside className="editor-sidebar">
          {/* Sección 1: Información Personal */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('personal')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Información Personal</span>
              </div>
              <span className={`chevron ${activeSection === 'personal' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'personal' && (
              <div className="accordion-content">
                <div className="form-row">
                  <div className="form-group-half">
                    <label className="form-label-sm">Nombre</label>
                    <input type="text" className="form-input-sm" value={personal.nombre} onChange={(e) => handlePersonalChange('nombre', e.target.value)} />
                  </div>
                  <div className="form-group-half">
                    <label className="form-label-sm">Apellido</label>
                    <input type="text" className="form-input-sm" value={personal.apellido} onChange={(e) => handlePersonalChange('apellido', e.target.value)} />
                  </div>
                </div>
                <div className="form-group-full">
                  <label className="form-label-sm">Título profesional</label>
                  <input type="text" className="form-input-sm" value={personal.titulo} onChange={(e) => handlePersonalChange('titulo', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group-half">
                    <label className="form-label-sm">Email</label>
                    <input type="email" className="form-input-sm" value={personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} />
                  </div>
                  <div className="form-group-half">
                    <label className="form-label-sm">Teléfono</label>
                    <input type="text" className="form-input-sm" value={personal.telefono} onChange={(e) => handlePersonalChange('telefono', e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group-half">
                    <label className="form-label-sm">Ubicación</label>
                    <input type="text" className="form-input-sm" value={personal.ubicacion} onChange={(e) => handlePersonalChange('ubicacion', e.target.value)} />
                  </div>
                  <div className="form-group-half">
                    <label className="form-label-sm">LinkedIn / Sitio</label>
                    <input type="text" className="form-input-sm" value={personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} />
                  </div>
                </div>
                <div className="form-group-full">
                  <label className="form-label-sm">Resumen Profesional</label>
                  <textarea className="form-textarea-sm" rows="3" value={personal.resumen} onChange={(e) => handlePersonalChange('resumen', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* Sección 2: Experiencia */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('experiencia')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>Experiencia ({experiencias.length})</span>
              </div>
              <span className={`chevron ${activeSection === 'experiencia' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'experiencia' && (
              <div className="accordion-content">
                {experiencias.map((exp, idx) => (
                  <div key={exp.id} className="exp-card-item">
                    <div className="exp-card-header">
                      <strong>Puesto #{idx + 1}</strong>
                      <button className="btn-remove-item" onClick={() => handleRemoveExperiencia(exp.id)}>Eliminar</button>
                    </div>
                    <div className="form-row">
                      <div className="form-group-half">
                        <label className="form-label-sm">Puesto</label>
                        <input type="text" className="form-input-sm" value={exp.puesto} onChange={(e) => handleUpdateExperiencia(exp.id, 'puesto', e.target.value)} />
                      </div>
                      <div className="form-group-half">
                        <label className="form-label-sm">Empresa</label>
                        <input type="text" className="form-input-sm" value={exp.empresa} onChange={(e) => handleUpdateExperiencia(exp.id, 'empresa', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group-half">
                        <label className="form-label-sm">Periodo</label>
                        <input type="text" className="form-input-sm" value={exp.fecha} onChange={(e) => handleUpdateExperiencia(exp.id, 'fecha', e.target.value)} />
                      </div>
                      <div className="form-group-half">
                        <label className="form-label-sm">Ubicación</label>
                        <input type="text" className="form-input-sm" value={exp.ubicacion} onChange={(e) => handleUpdateExperiencia(exp.id, 'ubicacion', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group-full">
                      <label className="form-label-sm">Descripción / Logros</label>
                      <textarea className="form-textarea-sm" value={exp.descripcion} onChange={(e) => handleUpdateExperiencia(exp.id, 'descripcion', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button className="btn-add-item" onClick={handleAddExperiencia}>+ Añadir Experiencia</button>
              </div>
            )}
          </div>

          {/* Sección 3: Educación */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('educacion')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <span>Educación ({educacion.length})</span>
              </div>
              <span className={`chevron ${activeSection === 'educacion' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'educacion' && (
              <div className="accordion-content">
                {educacion.map((edu, idx) => (
                  <div key={edu.id} className="exp-card-item">
                    <div className="exp-card-header">
                      <strong>Estudio #{idx + 1}</strong>
                      <button className="btn-remove-item" onClick={() => handleRemoveEducacion(edu.id)}>Eliminar</button>
                    </div>
                    <div className="form-group-full">
                      <label className="form-label-sm">Título / Grado</label>
                      <input type="text" className="form-input-sm" value={edu.titulo} onChange={(e) => handleUpdateEducacion(edu.id, 'titulo', e.target.value)} />
                    </div>
                    <div className="form-row">
                      <div className="form-group-half">
                        <label className="form-label-sm">Institución</label>
                        <input type="text" className="form-input-sm" value={edu.colegio} onChange={(e) => handleUpdateEducacion(edu.id, 'colegio', e.target.value)} />
                      </div>
                      <div className="form-group-half">
                        <label className="form-label-sm">Fecha</label>
                        <input type="text" className="form-input-sm" value={edu.fecha} onChange={(e) => handleUpdateEducacion(edu.id, 'fecha', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn-add-item" onClick={handleAddEducacion}>+ Añadir Educación</button>
              </div>
            )}
          </div>

          {/* Sección 4: Habilidades */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('habilidades')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8M8 12h8"></path>
                </svg>
                <span>Habilidades ({habilidades.length})</span>
              </div>
              <span className={`chevron ${activeSection === 'habilidades' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'habilidades' && (
              <div className="accordion-content">
                <div className="skills-tags-wrapper">
                  {habilidades.map((hab) => (
                    <span key={hab} className="skill-tag-editable">
                      {hab}
                      <span className="skill-tag-remove" onClick={() => handleRemoveHabilidad(hab)}>×</span>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddHabilidad} style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                  <input
                    type="text"
                    className="form-input-sm"
                    placeholder="Ej. Python, Figma, Scrum..."
                    value={nuevaHabilidad}
                    onChange={(e) => setNuevaHabilidad(e.target.value)}
                  />
                  <button type="submit" className="btn-add-item" style={{ width: 'auto', padding: '8px 14px', whiteSpace: 'nowrap' }}>
                    + Añadir
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sección 5: Ajustes de Estilo */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('estilos')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10"></path>
                </svg>
                <span>Ajustes de Estilo</span>
              </div>
              <span className={`chevron ${activeSection === 'estilos' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'estilos' && (
              <div className="accordion-content">
                <label className="form-label-sm">Color de Acento</label>
                <div className="color-palette">
                  {['#1F2937', '#006654', '#0D9488', '#E11D48', '#2563EB', '#7C3AED', '#D97706'].map(col => (
                    <span
                      key={col}
                      className={`color-circle ${estilos.color === col ? 'active-color' : ''}`}
                      style={{ backgroundColor: col }}
                      onClick={() => setEstilos(prev => ({ ...prev, color: col }))}
                    ></span>
                  ))}
                </div>
                <div className="form-group-full" style={{ marginTop: '16px' }}>
                  <label className="form-label-sm">Tipografía</label>
                  <select className="form-input-sm" value={estilos.font} onChange={(e) => setEstilos(prev => ({ ...prev, font: e.target.value }))}>
                    <option value="Inter">Inter (Limpia / Moderna)</option>
                    <option value="Roboto">Roboto (Estándar)</option>
                    <option value="Georgia">Georgia (Elegante / Serif)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Columna Derecha - Documento Vista Previa */}
        <main className="editor-preview-area">
          <div
            className="cv-document-paper"
            style={{ fontFamily: estilos.font === 'Georgia' ? 'Georgia, serif' : `'${estilos.font}', sans-serif` }}
          >
            <header className="cv-doc-header" style={{ borderColor: estilos.color }}>
              <h1 className="cv-doc-name" style={{ color: estilos.color }}>
                {personal.nombre} {personal.apellido}
              </h1>
              <h2 className="cv-doc-role">{personal.titulo}</h2>
              <div className="cv-doc-contact">
                {personal.email && <span>✉ {personal.email}</span>}
                {personal.telefono && <span>📞 {personal.telefono}</span>}
                {personal.ubicacion && <span>📍 {personal.ubicacion}</span>}
                {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
              </div>
            </header>

            {personal.resumen && (
              <section className="cv-doc-section">
                <h3 className="cv-sec-title" style={{ color: estilos.color }}>PERFIL</h3>
                <p className="cv-sec-text">{personal.resumen}</p>
              </section>
            )}

            {experiencias.length > 0 && (
              <section className="cv-doc-section">
                <h3 className="cv-sec-title" style={{ color: estilos.color }}>EXPERIENCIA</h3>
                {experiencias.map(exp => (
                  <div key={exp.id} className="cv-job-item">
                    <div className="cv-job-header">
                      <strong>{exp.puesto}</strong>
                      <span className="cv-job-date">{exp.fecha}</span>
                    </div>
                    <div className="cv-job-company">{exp.empresa}{exp.ubicacion ? ` • ${exp.ubicacion}` : ''}</div>
                    <p className="cv-sec-text" style={{ marginTop: '4px' }}>{exp.descripcion}</p>
                  </div>
                ))}
              </section>
            )}

            <div className="cv-doc-two-cols">
              {habilidades.length > 0 && (
                <section className="cv-doc-section">
                  <h3 className="cv-sec-title" style={{ color: estilos.color }}>HABILIDADES</h3>
                  <p className="cv-sec-text">{habilidades.join(' • ')}</p>
                </section>
              )}

              {educacion.length > 0 && (
                <section className="cv-doc-section">
                  <h3 className="cv-sec-title" style={{ color: estilos.color }}>EDUCACIÓN</h3>
                  {educacion.map(edu => (
                    <div key={edu.id} className="cv-edu-item">
                      <strong>{edu.titulo}</strong>
                      <div>{edu.colegio}</div>
                      <div className="cv-job-date">{edu.fecha}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
