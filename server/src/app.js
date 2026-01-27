import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';
import workoutRoutes from './routes/workouts.routes.js';
import authRoutes from './routes/auth.routes.js';
import exercisesRoutes from './routes/exercises.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1) Define paths
const clientDistPath = join(__dirname, '../../client/dist');
const assetsPath = join(clientDistPath, 'assets');
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
// 1. CORS and body parsers (must be first for all requests)
// 2. /assets static (MUST be first, with fallthrough:false to prevent interference)
// 3. General static (for other static files like index.html, with fallthrough:true)
// 4. Logging middleware (with /assets guard)
// 5. API routes
// 6. Catch-all SPA route (with /assets and file extension guards)
// 7. Error handlers (last, with proper 404 handling)
// ============================================================================

// Step 1: CORS and body parsers (applied to all requests)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Step 2: Serve /assets/* FIRST with fallthrough:false
// This ensures /assets/* requests NEVER reach any other middleware
// If file not found, express.static will call next() with error, which we handle
if (clientDistExists && existsSync(assetsPath)) {
  app.use('/assets', (req, res, next) => {
    // Debug log for /assets requests
    const filePath = join(assetsPath, req.path.replace('/assets/', ''));
    const fileExists = existsSync(filePath);
    console.log(`📦 [ASSETS] ${req.method} ${req.path} -> ${filePath} (exists: ${fileExists})`);
    next();
  });
  
  // Serve /assets/* with fallthrough:false - this prevents the request from continuing
  // if the file is not found (it will call next() with an error)
  app.use('/assets', express.static(assetsPath, {
    fallthrough: false, // CRITICAL: Don't let request continue if file not found
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  
  console.log('✅ /assets static serving enabled from:', assetsPath);
} else {
  console.warn('⚠️  Assets directory not found:', assetsPath);
}

// Step 3: Serve other static files (index.html, etc.) with fallthrough:true
// This allows requests to continue to other routes if file not found
if (clientDistExists) {
  app.use(express.static(clientDistPath, {
    fallthrough: true, // Allow request to continue if file not found
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ General static files serving enabled from:', clientDistPath);
} else {
  console.error('❌ Client dist not found! Static files will not be served.');
}

// Step 4: Logging middleware - GUARD: immediately skip /assets
// This should NEVER be reached for /assets/* if express.static works correctly
app.use((req, res, next) => {
  // 3) Guard: immediately next() for /assets - should never reach here
  if (req.path.startsWith('/assets')) {
    console.error(`🚨 [ERROR] Non-static middleware touched /assets: ${req.method} ${req.path} - This should NEVER happen!`);
    return next(); // This should never happen, but guard anyway
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
// 4) Ensure this NEVER matches assets or files with extensions
app.get('*', (req, res, next) => {
  // Skip API routes (shouldn't reach here, but safety check)
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // 4) Skip /assets - should never reach here, but guard anyway
  if (req.path.startsWith('/assets')) {
    console.error(`🚨 [ERROR] Catch-all route touched /assets: ${req.path} - This should NEVER happen!`);
    return res.status(404).end(); // Return 404, not 500
  }
  
  // 4) Skip files with extensions - return 404, DO NOT serve index.html
  if (req.path.includes('.')) {
    // Check if it's a known file extension
    if (req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|json|xml|txt)$/)) {
      return res.status(404).end(); // Return 404, not 500, DO NOT serve index.html
    }
  }
  
  // For all other routes (SPA routes like /, /login, /register, etc.), serve index.html
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

// Step 7: Error handling - 404 for API routes and missing static files
// 5) Ensure error handler does NOT convert static 404 into 500
// Custom error handler for static files BEFORE the general error handler
app.use((err, req, res, next) => {
  // If this is a static file request and file not found, return 404
  if (req.path.startsWith('/assets') || req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
    if (err.status === 404 || err.statusCode === 404 || err.code === 'ENOENT') {
      console.log(`📦 Static file not found: ${req.path} - returning 404`);
      return res.status(404).end(); // Return 404, not 500
    }
  }
  // Pass to general error handler
  next(err);
});

app.use(notFound);
app.use(errorHandler);

export default app;
