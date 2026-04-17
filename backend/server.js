require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests and local development when CORS_ORIGINS is not configured.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

// Default middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);


// Root route handler
app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
