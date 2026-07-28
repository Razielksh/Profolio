import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './CreacionDoc.css';

export default function CreacionDoc() {
  const [activeSection, setActiveSection] = useState('personal');

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="editor-page">
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

          <nav className="editor-nav-links">
            <Link to="/dashboard" className="nav-link nav-link-active">Mis CVs</Link>
            <Link to="/plantillas" className="nav-link">Plantillas</Link>
          </nav>
        </div>

        <div className="editor-nav-right">
          <button className="icon-action-btn" title="Compartir enlace">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </button>

          <button className="btn-descargar-pdf">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Descargar PDF
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

      {/* Contenido Principal: Formulario a la izquierda y Vista Previa a la derecha */}
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
                    <input type="text" className="form-input-sm" defaultValue="Jane" />
                  </div>
                  <div className="form-group-half">
                    <label className="form-label-sm">Apellido</label>
                    <input type="text" className="form-input-sm" defaultValue="Doe" />
                  </div>
                </div>

                <div className="form-group-full">
                  <label className="form-label-sm">Título profesional</label>
                  <input type="text" className="form-input-sm" defaultValue="Senior Software Engineer" />
                </div>

                <div className="form-row">
                  <div className="form-group-half">
                    <label className="form-label-sm">Email</label>
                    <input type="email" className="form-input-sm" defaultValue="jane.doe@example.com" />
                  </div>
                  <div className="form-group-half">
                    <label className="form-label-sm">Teléfono</label>
                    <input type="text" className="form-input-sm" defaultValue="+1 (555) 123-4567" />
                  </div>
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
                <span>Experiencia</span>
              </div>
              <span className={`chevron ${activeSection === 'experiencia' ? 'open' : ''}`}>›</span>
            </button>

            {activeSection === 'experiencia' && (
              <div className="accordion-content">
                <div className="exp-card-item">
                  <strong>Tech Corp Inc.</strong>
                  <p>Lead Developer • 2020 - Present</p>
                </div>
                <button className="btn-add-item">
                  + Añadir Experiencia
                </button>
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
                <span>Educación</span>
              </div>
              <span className={`chevron ${activeSection === 'educacion' ? 'open' : ''}`}>›</span>
            </button>
          </div>

          {/* Sección 4: Habilidades */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleSection('habilidades')}>
              <div className="accordion-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8M8 12h8"></path>
                </svg>
                <span>Habilidades</span>
              </div>
              <span className={`chevron ${activeSection === 'habilidades' ? 'open' : ''}`}>›</span>
            </button>
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
                <label className="form-label-sm">Color Principal</label>
                <div className="color-palette">
                  <span className="color-circle active-color" style={{ backgroundColor: '#1F2937' }}></span>
                  <span className="color-circle" style={{ backgroundColor: '#006654' }}></span>
                  <span className="color-circle" style={{ backgroundColor: '#0D9488' }}></span>
                  <span className="color-circle" style={{ backgroundColor: '#E11D48' }}></span>
                  <span className="color-circle add-color">+</span>
                </div>

                <div className="form-group-full" style={{ marginTop: '16px' }}>
                  <label className="form-label-sm">Tipografía</label>
                  <select className="form-input-sm">
                    <option>Inter / Inter</option>
                    <option>Roboto / Roboto</option>
                    <option>Outfit / Outfit</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Columna Derecha - Documento de Vista Previa */}
        <main className="editor-preview-area">
          <div className="cv-document-paper">
            <header className="cv-doc-header">
              <h1 className="cv-doc-name">Jane Doe</h1>
              <h2 className="cv-doc-role">Senior Software Engineer</h2>
              <div className="cv-doc-contact">
                <span>✉ jane.doe@example.com</span>
                <span>📞 +1 (555) 123-4567</span>
                <span>📍 San Francisco, CA</span>
                <span>🔗 linkedin.com/in/janedoe</span>
              </div>
            </header>

            <section className="cv-doc-section">
              <h3 className="cv-sec-title">PERFIL</h3>
              <p className="cv-sec-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </section>

            <section className="cv-doc-section">
              <h3 className="cv-sec-title">EXPERIENCIA</h3>

              <div className="cv-job-item">
                <div className="cv-job-header">
                  <strong>Lead Developer</strong>
                  <span className="cv-job-date">2020 - Presente</span>
                </div>
                <div className="cv-job-company">Tech Corp Inc. • San Francisco, CA</div>
                <ul className="cv-job-bullets">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                  <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                  <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
                </ul>
              </div>

              <div className="cv-job-item">
                <div className="cv-job-header">
                  <strong>Software Engineer</strong>
                  <span className="cv-job-date">2016 - 2020</span>
                </div>
                <div className="cv-job-company">Innovate Solutions • Austin, TX</div>
                <ul className="cv-job-bullets">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                  <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                </ul>
              </div>
            </section>

            <div className="cv-doc-two-cols">
              <section className="cv-doc-section">
                <h3 className="cv-sec-title">HABILIDADES</h3>
                <p className="cv-skill-group">
                  <strong>Languages:</strong> JavaScript, TypeScript, Python, Java, SQL
                </p>
                <p className="cv-skill-group">
                  <strong>Frameworks:</strong> React, Node.js, Express, Next.js, Django
                </p>
                <p className="cv-skill-group">
                  <strong>Tools & DevOps:</strong> Git, Docker, AWS, CI/CD, Jest
                </p>
              </section>

              <section className="cv-doc-section">
                <h3 className="cv-sec-title">EDUCACIÓN</h3>
                <div className="cv-edu-item">
                  <strong>B.S. Computer Science</strong>
                  <div>University of Technology</div>
                  <div className="cv-job-date">Graduated: 2016</div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
