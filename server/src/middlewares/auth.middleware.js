import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Protect routes - verify JWT token
// @access  Private
export const protect = async (req, res, next) => {
  let token;

  console.log(`Auth middleware: Protecting route ${req.method} ${req.originalUrl}`);

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware: Token found in Authorization header');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Auth middleware: Token verified for user ID: ${decoded.id}`);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log(`Auth middleware: User not found for ID: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          error: 'User not found',
        });
      }

      console.log(`Auth middleware: User authenticated successfully: ${req.user.email}`);
      next();
    } catch (error) {
      console.error('Auth middleware: Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
    });
  }
};

