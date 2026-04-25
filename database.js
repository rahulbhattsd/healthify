const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.ATLASDB_URL) {
      throw new Error('ATLASDB_URL is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.ATLASDB_URL, {
      serverSelectionTimeoutMS: 30000, // 30s timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Optional: connection events (good for debugging / production logs)
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit app if DB fails (important for production)
  }
};

module.exports = connectDB;

