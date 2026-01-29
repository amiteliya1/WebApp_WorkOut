import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './config/db.js';
import app from './app.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with correct path
dotenv.config({ path: join(__dirname, '../.env') });

const PORT = process.env.PORT || 10000;

// Start server function
const startServer = async () => {
  try {
    // Connect to database FIRST
    await connectDB();
    console.log('✅ MongoDB connection established');

    // THEN start server - Render requires binding to 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Health check available at: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

