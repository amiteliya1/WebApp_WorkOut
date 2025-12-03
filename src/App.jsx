import { useState } from 'react'
import HomePage from './components/HomePage'
import WorkoutLogForm from './components/WorkoutLogForm'
import ExerciseApiPage from './components/ExerciseApiPage'
import VideoPlayerPage from './components/VideoPlayerPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const handleMuscleSelect = (muscleName) => {
    setSelectedMuscle(muscleName);
    setCurrentPage('Exercises');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <HomePage />;
      case 'Form':
        return <WorkoutLogForm />;
      case 'Exercises':
        if (selectedMuscle) {
          return <VideoPlayerPage searchTerm={selectedMuscle} />;
        }
        return <ExerciseApiPage setMuscleAndNavigate={handleMuscleSelect} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '30px', fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>WORKOUT TRACKER</h1>
      <nav className="nav-container">
        <button
          onClick={() => setCurrentPage('Home')}
          className={`nav-btn ${currentPage === 'Home' ? 'active' : ''}`}
        >
          בית
        </button>
        <button
          onClick={() => setCurrentPage('Form')}
          className={`nav-btn ${currentPage === 'Form' ? 'active' : ''}`}
        >
          טופס
        </button>
        <button
          onClick={() => {
            setCurrentPage('Exercises');
            setSelectedMuscle(null);
          }}
          className={`nav-btn ${currentPage === 'Exercises' ? 'active' : ''}`}
        >
          ספריית תרגילים
        </button>
      </nav>

      {renderPage()}
    </div>
  )
}

export default App
