import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { getMuscleName } from '../utils/muscleMapping';
import { getSubcategoriesForMuscle } from '../utils/muscleSubcategories';
import { fetchYoutubeVideos } from '../hooks/useYoutubeVideos';
import ErrorState from './ErrorState';
import Loading from './Loading';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const VideoPlayerPage = () => {
    const { muscle } = useParams();
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);

    // Get muscle name from URL param (could be Hebrew or English)
    const muscleName = getMuscleName(muscle) || muscle;

    // Get subcategories for this muscle
    const subcategories = getSubcategoriesForMuscle(muscleName);

    // Default selected subcategory: "General" or first one
    const defaultSubcategory = subcategories.find(sub => sub.label === 'General') || subcategories[0];
    const [selectedSubcategory, setSelectedSubcategory] = useState(defaultSubcategory);
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch videos when subcategory changes
    useEffect(() => {
        const loadVideos = async () => {
            if (!muscle) {
                setError('Muscle name is required');
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

            // Build combined query: English label + English query
            const combinedQuery = `${selectedSubcategory.label} ${selectedSubcategory.query}`;

            const result = await fetchYoutubeVideos(combinedQuery, 20);

            if (result.error) {
                setError(result.error);
                setVideos([]);
            } else {
                setVideos(result.videos);
                if (result.videos.length === 0) {
                    setError('No short videos (up to 60 seconds) found for this category');
                }
            }

            setLoading(false);
        };

        loadVideos();
    }, [muscle, selectedSubcategory]);

    // Update selected subcategory when muscle changes
    useEffect(() => {
        if (subcategories.length > 0) {
            const defaultSub = subcategories.find(sub => sub.label === 'General') || subcategories[0];
            setSelectedSubcategory(defaultSub);
        }
    }, [muscleName, subcategories]);

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
                    No subcategories found for "{muscleName}"
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Videos for: {muscleName}</h2>

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
                    Subcategories:
                </h3>
                <div className="subcategories-list">
                    {subcategories.map((sub, index) => (
                        <button
                            key={index}
                            onClick={() => handleSubcategoryClick(sub)}
                            className={`subcategory-button ${selectedSubcategory.label === sub.label ? 'active' : ''}`}
                        >
                            {sub.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Section */}
            {loading ? (
                <Loading message={`Searching for videos for "${selectedSubcategory.label}"...`} />
            ) : error ? (
                <div className="card" style={{ marginTop: '20px' }}>
                    <ErrorState
                        message={error}
                        onRetry={() => {
                            setError(null);
                            setLoading(true);
                            // Trigger refetch by updating state
                            const loadVideos = async () => {
                                if (!muscle || !selectedSubcategory) {
                                    setLoading(false);
                                    return;
                                }
                                const combinedQuery = `${selectedSubcategory.label} ${selectedSubcategory.query}`;
                                const result = await fetchYoutubeVideos(combinedQuery, 20);
                                if (result.error) {
                                    setError(result.error);
                                    setVideos([]);
                                } else {
                                    setVideos(result.videos);
                                    if (result.videos.length === 0) {
                                        setError('No short videos (up to 60 seconds) found for this category');
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
                        Short videos for: {selectedSubcategory.label}
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
                                            title={isFavorite(video.id.videoId) ? "Remove from favorites" : "Add to favorites"}
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
                    <p>No short videos found for "{selectedSubcategory.label}".</p>
                    <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        Try selecting another category or check your internet connection.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayerPage;
