import mongoose from 'mongoose';
import connectDB, { disconnectDB } from '../config/db.js';

const resetDatabase = async () => {
  await connectDB();

  try {
    await mongoose.connection.db.dropDatabase();
    console.log('MongoDB database cleared successfully');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

resetDatabase().catch((error) => {
  console.error('Unexpected database reset failure:', error);
  process.exit(1);
});
