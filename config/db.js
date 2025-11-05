const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://localhost:27017/naac_portal';

async function connectDB() {
  const uri = process.env.MONGO_URI && process.env.MONGO_URI.trim() !== ''
    ? process.env.MONGO_URI
    : DEFAULT_URI;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
