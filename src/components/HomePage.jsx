import React, { useState } from 'react';
import WorkoutDayCard from './WorkoutDayCard';
import { FaCalendarDay, FaTimes } from 'react-icons/fa';

const WEEKLY_WORKOUT = [
    { id: 1, day: 'ראשון', focus: 'חזה וכתפיים', completed: false },
    { id: 2, day: 'שני', focus: 'גב ויד קדמית', completed: false },
    { id: 3, day: 'שלישי', focus: 'רגליים ובטן', completed: false },
    { id: 4, day: 'רביעי', focus: 'מנוחה / אירובי קל', completed: false },
    { id: 5, day: 'חמישי', focus: 'גוף עליון (Upper)', completed: false },
    { id: 6, day: 'שישי', focus: 'אימון לבחירה / השלמות', completed: false },
];

const HomePage = () => {
    const [workouts, setWorkouts] = useState(WEEKLY_WORKOUT);
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedDayName, setSelectedDayName] = useState('');
    const [selectedDayExercises, setSelectedDayExercises] = useState([]);

    const handleDayClick = (dayName) => {
        const storedProgram = JSON.parse(localStorage.getItem('trainingProgram') || '[]');
        const dayExercises = storedProgram.filter(exercise => exercise.day === dayName);

        setSelectedDayName(dayName);
        setSelectedDayExercises(dayExercises);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="home-page-container">
            <h2 className="section-title">תוכנית אימונים שבועית</h2>
            <div className="workouts-grid">
                {workouts.map((workout) => (
                    <WorkoutDayCard
                        key={workout.id}
                        workout={workout}
                        onToggle={() => handleDayClick(workout.day)}
                    />
                ))}
            </div>

            {/* Day Details Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content day-details-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-icon" onClick={closeModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-header-icon">
                            <FaCalendarDay />
                        </div>
                        <h3>אימון ליום {selectedDayName}</h3>

                        {selectedDayExercises.length > 0 ? (
                            <div className="exercises-list-container">
                                {selectedDayExercises.map((ex, index) => (
                                    <div key={index} className="exercise-item">
                                        <div className="exercise-name">{ex.name}</div>
                                        <div className="exercise-details">
                                            <span>{ex.weight} ק"ג</span>
                                            <span className="divider">•</span>
                                            <span>{ex.sets} סטים</span>
                                            <span className="divider">•</span>
                                            <span>{ex.reps} חזרות</span>
                                        </div>
                                        {ex.feeling && <div className="exercise-feeling">הרגשה: {ex.feeling}</div>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-exercises-msg">
                                <p>לא נרשמו תרגילים ליום זה.</p>
                                <p>גש ל"בניית תוכנית" כדי להוסיף תרגילים.</p>
                            </div>
                        )}

                        <button className="btn-primary" onClick={closeModal} style={{marginTop: '20px'}}>
                            סגור
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
