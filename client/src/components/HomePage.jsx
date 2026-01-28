import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavorite } from '../store/slices/favoritesSlice';
import { getAllWorkouts, deleteWorkout } from '../services/workouts.api';
import { useAuth } from '../hooks/useAuth';
import { FaHeart, FaTrash, FaEdit, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

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
    const { deleteAccount } = useAuth();
    const [workouts, setWorkouts] = useState(DEFAULT_WEEKLY_WORKOUT);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayWorkouts, setDayWorkouts] = useState([]);
    const [allWorkouts, setAllWorkouts] = useState([]); // All workouts from API
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingDay, setEditingDay] = useState(null);
    const [editFocus, setEditFocus] = useState('');
    const [showEditDayModal, setShowEditDayModal] = useState(false);

    // Load all workouts from API
    const fetchAllWorkouts = async () => {
        try {
            console.log('Fetching all workouts from API');
            setLoading(true);
            setError(null);
            const workoutsData = await getAllWorkouts();
            setAllWorkouts(workoutsData);
            console.log(`Loaded ${workoutsData.length} workouts from API`);
        } catch (err) {
            console.error('Error fetching workouts:', err);
            setError('Failed to load workouts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load workouts on component mount
    useEffect(() => {
        fetchAllWorkouts();
    }, []);

    // Load weekly plan from localStorage (keep this - it's just the planning)
    useEffect(() => {
        console.log('Loading weekly plan from localStorage');

        const storedWeeklyPlan = localStorage.getItem('weeklyPlan');
        if (storedWeeklyPlan) {
            try {
                const parsed = JSON.parse(storedWeeklyPlan);
                setWorkouts(parsed);
                console.log('Weekly plan loaded successfully:', parsed.length, 'days');
            } catch (error) {
                console.error('Error loading weekly plan from localStorage:', error);
                console.log('Using default weekly workout plan');
                setWorkouts(DEFAULT_WEEKLY_WORKOUT);
            }
        } else {
            console.log('No weekly plan found, using default');
        }
    }, []);

    const handleDayClick = (dayName) => {
        console.log(`User clicked on day: ${dayName}`);

        // Filter workouts for the selected day from API data
        const dayExercises = allWorkouts.filter(exercise => exercise.day === dayName);

        console.log(`Found ${dayExercises.length} workouts for ${dayName}`);

        setSelectedDay(dayName);
        setDayWorkouts(dayExercises);
    };

    const handleCloseModal = () => {
        setSelectedDay(null);
        setDayWorkouts([]);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handleEdit = (workout) => {
        // Navigate to form with workout data
        // Use _id from MongoDB instead of id
        navigate('/form', { state: { workoutToEdit: { ...workout, id: workout._id } } });
    };

    const handleDelete = async (workoutId) => {
        console.log(`User requested to delete workout ID: ${workoutId}`);

        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                setLoading(true);
                await deleteWorkout(workoutId);

                console.log(`Workout ${workoutId} deleted successfully`);
                alert('Workout deleted successfully!');

                // Reload workouts from API
                await fetchAllWorkouts();

                // Update the current day's workouts
                const updatedDayWorkouts = allWorkouts.filter(
                    workout => workout.day === selectedDay && workout._id !== workoutId
                );
                setDayWorkouts(updatedDayWorkouts);
            } catch (error) {
                console.error('Error deleting workout:', error);
                alert('Failed to delete workout. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Delete cancelled by user');
        }
    };

    const handleDeleteDay = async (dayName) => {
        console.log(`User requested to delete all workouts for day: ${dayName}`);

        const workoutsToDelete = allWorkouts.filter(workout => workout.day === dayName);

        if (workoutsToDelete.length === 0) {
            alert(`No workouts found for ${dayName}`);
            return;
        }

        if (window.confirm(`Are you sure you want to delete all ${workoutsToDelete.length} workouts for ${dayName}?`)) {
            try {
                setLoading(true);

                // Delete all workouts for this day
                await Promise.all(
                    workoutsToDelete.map(workout => deleteWorkout(workout._id))
                );

                console.log(`Deleted ${workoutsToDelete.length} workouts for ${dayName}`);
                alert(`Deleted ${workoutsToDelete.length} workouts for ${dayName}`);

                // Reload workouts from API
                await fetchAllWorkouts();

                setDayWorkouts([]);
                setSelectedDay(null);
            } catch (error) {
                console.error(`Error deleting workouts for ${dayName}:`, error);
                alert('Failed to delete workouts. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            console.log('Delete day cancelled by user');
        }
    };

    // Save weekly plan to localStorage (keep this - it's just the planning)
    const saveWeeklyPlan = (updatedWorkouts) => {
        console.log('Saving weekly plan to localStorage');

        try {
            localStorage.setItem('weeklyPlan', JSON.stringify(updatedWorkouts));
            setWorkouts(updatedWorkouts);
            console.log('Weekly plan saved successfully');
        } catch (error) {
            console.error('Error saving weekly plan to localStorage:', error);
            alert('Failed to save weekly plan. Please try again.');
        }
    };

    const handleEditDay = (workout) => {
        console.log(`User started editing day: ${workout.day}`);
        setEditingDay(workout.id);
        setEditFocus(workout.focus);
    };

    const handleSaveDayEdit = (dayId) => {
        console.log(`User saving edit for day ID: ${dayId}, new focus: "${editFocus}"`);

        if (!editFocus.trim()) {
            console.log('Save cancelled: empty focus');
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

    const handleCancelDayEdit = () => {
        setEditingDay(null);
        setEditFocus('');
    };

    const handleOpenEditDayModal = () => {
        setShowEditDayModal(true);
    };

    const handleCloseEditDayModal = () => {
        setShowEditDayModal(false);
    };

    const handleSelectDayToEdit = (dayName) => {
        const workout = workouts.find(w => w.day === dayName);
        if (workout) {
            handleEditDay(workout);
            setShowEditDayModal(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            '⚠️ WARNING: This will permanently delete your account and ALL your workouts!\n\n' +
            'This action CANNOT be undone.\n\n' +
            'Are you absolutely sure you want to delete your account?'
        );

        if (!confirmation) {
            console.log('Account deletion cancelled by user');
            return;
        }

        // Second confirmation
        const finalConfirmation = window.confirm(
            'FINAL WARNING!\n\n' +
            'Click OK to permanently delete your account and all data.\n' +
            'Click Cancel to keep your account.'
        );

        if (!finalConfirmation) {
            console.log('Account deletion cancelled by user (final confirmation)');
            return;
        }

        try {
            setLoading(true);
            console.log('Initiating account deletion...');

            const result = await deleteAccount();

            if (result.success) {
                alert(
                    `Account deleted successfully!\n\n` +
                    `Deleted ${result.deletedWorkouts} workout(s).\n\n` +
                    `You will now be redirected to the login page.`
                );
                navigate('/login');
            } else {
                alert(`Failed to delete account: ${result.error}`);
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="error-message" style={{
                    padding: '16px',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius)',
                    color: '#ef4444'
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading-message" style={{
                    padding: '16px',
                    marginBottom: '20px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: 'var(--radius)',
                    color: '#3b82f6',
                    textAlign: 'center'
                }}>
                    Loading...
                </div>
            )}

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
                                    disabled={loading}
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
                                <li key={workout._id} className="workout-item">
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
                                            disabled={loading}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(workout._id)}
                                            className="delete-btn"
                                            title="Delete Workout"
                                            disabled={loading}
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

            {/* Delete Account Section */}
            <div style={{
                marginTop: '60px',
                borderTop: '2px solid rgba(239, 68, 68, 0.3)',
                paddingTop: '32px',
                marginBottom: '40px'
            }}>
                <div className="card" style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <FaExclamationTriangle style={{
                            fontSize: '2rem',
                            color: '#ef4444',
                            marginBottom: '16px'
                        }} />
                        <h3 style={{
                            color: '#ef4444',
                            marginBottom: '12px',
                            fontSize: '1.25rem'
                        }}>
                            Danger Zone
                        </h3>
                        <p style={{
                            marginBottom: '20px',
                            color: 'var(--muted)',
                            fontSize: '0.9rem'
                        }}>
                            Permanently delete your account and all associated workout data.
                            <br />
                            <strong>This action cannot be undone.</strong>
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: 'var(--radius)',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 250ms ease',
                                opacity: loading ? 0.6 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.target.style.backgroundColor = '#dc2626';
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) e.target.style.backgroundColor = '#ef4444';
                            }}
                        >
                            <FaTrash /> {loading ? 'Deleting...' : 'Delete My Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
