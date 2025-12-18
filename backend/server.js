require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const rsvpRoutes = require('./routes/rsvp.routes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Log all requests (remove or comment out in production)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', rsvpRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Event Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events'
    }
  });
});

// Error handling middleware (add at the end)
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});