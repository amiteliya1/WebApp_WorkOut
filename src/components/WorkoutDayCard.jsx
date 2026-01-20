import React from 'react';

const WorkoutDayCard = ({ workout, onToggle, isSelected }) => {
    return (
        <li
            onClick={() => onToggle(workout.day)}
            className={`workout-day-card ${isSelected ? 'selected' : ''}`}
            style={{
                cursor: 'pointer',
                textDecoration: workout.completed ? 'line-through' : 'none',
                padding: '10px',
                borderBottom: '1px solid #ccc',
                backgroundColor: workout.completed ? '#e0e0e0' : 'transparent',
            }}
        >
            <strong>{workout.day}:</strong> {workout.focus}
            {workout.completed && ' ✅'}
        </li>
    );
};

export default WorkoutDayCard;
