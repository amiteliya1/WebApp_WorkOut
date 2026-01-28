import Workout from '../models/Workout.js';

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Private
export const getAllWorkouts = async (req, res, next) => {
  try {
    console.log(`Fetching all workouts for user: ${req.user._id}`);
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    console.log(`Found ${workouts.length} workouts`);
    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    console.error('Error fetching workouts:', error.message);
    next(error);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req, res, next) => {
  try {
    console.log(`Fetching workout ${req.params.id} for user: ${req.user._id}`);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid workout ID format');
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
      console.log('Workout not found');
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    console.log('Workout fetched successfully');
    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    console.error('Error fetching workout:', error.message);
    next(error);
  }
};

// @desc    Create workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    console.log('Creating new workout:', req.body);

    // Validate required fields
    const { day, name, weight, sets, reps, feeling } = req.body;

    if (!day || typeof day !== 'string') {
      console.log('Validation failed: day is required');
      return res.status(400).json({
        success: false,
        error: 'Day is required and must be a string',
      });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.log('Validation failed: name is required');
      return res.status(400).json({
        success: false,
        error: 'Exercise name is required and must be a non-empty string',
      });
    }

    if (weight === undefined || weight === null || typeof weight !== 'number' || weight < 0) {
      console.log('Validation failed: weight is invalid');
      return res.status(400).json({
        success: false,
        error: 'Weight is required and must be a non-negative number',
      });
    }

    if (!sets || typeof sets !== 'number' || sets < 1) {
      console.log('Validation failed: sets is invalid');
      return res.status(400).json({
        success: false,
        error: 'Sets is required and must be a positive number',
      });
    }

    if (!reps || typeof reps !== 'number' || reps < 1) {
      console.log('Validation failed: reps is invalid');
      return res.status(400).json({
        success: false,
        error: 'Reps is required and must be a positive number',
      });
    }

    if (!feeling || typeof feeling !== 'string') {
      console.log('Validation failed: feeling is required');
      return res.status(400).json({
        success: false,
        error: 'Feeling is required and must be a string',
      });
    }

    // Always set user to the logged-in user
    const workoutData = {
      day: day.trim(),
      name: name.trim(),
      weight,
      sets,
      reps,
      feeling: feeling.trim(),
      user: req.user._id,
    };

    const workout = await Workout.create(workoutData);
    console.log(`Workout created successfully with ID: ${workout._id}`);

    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    console.error('Error creating workout:', error.message);

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
    console.log(`Updating workout ${req.params.id}:`, req.body);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid workout ID format');
      return res.status(400).json({
        success: false,
        error: 'Invalid workout ID format',
      });
    }

    // Validate fields if provided
    if (req.body.name !== undefined) {
      if (typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Exercise name must be a non-empty string',
        });
      }
      req.body.name = req.body.name.trim();
    }

    if (req.body.day !== undefined) {
      if (typeof req.body.day !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Day must be a string',
        });
      }
      req.body.day = req.body.day.trim();
    }

    if (req.body.weight !== undefined) {
      if (typeof req.body.weight !== 'number' || req.body.weight < 0) {
        return res.status(400).json({
          success: false,
          error: 'Weight must be a non-negative number',
        });
      }
    }

    if (req.body.sets !== undefined) {
      if (typeof req.body.sets !== 'number' || req.body.sets < 1) {
        return res.status(400).json({
          success: false,
          error: 'Sets must be a positive number',
        });
      }
    }

    if (req.body.reps !== undefined) {
      if (typeof req.body.reps !== 'number' || req.body.reps < 1) {
        return res.status(400).json({
          success: false,
          error: 'Reps must be a positive number',
        });
      }
    }

    if (req.body.feeling !== undefined) {
      if (typeof req.body.feeling !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Feeling must be a string',
        });
      }
      req.body.feeling = req.body.feeling.trim();
    }

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
      console.log('Workout not found');
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    console.log('Workout updated successfully');
    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    console.error('Error updating workout:', error.message);

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
    console.log(`Deleting workout ${req.params.id} for user: ${req.user._id}`);

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid workout ID format');
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
      console.log('Workout not found');
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    console.log('Workout deleted successfully');
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting workout:', error.message);
    next(error);
  }
};
