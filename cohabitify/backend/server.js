import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import roommateRoutes from './routes/roommates.js';
import secretRoutes from './routes/secrets.js';
import moodRoutes from './routes/moods.js';
import roomsRoutes from './routes/rooms.js';
import supportRoutes from './routes/support.js';

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
    // In development, allow all origins to avoid local CORS issues
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
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
app.use('/api/email', emailRoutes);

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
const HOST = process.env.HOST || '0.0.0.0';

// Function to get the next available port
const getNextAvailablePort = async (port) => {
  const net = await import('net');
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      // Port is in use, try next port
      resolve(getNextAvailablePort(port + 1));
    });
    server.listen(port, HOST, () => {
      const { port: availablePort } = server.address();
      server.close(() => resolve(availablePort));
    });
  });
};

// Start the server
const startServer = async () => {
  try {
    const availablePort = await getNextAvailablePort(PORT);
    
    server.listen(availablePort, HOST, () => {
      console.log(`Server running on http://${HOST}:${availablePort}`);
      
      // Update frontend .env file if in development
      if (process.env.NODE_ENV !== 'production') {
        // Use dynamic import at the top level of the module
        Promise.all([
          import('fs'),
          import('path')
        ]).then(([fs, path]) => {
          const envPath = path.join(process.cwd(), '..', '.env');
          
          try {
            let envContent = '';
            if (fs.existsSync(envPath)) {
              envContent = fs.readFileSync(envPath, 'utf8');
              // Remove existing VITE_API_URL if it exists
              envContent = envContent.replace(/^VITE_API_URL=.*$/gm, '');
            }
            
            // Add/update VITE_API_URL with the current port
            envContent += `\nVITE_API_URL=http://localhost:${availablePort}\n`;
            fs.writeFileSync(envPath, envContent.trim() + '\n');
            console.log(`Updated frontend .env with VITE_API_URL=http://localhost:${availablePort}`);
          } catch (err) {
            console.warn('Could not update frontend .env file:', err.message);
          }
        }).catch(err => {
          console.warn('Failed to load required modules:', err);
        });
      }
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${availablePort} is in use, trying next port...`);
        startServer();
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
