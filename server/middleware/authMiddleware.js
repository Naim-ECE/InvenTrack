import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import env from '../config/env.js';
import { normalizeRole } from '../utils/roles.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    const decoded = verifyToken(token, env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
    }

    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    user.role = normalizeRole(user.role);

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Not authorized' });
  }
};
