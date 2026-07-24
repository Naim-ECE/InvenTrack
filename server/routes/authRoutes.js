import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  googleAuth,
  getAllUsers,
  updateUserRole,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect);
router.post('/logout', logoutUser);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.get('/users', authorize('admin'), getAllUsers);
router.put('/users/:id/role', authorize('admin'), updateUserRole);

export default router;
