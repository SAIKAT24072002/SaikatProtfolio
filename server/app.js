import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// CORS setups mapping client origins and allowing cookies
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  credentials: true
}));

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Server health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API service is active.' });
});

// Routing groupings
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api', adminRoutes);

// Catch-all 404 Route
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

export default app;
