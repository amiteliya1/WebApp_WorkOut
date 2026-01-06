import React, { useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTheme } from './hooks/useTheme'
import HomePage from './components/HomePage'
import WorkoutLogForm from './components/WorkoutLogForm'
import ExerciseApiPage from './components/ExerciseApiPage'
import VideoPlayerPage from './components/VideoPlayerPage'
import NotFoundPage from './components/NotFoundPage'
import { FaHeart, FaSun, FaMoon } from 'react-icons/fa'
import './App.css'

function App() {
  const favoritesCount = useSelector((state) => state.favorites.items.length)
  const [theme, toggleTheme] = useTheme()

  // עדכון class של body לפי theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme'
  }, [theme])

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px' }}>
          <h1 className="site-title">WORKOUT TRACKER</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {favoritesCount > 0 && (
              <span style={{ 
                color: '#e91e63', 
                fontSize: '1.2rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                fontWeight: 'bold'
              }}>
                <FaHeart /> {favoritesCount}
              </span>
            )}
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-color)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '5px 10px'
              }}
              title={theme === 'light' ? 'עבור למצב כהה' : 'עבור למצב בהיר'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
        <nav className="nav-container">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            end
          >
            בית
          </NavLink>
          <NavLink 
            to="/form" 
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            בניית תוכנית
          </NavLink>
          <NavLink 
            to="/exercises" 
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            ספריית תרגילים
          </NavLink>
        </nav>
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
    </>
  )
}

export default App
