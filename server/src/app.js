import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import workoutRoutes from './routes/workouts.routes.js';
import authRoutes from './routes/auth.routes.js';
import exercisesRoutes from './routes/exercises.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS Configuration - Support Vercel domains and localhost
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins
    const allowedOrigins = [
      'https://web-app-work-out-client.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5180',
    ];

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check if origin ends with .vercel.app (for preview deployments)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

// Middleware - CORS must be before routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', exercisesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Serve static files from client/dist
app.use(express.static(join(__dirname, '../../client/dist')));

// Catch-all handler: send back React's index.html file for client routes
// This must be AFTER all API routes and BEFORE 404 handler
app.get('*', (req, res, next) => {
  // Only handle non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(__dirname, '../../client/dist/index.html'));
  } else {
    // API routes that don't exist should go to 404 handler
    next();
  }
});

// Error handling - 404 for API routes only
app.use(notFound);
app.use(errorHandler);

export default app;
