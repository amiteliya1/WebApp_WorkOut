import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWorkouts } from '../hooks/useWorkouts';
import WorkoutForm from '../components/WorkoutForm';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

// Get API URL - use relative path for same-origin deployment
const getApiUrl = () => {
  // In production (served from same server), use relative path
  // In development, use environment variable or localhost
  if (import.meta.env.PROD) {
    return '/api';
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

const EditWorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateWorkout } = useWorkouts();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/workouts/${id}`);
        setWorkout(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load workout');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkout();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    const result = await updateWorkout(id, formData);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      alert(`שגיאה: ${result.error}`);
    }
  };

  if (loading) return <Loading message="טוען אימון..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <WorkoutForm
          onSubmit={handleSubmit}
          initialData={workout}
          loading={submitting}
        />
      </main>
    </div>
  );
};

export default EditWorkoutPage;

