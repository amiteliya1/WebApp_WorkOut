import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaArrowRight, FaCalendar, FaClock } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/workouts/${id}`);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading message="טוען אימון..." />;
  if (error) return <ErrorState message={error} />;
  if (!workout) return <ErrorState message="אימון לא נמצא" />;

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="workout-detail">
          <div className="workout-detail-header">
            <Link to="/" className="back-link">
              <FaArrowRight /> חזרה לרשימה
            </Link>
            <Link to={`/edit/${id}`} className="btn-primary">
              <FaEdit /> ערוך
            </Link>
          </div>

          <div className="workout-detail-card">
            <h1>{workout.title}</h1>
            <div className="workout-detail-info">
              <div className="info-item">
                <FaClock />
                <span>{workout.duration} דקות</span>
              </div>
              <div className="info-item">
                <FaCalendar />
                <span>{formatDate(workout.date)}</span>
              </div>
            </div>
            {workout.notes && (
              <div className="workout-detail-notes">
                <h3>הערות:</h3>
                <p>{workout.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutDetailPage;

