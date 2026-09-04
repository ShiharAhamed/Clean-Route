const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cleanroute_lk';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n👉 How to fix:\n1. If using MongoDB Atlas (Cloud), update MONGO_URI in 'backend/.env' with your connection string.\n2. If using local MongoDB, ensure the MongoDB service is installed and running.\n`);
  }
};

module.exports = connectDB;
