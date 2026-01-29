import express from 'express';
import { register, login, getMe, deleteAccount, getFavorites, addFavorite, removeFavorite, getWeeklyPlan, updateWeeklyPlan } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteAccount);

// Favorites routes
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:videoId', protect, removeFavorite);

// Weekly Plan routes
router.get('/weeklyPlan', protect, getWeeklyPlan);
router.put('/weeklyPlan', protect, updateWeeklyPlan);

export default router;

