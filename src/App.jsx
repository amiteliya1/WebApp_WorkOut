import { Routes, Route, NavLink } from 'react-router-dom'
import HomePage from './components/HomePage'
import WorkoutLogForm from './components/WorkoutLogForm'
import ExerciseApiPage from './components/ExerciseApiPage'
import VideoPlayerPage from './components/VideoPlayerPage'
import NotFoundPage from './components/NotFoundPage'
import './App.css'

function App() {
  return (
    <>
      <header className="app-header">
        <h1 className="site-title">WORKOUT TRACKER</h1>
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
            טופס
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
