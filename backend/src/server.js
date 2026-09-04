import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());

// API Health / Status check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', app: 'CleanRoute LK API', timestamp: new Date() });
});

// Mount Resource Routes
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stats', statsRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[CleanRoute LK] Server running on http://localhost:${PORT}`);
});
