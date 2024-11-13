const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const connectDB = require('./database'); // Ensure database connection module is correct
const User = require('./User');    // Import the User model
// Load environment variables at the very start
require('dotenv').config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from the React frontend
}));
app.use(express.json());  // Parses incoming JSON requests

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Healthify API');
});

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User signed up successfully!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If login is successful, respond with a success message
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Mock route for AI processing
app.post('/api/processData', async (req, res) => {
  const formData = req.body;

  // Placeholder for API key and URL
  const apiUrl = process.env.AI_API_URL || 'https://api.placeholder.com/process';
  const apiKey = process.env.AI_API_KEY || 'your-api-key-here';

  // Example mock response if API key isn't set
  if (!apiKey || apiKey === 'your-api-key-here') {
      return res.json({
          success: true,
          message: "Mock AI response",
          data: { recommendation: "Based on your data, we suggest XYZ." }
      });
  }

  try {
      const aiResponse = await axios.post(apiUrl, formData, {
          headers: {
              'Authorization': `Bearer ${apiKey}`
          }
      });
      res.json(aiResponse.data);
  } catch (error) {
      res.status(500).json({ error: "Failed to process data." });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
