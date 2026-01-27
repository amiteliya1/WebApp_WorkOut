import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import workoutRoutes from './routes/workouts.routes.js';
import authRoutes from './routes/auth.routes.js';
import exercisesRoutes from './routes/exercises.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to client/dist
const clientDistPath = join(__dirname, '../../client/dist');
const clientIndexPath = join(clientDistPath, 'index.html');

// Log paths for debugging
console.log('📁 Server directory:', __dirname);
console.log('📁 Client dist path:', clientDistPath);
console.log('📁 Client index path:', clientIndexPath);

// Check if client/dist exists
const clientDistExists = existsSync(clientDistPath);
const clientIndexExists = existsSync(clientIndexPath);

if (clientDistExists && clientIndexExists) {
  console.log('✅ Client dist found! Frontend will be served.');
} else {
  console.warn('⚠️  Warning: client/dist not found. Frontend will not be served.');
  console.warn(`   Expected path: ${clientDistPath}`);
  console.warn(`   Dist exists: ${clientDistExists}`);
  console.warn(`   Index exists: ${clientIndexExists}`);
  console.warn('   Make sure to run: npm run build:client');
}

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

// Serve static files from client/dist (only if it exists)
if (clientDistExists) {
  // Serve static files with proper MIME types
  app.use(express.static(clientDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ Static files serving enabled from:', clientDistPath);
} else {
  console.error('❌ Client dist not found! Static files will not be served.');
}

// Catch-all handler: send back React's index.html file for client routes
// This must be AFTER all API routes and static files, BEFORE 404 handler
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Skip static assets - they should be handled by express.static above
  // If we reach here for a static file, it means it wasn't found
  if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
    console.warn(`⚠️  Static file not found: ${req.path}`);
    return res.status(404).json({
      success: false,
      error: 'Static file not found',
      path: req.path,
    });
  }
  
  // For all other routes (SPA routes), serve index.html
  if (clientIndexExists) {
    console.log(`📄 Serving index.html for route: ${req.path}`);
    res.sendFile(clientIndexPath, (err) => {
      if (err) {
        console.error('❌ Error sending index.html:', err);
        res.status(500).json({
          success: false,
          error: 'Error serving frontend',
          path: req.path,
          details: err.message,
        });
      }
    });
  } else {
    // If dist doesn't exist, return helpful error message
    console.warn(`⚠️  Frontend not built. Requested path: ${req.path}`);
    res.status(503).json({
      success: false,
      error: 'Frontend not built. Please run: npm run build:client',
      path: req.path,
      distPath: clientDistPath,
    });
  }
});

// Error handling - 404 for API routes only
app.use(notFound);
app.use(errorHandler);

export default app;
