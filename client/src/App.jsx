import React, { useEffect, useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from './hooks/useTheme'
import HomePage from './components/HomePage'
import WorkoutLogForm from './components/WorkoutLogForm'
import ExerciseApiPage from './components/ExerciseApiPage'
import VideoPlayerPage from './components/VideoPlayerPage'
import NotFoundPage from './components/NotFoundPage'
import { FaHeart, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'
import './App.css'

function App() {
  const favoritesCount = useSelector((state) => state.favorites.items.length)
  const [theme, toggleTheme] = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // עדכון class של body לפי theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme'
  }, [theme])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div style={{ margin: 0, padding: 0, width: '100%' }}>
      <header className="top-navbar">
        <div className="navbar-container">
          {/* Right side (RTL): Navigation Links */}
          <nav className="navbar-nav">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
              onClick={closeMobileMenu}
            >
              בית
            </NavLink>
            <span className="nav-separator">|</span>
            <NavLink 
              to="/form" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              בניית תוכנית
            </NavLink>
            <span className="nav-separator">|</span>
            <NavLink 
              to="/exercises" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              ספריית תרגילים
            </NavLink>
          </nav>

          {/* Left side (RTL): Brand + Controls */}
          <div className="navbar-left-group">
            <div className="navbar-brand">
              <h1 className="navbar-logo">WORKOUT TRACKER</h1>
            </div>
            <div className="navbar-controls">
              {favoritesCount > 0 && (
                <span className="favorites-badge">
                  <FaHeart /> {favoritesCount}
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={theme === 'light' ? 'עבור למצב כהה' : 'עבור למצב בהיר'}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="תפריט"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <NavLink 
              to="/" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              end
              onClick={closeMobileMenu}
            >
              בית
            </NavLink>
            <NavLink 
              to="/form" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              בניית תוכנית
            </NavLink>
            <NavLink 
              to="/exercises" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              ספריית תרגילים
            </NavLink>
          </div>
        )}
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<WorkoutLogForm />} />
          <Route path="/exercises" element={<ExerciseApiPage />} />
          <Route path="/exercises/:muscle" element={<VideoPlayerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
