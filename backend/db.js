import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Get MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodlink_db';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    return false;
  }
}

// Test database connection
async function testConnection() {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Get database connection status
function getConnectionStatus() {
  return mongoose.connection.readyState === 1;
}

// Close database connection
async function closeConnection() {
  try {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');
    return true;
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    return false;
  }
}

export {
  connectToDatabase,
  testConnection,
  getConnectionStatus,
  closeConnection,
  mongoose
};
export default connectToDatabase;
