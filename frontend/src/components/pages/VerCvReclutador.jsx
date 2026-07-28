import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import './VerCvReclutador.css';

export default function VerCvReclutador() {
  const [showModalContact, setShowModalContact] = useState(false);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  const [channelWhatsapp, setChannelWhatsapp] = useState(false);
  const [sentNotification, setSentNotification] = useState(false);

  return (
    <div className="view-cv-page">
      {/* Navbar Superior */}
      <header className="view-cv-navbar">
        <div className="view-cv-nav-left">
          <Link to="/reclutador/directorio" className="back-btn" title="Volver al directorio">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>

          <div className="brand-logo">
            <img src={profolioIcon} alt="Logo Profolio" className="brand-icon-sm" />
            <span className="brand-name-sm">Profolio</span>
          </div>
        </div>

        <div className="view-cv-nav-right">
          <button className="btn-contactar" onClick={() => setShowModalContact(true)}>
            Contactar Candidato
          </button>
          <button className="btn-descargar-pdf">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Descargar PDF
          </button>
        </div>
      </header>

      {sentNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: '600',
          fontSize: '0.95rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✓ Mensaje enviado exitosamente a Alex Morgan
        </div>
      )}

      {/* Contenido Hoja de CV de Alex Morgan */}
      <main className="view-cv-body">
        <div className="cv-paper-document">
          {/* Header de Alex Morgan */}
          <div className="cv-header-row">
            <div>
              <h1 className="cv-name">Alex Morgan</h1>
              <h2 className="cv-role">Senior Frontend Developer</h2>
            </div>
            <div className="cv-contact-col">
              <div>📍 San Francisco, CA</div>
              <div>✉ alex.morgan@example.com</div>
              <div>🌐 portfolio.dev</div>
            </div>
          </div>

          <hr className="cv-line" />

          {/* Resumen Profesional */}
          <section className="cv-section">
            <h3 className="cv-sec-heading">Resumen Profesional</h3>
            <p className="cv-sec-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </section>

          {/* Experiencia */}
          <section className="cv-section">
            <h3 className="cv-sec-heading">Experiencia</h3>

            <div className="cv-exp-item">
              <div className="cv-exp-top">
                <strong>TechNova Solutions</strong>
                <span className="cv-exp-date">Oct 2020 – Actualidad</span>
              </div>
              <div className="cv-exp-role">Lead Frontend Engineer</div>
              <ul className="cv-exp-bullets">
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
              </ul>
            </div>

            <div className="cv-exp-item">
              <div className="cv-exp-top">
                <strong>Creative Digital Agency</strong>
                <span className="cv-exp-date">Jun 2017 – Sep 2020</span>
              </div>
              <div className="cv-exp-role">Frontend Developer</div>
              <ul className="cv-exp-bullets">
                <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                <li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui.</li>
                <li>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam.</li>
              </ul>
            </div>
          </section>

          {/* Habilidades */}
          <section className="cv-section">
            <h3 className="cv-sec-heading">Habilidades</h3>
            <div className="cv-skills-pills">
              <span className="skill-chip">React</span>
              <span className="skill-chip">TypeScript</span>
              <span className="skill-chip">Next.js</span>
              <span className="skill-chip">Tailwind CSS</span>
              <span className="skill-chip">GraphQL</span>
              <span className="skill-chip">Jest</span>
              <span className="skill-chip">CI/CD</span>
            </div>
          </section>

          {/* Educación */}
          <section className="cv-section">
            <h3 className="cv-sec-heading">Educación</h3>
            <div className="cv-exp-top">
              <strong>University of California, Berkeley</strong>
              <span className="cv-exp-date">2013 – 2017</span>
            </div>
            <div className="cv-exp-role">B.S. Computer Science</div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="view-cv-footer">
        © 2024 CVGenerador. Todos los derechos reservados. &nbsp;&nbsp; Términos de Servicio &nbsp;&nbsp; Política de Privacidad
      </footer>

      {/* MODAL CONTACTAR (contactar_user_reclutador.png) */}
      {showModalContact && (
        <div className="contact-modal-backdrop">
          <div className="contact-modal-card">
            <div className="contact-modal-header">
              <h2 className="contact-modal-title">Contactar a Alex Morgan</h2>
              <button className="close-btn" onClick={() => setShowModalContact(false)}>✕</button>
            </div>

            <div className="contact-modal-body">
              <div className="form-group-modal">
                <label className="modal-label">Mensaje</label>
                <textarea
                  className="modal-textarea"
                  rows="4"
                  placeholder="Escribe un mensaje profesional..."
                ></textarea>
              </div>

              <div className="form-group-modal">
                <label className="modal-label">Canales de contacto</label>

                {/* Email Option */}
                <div
                  className={`channel-option ${channelEmail ? 'channel-selected' : ''}`}
                  onClick={() => setChannelEmail(!channelEmail)}
                >
                  <div className="channel-info">
                    <span className="channel-icon">✉</span>
                    <span>Correo electrónico</span>
                  </div>
                  <input type="checkbox" checked={channelEmail} readOnly />
                </div>

                {/* SMS Option */}
                <div
                  className={`channel-option ${channelSms ? 'channel-selected' : ''}`}
                  onClick={() => setChannelSms(!channelSms)}
                >
                  <div className="channel-info">
                    <span className="channel-icon">💬</span>
                    <span>SMS</span>
                  </div>
                  <input type="checkbox" checked={channelSms} readOnly />
                </div>

                {/* WhatsApp Option */}
                <div
                  className={`channel-option ${channelWhatsapp ? 'channel-selected' : ''}`}
                  onClick={() => setChannelWhatsapp(!channelWhatsapp)}
                >
                  <div className="channel-info">
                    <span className="channel-icon">💬</span>
                    <span>WhatsApp</span>
                  </div>
                  <input type="checkbox" checked={channelWhatsapp} readOnly />
                </div>
              </div>
            </div>

            <div className="contact-modal-footer">
              <span className="modal-disclaimer">
                El candidato recibirá tu mensaje a través de los canales seleccionados.
              </span>

              <div className="modal-footer-btns">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModalContact(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-modal-send"
                  onClick={() => {
                    setSentNotification(true);
                    setShowModalContact(false);
                    setTimeout(() => setSentNotification(false), 4000);
                  }}
                >
                  ▷ Enviar mensaje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
