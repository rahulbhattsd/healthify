const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');  // Import exec to run Python script
const connectDB = require('./database');
const User = require('./User');
require('dotenv').config();
const app = express();

// Connect to the database
connectDB();

// Middleware
const allowedOrigins = ['https://healthify-31ok.onrender.com', 'http://localhost:5000', 'http://localhost:5173'];

app.use(cors({
  origin: ['https://healthify-31ok.onrender.com', 'http://localhost:5000', 'http://localhost:5173'],
  credentials: true
}));




app.use(express.json());  // Parse incoming JSON requests

// Serve the React app from the 'client/dist' folder
app.use(express.static(path.join(__dirname, "client/dist")));

// Serve frontend on all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

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



// AI Processing Route
app.post('/api/processData', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    // Ensure context and question are provided
    if (!context || !question) {
      return res.status(400).json({ error: 'Context and question are required' });
    }

    // Call the Python script using child_process
    const pythonScriptPath = path.join(__dirname, 'ai_integration.py');
    exec(`python ${pythonScriptPath} "${context}" "${question}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing Python script:', error);
        return res.status(500).json({ error: 'Failed to process AI response' });
      }
      if (stderr) {
        console.error('Python script stderr:', stderr);
        return res.status(500).json({ error: 'Error in AI response generation' });
      }

      // Send AI response to the client
      const aiResponse = stdout.trim();  // Clean up the response from Python script
      res.json({ success: true, response: aiResponse });
    });

  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({ error: 'Failed to process data' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

