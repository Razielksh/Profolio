import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/pages/Login'
import Create_account from './components/pages/Create_account'
import Dashboard from './components/pages/Dashboard'
import Forgot from './components/pages/Forgot'
import New_password from './components/pages/New_password'
import CreacionDoc from './components/pages/CreacionDoc'
import Perfil from './components/pages/Perfil'
import GestionUsuarios from './components/pages/GestionUsuarios'
import Directorio from './components/pages/Directorio'
import CvsGuardados from './components/pages/CvsGuardados'
import VerCvReclutador from './components/pages/VerCvReclutador'
import './App.css'

// Componente simple para proteger rutas
function ProtectedRoute({ children, allowedRoles }) {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuario_activo') || 'null');

  if (!usuarioActivo) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuarioActivo.rol)) {
    // Si no tiene el rol necesario, redirige a su dashboard principal
    if (usuarioActivo.rol === 'Admin') return <Navigate to="/admin/usuarios" replace />;
    if (usuarioActivo.rol === 'Reclutador') return <Navigate to="/reclutador/directorio" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/crear-cuenta" element={<Create_account />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/new-password" element={<New_password />} />

        {/* Rutas protegidas (Usuario) */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['Usuario', 'Admin', 'Reclutador']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/creacion-doc" element={
          <ProtectedRoute allowedRoles={['Usuario', 'Admin', 'Reclutador']}>
            <CreacionDoc />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute allowedRoles={['Usuario', 'Admin', 'Reclutador']}>
            <Perfil />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas (Admin) */}
        <Route path="/admin/usuarios" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <GestionUsuarios />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas (Reclutador) */}
        <Route path="/reclutador/directorio" element={
          <ProtectedRoute allowedRoles={['Reclutador', 'Admin']}>
            <Directorio />
          </ProtectedRoute>
        } />
        <Route path="/reclutador/guardados" element={
          <ProtectedRoute allowedRoles={['Reclutador', 'Admin']}>
            <CvsGuardados />
          </ProtectedRoute>
        } />
        <Route path="/reclutador/ver-cv" element={
          <ProtectedRoute allowedRoles={['Reclutador', 'Admin']}>
            <VerCvReclutador />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
