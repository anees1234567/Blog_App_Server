const mongoose = require('mongoose');
const { DB_URL } = require('./index');

const connectDB = async () => {
  try {
  
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;