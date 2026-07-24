import env from './config/env.js';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';
import connectDB, { disconnectDB } from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import { setupSocketHandlers } from './sockets/socketHandler.js';

const PORT = env.PORT;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Configure Cloudinary
  configureCloudinary();

  // Create HTTP server
  const server = http.createServer(app);

  // Setup Socket.io
  const io = new SocketIO(server, {
    cors: {
      origin: [env.CLIENT_URL, 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Attach io to app for use in controllers
  app.set('io', io);

  // Setup socket event handlers
  setupSocketHandlers(io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await disconnectDB();
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
