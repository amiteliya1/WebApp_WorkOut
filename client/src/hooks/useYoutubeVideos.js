import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Get auth header with token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Custom hook for fetching YouTube videos through our secure server API
 * @param {string} query - Search query (English combined)
 * @param {number} maxResults - Maximum number of results to fetch (default: 20)
 * @returns {{videos: Array, loading: boolean, error: string|null, refetch: Function}}
 */
export const useYoutubeVideos = (query, maxResults = 20) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideos = useCallback(async () => {
        if (!query) {
            setVideos([]);
            setError('Search query is required');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Call our server API instead of YouTube directly
            const response = await axios.get(`${API_URL}/videos`, {
                params: {
                    query: query,
                    maxResults: maxResults,
                },
                headers: getAuthHeader(),
            });

            if (response.data.success) {
                setVideos(response.data.data || []);
                setError(null);
            } else {
                setVideos([]);
                setError(response.data.error || 'Error loading videos');
            }
        } catch (err) {
            console.error('Server API Error:', err);

            let errorMessage = 'Error loading videos from server';

            if (err.response) {
                const status = err.response.status;
                const errorData = err.response.data;

                if (status === 403) {
                    errorMessage = errorData?.error || 'YouTube API quota exceeded. Please try again later.';
                } else if (status === 401) {
                    errorMessage = 'Authentication required. Please login again.';
                } else if (status === 400) {
                    errorMessage = errorData?.error || 'Invalid request - check the parameters';
                } else if (status === 503) {
                    errorMessage = 'Unable to connect to YouTube API. Please check your internet connection.';
                } else {
                    errorMessage = errorData?.error || `Server error (${status})`;
                }
            } else if (err.request) {
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            }

            setVideos([]);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [query, maxResults]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const refetch = useCallback(() => {
        fetchVideos();
    }, [fetchVideos]);

    return { videos, loading, error, refetch };
};

