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

// 1) Bulletproof absolute paths from process.cwd() -> client/dist
// Render logs show process.cwd() is usually '/opt/render/project/src/server'
// So client dist is expected at '/opt/render/project/src/client/dist'
const distPath = path.resolve(process.cwd(), '..', 'client', 'dist');
const assetsPath = path.resolve(distPath, 'assets');
const clientIndexPath = path.join(distPath, 'index.html');

// 2) Logs to verify paths
console.log('📁 Server __dirname:', __dirname);
console.log('📁 Resolved Dist Path:', distPath);
console.log('📁 Resolved Assets Path:', assetsPath);
console.log('📁 Resolved Index Path:', clientIndexPath);
console.log('📁 process.cwd():', process.cwd());

const distExists = existsSync(distPath);
const indexExists = existsSync(clientIndexPath);
const assetsExists = existsSync(assetsPath);

if (distExists && indexExists && assetsExists) {
  console.log('✅ Client dist found! Frontend will be served.');
} else {
  console.warn('⚠️  Warning: client/dist or assets not found. Frontend may not be served correctly.');
  console.warn(`   distPath: ${distPath} (exists: ${distExists})`);
  console.warn(`   clientIndexPath: ${clientIndexPath} (exists: ${indexExists})`);
  console.warn(`   assetsPath: ${assetsPath} (exists: ${assetsExists})`);
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

// 2) Fallback middleware for assets and dist (order matters)
// Serve any file that Vite may have emitted into dist root
app.use(express.static(distPath));
// Serve from /assets prefix
app.use('/assets', express.static(assetsPath));
// Also serve assets even if requested from root (e.g. "/index-XYZ.js")
app.use(express.static(assetsPath));

// 3) Ensure proper Content-Type for JS/CSS (Render/Express + monorepo edge cases)
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.type('text/css');
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

// 4) Catch-all route at the VERY END: serve index.html only for non-file SPA routes
app.get('*', (req, res) => {
  // Do not override file requests (anything with a dot)
  if (req.path.includes('.')) {
    return res.status(404).send('File not found');
  }

  if (!indexExists) {
    return res.status(503).send('Frontend not built. Please run: npm run build:client');
  }

  return res.sendFile(path.join(distPath, 'index.html'));
});

// Step 7: Error handlers - MUST be LAST
app.use(notFound);
app.use(errorHandler);

export default app;
