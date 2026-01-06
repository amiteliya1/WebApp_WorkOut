import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

const ExerciseApiPage = () => {
    const navigate = useNavigate();

    const { data: exercisesData, loading, error } = useApi('https://wger.de/api/v2/exercise/?language=2&limit=10');
    const { data: categoriesData } = useApi('https://wger.de/api/v2/exercisecategory/');

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

    const handleCategoryClick = (categoryName) => {
        navigate(`/exercises/${categoryName}`);
    };

    if (loading) {
        return <div>טוען ספריית תרגילים... ⏳</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="card">
            <h2>קטגוריות תרגילים</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                {uniqueCategories.map((categoryName) => (
                    <button
                        key={categoryName}
                        onClick={() => handleCategoryClick(categoryName)}
                        className="btn-primary"
                        style={{
                            minWidth: '120px',
                            backgroundColor: '#2c3e50', /* Darker for categories */
                            color: '#e0e0e0',
                            border: '1px solid #444'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#00e676';
                            e.target.style.color = '#121212';
                            e.target.style.borderColor = '#00e676';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#2c3e50';
                            e.target.style.color = '#e0e0e0';
                            e.target.style.borderColor = '#444';
                        }}
                    >
                        {categoryName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExerciseApiPage;
