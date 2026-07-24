import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`[FATAL ERROR] Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please create a .env file based on .env.example and populate the required variables.');
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
};

// Validate Cloudinary for production
const hasCloudinary = env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET;
if (!hasCloudinary && env.NODE_ENV === 'production') {
  console.error('[FATAL ERROR] Cloudinary credentials are required in production.');
  process.exit(1);
}

// Generate startup report
console.log('\n--- Startup Validation Report ---');
console.log('✓ MongoDB configured');
console.log('✓ JWT configured');
console.log(hasCloudinary ? '✓ Cloudinary configured' : '⚠ Cloudinary skipped (Image uploads disabled)');
console.log(env.FIREBASE_PROJECT_ID ? '✓ Firebase project configured' : '⚠ Firebase skipped (Google auth disabled)');
console.log(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS ? '✓ SMTP configured' : '⚠ SMTP skipped (Emails will not be sent)');
console.log('✓ Server ready');
console.log('---------------------------------\n');

export default env;
