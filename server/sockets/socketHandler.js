import { verifyToken } from '../utils/jwt.js';
import env from '../config/env.js';
import User from '../models/User.js';

export const setupSocketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyToken(token, env.JWT_SECRET);
      if (!decoded) {
        return next(new Error('Authentication error: Invalid token'));
      }

      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: User not found or inactive'));
      }

      // Attach user to socket object
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.email}) - Socket ID: ${socket.id}`);

    // Join user-specific room to receive targeted notifications
    socket.join(`user_${socket.user._id}`);
    
    // Join role-specific rooms (e.g., 'vendor_updates', 'admin_alerts')
    if (socket.user.role) {
      socket.join(`role_${socket.user.role}`);
    }

    // Handle joining explicit rooms from client
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Handle leaving explicit rooms from client
    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    // Handle client disconnects
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} - Socket ID: ${socket.id}`);
    });
  });
};
