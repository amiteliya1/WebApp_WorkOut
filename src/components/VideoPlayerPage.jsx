import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { useApi } from '../hooks/useApi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const YOUTUBE_API_KEY = 'AIzaSyAWG8a5jKvgXYcJ0fXzkuB0zi4_tfPAuqE';

const VideoPlayerPage = () => {
    const { muscle } = useParams();
    const searchTerm = muscle;
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);

    const isFavorite = (videoId) => {
        return favorites.some(fav => fav.id.videoId === videoId);
    };

    const { data, loading, error } = useApi(
        searchTerm ? 'https://www.googleapis.com/youtube/v3/search' : null,
        {
            params: {
                part: 'snippet',
                maxResults: 8,
                q: `${searchTerm} Gym Workout`,
                key: YOUTUBE_API_KEY,
                type: 'video',
                videoDuration: 'short'
            }
        }
    );

    const videos = data?.items || [];

    const handleToggleFavorite = (video) => {
        if (isFavorite(video.id.videoId)) {
            dispatch(removeFavorite(video.id.videoId));
        } else {
            dispatch(addFavorite(video));
        }
    };

    if (loading) {
        return <div>מחפש סרטונים עבור "{searchTerm}"... ⏳</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="card">
            <h2>סרטונים מומלצים עבור: {searchTerm}</h2>
            {videos.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {videos.map((video) => (
                        <li key={video.id.videoId} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <a
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: '#00e676', fontWeight: 'bold', fontSize: '18px', display: 'block', padding: '5px', flex: 1 }}
                                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    {video.snippet.title}
                                </a>
                                <button
                                    onClick={() => handleToggleFavorite(video)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        color: isFavorite(video.id.videoId) ? '#e91e63' : '#757575',
                                        padding: '5px 10px'
                                    }}
                                    title={isFavorite(video.id.videoId) ? "הסר ממועדפים" : "הוסף למועדפים"}
                                >
                                    {isFavorite(video.id.videoId) ? <FaHeart /> : <FaRegHeart />}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>לא נמצאו סרטונים.</p>
            )}
        </div>
    );
};

export default VideoPlayerPage;
