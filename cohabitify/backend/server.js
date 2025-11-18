const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const roommateRoutes = require('./routes/roommates');
const secretRoutes = require('./routes/secrets');
const moodRoutes = require('./routes/moods');
const roomsRoutes = require('./routes/rooms');
const supportRoutes = require('./routes/support');

const app = express();
const server = http.createServer(app);
let io; // socket disabled per request

// Security middleware
app.use(helmet());

// CORS configuration
// Allow list can be configured via env: ALLOWED_ORIGINS=url1,url2
const allowedOrigins = (process.env.ALLOWED_ORIGINS || (
  process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : 'http://localhost:5173,http://localhost:5174'
)).split(',').map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or mobile apps) and those in the allow list
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;
  
  const connectWithRetry = async () => {
    try {
      console.log('Attempting to connect to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        family: 4, // Use IPv4
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
      });
    } catch (err) {
      retryCount++;
      console.error(`❌ MongoDB connection attempt ${retryCount} failed:`, err.message);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in 5 seconds... (${retryCount}/${maxRetries})`);
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error('❌ Max retries reached. Could not connect to MongoDB. Please check your connection and try again.');
        console.log('Make sure your IP is whitelisted in MongoDB Atlas and the connection string is correct.');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully to:', mongoose.connection.host);
  console.log('📊 Database name:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

// Initialize the database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/secrets', secretRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/support', supportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO disabled

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
