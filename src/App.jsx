import { useState } from 'react'
import Layout from './components/Layout'
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

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === 'Exercises') {
      setSelectedMuscle(null);
    }
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
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  )
}

export default App
