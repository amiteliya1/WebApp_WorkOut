import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    console.log(`Registration attempt for email: ${email}`);

    // Validate input - required fields
    if (!email || !password) {
      console.log('Registration validation failed: missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Registration validation failed: invalid email format');
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log('Registration validation failed: password too short');
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`Registration failed: email ${email} already exists`);
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      name: name || undefined,
    });

    console.log(`User registered successfully: ${user.email} (ID: ${user._id})`);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Validate input - required fields
    if (!email || !password) {
      console.log('Login validation failed: missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Find user and include password (select: false by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login failed: user not found for email ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login failed: incorrect password for email ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log(`Login successful for user: ${user.email} (ID: ${user._id})`);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    console.log(`Fetching user profile for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User profile fetch failed: user ID ${req.user.id} not found`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`User profile fetched successfully for: ${user.email}`);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/me
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    console.log(`Delete account request for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`Delete failed: user ID ${req.user.id} not found`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Import Workout model to delete user's workouts
    const Workout = (await import('../models/Workout.js')).default;

    // Delete all workouts belonging to this user
    const deletedWorkouts = await Workout.deleteMany({ user: req.user.id });
    console.log(`Deleted ${deletedWorkouts.deletedCount} workouts for user ${user.email}`);

    // Delete the user
    await User.findByIdAndDelete(req.user.id);
    console.log(`User account deleted successfully: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully',
      data: {
        deletedWorkouts: deletedWorkouts.deletedCount,
      },
    });
  } catch (error) {
    console.error('Error deleting user account:', error.message);
    next(error);
  }
};

