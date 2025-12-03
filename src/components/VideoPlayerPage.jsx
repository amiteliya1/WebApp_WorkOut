import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Replace with your actual YouTube Data API key
const YOUTUBE_API_KEY = 'AIzaSyAWG8a5jKvgXYcJ0fXzkuB0zi4_tfPAuqE';

const VideoPlayerPage = ({ searchTerm }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                            <a
                                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: '#00e676', fontWeight: 'bold', fontSize: '18px', display: 'block', padding: '5px' }}
                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            >
                                {video.snippet.title}
                            </a>
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
