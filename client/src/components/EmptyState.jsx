import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <FaDumbbell className="empty-icon" />
      <h3>No workouts yet</h3>
      <p>Start creating new workouts</p>
      <Link to="/new" className="btn-primary">
        Create New Workout
      </Link>
    </div>
  );
};

export default EmptyState;

