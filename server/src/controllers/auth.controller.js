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

// @desc    Get user favorites
// @route   GET /api/auth/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    console.log(`Fetching favorites for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`Found ${user.favorites.length} favorites for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    next(error);
  }
};

// @desc    Add favorite video
// @route   POST /api/auth/favorites
// @access  Private
export const addFavorite = async (req, res, next) => {
  try {
    const { video } = req.body;
    console.log(`Adding favorite for user ID: ${req.user.id}`);

    if (!video || !video.id || !video.id.videoId) {
      console.log('Invalid video data provided');
      return res.status(400).json({
        success: false,
        error: 'Invalid video data',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if video is already in favorites
    const exists = user.favorites.some(
      (fav) => fav.id.videoId === video.id.videoId
    );

    if (exists) {
      console.log(`Video ${video.id.videoId} already in favorites`);
      return res.status(400).json({
        success: false,
        error: 'Video already in favorites',
      });
    }

    // Add to favorites
    user.favorites.push(video);
    await user.save();

    console.log(`Added favorite video ${video.id.videoId} for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    next(error);
  }
};

// @desc    Remove favorite video
// @route   DELETE /api/auth/favorites/:videoId
// @access  Private
export const removeFavorite = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    console.log(`Removing favorite ${videoId} for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Filter out the video to remove
    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(
      (fav) => fav.id.videoId !== videoId
    );

    if (user.favorites.length === initialLength) {
      console.log(`Video ${videoId} not found in favorites`);
      return res.status(404).json({
        success: false,
        error: 'Video not found in favorites',
      });
    }

    await user.save();

    console.log(`Removed favorite video ${videoId} for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    next(error);
  }
};

// @desc    Get user weekly plan
// @route   GET /api/auth/weeklyPlan
// @access  Private
export const getWeeklyPlan = async (req, res, next) => {
  try {
    console.log(`Fetching weekly plan for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`Found weekly plan with ${user.weeklyPlan.length} days for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.weeklyPlan,
    });
  } catch (error) {
    console.error('Error fetching weekly plan:', error.message);
    next(error);
  }
};

// @desc    Update user weekly plan
// @route   PUT /api/auth/weeklyPlan
// @access  Private
export const updateWeeklyPlan = async (req, res, next) => {
  try {
    const { weeklyPlan } = req.body;
    console.log(`Updating weekly plan for user ID: ${req.user.id}`);

    if (!weeklyPlan || !Array.isArray(weeklyPlan)) {
      console.log('Invalid weekly plan data provided');
      return res.status(400).json({
        success: false,
        error: 'Invalid weekly plan data',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update weekly plan
    user.weeklyPlan = weeklyPlan;
    await user.save();

    console.log(`Updated weekly plan for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.weeklyPlan,
    });
  } catch (error) {
    console.error('Error updating weekly plan:', error.message);
    next(error);
  }
};

// @desc    Get user theme
// @route   GET /api/auth/theme
// @access  Private
export const getTheme = async (req, res, next) => {
  try {
    console.log(`Fetching theme for user ID: ${req.user.id}`);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    console.log(`Found theme '${user.theme}' for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.theme,
    });
  } catch (error) {
    console.error('Error fetching theme:', error.message);
    next(error);
  }
};

// @desc    Update user theme
// @route   PUT /api/auth/theme
// @access  Private
export const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;
    console.log(`Updating theme for user ID: ${req.user.id} to '${theme}'`);

    if (!theme || !['light', 'dark'].includes(theme)) {
      console.log('Invalid theme provided');
      return res.status(400).json({
        success: false,
        error: 'Invalid theme. Must be "light" or "dark"',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log(`User not found: ${req.user.id}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update theme
    user.theme = theme;
    await user.save();

    console.log(`Updated theme to '${theme}' for user ${user.email}`);

    res.status(200).json({
      success: true,
      data: user.theme,
    });
  } catch (error) {
    console.error('Error updating theme:', error.message);
    next(error);
  }
};

