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
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid workout ID format',
      });
    }

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
    // Validate required fields
    const { title, duration } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be a non-empty string',
      });
    }

    if (!duration || typeof duration !== 'number' || duration < 1) {
      return res.status(400).json({
        success: false,
        error: 'Duration is required and must be a positive number',
      });
    }

    // Validate notes length if provided
    if (req.body.notes && req.body.notes.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Notes cannot exceed 500 characters',
      });
    }

    // Always set user to the logged-in user, ignore any user from client
    const workoutData = {
      title: title.trim(),
      duration,
      notes: req.body.notes ? req.body.notes.trim() : undefined,
      user: req.user._id,
    };

    const workout = await Workout.create(workoutData);
    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid workout ID format',
      });
    }

    // Validate title if provided
    if (req.body.title !== undefined) {
      if (typeof req.body.title !== 'string' || req.body.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title must be a non-empty string',
        });
      }
      req.body.title = req.body.title.trim();
    }

    // Validate duration if provided
    if (req.body.duration !== undefined) {
      if (typeof req.body.duration !== 'number' || req.body.duration < 1) {
        return res.status(400).json({
          success: false,
          error: 'Duration must be a positive number',
        });
      }
    }

    // Validate notes length if provided
    if (req.body.notes !== undefined && req.body.notes.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Notes cannot exceed 500 characters',
      });
    }

    // Remove user from update data if present (user cannot be changed)
    const { user, ...updateData } = req.body;
    if (req.body.notes) {
      updateData.notes = req.body.notes.trim();
    }
    
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
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid workout ID format',
      });
    }

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

