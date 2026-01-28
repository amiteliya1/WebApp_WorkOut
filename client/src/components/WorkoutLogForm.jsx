import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

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
    const [isEditingFromHome, setIsEditingFromHome] = useState(false); // Whether editing from home page

    // Load data if coming from home page
    useEffect(() => {
        // If coming from home page with workout to edit
        if (location.state?.workoutToEdit) {
            const workout = location.state.workoutToEdit;
            setEditingId(workout.id);
            setIsEditingFromHome(true); // Mark as from home page
            setExerciseName(workout.name);
            setWeightLifted(workout.weight);
            setSetsCount(workout.sets);
            setRepsCount(workout.reps);
            setFeeling(workout.feeling);
            setSelectedDay(workout.day);
        } else if (location.state?.addToDay) {
            // If coming from home page to add new workout for specific day
            setIsEditingFromHome(true);
            setSelectedDay(location.state.addToDay);
        } else {
            setIsEditingFromHome(false);
        }
    }, [location.state]);

    const handleSubmit = (e) => {
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

        if (!weightLifted || Number(weightLifted) <= 0) {
            newErrors.weightLifted = 'Weight must be a positive number';
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

        try {
            // All workouts are saved only in weeklyWorkouts (home page)
            const existingWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');

            if (editingId && isEditingFromHome) {
                // Update existing workout from home page
                console.log(`Updating workout ID: ${editingId}`);
                const updatedWeeklyWorkouts = existingWeeklyWorkouts.map(workout =>
                    workout.id === editingId
                        ? {
                            id: editingId,
                            day: selectedDay,
                            name: exerciseName,
                            weight: weightLifted,
                            sets: setsCount,
                            reps: repsCount,
                            feeling: feeling
                        }
                        : workout
                );
                localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));
                console.log('Workout updated successfully');
                alert('Workout updated successfully!');
            } else {
                // Add new workout - saved only on home page
                console.log('Creating new workout');
                const newWorkout = {
                    id: Date.now(),
                    day: selectedDay,
                    name: exerciseName,
                    weight: weightLifted,
                    sets: setsCount,
                    reps: repsCount,
                    feeling: feeling
                };
                const updatedWeeklyWorkouts = [...existingWeeklyWorkouts, newWorkout];
                localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));
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
            console.error('Error saving workout to localStorage:', error);
            alert('Failed to save workout. Please try again.');
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
        <div>
            <div className="card workout-form-card">
                <h2>{editingId ? 'Edit Workout' : 'Workout Log'}</h2>
                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cancel-edit-btn"
                    >
                        <FaTimes /> Cancel Editing
                    </button>
                )}
                <form onSubmit={handleSubmit} className="workout-form">

                <div className="form-field">
                    <label htmlFor="day">Day of Week</label>
                    <select
                        id="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
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
                    <label htmlFor="exerciseName">Exercise Name</label>
                    <input
                        type="text"
                        id="exerciseName"
                        value={exerciseName}
                        onChange={(e) => {
                            setExerciseName(e.target.value);
                            // Clear error when user types
                            if (errors.exerciseName) {
                                setErrors(prev => ({ ...prev, exerciseName: undefined }));
                            }
                        }}
                        placeholder="Example: Bench Press"
                    />
                    {errors.exerciseName && <span className="form-error">{errors.exerciseName}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="weightLifted">Weight Lifted (kg)</label>
                    <input
                        type="number"
                        id="weightLifted"
                        value={weightLifted}
                        onChange={(e) => {
                            setWeightLifted(e.target.value);
                            // Clear error when user types
                            if (errors.weightLifted) {
                                setErrors(prev => ({ ...prev, weightLifted: undefined }));
                            }
                        }}
                        min="0"
                        step="0.1"
                        placeholder="0"
                    />
                    {errors.weightLifted && <span className="form-error">{errors.weightLifted}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="setsCount">Number of Sets</label>
                    <input
                        type="number"
                        id="setsCount"
                        value={setsCount}
                        onChange={(e) => {
                            setSetsCount(e.target.value);
                            // Clear error when user types
                            if (errors.setsCount) {
                                setErrors(prev => ({ ...prev, setsCount: undefined }));
                            }
                        }}
                        min="0"
                        step="1"
                        placeholder="0"
                    />
                    {errors.setsCount && <span className="form-error">{errors.setsCount}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="repsCount">Number of Reps</label>
                    <input
                        type="number"
                        id="repsCount"
                        value={repsCount}
                        onChange={(e) => {
                            setRepsCount(e.target.value);
                            // Clear error when user types
                            if (errors.repsCount) {
                                setErrors(prev => ({ ...prev, repsCount: undefined }));
                            }
                        }}
                        min="0"
                        step="1"
                        placeholder="0"
                    />
                    {errors.repsCount && <span className="form-error">{errors.repsCount}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="feeling">Overall Feeling</label>
                    <select
                        id="feeling"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                    >
                        <option value="Excellent">Excellent</option>
                        <option value="Normal">Normal</option>
                        <option value="Difficult">Difficult</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary form-submit-btn">
                    {editingId ? 'Update Workout' : 'Save Workout'}
                </button>
            </form>
            </div>
        </div>
    );
};

export default WorkoutLogForm;
