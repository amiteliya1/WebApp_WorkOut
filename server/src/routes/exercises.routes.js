import express from 'express';
import axios from 'axios';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Wger API base URL
const WGER_API_BASE = 'https://wger.de/api/v2';

// YouTube API base URL
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * @route   GET /api/exercises
 * @desc    Get exercises from wger.de API (proxy)
 * @access  Private
 */
router.get('/exercises', protect, async (req, res, next) => {
  try {
    const { language = 2, limit = 10 } = req.query;
    
    const response = await axios.get(`${WGER_API_BASE}/exercise/`, {
      params: {
        language,
        limit,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Wger API Error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || 'Error loading exercises from external server',
    });
  }
});

/**
 * @route   GET /api/exercises/categories
 * @desc    Get exercise categories from wger.de API (proxy)
 * @access  Private
 */
router.get('/exercises/categories', protect, async (req, res, next) => {
  try {
    const response = await axios.get(`${WGER_API_BASE}/exercisecategory/`);

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Wger Categories API Error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || 'Error loading categories from external server',
    });
  }
});

/**
 * @route   GET /api/videos
 * @desc    Get YouTube shorts for a search query (proxy with filtering)
 * @access  Private
 */
router.get('/videos', protect, async (req, res, next) => {
  try {
    const { query, maxResults = 20 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required (query parameter)',
      });
    }

    // Get YouTube API key from environment
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeApiKey) {
      return res.status(500).json({
        success: false,
        error: 'YouTube API key is not configured on the server',
      });
    }

    // Step 1: Search for videos with videoDuration=short
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        maxResults: parseInt(maxResults),
        q: `${query} shorts`,
        key: youtubeApiKey,
        type: 'video',
        videoDuration: 'short',
      },
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Step 2: Get video IDs
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

    // Step 3: Fetch video details to get duration
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'contentDetails,snippet',
        id: videoIds,
        key: youtubeApiKey,
      },
    });

    if (!detailsResponse.data.items || detailsResponse.data.items.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
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

    res.status(200).json({
      success: true,
      data: shortVideos,
    });
  } catch (error) {
    console.error('YouTube API Error:', error.message);

    // Handle different error types
    if (error.response?.status === 403) {
      const errorData = error.response.data?.error;

      if (errorData?.errors?.[0]?.reason === 'quotaExceeded') {
        return res.status(403).json({
          success: false,
          error: 'YouTube API quota exceeded. Please try again later.',
        });
      } else if (errorData?.errors?.[0]?.reason === 'forbidden') {
        return res.status(403).json({
          success: false,
          error: 'YouTube API key is invalid or missing permissions',
        });
      }

      return res.status(403).json({
        success: false,
        error: 'YouTube API authorization error (403)',
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request - check the parameters',
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'YouTube API key is invalid',
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'YouTube API service not found',
      });
    }

    if (error.request) {
      return res.status(503).json({
        success: false,
        error: 'Unable to connect to YouTube API. Please check your internet connection.',
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.error?.message || 'Error loading videos from YouTube',
    });
  }
});

export default router;

