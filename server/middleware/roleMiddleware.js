import { normalizeRole } from '../utils/roles.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const activeRole = normalizeRole(req.user.role);

    if (!roles.includes(activeRole)) {
      return res.status(403).json({
        error: `Role '${activeRole}' is not authorized to access this resource`,
      });
    }

    next();
  };
};
