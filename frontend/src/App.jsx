import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/pages/Login'
import Create_account from './components/pages/Create_account'
import Dashboard from './components/pages/Dashboard'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/crear-cuenta" element={<Create_account />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
