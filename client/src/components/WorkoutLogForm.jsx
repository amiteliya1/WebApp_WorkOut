import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { createWorkout, updateWorkout } from '../services/workouts.api';

// Common exercises list for autocomplete - 30 exercises (5 per muscle group)
const COMMON_EXERCISES = [
    // Chest exercises (5)
    'Barbell Bench Press',
    'Dumbbell Bench Press',
    'Incline Bench Press',
    'Push-ups',
    'Chest Fly',

    // Back exercises (5)
    'Pull-ups',
    'Deadlift',
    'Bent Over Row',
    'Lat Pulldown',
    'Seated Cable Row',

    // Shoulder exercises (5)
    'Overhead Press',
    'Dumbbell Shoulder Press',
    'Lateral Raise',
    'Front Raise',
    'Rear Delt Fly',

    // Arms exercises (5)
    'Barbell Curl',
    'Dumbbell Curl',
    'Tricep Dip',
    'Tricep Pushdown',
    'Hammer Curl',

    // Leg exercises (5)
    'Barbell Squat',
    'Leg Press',
    'Lunges',
    'Leg Extension',
    'Calf Raise',

    // Core/Abs exercises (5)
    'Plank',
    'Crunches',
    'Russian Twist',
    'Leg Raises',
    'Mountain Climbers',
].sort();

const WorkoutLogForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [exerciseName, setExerciseName] = useState('');
    const [weightLifted, setWeightLifted] = useState('');
    const [setsCount, setSetsCount] = useState('');
    const [repsCount, setRepsCount] = useState('');
    const [feeling, setFeeling] = useState('Normal');
    const [selectedDay, setSelectedDay] = useState('Sunday');
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [isEditingFromHome, setIsEditingFromHome] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if editing
        if (location.state?.workoutToEdit) {
            const workout = location.state.workoutToEdit;
            console.log('Editing workout:', workout);
            setExerciseName(workout.name);
            setWeightLifted(workout.weight.toString());
            setSetsCount(workout.sets.toString());
            setRepsCount(workout.reps.toString());
            setFeeling(workout.feeling);
            setSelectedDay(workout.day);
            setEditingId(workout.id || workout._id); // Support both id and _id
            setIsEditingFromHome(true);
        }

        // Check if adding to a specific day
        if (location.state?.addToDay) {
            console.log('Adding workout for day:', location.state.addToDay);
            setSelectedDay(location.state.addToDay);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Workout form submitted', {
            exerciseName,
            weightLifted,
            setsCount,
            repsCount,
            feeling,
            selectedDay,
            isEditing: !!editingId
        });

        const newErrors = {};

        if (!exerciseName || exerciseName.trim().length === 0) {
            newErrors.exerciseName = 'Exercise name is required';
        }

        if (!weightLifted || Number(weightLifted) < 0) {
            newErrors.weightLifted = 'Weight must be a non-negative number';
        }

        if (!setsCount || Number(setsCount) <= 0) {
            newErrors.setsCount = 'Number of sets must be a positive number';
        }

        if (!repsCount || Number(repsCount) <= 0) {
            newErrors.repsCount = 'Number of reps must be a positive number';
        }

        if (Object.keys(newErrors).length > 0) {
            console.log('Form validation failed:', newErrors);
            setErrors(newErrors);
            return;
        }

        console.log('Form validation passed');
        setErrors({});

        const workoutData = {
            day: selectedDay,
            name: exerciseName.trim(),
            weight: Number(weightLifted),
            sets: Number(setsCount),
            reps: Number(repsCount),
            feeling: feeling
        };

        try {
            setLoading(true);
            setError(null);

            if (editingId && isEditingFromHome) {
                // Update existing workout
                console.log(`Updating workout ID: ${editingId}`, workoutData);
                await updateWorkout(editingId, workoutData);
                console.log('Workout updated successfully');
                alert('Workout updated successfully!');
            } else {
                // Add new workout
                console.log('Creating new workout', workoutData);
                await createWorkout(workoutData);
                console.log('Workout saved successfully');
                alert('Workout saved successfully!');
            }

            // Reset form
            setExerciseName('');
            setWeightLifted('');
            setSetsCount('');
            setRepsCount('');
            setFeeling('Normal');
            setSelectedDay('Sunday');
            setEditingId(null);
            setIsEditingFromHome(false);

            // Return to home page using navigate
            console.log('Navigating back to home page');
            navigate('/');
        } catch (error) {
            console.error('Error saving workout:', error);
            const errorMessage = error.response?.data?.error || 'Failed to save workout. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        console.log('User cancelled workout edit');

        setEditingId(null);
        setIsEditingFromHome(false);
        setExerciseName('');
        setWeightLifted('');
        setSetsCount('');
        setRepsCount('');
        setFeeling('Normal');
        setSelectedDay('Sunday');

        // Return to home page using navigate
        console.log('Navigating back to home page');
        navigate('/');
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>
                    {editingId ? 'Edit Workout' : 'Log Your Workout'}
                </h2>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="close-modal-btn"
                    title="Back to Home"
                >
                    <FaTimes />
                </button>
            </div>

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

            <form onSubmit={handleSubmit} className="workout-form">
                <div className="form-field">
                    <label htmlFor="day-select">
                        Day of the week
                    </label>
                    <select
                        id="day-select"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        disabled={loading}
                    >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="exercise-name">
                        Exercise Name
                    </label>
                    <input
                        id="exercise-name"
                        type="text"
                        list="exercises-list"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        placeholder="Choose from list or type your own..."
                        disabled={loading}
                        autoComplete="off"
                    />
                    <datalist id="exercises-list">
                        {COMMON_EXERCISES.map((exercise) => (
                            <option key={exercise} value={exercise} />
                        ))}
                    </datalist>
                    {errors.exerciseName && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                            {errors.exerciseName}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="weight">
                        Weight Lifted (kg)
                    </label>
                    <input
                        id="weight"
                        type="number"
                        value={weightLifted}
                        onChange={(e) => setWeightLifted(e.target.value)}
                        placeholder="e.g., 60"
                        min="0"
                        step="0.5"
                        disabled={loading}
                    />
                    {errors.weightLifted && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                            {errors.weightLifted}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="sets">
                        Number of Sets
                    </label>
                    <input
                        id="sets"
                        type="number"
                        value={setsCount}
                        onChange={(e) => setSetsCount(e.target.value)}
                        placeholder="e.g., 3"
                        min="1"
                        disabled={loading}
                    />
                    {errors.setsCount && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                            {errors.setsCount}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="reps">
                        Number of Reps
                    </label>
                    <input
                        id="reps"
                        type="number"
                        value={repsCount}
                        onChange={(e) => setRepsCount(e.target.value)}
                        placeholder="e.g., 10"
                        min="1"
                        disabled={loading}
                    />
                    {errors.repsCount && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                            {errors.repsCount}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="feeling">
                        How do you feel?
                    </label>
                    <select
                        id="feeling"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        disabled={loading}
                    >
                        <option value="Bad">Bad</option>
                        <option value="Normal">Normal</option>
                        <option value="Good">Good</option>
                        <option value="Great">Great</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ flex: 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (editingId ? 'Update Workout' : 'Save Workout')}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="btn-secondary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default WorkoutLogForm;
