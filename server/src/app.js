import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { existsSync } from 'fs';
import workoutRoutes from './routes/workouts.routes.js';
import authRoutes from './routes/auth.routes.js';
import exercisesRoutes from './routes/exercises.routes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1) Use path.resolve to build absolute paths from server/src -> client/dist
const distPath = path.resolve(__dirname, '..', '..', 'client', 'dist');
const assetsPath = path.resolve(distPath, 'assets');
const clientIndexPath = path.join(distPath, 'index.html');

// 2) Logs to verify paths
console.log('📁 Server __dirname:', __dirname);
console.log('📁 Resolved Dist Path:', distPath);
console.log('📁 Resolved Assets Path:', assetsPath);
console.log('📁 Resolved Index Path:', clientIndexPath);

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

// 3) Serve static files using these three layers (MUST be before routes)
// Layer 1: Serve from /assets prefix
app.use('/assets', express.static(assetsPath));
// Layer 2: Serve from assets folder even if requested from root (The Fix)
app.use(express.static(assetsPath));
// Layer 3: Serve from the main dist folder
app.use(express.static(distPath));

// Logging for confirmation
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

// 4) Catch-all route at the VERY END: serve index.html from dist
app.get('*', (req, res) => {
  // If dist/index.html doesn't exist, return helpful error
  if (!indexExists) {
    return res.status(503).json({
      success: false,
      error: 'Frontend not built. Please run: npm run build:client',
      path: req.path,
      distPath,
    });
  }

  return res.sendFile(path.join(distPath, 'index.html'));
});

// Step 7: Error handlers - MUST be LAST
app.use(notFound);
app.use(errorHandler);

export default app;
