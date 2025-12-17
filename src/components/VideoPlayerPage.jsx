import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const YOUTUBE_API_KEY = 'AIzaSyAWG8a5jKvgXYcJ0fXzkuB0zi4_tfPAuqE';

const VideoPlayerPage = () => {
    const { muscle } = useParams();
    const searchTerm = muscle;
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        maxResults: 8,
                        q: `${searchTerm} Gym Workout`,
                        key: YOUTUBE_API_KEY,
                        type: 'video',
                        videoDuration: 'short'
                    }
                });
                setVideos(response.data.items);
                setLoading(false);
            } catch (err) {
                setError('שגיאה בחיפוש סרטונים. אנא נסה שנית מאוחר יותר.');
                setLoading(false);
                console.error("Error fetching videos:", err);
            }
        };

        if (searchTerm) {
            fetchVideos();
        }
    }, [searchTerm]);

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
                                    onClick={() => {
                                        if (isFavorite(video.id.videoId)) {
                                            removeFavorite(video.id.videoId);
                                        } else {
                                            addFavorite(video);
                                        }
                                    }}
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
