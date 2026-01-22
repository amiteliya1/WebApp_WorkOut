import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

// Import muscle images
import absImage from '../assets/muscles/abs.jpg.jpg';
import chestImage from '../assets/muscles/chest.jpg.jpg';
import legsImage from '../assets/muscles/legs.jpg.jpg';
import backImage from '../assets/muscles/back.jpg.jpg';
import armsImage from '../assets/muscles/arms.jpg.jpg';
import shouldersImage from '../assets/muscles/shoulders.jpg.jpg';

const ExerciseApiPage = () => {
    const navigate = useNavigate();

    const { data: exercisesData, loading, error } = useApi('https://wger.de/api/v2/exercise/?language=2&limit=10');
    const { data: categoriesData } = useApi('https://wger.de/api/v2/exercisecategory/');

    // מיפוי עברית ↔ אנגלית עם תמונות
    const muscleGroups = [
        { hebrew: 'בטן', english: 'ABS', image: absImage },
        { hebrew: 'רגליים', english: 'LEGS', image: legsImage },
        { hebrew: 'חזה', english: 'Chest', image: chestImage },
        { hebrew: 'גב', english: 'Back', image: backImage },
        { hebrew: 'ידיים', english: 'ARMS', image: armsImage },
        { hebrew: 'כתפיים', english: 'SHOULDERS', image: shouldersImage }
    ];

    const uniqueCategories = React.useMemo(() => {
        if (!exercisesData || !categoriesData) return [];

        const categoriesMap = {};
        categoriesData.results.forEach(category => {
            categoriesMap[category.id] = category;
        });

        const exercisesWithCategories = exercisesData.results.map(exercise => ({
            ...exercise,
            category: categoriesMap[exercise.category] || { name: 'Unknown' }
        }));

        const categoriesSet = new Set();
        exercisesWithCategories.forEach(exercise => {
            if (exercise.category.name !== 'Unknown') {
                categoriesSet.add(exercise.category.name);
            }
        });
        categoriesSet.add('Chest');
        categoriesSet.add('Back');

        return Array.from(categoriesSet);
    }, [exercisesData, categoriesData]);

    const handleCategoryClick = (englishName) => {
        navigate(`/exercises/${englishName}`);
    };

    if (loading) {
        return <div className="loading-message">טוען ספריית תרגילים... ⏳</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="card exercise-library-card">
            <h2>קטגוריות תרגילים</h2>
            <div className="muscle-grid">
                {muscleGroups.map((muscle) => (
                    <div
                        key={muscle.english}
                        className="muscle-card"
                        onClick={() => handleCategoryClick(muscle.english)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCategoryClick(muscle.english);
                            }
                        }}
                    >
                        <div className="muscle-card-image">
                            <img 
                                src={muscle.image}
                                alt={muscle.hebrew}
                                className="muscle-image"
                            />
                            <div className="muscle-card-overlay"></div>
                        </div>
                        <div className="muscle-card-content">
                            <h3 className="muscle-card-title">{muscle.hebrew}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseApiPage;
