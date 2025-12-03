import React, { useState } from 'react';
import WorkoutDayCard from './WorkoutDayCard';

const WEEKLY_WORKOUT = [
    { id: 1, day: 'ראשון', focus: 'חזה וכתפיים', completed: false },
    { id: 2, day: 'שני', focus: 'גב ויד קדמית', completed: false },
    { id: 3, day: 'שלישי', focus: 'רגליים ובטן', completed: false },
    { id: 4, day: 'רביעי', focus: 'מנוחה / אירובי קל', completed: false },
    { id: 5, day: 'חמישי', focus: 'גוף עליון (Upper)', completed: false },
];

const HomePage = () => {
    const [workouts, setWorkouts] = useState(WEEKLY_WORKOUT);

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

    const toggleDayCompleted = (id) => {
        setWorkouts((prevWorkouts) =>
            prevWorkouts.map((workout) =>
                workout.id === id ? { ...workout, completed: !workout.completed } : workout
            )
        );
    };

    return (
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
    );
};

export default HomePage;
