const express = require('express');
const User = require('./User');
const router = express.Router();
const axios = require('axios');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User signed up successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to sign up" });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Your Hugging Face API key
const API_KEY = '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';

router.post('/ai-process', async (req, res) => {
  try {
    const { textInput } = req.body;
    const response = await axios.post('https://api-inference.huggingface.co/models/MedAlpaca-7B', {
      inputs: textInput,
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("AI process error:", error);
    res.status(500).send('Error in processing AI request');
  }
});



module.exports = router;
