import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaClock, FaCalendar } from 'react-icons/fa';

const WorkoutCard = ({ workout, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="workout-card">
      <div className="workout-card-header">
        <h3>{workout.title}</h3>
        <div className="workout-card-actions">
          <Link to={`/edit/${workout._id}`} className="btn-icon" title="ערוך">
            <FaEdit />
          </Link>
          <button
            onClick={() => {
              if (window.confirm('האם אתה בטוח שברצונך למחוק את האימון הזה?')) {
                onDelete(workout._id);
              }
            }}
            className="btn-icon btn-danger"
            title="מחק"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="workout-card-body">
        <div className="workout-info-item">
          <FaClock /> <span>{workout.duration} דקות</span>
        </div>
        <div className="workout-info-item">
          <FaCalendar /> <span>{formatDate(workout.date)}</span>
        </div>
        {workout.notes && (
          <div className="workout-notes">
            <p>{workout.notes}</p>
          </div>
        )}
      </div>
      <Link to={`/workouts/${workout._id}`} className="workout-card-link">
        צפה בפרטים
      </Link>
    </div>
  );
};

export default WorkoutCard;

