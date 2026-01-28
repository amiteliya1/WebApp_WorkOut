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

    // Get API URL - always use VITE_API_URL (or localhost fallback)
    const getApiUrl = () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
      return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
    };

    const API_URL = getApiUrl();
    
    const { data: exercisesData, loading, error, refetch } = useApi(`${API_URL}/exercises?language=2&limit=10`);
    const { data: categoriesData } = useApi(`${API_URL}/exercises/categories`);

    // Muscle groups with images (using centralized mapping)
    const muscleGroups = [
        { name: 'Abs', searchTerm: MUSCLE_MAPPING['Abs'], image: absImage },
        { name: 'Legs', searchTerm: MUSCLE_MAPPING['Legs'], image: legsImage },
        { name: 'Chest', searchTerm: MUSCLE_MAPPING['Chest'], image: chestImage },
        { name: 'Back', searchTerm: MUSCLE_MAPPING['Back'], image: backImage },
        { name: 'Arms', searchTerm: MUSCLE_MAPPING['Arms'], image: armsImage },
        { name: 'Shoulders', searchTerm: MUSCLE_MAPPING['Shoulders'], image: shouldersImage }
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

    const handleCategoryClick = (muscleName) => {
        // Navigate with muscle name (e.g., "Back")
        navigate(`/exercises/${encodeURIComponent(muscleName)}`);
    };

    // Show loading while checking auth
    if (authLoading) {
        return <Loading message="Checking permissions..." />;
    }

    // Don't render if not authenticated (will redirect)
    if (!user) {
        return null;
    }

    if (loading) {
        return <Loading message="Loading exercise library..." />;
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
            <h2>Exercise Categories</h2>
            <div className="muscle-grid">
                {muscleGroups.map((muscle) => (
                    <div
                        key={muscle.name}
                        className="muscle-card"
                        onClick={() => handleCategoryClick(muscle.name)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleCategoryClick(muscle.name);
                            }
                        }}
                    >
                        <div className="muscle-card-image">
                            <img
                                src={muscle.image}
                                alt={muscle.name}
                                className="muscle-image"
                            />
                            <div className="muscle-card-overlay"></div>
                        </div>
                        <div className="muscle-card-content">
                            <h3 className="muscle-card-title">{muscle.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseApiPage;
