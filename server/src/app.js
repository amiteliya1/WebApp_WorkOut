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

// ============================================================================
// MIDDLEWARE ORDER IS CRITICAL:
// 1. CORS and body parsers (must be first for all requests)
// 2. express.static (MUST be before any other middleware to serve assets)
// 3. Logging middleware (skip /assets to avoid interference)
// 4. API routes
// 5. Catch-all SPA route (skip /assets and file extensions)
// 6. Error handlers (last)
// ============================================================================

// Step 1: CORS and body parsers (applied to all requests)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Step 2: Serve static files FIRST - this handles /assets/*.js, /assets/*.css, etc.
// Order matters: express.static must be registered BEFORE any other middleware
// that might interfere with static file requests. If a file exists, express.static
// will serve it and stop the request chain. If not, it calls next().
if (clientDistExists) {
  app.use(express.static(clientDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ Static files serving enabled from:', clientDistPath);
} else {
  console.error('❌ Client dist not found! Static files will not be served.');
}

// Step 3: Logging middleware - explicitly skip /assets to avoid interference
// This runs AFTER express.static, so if a static file was found, it won't reach here
app.use((req, res, next) => {
  // Skip logging for static assets - they should already be handled by express.static
  if (req.path.startsWith('/assets/')) {
    return next();
  }
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Step 4: API Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', exercisesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Step 5: Catch-all handler for SPA routes - serve index.html
// This must be AFTER express.static and API routes, but BEFORE error handlers
// Order matters: express.static handles /assets/* first, so this only runs for
// routes that don't match static files or API routes.
app.get('*', (req, res, next) => {
  // Skip API routes (shouldn't reach here, but safety check)
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Skip static assets - express.static should have handled these already
  // If we reach here for /assets/*, it means the file doesn't exist (404)
  if (req.path.startsWith('/assets/')) {
    return next(); // Let 404 handler deal with missing static files
  }
  
  // Skip file extensions - these should be handled by express.static
  if (req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
    return next(); // Let 404 handler deal with missing files
  }
  
  // For all other routes (SPA routes like /, /login, /register, etc.), serve index.html
  if (clientIndexExists) {
    console.log(`📄 Serving index.html for SPA route: ${req.path}`);
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

// Step 6: Error handling - 404 for API routes and missing static files
app.use(notFound);
app.use(errorHandler);

export default app;
