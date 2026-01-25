import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { getHebrewName } from '../utils/muscleMapping';
import { getSubcategoriesForMuscle } from '../utils/muscleSubcategories';
import { fetchYoutubeVideos } from '../hooks/useYoutubeVideos';
import ErrorState from './ErrorState';
import Loading from './Loading';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const VideoPlayerPage = () => {
    const { muscle } = useParams();
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);
    
    // Get Hebrew muscle name from URL param (could be Hebrew or English)
    const hebrewMuscleName = getHebrewName(muscle) || muscle;
    
    // Get subcategories for this muscle
    const subcategories = getSubcategoriesForMuscle(hebrewMuscleName);
    
    // Default selected subcategory: "כללי" (general) or first one
    const defaultSubcategory = subcategories.find(sub => sub.labelHe === 'כללי') || subcategories[0];
    const [selectedSubcategory, setSelectedSubcategory] = useState(defaultSubcategory);
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get YouTube API key from environment
    const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    // Fetch videos when subcategory changes
    useEffect(() => {
        const loadVideos = async () => {
            if (!muscle) {
                setError('נדרש שם שריר');
                setLoading(false);
                return;
            }

            if (!YOUTUBE_API_KEY) {
                setError('חסר מפתח YouTube API (VITE_YOUTUBE_API_KEY)');
                setLoading(false);
                return;
            }

            if (!selectedSubcategory) {
                setVideos([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // Build combined query: Hebrew label + English query
            const combinedQuery = `${selectedSubcategory.labelHe} ${selectedSubcategory.query}`;

            const result = await fetchYoutubeVideos(combinedQuery, YOUTUBE_API_KEY, 20);

            if (result.error) {
                setError(result.error);
                setVideos([]);
            } else {
                setVideos(result.videos);
                if (result.videos.length === 0) {
                    setError('לא נמצאו סרטונים קצרים (עד 60 שניות) עבור הקטגוריה הזו');
                }
            }

            setLoading(false);
        };

        loadVideos();
    }, [muscle, selectedSubcategory, YOUTUBE_API_KEY]);

    // Update selected subcategory when muscle changes
    useEffect(() => {
        if (subcategories.length > 0) {
            const defaultSub = subcategories.find(sub => sub.labelHe === 'כללי') || subcategories[0];
            setSelectedSubcategory(defaultSub);
        }
    }, [hebrewMuscleName, subcategories]);

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const isFavorite = (videoId) => {
        return favorites.some(fav => fav.id.videoId === videoId);
    };

    const handleToggleFavorite = (video) => {
        if (isFavorite(video.id.videoId)) {
            dispatch(removeFavorite(video.id.videoId));
        } else {
            dispatch(addFavorite(video));
        }
    };

    const handleVideoClick = (videoId) => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
    };

    // If no subcategories found for this muscle
    if (subcategories.length === 0) {
        return (
            <div className="card">
                <div className="error-message" style={{ color: 'var(--error, #ff4444)', padding: '20px', textAlign: 'center' }}>
                    לא נמצאו קטגוריות משנה עבור "{hebrewMuscleName}"
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>סרטונים עבור: {hebrewMuscleName}</h2>
            
            {/* Subcategories List */}
            <div style={{ 
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border, #333)'
            }}>
                <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    color: 'var(--text, #fff)'
                }}>
                    קטגוריות משנה:
                </h3>
                <div className="subcategories-list">
                    {subcategories.map((sub, index) => (
                        <button
                            key={index}
                            onClick={() => handleSubcategoryClick(sub)}
                            className={`subcategory-button ${selectedSubcategory.labelHe === sub.labelHe ? 'active' : ''}`}
                        >
                            {sub.labelHe}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Section */}
            {loading ? (
                <Loading message={`מחפש סרטונים עבור "${selectedSubcategory.labelHe}"... ⏳`} />
            ) : error ? (
                <div className="card" style={{ marginTop: '20px' }}>
                    <ErrorState 
                        message={error} 
                        onRetry={() => {
                            setError(null);
                            setLoading(true);
                            // Trigger refetch by updating state
                            const loadVideos = async () => {
                                if (!muscle || !YOUTUBE_API_KEY || !selectedSubcategory) {
                                    setLoading(false);
                                    return;
                                }
                                const combinedQuery = `${selectedSubcategory.labelHe} ${selectedSubcategory.query}`;
                                const result = await fetchYoutubeVideos(combinedQuery, YOUTUBE_API_KEY, 20);
                                if (result.error) {
                                    setError(result.error);
                                    setVideos([]);
                                } else {
                                    setVideos(result.videos);
                                    if (result.videos.length === 0) {
                                        setError('לא נמצאו סרטונים קצרים (עד 60 שניות) עבור הקטגוריה הזו');
                                    } else {
                                        setError(null);
                                    }
                                }
                                setLoading(false);
                            };
                            loadVideos();
                        }}
                    />
                </div>
            ) : videos.length > 0 ? (
                <>
                    <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        marginBottom: '16px',
                        color: 'var(--text, #fff)'
                    }}>
                        סרטונים קצרים עבור: {selectedSubcategory.labelHe}
                    </h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px' 
                    }}>
                        {videos.map((video) => (
                            <div
                                key={video.id.videoId}
                                style={{
                                    border: '1px solid var(--border, #333)',
                                    borderRadius: 'var(--radius, 8px)',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    background: 'var(--surface, #1a1a1a)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 230, 118, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                onClick={() => handleVideoClick(video.id.videoId)}
                            >
                                {/* Thumbnail */}
                                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
                                    <img
                                        src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                                        alt={video.snippet.title}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>
                                
                                {/* Content */}
                                <div style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: 'var(--text, #fff)',
                                                flex: 1,
                                                lineHeight: '1.4',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {video.snippet.title}
                                        </h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(video);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '20px',
                                                color: isFavorite(video.id.videoId) ? '#e91e63' : '#757575',
                                                padding: '4px',
                                                flexShrink: 0,
                                            }}
                                            title={isFavorite(video.id.videoId) ? "הסר ממועדפים" : "הוסף למועדפים"}
                                        >
                                            {isFavorite(video.id.videoId) ? <FaHeart /> : <FaRegHeart />}
                                        </button>
                                    </div>
                                    <p
                                        style={{
                                            margin: '8px 0 0 0',
                                            fontSize: '12px',
                                            color: 'var(--muted, #999)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {video.snippet.channelTitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted, #999)' }}>
                    <p>לא נמצאו סרטונים קצרים עבור "{selectedSubcategory.labelHe}".</p>
                    <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        נסה לבחור קטגוריה אחרת או לבדוק את החיבור לאינטרנט.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayerPage;
