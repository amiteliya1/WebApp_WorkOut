import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const WorkoutLogForm = () => {
    const location = useLocation();
    const [exerciseName, setExerciseName] = useState('');
    const [weightLifted, setWeightLifted] = useState('');
    const [setsCount, setSetsCount] = useState('');
    const [repsCount, setRepsCount] = useState('');
    const [feeling, setFeeling] = useState('רגיל');
    const [selectedDay, setSelectedDay] = useState('ראשון');
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [isEditingFromHome, setIsEditingFromHome] = useState(false); // האם עורכים מהעמוד הבית

    // טעינת נתונים אם הגענו מהעמוד הבית
    useEffect(() => {
        // אם הגענו מהעמוד הבית עם אימון לעריכה
        if (location.state?.workoutToEdit) {
            const workout = location.state.workoutToEdit;
            setEditingId(workout.id);
            setIsEditingFromHome(true); // סימון שזה מהעמוד הבית
            setExerciseName(workout.name);
            setWeightLifted(workout.weight);
            setSetsCount(workout.sets);
            setRepsCount(workout.reps);
            setFeeling(workout.feeling);
            setSelectedDay(workout.day);
        } else if (location.state?.addToDay) {
            // אם הגענו מהעמוד הבית להוספת אימון חדש ליום מסוים
            setIsEditingFromHome(true);
            setSelectedDay(location.state.addToDay);
        } else {
            setIsEditingFromHome(false);
        }
    }, [location.state]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!exerciseName || exerciseName.trim().length === 0) {
            newErrors.exerciseName = 'שם התרגיל הוא שדה חובה';
        }

        if (!weightLifted || Number(weightLifted) <= 0) {
            newErrors.weightLifted = 'משקל הרמה חייב להיות מספר חיובי';
        }

        if (!setsCount || Number(setsCount) <= 0) {
            newErrors.setsCount = 'מספר הסטים חייב להיות מספר חיובי';
        }

        if (!repsCount || Number(repsCount) <= 0) {
            newErrors.repsCount = 'מספר החזרות חייב להיות מספר חיובי';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // כל האימונים נשמרים רק ב-weeklyWorkouts (עמוד הבית)
        const existingWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
        
        if (editingId && isEditingFromHome) {
            // עדכון אימון קיים מהעמוד הבית
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
            alert('האימון עודכן בהצלחה!');
        } else {
            // הוספת אימון חדש - נשמר רק בעמוד הבית
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
            alert('האימון נשמר בהצלחה!');
        }

        // איפוס הטופס
        setExerciseName('');
        setWeightLifted('');
        setSetsCount('');
        setRepsCount('');
        setFeeling('רגיל');
        setSelectedDay('ראשון');
        setEditingId(null);
        setIsEditingFromHome(false);
        
        // מעבר חזרה לעמוד הבית
        window.location.href = '/';
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setIsEditingFromHome(false);
        setExerciseName('');
        setWeightLifted('');
        setSetsCount('');
        setRepsCount('');
        setFeeling('רגיל');
        setSelectedDay('ראשון');
        
        // חזרה לעמוד הבית
        window.location.href = '/';
    };

    return (
        <div>
            <div className="card workout-form-card">
                <h2>{editingId ? 'ערוך אימון' : 'יומן אימון'}</h2>
                {editingId && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cancel-edit-btn"
                    >
                        <FaTimes /> ביטול עריכה
                    </button>
                )}
                <form onSubmit={handleSubmit} className="workout-form">

                <div className="form-field">
                    <label htmlFor="day">יום בשבוע</label>
                    <select
                        id="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        <option value="ראשון">ראשון</option>
                        <option value="שני">שני</option>
                        <option value="שלישי">שלישי</option>
                        <option value="רביעי">רביעי</option>
                        <option value="חמישי">חמישי</option>
                        <option value="שישי">שישי</option>
                        <option value="שבת">שבת</option>
                    </select>
                </div>

                <div className="form-field">
                    <label htmlFor="exerciseName">שם התרגיל</label>
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
                        placeholder="לדוגמה: לחיצת חזה"
                    />
                    {errors.exerciseName && <span className="form-error">{errors.exerciseName}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="weightLifted">משקל הרמה (ק"ג)</label>
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
                    <label htmlFor="setsCount">מספר סטים</label>
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
                    <label htmlFor="repsCount">מספר חזרות</label>
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
                    <label htmlFor="feeling">הרגשה כללית</label>
                    <select
                        id="feeling"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                    >
                        <option value="מצוין">מצוין</option>
                        <option value="רגיל">רגיל</option>
                        <option value="קשה">קשה</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary form-submit-btn">
                    {editingId ? 'עדכן אימון' : 'שמור אימון'}
                </button>
            </form>
            </div>
        </div>
    );
};

export default WorkoutLogForm;
