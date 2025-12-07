import React from 'react';

const WorkoutDayCard = ({ workout, onToggle }) => {
    return (
        <div
            className={`workout-card ${workout.completed ? 'completed' : ''}`}
            onClick={() => onToggle(workout.id)}
        >
            <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>{workout.day}</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{workout.focus}</p>
            {workout.completed && <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>הושלם ✅</span>}
        </div>
    );
};

export default WorkoutDayCard;
