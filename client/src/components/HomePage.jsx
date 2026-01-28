import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavorite } from '../store/slices/favoritesSlice';
import WorkoutDayCard from './WorkoutDayCard';
import { FaHeart, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

const DEFAULT_WEEKLY_WORKOUT = [
    { id: 1, day: 'Sunday', focus: 'Chest and Shoulders', completed: false },
    { id: 2, day: 'Monday', focus: 'Back and Biceps', completed: false },
    { id: 3, day: 'Tuesday', focus: 'Legs and Abs', completed: false },
    { id: 4, day: 'Wednesday', focus: 'Rest / Light Cardio', completed: false },
    { id: 5, day: 'Thursday', focus: 'Upper Body', completed: false },
    { id: 6, day: 'Friday', focus: 'Lower Body', completed: false },
    { id: 7, day: 'Saturday', focus: 'Rest', completed: false },
];

const HomePage = () => {
    const favorites = useSelector((state) => state.favorites.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState(DEFAULT_WEEKLY_WORKOUT);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayWorkouts, setDayWorkouts] = useState([]);
    const [editingDay, setEditingDay] = useState(null); // Day being edited
    const [editFocus, setEditFocus] = useState(''); // Focus value being edited
    const [showEditDayModal, setShowEditDayModal] = useState(false); // Modal for selecting day to edit

    const handleDayClick = (dayName) => {
        // Load home page workouts (by day)
        const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
        const dayExercises = storedWeeklyWorkouts.filter(exercise => exercise.day === dayName);
        
        setSelectedDay(dayName);
        setDayWorkouts(dayExercises);
    };

    const handleCloseModal = () => {
        setSelectedDay(null);
        setDayWorkouts([]);
    };

    const handleOverlayClick = (e) => {
        // Close on overlay click (not on the card itself)
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handleEdit = (workout) => {
        // Navigate to form with workout data
        navigate('/form', { state: { workoutToEdit: workout } });
    };

    const handleDelete = (workoutId) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            // Delete from home page workouts (by day)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const updatedWeeklyWorkouts = storedWeeklyWorkouts.filter(workout => workout.id !== workoutId);
            localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));

            // Update the list
            const dayExercises = updatedWeeklyWorkouts.filter(exercise => exercise.day === selectedDay);
            setDayWorkouts(dayExercises);
        }
    };

    const handleDeleteDay = (dayName) => {
        if (window.confirm(`Are you sure you want to delete all workouts for ${dayName}?`)) {
            // Delete from home page workouts (by day)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const updatedWeeklyWorkouts = storedWeeklyWorkouts.filter(workout => workout.day !== dayName);
            localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));
            setDayWorkouts([]);
            setSelectedDay(null);
        }
    };

    // Load weekly plan from localStorage
    useEffect(() => {
        const storedWeeklyPlan = localStorage.getItem('weeklyPlan');
        if (storedWeeklyPlan) {
            try {
                const parsed = JSON.parse(storedWeeklyPlan);
                setWorkouts(parsed);
            } catch (error) {
                console.error('Error loading weekly plan:', error);
            }
        }
    }, []);

    // Update list when component reloads
    useEffect(() => {
        if (selectedDay) {
            // Load home page workouts (by day)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const dayExercises = storedWeeklyWorkouts.filter(exercise => exercise.day === selectedDay);
            setDayWorkouts(dayExercises);
        }
    }, [selectedDay]);

    // Save weekly plan to localStorage
    const saveWeeklyPlan = (updatedWorkouts) => {
        localStorage.setItem('weeklyPlan', JSON.stringify(updatedWorkouts));
        setWorkouts(updatedWorkouts);
    };

    // Open day editing
    const handleEditDay = (workout) => {
        setEditingDay(workout.id);
        setEditFocus(workout.focus);
    };

    // Save day edit
    const handleSaveDayEdit = (dayId) => {
        if (!editFocus.trim()) {
            alert('Please enter workout focus');
            return;
        }

        const updatedWorkouts = workouts.map(workout =>
            workout.id === dayId
                ? { ...workout, focus: editFocus.trim() }
                : workout
        );
        saveWeeklyPlan(updatedWorkouts);
        setEditingDay(null);
        setEditFocus('');
    };

    // Cancel editing
    const handleCancelDayEdit = () => {
        setEditingDay(null);
        setEditFocus('');
    };

    // Open day selection modal for editing
    const handleOpenEditDayModal = () => {
        setShowEditDayModal(true);
    };

    // Close day selection modal
    const handleCloseEditDayModal = () => {
        setShowEditDayModal(false);
    };

    // Select day to edit from modal
    const handleSelectDayToEdit = (dayName) => {
        const workout = workouts.find(w => w.day === dayName);
        if (workout) {
            handleEditDay(workout);
            setShowEditDayModal(false);
        }
    };

    return (
        <div>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0 }}>Weekly Workout Program</h2>
                    <button
                        type="button"
                        onClick={handleOpenEditDayModal}
                        className="edit-day-btn"
                        title="Edit Day"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <FaEdit />
                    </button>
                </div>
                <ul className="weekly-plan-list">
                    {workouts.map((workout) => (
                        <li key={workout.id} className="weekly-plan-item">
                            <div
                                className={`workout-day-card ${selectedDay === workout.day ? 'selected' : ''}`}
                                onClick={() => handleDayClick(workout.day)}
                            >
                                <div className="workout-day-content">
                                    <strong>{workout.day}:</strong>
                                    {editingDay === workout.id ? (
                                        <div className="edit-focus-container" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={editFocus}
                                                onChange={(e) => setEditFocus(e.target.value)}
                                                className="edit-focus-input"
                                                placeholder="Enter workout focus"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveDayEdit(workout.id);
                                                    } else if (e.key === 'Escape') {
                                                        handleCancelDayEdit();
                                                    }
                                                }}
                                            />
                                            <div className="edit-focus-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveDayEdit(workout.id)}
                                                    className="save-focus-btn"
                                                    title="Save"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelDayEdit}
                                                    className="cancel-focus-btn"
                                                    title="Cancel"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span>{workout.focus}</span>
                                    )}
                                    {workout.completed && ' ✅'}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal - Select day to edit */}
            {showEditDayModal && (
                <div className="modal-overlay" onClick={handleCloseEditDayModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, color: 'var(--accent)' }}>Which day would you like to edit?</h3>
                            <button
                                onClick={handleCloseEditDayModal}
                                className="close-modal-btn"
                                title="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {workouts.map((workout) => (
                                <li key={workout.id} style={{ marginBottom: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDayToEdit(workout.day)}
                                        className="btn-primary"
                                        style={{ width: '100%', textAlign: 'right', padding: '12px 20px' }}
                                    >
                                        {workout.day}: {workout.focus}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Modal - Display workouts for selected day */}
            {selectedDay && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content day-workouts-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="day-workouts-header">
                            <h3>Workouts for {selectedDay}</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                    onClick={() => handleDeleteDay(selectedDay)}
                                    className="delete-day-btn"
                                    title={`Delete all workouts for ${selectedDay}`}
                                >
                                    <FaTrash /> Delete Day
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="close-modal-btn"
                                    title="Close"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                    {dayWorkouts.length > 0 ? (
                        <ul className="workout-list">
                            {dayWorkouts.map((workout) => (
                                <li key={workout.id} className="workout-item">
                                    <div className="workout-info">
                                        <strong>{workout.name}</strong>
                                        <span className="workout-details">
                                            {workout.weight} kg × {workout.sets} sets × {workout.reps} reps
                                        </span>
                                        <span className="workout-feeling">Feeling: {workout.feeling}</span>
                                    </div>
                                    <div className="workout-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(workout)}
                                            className="edit-btn"
                                            title="Edit Workout"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(workout.id)}
                                            className="delete-btn"
                                            title="Delete Workout"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-workouts-message">
                            <p>No workouts recorded for {selectedDay}.</p>
                            <button
                                onClick={() => navigate('/form', { state: { addToDay: selectedDay } })}
                                className="btn-primary"
                                style={{ marginTop: '16px' }}
                            >
                                Add new workout for {selectedDay}
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            )}

            {favorites.length > 0 && (
                <div style={{ marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <h3 style={{ color: '#e91e63', textAlign: 'center' }}><FaHeart style={{ marginRight: '10px' }} /> My Favorite Exercises</h3>
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
                                        onClick={() => dispatch(removeFavorite(video.id.videoId))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            color: '#e74c3c',
                                            marginLeft: '10px'
                                        }}
                                        title="Remove from Favorites"
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
