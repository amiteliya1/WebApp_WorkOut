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
    console.log('🚀 NewWorkoutPage handleSubmit called');
    console.log('📋 Received formData:', formData);
    console.log('🔍 createWorkout function exists?', typeof createWorkout === 'function');
    
    setLoading(true);
    console.log('⏳ Calling createWorkout...');
    const result = await createWorkout(formData);
    console.log('📦 createWorkout result:', result);
    setLoading(false);

    if (result.success) {
      console.log('✅ Success! Navigating to home...');
      navigate('/');
    } else {
      console.log('❌ Error:', result.error);
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

