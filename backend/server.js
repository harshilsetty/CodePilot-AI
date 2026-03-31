require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Default middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Root route handler
app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
