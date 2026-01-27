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

// 1. Define paths correctly:
const distPath = join(__dirname, '../../client/dist');
const assetsPath = join(__dirname, '../../client/dist/assets');
const clientIndexPath = join(distPath, 'index.html');

// Log paths for debugging
console.log('📁 Server directory:', __dirname);
console.log('📁 Dist path:', distPath);
console.log('📁 Assets path:', assetsPath);
console.log('📁 Index path:', clientIndexPath);

// Check if client/dist exists
const distExists = existsSync(distPath);
const indexExists = existsSync(clientIndexPath);

if (distExists && indexExists) {
  console.log('✅ Client dist found! Frontend will be served.');
} else {
  console.warn('⚠️  Warning: client/dist not found. Frontend will not be served.');
  console.warn(`   Expected path: ${distPath}`);
  console.warn(`   Dist exists: ${distExists}`);
  console.warn(`   Index exists: ${indexExists}`);
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

// Step 2: Serve static files using multiple layers - CRITICAL: Place BEFORE any routes
// 2. Serve static files using multiple layers:
if (distExists && existsSync(assetsPath)) {
  // Layer A: Serve from /assets prefix
  app.use('/assets', express.static(assetsPath));
  console.log('✅ Layer A: /assets static serving enabled from:', assetsPath);
  
  // Layer B: Serve from assets folder even if requested from root (The Fix)
  // This handles cases where browser requests /index-XXX.js but file is in /assets/
  app.use(express.static(assetsPath));
  console.log('✅ Layer B: Root requests -> assets folder enabled');
  
  // Layer C: Serve from the main dist folder
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));
  console.log('✅ Layer C: General static files serving enabled from:', distPath);
} else {
  console.error('❌ Client dist or assets not found! Static files will not be served.');
}

// Step 3: Logging for confirmation
// 3. Logging for confirmation:
app.use((req, res, next) => {
  if (req.url.endsWith('.css') || req.url.endsWith('.js')) {
    console.log(`📦 [ASSET CHECK] Request: ${req.url}`);
  }
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

// Step 5: Catch-all handler for SPA routes - serve index.html
// 4. Ensure the Catch-all route is at the VERY END:
// Goal: Prevent the catch-all route from returning index.html when the browser asks for a .css or .js file from the root
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Not Found' });
  }
  
  // Does NOT handle /assets/*
  if (req.path.startsWith('/assets')) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  
  // Does NOT handle requests with a dot in the path (like .js, .css, .png, etc.)
  // This prevents the catch-all from returning index.html for .css/.js files
  if (req.path.includes('.')) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }
  
  // Only serves index.html for real SPA routes
  if (indexExists) {
    console.log(`📄 Serving index.html for SPA route: ${req.path}`);
    res.sendFile(clientIndexPath, (err) => {
      if (err) {
        console.error('❌ Error sending index.html:', err);
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
    res.status(503).json({
      success: false,
      error: 'Frontend not built. Please run: npm run build:client',
      path: req.path,
      distPath: distPath,
    });
  }
});

// Step 7: Error handlers - MUST be LAST
app.use(notFound);
app.use(errorHandler);

export default app;
