import express from 'express';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workouts.controller.js';

const router = express.Router();

router.route('/').get(getAllWorkouts).post(createWorkout);
router
  .route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;

