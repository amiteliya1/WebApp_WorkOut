import axios from 'axios';

// Create a separate axios instance for YouTube API without Authorization header
const youtubeAxios = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
});

// Explicitly remove Authorization header for YouTube requests
youtubeAxios.interceptors.request.use((config) => {
    // Remove Authorization header if it exists
    delete config.headers['Authorization'];
    delete config.headers['authorization'];
    return config;
});

/**
 * Fetch YouTube videos with filtering for shorts (<= 60 seconds)
 * @param {string} query - Search query (Hebrew + English combined)
 * @param {string} apiKey - YouTube API key
 * @param {number} maxResults - Maximum number of results to fetch (default: 20, will filter to <= 60s)
 * @returns {Promise<{videos: Array, error: string|null}>}
 */
export const fetchYoutubeVideos = async (query, apiKey, maxResults = 20) => {
    if (!apiKey) {
        return {
            videos: [],
            error: 'חסר מפתח YouTube API (VITE_YOUTUBE_API_KEY)',
        };
    }

    if (!query) {
        return {
            videos: [],
            error: 'נדרש שאילתת חיפוש',
        };
    }

    try {
        // Step 1: Search for videos with videoDuration=short
        const searchResponse = await youtubeAxios.get('/search', {
            params: {
                part: 'snippet',
                maxResults: maxResults,
                q: `${query} shorts`,
                key: apiKey,
                type: 'video',
                videoDuration: 'short',
            },
            headers: {},
        });

        if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
            return {
                videos: [],
                error: null, // No error, just no results
            };
        }

        // Step 2: Get video IDs
        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        // Step 3: Fetch video details to get duration
        const detailsResponse = await youtubeAxios.get('/videos', {
            params: {
                part: 'contentDetails,snippet',
                id: videoIds,
                key: apiKey,
            },
            headers: {},
        });

        if (!detailsResponse.data.items || detailsResponse.data.items.length === 0) {
            return {
                videos: [],
                error: null,
            };
        }

        // Step 4: Filter videos <= 60 seconds (true shorts)
        const shortVideos = detailsResponse.data.items
            .filter(video => {
                // Parse duration (format: PT1M30S = 1 minute 30 seconds)
                const duration = video.contentDetails.duration;
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (!match) return false;

                const hours = parseInt(match[1] || 0);
                const minutes = parseInt(match[2] || 0);
                const seconds = parseInt(match[3] || 0);
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;

                return totalSeconds <= 60;
            })
            .map(video => ({
                id: { videoId: video.id },
                snippet: video.snippet,
                contentDetails: video.contentDetails,
            }));

        return {
            videos: shortVideos,
            error: null,
        };
    } catch (err) {
        console.error('YouTube API Error:', err);
        
        let errorMessage = 'שגיאה בטעינת סרטונים מ-YouTube';
        
        if (err.response) {
            const status = err.response.status;
            const errorData = err.response.data?.error;
            
            if (status === 403) {
                if (errorData?.errors?.[0]?.reason === 'quotaExceeded') {
                    errorMessage = 'מכסת ה-API של YouTube אזלה. נסה שוב מאוחר יותר.';
                } else if (errorData?.errors?.[0]?.reason === 'forbidden') {
                    errorMessage = 'מפתח API של YouTube לא תקין או חסר הרשאות';
                } else {
                    errorMessage = 'שגיאת הרשאות ב-YouTube API (403)';
                }
            } else if (status === 400) {
                errorMessage = 'בקשה לא תקינה - בדוק את הפרמטרים';
            } else if (status === 401) {
                errorMessage = 'מפתח API של YouTube לא תקין';
            } else if (status === 404) {
                errorMessage = 'שירות YouTube API לא נמצא';
            } else {
                errorMessage = errorData?.message || `שגיאת שרת YouTube (${status})`;
            }
        } else if (err.request) {
            errorMessage = 'לא ניתן להתחבר ל-YouTube API. בדוק את החיבור לאינטרנט.';
        }

        return {
            videos: [],
            error: errorMessage,
        };
    }
};

