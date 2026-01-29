import React, { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import HomePage from './components/HomePage'
import WorkoutLogForm from './components/WorkoutLogForm'
import ExerciseApiPage from './components/ExerciseApiPage'
import VideoPlayerPage from './components/VideoPlayerPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './components/NotFoundPage'
import Footer from './components/Footer'
import { FaHeart, FaSun, FaMoon, FaBars, FaTimes, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import './App.css'

function App() {
  const favoritesCount = useSelector((state) => state.favorites.items.length)
  const [theme, toggleTheme] = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Update body class based on theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme'
  }, [theme])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    closeMobileMenu()
  }

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <header className="top-navbar">
        <div className="navbar-container">
          {/* Left side: Brand Logo */}
          <div className="navbar-brand">
            <h1 className="navbar-logo">WORKOUT TRACKER</h1>
          </div>

          {/* Center: Navigation Links */}
          <nav className="navbar-nav">
            {user ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
                <span className="nav-separator">|</span>
                <NavLink
                  to="/form"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Build Program
                </NavLink>
                <span className="nav-separator">|</span>
                <NavLink
                  to="/exercises"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Exercise Library
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
                <span className="nav-separator">|</span>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>

          {/* Right side: User Controls */}
          <div className="navbar-controls">
              {favoritesCount > 0 && (
                <span className="favorites-badge">
                  <FaHeart /> {favoritesCount}
                </span>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  title="Logout"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 250ms ease',
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="nav-link"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FaSignInAlt /> Login
                </NavLink>
              )}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {user ? (
              <>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  end
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/form"
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Build Program
                </NavLink>
                <NavLink
                  to="/exercises"
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Exercise Library
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'right',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink 
                to="/login" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
            )}
          </div>
        )}
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <WorkoutLogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises"
            element={
              <ProtectedRoute>
                <ExerciseApiPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercises/:muscle"
            element={
              <ProtectedRoute>
                <VideoPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
