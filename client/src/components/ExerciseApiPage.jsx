import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { MUSCLE_MAPPING } from '../utils/muscleMapping';
import ErrorState from './ErrorState';
import Loading from './Loading';

// Import muscle images
import absImage from '../assets/muscles/abs.jpg.jpg';
import chestImage from '../assets/muscles/chest.jpg.jpg';
import legsImage from '../assets/muscles/legs.jpg.jpg';
import backImage from '../assets/muscles/back.jpg.jpg';
import armsImage from '../assets/muscles/arms.jpg.jpg';
import shouldersImage from '../assets/muscles/shoulders.jpg.jpg';

const ExerciseApiPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
    
    const { data: exercisesData, loading, error, refetch } = useApi(`${API_URL}/exercises?language=2&limit=10`);
    const { data: categoriesData } = useApi(`${API_URL}/exercises/categories`);

    // מיפוי עברית ↔ אנגלית עם תמונות (using centralized mapping)
    const muscleGroups = [
        { hebrew: 'בטן', english: MUSCLE_MAPPING['בטן'], image: absImage },
        { hebrew: 'רגליים', english: MUSCLE_MAPPING['רגליים'], image: legsImage },
        { hebrew: 'חזה', english: MUSCLE_MAPPING['חזה'], image: chestImage },
        { hebrew: 'גב', english: MUSCLE_MAPPING['גב'], image: backImage },
        { hebrew: 'ידיים', english: MUSCLE_MAPPING['ידיים'], image: armsImage },
        { hebrew: 'כתפיים', english: MUSCLE_MAPPING['כתפיים'], image: shouldersImage }
    ];

    const uniqueCategories = React.useMemo(() => {
        if (!exercisesData?.data || !categoriesData?.data) return [];

        const categoriesMap = {};
        categoriesData.data.results.forEach(category => {
            categoriesMap[category.id] = category;
        });

        const exercisesWithCategories = exercisesData.data.results.map(exercise => ({
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

    const handleCategoryClick = (hebrewMuscleName) => {
        // Navigate with Hebrew muscle name (e.g., "גב")
        navigate(`/exercises/${encodeURIComponent(hebrewMuscleName)}`);
    };

    // Show loading while checking auth
    if (authLoading) {
        return <Loading message="בודק הרשאות... ⏳" />;
    }

    // Don't render if not authenticated (will redirect)
    if (!user) {
        return null;
    }

    if (loading) {
        return <Loading message="טוען ספריית תרגילים... ⏳" />;
    }

    if (error) {
        return (
            <div className="card">
                <ErrorState message={error} onRetry={refetch} />
            </div>
        );
    }

    return (
        <div className="card exercise-library-card">
            <h2>קטגוריות תרגילים</h2>
            <div className="muscle-grid">
                {muscleGroups.map((muscle) => (
                    <div
                        key={muscle.english}
                        className="muscle-card"
                        onClick={() => handleCategoryClick(muscle.hebrew)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCategoryClick(muscle.hebrew);
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
