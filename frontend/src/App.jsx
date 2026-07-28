import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/crear-cuenta" element={<Create_account />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/new-password" element={<New_password />} />
        <Route path="/creacion-doc" element={<CreacionDoc />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin/usuarios" element={<GestionUsuarios />} />
        <Route path="/reclutador/directorio" element={<Directorio />} />
        <Route path="/reclutador/guardados" element={<CvsGuardados />} />
        <Route path="/reclutador/ver-cv" element={<VerCvReclutador />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
