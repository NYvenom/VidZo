import { useState } from 'react'
import './App.css'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>

        <AuthProvider>

        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Authentication />} />
        </Routes>
        </AuthProvider>

      </Router>
    </>
  )
}

export default App
