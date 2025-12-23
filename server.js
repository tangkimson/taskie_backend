// Main server file for Taskie Backend
// This file initializes the Express server and connects to MongoDB

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const connectDB = require('./config/database');
const { seedDatabase } = require('./utils/seedData');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB database and auto-seed if needed
const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Wait a bit for connection to be fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Auto-seed database (only in production or if explicitly enabled)
    // Smart seeding will only add missing items, won't delete existing data
    const shouldAutoSeed = process.env.AUTO_SEED === 'true' || process.env.NODE_ENV === 'production';
    
    if (shouldAutoSeed) {
      console.log('🌱 Auto-seeding database (will add missing items only)...');
      await seedDatabase(false); // false = don't force, smart seeding adds missing items
      console.log('✅ Auto-seeding completed!');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// Initialize database (non-blocking)
initializeDatabase();

// Middleware
// CORS - Allow frontend to make requests to backend
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (so they can be accessed via URL)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');
const favoriteRoutes = require('./routes/favorites');
const categoryRoutes = require('./routes/categories');
const locationRoutes = require('./routes/locations');
const adminRoutes = require('./routes/admin');

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Taskie API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Returns the status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Taskie API is running!
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 status:
 *                   type: string
 *                   example: OK
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Taskie API is running!',
    version: '1.0.0',
    status: 'OK',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Taskie Backend server is running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
});











