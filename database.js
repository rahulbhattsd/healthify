const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables only once, here.

const dbUrl = process.env.ATLASDB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000  // Optional: increase timeout to 30 seconds
    });
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectDB;


