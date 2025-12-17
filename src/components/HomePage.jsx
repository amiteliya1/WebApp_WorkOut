import React, { useState } from 'react';
import WorkoutDayCard from './WorkoutDayCard';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart, FaTrash } from 'react-icons/fa';

const WEEKLY_WORKOUT = [
    { id: 1, day: 'ראשון', focus: 'חזה וכתפיים', completed: false },
    { id: 2, day: 'שני', focus: 'גב ויד קדמית', completed: false },
    { id: 3, day: 'שלישי', focus: 'רגליים ובטן', completed: false },
    { id: 4, day: 'רביעי', focus: 'מנוחה / אירובי קל', completed: false },
    { id: 5, day: 'חמישי', focus: 'גוף עליון (Upper)', completed: false },
    { id: 6, day: 'שישי', focus: 'גוף תחתון (Lower)', completed: false },
    { id: 7, day: 'שבת', focus: 'מנוחה', completed: false },
];

const HomePage = () => {
    const workouts = WEEKLY_WORKOUT;
    const { favorites, removeFavorite } = useFavorites();

    const handleDayClick = (dayName) => {
        const storedProgram = JSON.parse(localStorage.getItem('trainingProgram') || '[]');
        const dayExercises = storedProgram.filter(exercise => exercise.day === dayName);

        if (dayExercises.length > 0) {
            const exerciseList = dayExercises.map(ex => `${ex.name}: ${ex.sets} סטים x ${ex.reps} חזרות`).join('\n');
            alert(`אימון ליום ${dayName}:\n\n${exerciseList}`);
        } else {
            alert(`אין אימונים רשומים ליום ${dayName}.`);
        }
    };

    return (
        <div>
            <div className="card">
                <h2>תוכנית אימונים שבועית</h2>
                <ul>
                    {workouts.map((workout) => (
                        <WorkoutDayCard
                            key={workout.id}
                            workout={workout}
                            onToggle={() => handleDayClick(workout.day)}
                        />
                    ))}
                </ul>
            </div>

            {favorites.length > 0 && (
                <div style={{ marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <h3 style={{ color: '#e91e63', textAlign: 'center' }}><FaHeart style={{ marginRight: '10px' }} /> התרגילים המועדפים שלי</h3>
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {favorites.map((video) => (
                                <li key={video.id.videoId} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: '#00e676', fontWeight: 'bold', fontSize: '16px' }}
                                    >
                                        {video.snippet.title}
                                    </a>
                                    <button
                                        onClick={() => removeFavorite(video.id.videoId)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            color: '#e74c3c',
                                            marginLeft: '10px'
                                        }}
                                        title="הסר מהמועדפים"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
