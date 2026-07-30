import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import profolioIcon from '../../assets/profolio_icon.svg';
import { cvService, contactService } from '../../services/api';
import './VerCvReclutador.css';

export default function VerCvReclutador() {
  const [searchParams] = useSearchParams();
  const cvId = searchParams.get('cvId');

  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalContact, setShowModalContact] = useState(false);
  const [mensajeContacto, setMensajeContacto] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);
  const [channelWhatsapp, setChannelWhatsapp] = useState(false);
  const [sentNotification, setSentNotification] = useState(false);

  useEffect(() => {
    if (cvId) {
      setLoading(true);
      const numericId = parseInt(cvId, 10);
      
      if (!isNaN(numericId)) {
        // Cargar desde la base de datos
        cvService.getPublicCvById(numericId)
          .then(data => {
            setCvData(data);
          })
          .catch(err => {
            console.error('Error al cargar CV real público:', err);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [cvId]);

  // Datos procesados desde el backend (o demo solo si no existe cvData en absoluto)
  const isRealCv = cvData !== null;

  const personal = {
    nombre: isRealCv ? (cvData.nombreContacto || 'Sin nombre') : 'Alex Morgan',
    titulo: isRealCv ? (cvData.tituloProfesional || cvData.titulo || 'Sin título profesional') : 'Senior Frontend Developer',
    email: cvData?.email || 'alex.morgan@example.com',
    telefono: cvData?.telefono || '+52 (55) 0000-0000',
    ubicacion: cvData?.ubicacion || 'México',
    linkedin: cvData?.linkedinUrl || '',
    resumen: isRealCv ? (cvData.resumen || '') : 'Desarrollador de software apasionado con más de 6 años de experiencia en la creación de aplicaciones web escalables y eficientes.'
  };

  const experiencias = isRealCv
    ? (cvData.experiencias || [])
    : [
        {
          id: 1,
          empresa: 'TechNova Solutions',
          puesto: 'Lead Engineer',
          fecha: 'Oct 2020 – Actualidad',
          descripcion: 'Lideré el equipo de desarrollo, optimizando el rendimiento de la aplicación en un 40% e implementando CI/CD.'
        }
      ];

  const habilidades = isRealCv
    ? (cvData.habilidades || []).map(h => typeof h === 'string' ? h : h.nombre)
    : ['React', 'JavaScript', 'Node.js', 'SQL'];

  const educacion = isRealCv
    ? (cvData.educacion || [])
    : [
        {
          id: 1,
          titulo: 'Licenciatura en Ciencias de la Computación',
          colegio: 'Universidad Nacional',
          fecha: '2015 - 2019'
        }
      ];

  const handleEnviarContacto = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    const textoMensaje = mensajeContacto || `Hola ${personal.nombre}, hemos revisado tu perfil en Profolio y estamos interesados en agendar una entrevista con nuestro equipo.`;

    try {
      if (channelEmail) {
        await contactService.enviarCorreoContacto({
          to: personal.email,
          subject: `Oportunidad laboral: Profolio se interesa en tu perfil (${personal.titulo})`,
          message: textoMensaje,
        });
      }

      setShowModalContact(false);
      setSentNotification(true);
      setTimeout(() => setSentNotification(false), 4000);
    } catch (error) {
      console.error('Error enviando contacto:', error);
      alert('⚠️ ' + error.message);
    } finally {
      setSendingEmail(false);
    }
  };

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
          <button className="btn-descargar-pdf" onClick={() => window.print()}>
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
          backgroundColor: '#006654',
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
          ✓ Mensaje enviado exitosamente a {personal.nombre} {personal.apellido}
        </div>
      )}

      {/* Contenido Hoja de CV */}
      <main className="view-cv-body">
        <div className="cv-paper-document">
          {/* Header del Candidato */}
          <div className="cv-header-row">
            <div>
              <h1 className="cv-name">{personal.nombre} {personal.apellido}</h1>
              <h2 className="cv-role">{personal.titulo || 'Profesional'}</h2>
            </div>
            <div className="cv-contact-col">
              {personal.ubicacion && <div>📍 {personal.ubicacion}</div>}
              {personal.email && <div>✉ {personal.email}</div>}
              {personal.telefono && <div>📞 {personal.telefono}</div>}
              {personal.linkedin && <div>🔗 {personal.linkedin}</div>}
            </div>
          </div>

          <hr className="cv-line" />

          {/* Resumen Profesional */}
          {personal.resumen && (
            <section className="cv-section">
              <h3 className="cv-sec-heading">Resumen Profesional</h3>
              <p className="cv-sec-text">{personal.resumen}</p>
            </section>
          )}

          {/* Experiencia */}
          {experiencias.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-sec-heading">Experiencia</h3>
              {experiencias.map((exp, idx) => (
                <div key={exp.id || idx} className="cv-exp-item">
                  <div className="cv-exp-top">
                    <strong>{exp.empresa}</strong>
                    <span className="cv-exp-date">{exp.fecha}</span>
                  </div>
                  <div className="cv-exp-role">{exp.puesto} {exp.ubicacion ? `• ${exp.ubicacion}` : ''}</div>
                  <p className="cv-sec-text" style={{ marginTop: '4px' }}>{exp.descripcion}</p>
                </div>
              ))}
            </section>
          )}

          {/* Habilidades */}
          {habilidades.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-sec-heading">Habilidades</h3>
              <div className="cv-skills-pills">
                {habilidades.map((hab, idx) => (
                  <span key={idx} className="skill-chip">{hab}</span>
                ))}
              </div>
            </section>
          )}

          {/* Educación */}
          {educacion.length > 0 && (
            <section className="cv-section">
              <h3 className="cv-sec-heading">Educación</h3>
              {educacion.map((edu, idx) => (
                <div key={edu.id || idx} className="cv-exp-item">
                  <div className="cv-exp-top">
                    <strong>{edu.titulo}</strong>
                    <span className="cv-exp-date">{edu.fecha}</span>
                  </div>
                  <div className="cv-exp-role">{edu.colegio}</div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* Modal Contactar Candidato */}
      {showModalContact && (
        <div className="contact-modal-backdrop" onClick={() => setShowModalContact(false)}>
          <div className="contact-modal-card" onClick={e => e.stopPropagation()}>

            {/* Header del Modal */}
            <div className="contact-modal-header">
              <h3 className="contact-modal-title">Contactar a {personal.nombre} {personal.apellido}</h3>
              <button className="close-btn" onClick={() => setShowModalContact(false)}>✕</button>
            </div>

            <form onSubmit={handleEnviarContacto}>
              {/* Textarea del mensaje */}
              <div className="form-group-modal">
                <label className="modal-label">Mensaje</label>
                <textarea
                  className="modal-textarea"
                  rows="4"
                  placeholder="Escribe un mensaje profesional..."
                  value={mensajeContacto}
                  onChange={(e) => setMensajeContacto(e.target.value)}
                ></textarea>
              </div>

              {/* Canales de contacto */}
              <div className="form-group-modal">
                <label className="modal-label">Canales de contacto</label>

                <label className={`channel-option ${channelEmail ? 'channel-selected' : ''}`} onClick={() => setChannelEmail(!channelEmail)}>
                  <div className="channel-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={channelEmail ? '#006654' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Correo electrónico
                  </div>
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={() => {}}
                    style={{ accentColor: '#006654', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>

                <label className={`channel-option ${channelSms ? 'channel-selected' : ''}`} onClick={() => setChannelSms(!channelSms)}>
                  <div className="channel-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={channelSms ? '#006654' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    SMS
                  </div>
                  <input
                    type="checkbox"
                    checked={channelSms}
                    onChange={() => {}}
                    style={{ accentColor: '#006654', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>

                <label className={`channel-option ${channelWhatsapp ? 'channel-selected' : ''}`} onClick={() => setChannelWhatsapp(!channelWhatsapp)}>
                  <div className="channel-info">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={channelWhatsapp ? '#006654' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    WhatsApp
                  </div>
                  <input
                    type="checkbox"
                    checked={channelWhatsapp}
                    onChange={() => {}}
                    style={{ accentColor: '#006654', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Footer del Modal */}
              <div className="contact-modal-footer">
                <p className="modal-disclaimer">
                  El candidato recibirá tu mensaje a través de los canales seleccionados.
                </p>
                <div className="modal-footer-btns">
                  <button type="button" className="close-btn" style={{ padding: '9px 18px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.88rem', fontWeight: '600', color: '#374151', cursor: 'pointer' }} onClick={() => setShowModalContact(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-modal-submit" disabled={sendingEmail}>
                    {sendingEmail ? 'Enviando correo...' : 'Enviar Mensaje'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
