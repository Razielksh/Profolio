import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        {/* Encabezado */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">¡Bienvenido de nuevo, Alex!</h1>
            <p className="dashboard-subtitle">Aquí están tus CVs recientes y borradores.</p>
          </div>
          <Link to="/creacion-doc" className="btn-crear-cv" style={{ textDecoration: 'none', display: 'inline-block' }}>
            + Crear nuevo CV
          </Link>
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

        {/* Estado vacío */}
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#006654" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h2 className="empty-title">Aún no tienes ningún CV</h2>
          <p className="empty-subtitle">Crea tu primer currículum y empieza a destacar.</p>
          <Link to="/creacion-doc" className="btn-crear-cv" style={{ textDecoration: 'none', display: 'inline-block' }}>
            + Crear mi primer CV
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        © 2024 CVGenerador.
      </footer>
    </div>
  );
}
