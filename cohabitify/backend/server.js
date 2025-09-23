const express = require('express');
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

const app = express();

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error (on connect):', err));

// Additional connection diagnostics
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error event:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/secrets', secretRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/rooms', roomsRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
