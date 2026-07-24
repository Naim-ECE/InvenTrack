import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { sendEmail } from '../services/emailService.js';
import crypto from 'crypto';
import env from '../config/env.js';
import getFirebaseAdmin from '../config/firebase.js';
import { normalizeRole, normalizeUserDocument } from '../utils/roles.js';

const issueAuthResponse = async (res, user, statusCode = 200, extra = {}) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    user: normalizeUserDocument(user),
    accessToken,
    refreshToken,
    ...extra,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, storeName } = req.body;
    const normalizedRole = normalizeRole(role);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({ name, email, password, role: normalizedRole });

    // If vendor role, create vendor profile
    if (normalizedRole === 'vendor') {
      await Vendor.create({
        user: user._id,
        storeName: storeName || `${name}'s Store`,
      });
    }

    await issueAuthResponse(res, user, 201);
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await issueAuthResponse(res, user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// @desc    Google/Firebase auth
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
  try {
    const { idToken, role = 'customer', profile = {} } = req.body;
    const normalizedRole = normalizeRole(role);

    let decoded = null;
    if (idToken) {
      try {
        const firebaseAdmin = getFirebaseAdmin();
        decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
      } catch (verificationError) {
        if (env.NODE_ENV === 'production') {
          throw verificationError;
        }

        console.warn('Google token verification failed, using client profile fallback:', verificationError.message);
      }
    }

    const email = (decoded?.email || profile.email || '').toLowerCase();
    if (!email) return res.status(400).json({ error: 'Google account email is required' });

    const googleUid = decoded?.uid || profile.uid || `google:${email}`;
    const displayName = decoded?.name || profile.name || profile.displayName || email.split('@')[0];
    const avatar = decoded?.picture || profile.picture || profile.avatar || '';

    let user = await User.findOne({ $or: [{ firebaseUid: googleUid }, { email }] });
    const wasCreated = !user;

    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        avatar,
        role: normalizedRole,
        firebaseUid: googleUid,
        authProvider: 'google',
      });

      if (normalizedRole === 'vendor') {
        await Vendor.create({
          user: user._id,
          storeName: `${user.name}'s Store`,
        });
      }
    } else {
      user.firebaseUid = user.firebaseUid || googleUid;
      user.authProvider = user.authProvider || 'google';
      user.avatar = user.avatar || avatar;
      await user.save({ validateBeforeSave: false });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    if (normalizeRole(user.role) !== user.role) {
      user.role = normalizeRole(user.role);
      await user.save({ validateBeforeSave: false });
    }

    if (user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: user._id });
      if (!vendor) {
        await Vendor.create({
          user: user._id,
          storeName: `${user.name}'s Store`,
        });
      }
    }

    await issueAuthResponse(res, user, wasCreated ? 201 : 200, { isNewUser: wasCreated });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(error.statusCode || 401).json({ error: error.message || 'Google authentication failed' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let vendorData = null;
    if (normalizeRole(user.role) === 'vendor') {
      vendorData = await Vendor.findOne({ user: user._id });
      if (!vendorData) {
        vendorData = await Vendor.create({
          user: user._id,
          storeName: `${user.name}'s Store`,
        });
      }
    }

    res.json({ user: normalizeUserDocument(user), vendor: vendorData });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No account found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'InventoryMaster Pro - Password Reset',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">Reset Password</a>
          <p>This link expires in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      res.json({ message: 'Password reset email sent' });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Email send error:', emailError);
      res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Password reset successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user: normalizeUserDocument(user) });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
};

// @desc    Admin: list users
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
      User.countDocuments(filter),
    ]);
    res.json({ users: users.map((user) => normalizeUserDocument(user)), total, page: pageNumber, pages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// @desc    Admin: update user role
// @route   PUT /api/auth/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const normalizedRole = normalizeRole(role, '');
    if (!normalizedRole) return res.status(400).json({ error: 'Invalid role' });

    const user = await User.findByIdAndUpdate(req.params.id, { role: normalizedRole }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingVendor = await Vendor.findOne({ user: user._id });

    if (normalizedRole === 'vendor') {
      if (!existingVendor) {
        await Vendor.create({ user: user._id, storeName: `${user.name}'s Store` });
      }
    } else if (existingVendor) {
      await existingVendor.deleteOne();
    }

    res.json({ user: normalizeUserDocument(user) });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};
