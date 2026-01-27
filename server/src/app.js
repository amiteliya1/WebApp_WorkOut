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

// Path Definitions: Use path.join(__dirname, '../../client/dist') for the client path
// and path.join(__dirname, '../../client/dist/assets') for assets.
const clientDistPath = join(__dirname, '../../client/dist');
const assetsPath = join(__dirname, '../../client/dist/assets');
const clientIndexPath = join(clientDistPath, 'index.html');

// Log paths for debugging
console.log('📁 Server directory:', __dirname);
console.log('📁 Client dist path:', clientDistPath);
console.log('📁 Assets path:', assetsPath);
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
// MIDDLEWARE ORDER IS CRITICAL - DO NOT CHANGE:
// 1. CORS and body parsers
// 2. Static middleware for /assets (BEFORE any routes)
// 3. Static middleware for rest of dist (BEFORE any routes)
// 4. Logging middleware (with /assets guard)
// 5. API routes
// 6. Catch-all SPA route (LAST, skip /assets and files with extensions)
// 7. Error handlers (LAST)
// ============================================================================

// Step 1: CORS and body parsers
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Step 2: Serve static files - CRITICAL: Place BEFORE any routes
// Use app.use('/assets', express.static(assetsPath)) specifically for the assets folder
if (clientDistExists && existsSync(assetsPath)) {
  // Logging: Keep the debug logs for [STATIC REQUEST] to monitor incoming asset calls
  app.use('/assets', (req, res, next) => {
    const filePath = join(assetsPath, req.path.replace('/assets/', ''));
    const exists = existsSync(filePath);
    console.log(`📦 [STATIC REQUEST] ${req.method} ${req.path} -> ${filePath} (exists: ${exists})`);
    next();
  });
  
  // Use app.use('/assets', express.static(assetsPath)) specifically for the assets folder
  app.use('/assets', express.static(assetsPath));
  console.log('✅ /assets static serving enabled from:', assetsPath);
} else {
  console.warn('⚠️  Assets directory not found:', assetsPath);
}

// Step 3: Use app.use(express.static(clientDistPath)) for the rest of the dist folder
if (clientDistExists) {
  app.use(express.static(clientDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ General static files serving enabled from:', clientDistPath);
} else {
  console.error('❌ Client dist not found! Static files will not be served.');
}

// Step 4: Logging middleware - skip /assets
app.use((req, res, next) => {
  // Do NOT log or modify responses for /assets
  if (req.path.startsWith('/assets')) {
    return next();
  }
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Step 5: API Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', exercisesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Step 6: Catch-all handler for SPA routes - serve index.html
// Ensure app.get('*', ...) is the very LAST route in the file
// The goal is to prevent the catch-all route from intercepting requests for .js and .css files
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Does NOT handle /assets/*
  if (req.path.startsWith('/assets')) {
    return next(); // Let 404 handler deal with it
  }
  
  // Does NOT handle requests with a dot in the path (like .js, .css, .png, etc.)
  if (req.path.includes('.')) {
    return next(); // Let 404 handler deal with it
  }
  
  // Only serves index.html for real SPA routes
  if (clientIndexExists) {
    console.log(`📄 Serving index.html for SPA route: ${req.path}`);
    res.sendFile(clientIndexPath, (err) => {
      if (err) {
        console.error('❌ Error sending index.html:', err);
        // Only send error if response hasn't been sent yet
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Error serving frontend',
            path: req.path,
            details: err.message,
          });
        }
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

// Step 7: Error handlers - MUST be LAST
app.use(notFound);
app.use(errorHandler);

export default app;
