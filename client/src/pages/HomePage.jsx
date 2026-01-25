import React, { useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import WorkoutList from '../components/WorkoutList';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const { data: workouts, loading, error, deleteWorkout, refetch } = useWorkouts();
  const [searchTerm, setSearchTerm] = useLocalStorage('lastSearch', '');

  const handleDelete = async (id) => {
    const result = await deleteWorkout(id);
    if (result.success) {
      refetch();
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>האימונים שלי</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="חפש אימון..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <WorkoutList
          workouts={workouts}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          onRetry={refetch}
        />
      </main>
    </div>
  );
};

export default HomePage;

