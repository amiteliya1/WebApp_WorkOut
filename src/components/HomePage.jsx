import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavorite } from '../store/slices/favoritesSlice';
import WorkoutDayCard from './WorkoutDayCard';
import { FaHeart, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

const DEFAULT_WEEKLY_WORKOUT = [
    { id: 1, day: 'ראשון', focus: 'חזה וכתפיים', completed: false },
    { id: 2, day: 'שני', focus: 'גב ויד קדמית', completed: false },
    { id: 3, day: 'שלישי', focus: 'רגליים ובטן', completed: false },
    { id: 4, day: 'רביעי', focus: 'מנוחה / אירובי קל', completed: false },
    { id: 5, day: 'חמישי', focus: 'גוף עליון (Upper)', completed: false },
    { id: 6, day: 'שישי', focus: 'גוף תחתון (Lower)', completed: false },
    { id: 7, day: 'שבת', focus: 'מנוחה', completed: false },
];

const HomePage = () => {
    const favorites = useSelector((state) => state.favorites.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState(DEFAULT_WEEKLY_WORKOUT);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayWorkouts, setDayWorkouts] = useState([]);
    const [editingDay, setEditingDay] = useState(null); // יום שנמצא בעריכה
    const [editFocus, setEditFocus] = useState(''); // ערך הפוקוס בעריכה

    const handleDayClick = (dayName) => {
        // טעינת אימונים של עמוד הבית (לפי יום)
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
        // סגירה בלחיצה על ה-overlay (לא על הכרטיסה עצמה)
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handleEdit = (workout) => {
        // מעבר לטופס עם נתוני האימון
        navigate('/form', { state: { workoutToEdit: workout } });
    };

    const handleDelete = (workoutId) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק את האימון הזה?')) {
            // מחיקה מאימוני עמוד הבית (לפי יום)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const updatedWeeklyWorkouts = storedWeeklyWorkouts.filter(workout => workout.id !== workoutId);
            localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));
            
            // עדכון הרשימה
            const dayExercises = updatedWeeklyWorkouts.filter(exercise => exercise.day === selectedDay);
            setDayWorkouts(dayExercises);
        }
    };

    const handleDeleteDay = (dayName) => {
        if (window.confirm(`האם אתה בטוח שברצונך למחוק את כל האימונים של יום ${dayName}?`)) {
            // מחיקה מאימוני עמוד הבית (לפי יום)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const updatedWeeklyWorkouts = storedWeeklyWorkouts.filter(workout => workout.day !== dayName);
            localStorage.setItem('weeklyWorkouts', JSON.stringify(updatedWeeklyWorkouts));
            setDayWorkouts([]);
            setSelectedDay(null);
        }
    };

    // טעינת התוכנית השבועית מ-localStorage
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

    // עדכון הרשימה כשהקומפוננטה נטענת מחדש
    useEffect(() => {
        if (selectedDay) {
            // טעינת אימוני עמוד הבית (לפי יום)
            const storedWeeklyWorkouts = JSON.parse(localStorage.getItem('weeklyWorkouts') || '[]');
            const dayExercises = storedWeeklyWorkouts.filter(exercise => exercise.day === selectedDay);
            setDayWorkouts(dayExercises);
        }
    }, [selectedDay]);

    // שמירת התוכנית השבועית ב-localStorage
    const saveWeeklyPlan = (updatedWorkouts) => {
        localStorage.setItem('weeklyPlan', JSON.stringify(updatedWorkouts));
        setWorkouts(updatedWorkouts);
    };

    // פתיחת עריכה של יום
    const handleEditDay = (workout) => {
        setEditingDay(workout.id);
        setEditFocus(workout.focus);
    };

    // שמירת עריכה של יום
    const handleSaveDayEdit = (dayId) => {
        if (!editFocus.trim()) {
            alert('אנא הזן פוקוס אימון');
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

    // ביטול עריכה
    const handleCancelDayEdit = () => {
        setEditingDay(null);
        setEditFocus('');
    };

    return (
        <div>
            <div className="card">
                <h2>תוכנית אימונים שבועית</h2>
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
                                                placeholder="הזן פוקוס אימון"
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
                                                    title="שמור"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelDayEdit}
                                                    className="cancel-focus-btn"
                                                    title="ביטול"
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
                            {editingDay !== workout.id && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditDay(workout);
                                    }}
                                    className="edit-day-btn"
                                    title="ערוך פוקוס אימון"
                                >
                                    <FaEdit />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal - הצגת האימונים של היום שנבחר */}
            {selectedDay && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-content day-workouts-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="day-workouts-header">
                            <h3>אימונים ליום {selectedDay}</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                    onClick={() => handleDeleteDay(selectedDay)}
                                    className="delete-day-btn"
                                    title={`מחק את כל האימונים של ${selectedDay}`}
                                >
                                    <FaTrash /> מחק יום
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="close-modal-btn"
                                    title="סגור"
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
                                            {workout.weight} ק"ג × {workout.sets} סטים × {workout.reps} חזרות
                                        </span>
                                        <span className="workout-feeling">הרגשה: {workout.feeling}</span>
                                    </div>
                                    <div className="workout-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(workout)}
                                            className="edit-btn"
                                            title="ערוך אימון"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(workout.id)}
                                            className="delete-btn"
                                            title="מחק אימון"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-workouts-message">
                            <p>אין אימונים רשומים ליום {selectedDay}.</p>
                            <button
                                onClick={() => navigate('/form', { state: { addToDay: selectedDay } })}
                                className="btn-primary"
                                style={{ marginTop: '16px' }}
                            >
                                הוסף אימון חדש ליום {selectedDay}
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            )}

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
                                        onClick={() => dispatch(removeFavorite(video.id.videoId))}
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
