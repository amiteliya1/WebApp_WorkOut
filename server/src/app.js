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

// Define paths
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
// MIDDLEWARE ORDER IS CRITICAL:
// 1. CORS and body parsers
// 2. /assets static (NO fallthrough:false, NO try/catch, NO logging)
// 3. General static
// 4. Logging middleware (skip /assets)
// 5. API routes
// 6. Catch-all SPA route (skip /assets and files with dots)
// 7. Error handlers (LAST, with /assets guard)
// ============================================================================

// Step 1: CORS and body parsers
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log ALL incoming requests to see what's happening
app.use((req, res, next) => {
  console.log(`🌐 [INCOMING] ${req.method} ${req.path} (from ${req.get('referer') || 'direct'})`);
  next();
});

// Step 2: Serve static files (including /assets/*)
// The general express.static will handle /assets/* automatically because
// req.path = /assets/index-XXX.js, and express.static will look for
// clientDistPath + req.path = clientDistPath + /assets/index-XXX.js
if (clientDistExists) {
  // Add logging middleware BEFORE express.static to see what requests come in
  // This MUST be before express.static to catch all requests
  app.use((req, res, next) => {
    // Log ALL requests to see what's happening
    if (req.path.startsWith('/assets/')) {
      const filePath = join(clientDistPath, req.path);
      const exists = existsSync(filePath);
      console.log(`📦 [STATIC REQUEST] ${req.method} ${req.path}`);
      console.log(`📦 [STATIC PATH] Resolved to: ${filePath}`);
      console.log(`📦 [STATIC EXISTS] ${exists}`);
      
      // If file exists but express.static doesn't serve it, serve it manually
      if (exists && req.method === 'GET') {
        console.log(`📦 [MANUAL SERVE] Serving file manually: ${filePath}`);
        return res.sendFile(filePath, (err) => {
          if (err) {
            console.error(`❌ [MANUAL SERVE ERROR] ${err.message}`);
            return next();
          }
        });
      }
    }
    next();
  });
  
  app.use(express.static(clientDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ Static files serving enabled from:', clientDistPath);
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
// 4) Ensure this NEVER matches assets or files with extensions
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // 4) Does NOT handle /assets/*
  if (req.path.startsWith('/assets')) {
    return next(); // Let 404 handler deal with it
  }
  
  // 4) Does NOT handle requests with a dot in the path
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
// 3) The error handler must be LAST middleware in the app
app.use(notFound);
app.use(errorHandler);

export default app;
