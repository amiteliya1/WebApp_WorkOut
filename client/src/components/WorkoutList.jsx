import React from 'react';
import { Link } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';
import Loading from './Loading';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

const WorkoutList = ({ workouts, loading, error, onDelete, searchTerm = '', onRetry = null }) => {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!workouts || workouts.length === 0) return <EmptyState />;

  const filteredWorkouts = workouts.filter((workout) =>
    workout.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredWorkouts.length === 0) {
    return (
      <div className="empty-state">
        <p>לא נמצאו אימונים התואמים לחיפוש "{searchTerm}"</p>
        <Link to="/new" className="btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>
          צור אימון חדש
        </Link>
      </div>
    );
  }

  return (
    <div className="workout-list">
      {filteredWorkouts.map((workout) => (
        <WorkoutCard key={workout._id} workout={workout} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WorkoutList;

