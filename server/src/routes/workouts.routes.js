import express from 'express';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workouts.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All workout routes are protected
router.route('/').get(protect, getAllWorkouts).post(protect, createWorkout);
router
  .route('/:id')
  .get(protect, getWorkoutById)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

export default router;

