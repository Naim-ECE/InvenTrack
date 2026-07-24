import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  let retries = 5;

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB runtime error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting reconnection...');
      });
      
      mongoose.connection.on('connected', () => {
        console.log('MongoDB reconnected.');
      });

      break;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB connection failed. Retries left: ${retries}`);
      console.error(`Error details: ${error.message}`);
      
      if (retries === 0) {
        console.error('Could not connect to MongoDB after multiple attempts. Exiting...');
        process.exit(1);
      }
      
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

export default connectDB;
