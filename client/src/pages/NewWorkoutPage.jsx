import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import WorkoutForm from '../components/WorkoutForm';
import Navbar from '../components/Navbar';

const NewWorkoutPage = () => {
  const navigate = useNavigate();
  const { createWorkout } = useWorkouts();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    const result = await createWorkout(formData);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      alert(`שגיאה: ${result.error}`);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <WorkoutForm onSubmit={handleSubmit} loading={loading} />
      </main>
    </div>
  );
};

export default NewWorkoutPage;

