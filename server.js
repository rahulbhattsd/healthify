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
const fetch = require('node-fetch');


// Connect to the database
connectDB();

// Middleware
const allowedOrigins = ['https://healthify-31ok.onrender.com', 'http://localhost:5000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // If you're using cookies or authorization headers
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
// OpenAI API Key from environment variables
const API_KEY = process.env.OPENAI_API_KEY;

// Process data route
app.post('/api/processData', async (req, res) => {
  const { context, question } = req.body;

  if (!context || !question) {
    return res.status(400).json({ error: 'Context and question are required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4", // Use GPT-4 model
        messages: [
          { role: "system", content: "You are a health assistant providing personalized advice." },
          { role: "user", content: `Context: ${context}\n\nQuestion: ${question}` },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      return res.status(response.status).json({ error: error.message || "Failed to get response from OpenAI" });
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Error processing AI request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

