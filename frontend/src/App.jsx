/**
 * App.jsx — Root with ThemeProvider + AuthProvider + Router
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import QuestionDetail from './pages/QuestionDetail'
import Progress from './pages/Progress'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected — share Navbar layout */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/question/:id" element={<QuestionDetail />} />
                <Route path="/progress"     element={<Progress />} />
                <Route path="*"             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
