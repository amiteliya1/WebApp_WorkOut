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
      error: error.response?.data?.detail || 'שגיאה בטעינת תרגילים מהשרת החיצוני',
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
      error: error.response?.data?.detail || 'שגיאה בטעינת קטגוריות מהשרת החיצוני',
    });
  }
});

/**
 * @route   GET /api/videos
 * @desc    Get YouTube videos for a muscle group (proxy)
 * @access  Private
 */
router.get('/videos', protect, async (req, res, next) => {
  try {
    const { muscle } = req.query;

    if (!muscle) {
      return res.status(400).json({
        success: false,
        error: 'נדרש שם שריר (muscle)',
      });
    }

    // Get YouTube API key from environment
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;

    if (!youtubeApiKey) {
      return res.status(500).json({
        success: false,
        error: 'מפתח API של YouTube לא מוגדר בשרת',
      });
    }

    const searchQuery = muscle.toLowerCase().includes('workout') 
      ? muscle 
      : `${muscle} Gym Workout`;

    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        maxResults: 8,
        q: searchQuery,
        key: youtubeApiKey,
        type: 'video',
        videoDuration: 'short',
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    
    // Handle different error types
    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: 'מפתח API של YouTube לא תקין או חסר הרשאות',
      });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'בקשה לא תקינה - בדוק את הפרמטרים',
      });
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.error?.message || 'שגיאה בטעינת סרטונים מ-YouTube',
    });
  }
});

export default router;

