import Workout from '../models/Workout.js';

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Public
export const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Public
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create workout
// @route   POST /api/workouts
// @access  Public
export const createWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Public
export const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Public
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

