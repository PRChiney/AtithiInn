import 'dotenv/config'; 

import express from 'express';
import mongoose from 'mongoose'; 
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import bookingsRouter from './routes/bookings.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/users.js';
import roomsRouter from './routes/rooms.js';


// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('FATAL ERROR: Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  });

// Import Routes
import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';

const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/hotels', hotelRoutes); 
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy 🚀', status: 'UP' });
});

app.get('/', (req, res) => {
  res.send('AtithiInn API is running!');
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;