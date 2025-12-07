import React, { useState } from 'react';

const WorkoutLogForm = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [weightLifted, setWeightLifted] = useState('');
    const [setsCount, setSetsCount] = useState('');
    const [repsCount, setRepsCount] = useState('');
    const [feeling, setFeeling] = useState('רגיל');
    const [selectedDay, setSelectedDay] = useState('ראשון');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (exerciseName.length < 3) {
            newErrors.exerciseName = 'שם התרגיל חייב להכיל לפחות 3 תווים';
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

        const newWorkout = {
            id: Date.now(),
            day: selectedDay,
            name: exerciseName,
            weight: weightLifted,
            sets: setsCount,
            reps: repsCount,
            feeling: feeling
        };

        const existingProgram = JSON.parse(localStorage.getItem('trainingProgram') || '[]');
        const updatedProgram = [...existingProgram, newWorkout];
        localStorage.setItem('trainingProgram', JSON.stringify(updatedProgram));

        alert('האימון נשמר בהצלחה!');

        console.log('Workout Logged:', newWorkout);
    };

    return (
        <div className="card">
            <h2>יומן אימון</h2>
            <form onSubmit={handleSubmit} className="workout-form">

                <div className="form-group full-width">
                    <label htmlFor="day">יום בשבוע:</label>
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
                    </select>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="exerciseName">שם התרגיל:</label>
                    <input
                        type="text"
                        id="exerciseName"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        required
                        placeholder="לדוגמה: לחיצת חזה"
                    />
                    {errors.exerciseName && <span style={{ color: '#ff5252', fontSize: '12px' }}>{errors.exerciseName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="weightLifted">משקל הרמה (ק"ג):</label>
                    <input
                        type="number"
                        id="weightLifted"
                        value={weightLifted}
                        onChange={(e) => setWeightLifted(e.target.value)}
                        required
                        placeholder="0"
                    />
                    {errors.weightLifted && <span style={{ color: '#ff5252', fontSize: '12px' }}>{errors.weightLifted}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="setsCount">מספר סטים:</label>
                    <input
                        type="number"
                        id="setsCount"
                        value={setsCount}
                        onChange={(e) => setSetsCount(e.target.value)}
                        required
                        placeholder="0"
                    />
                    {errors.setsCount && <span style={{ color: '#ff5252', fontSize: '12px' }}>{errors.setsCount}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="repsCount">מספר חזרות:</label>
                    <input
                        type="number"
                        id="repsCount"
                        value={repsCount}
                        onChange={(e) => setRepsCount(e.target.value)}
                        required
                        placeholder="0"
                    />
                    {errors.repsCount && <span style={{ color: '#ff5252', fontSize: '12px' }}>{errors.repsCount}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="feeling">הרגשה כללית:</label>
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

                <div className="form-group full-width">
                    <button type="submit" className="btn-primary">
                        שמור אימון
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WorkoutLogForm;
