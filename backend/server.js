const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'CleanRoute LK API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CleanRoute LK Server running on port ${PORT}`);
});
