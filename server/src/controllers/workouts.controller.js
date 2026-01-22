import Workout from '../models/Workout.js';

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Private
export const getAllWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
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
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

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
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    // Always set user to the logged-in user, ignore any user from client
    const workoutData = {
      ...req.body,
      user: req.user._id,
    };
    const workout = await Workout.create(workoutData);
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
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    // Remove user from update data if present (user cannot be changed)
    const { user, ...updateData } = req.body;
    
    const workout = await Workout.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updateData,
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
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

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

