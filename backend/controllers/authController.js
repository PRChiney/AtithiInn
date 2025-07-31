import User from '../models/User.js';
import Token from '../models/Token.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

// Environment validation with detailed checks
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Enhanced configuration with defaults
const AUTH_CONFIG = {
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRE) || 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    path: '/',
  },
  tokenExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  passwordMinLength: 8
};

// Send the response with token
const sendTokenResponse = async (user, statusCode, res) => {
  try {
    if (!user) throw new Error('User object is required');
    
    const token = user.generateAuthToken(); 
    
    // Validate the JWT token to ensure it's valid
    try {
      jwt.verify(token, process.env.JWT_SECRET); // Verifies the token using your JWT_SECRET
    } catch (tokenError) {
      console.error('Invalid token:', tokenError);
      throw new Error('Invalid token');
    }

    // Store token in database with error handling
    try {
      await Token.create({
        token,
        userId: user._id,
        expiresAt: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 86400000))
      });
    } catch (tokenError) {
      console.error('Token storage error:', tokenError);
      throw new Error('Failed to store authentication token');
    }

    // Set cookie with enhanced options
    res.cookie('token', token, AUTH_CONFIG.cookieOptions);

    // Prepare comprehensive user response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    };

    return res.status(statusCode).json({
      success: true,
      token,
      user: userResponse,
      expiresIn: AUTH_CONFIG.tokenExpiresIn
    });

  } catch (error) {
    console.error('Token response error:', error);
    throw error;
  }
};

// Controller Methods
export const register = async (req, res) => {
  console.log('Registration request received:', req.body);
  try {
    // Check express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      return res.status(409).json({ 
        success: false, 
        message: `${field} is already in use`,
        field
      });
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      isAdmin: req.body.isAdmin || false
    });

    return sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'REGISTRATION_FAILED'
    });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    // Verify admin secret
    if (req.body.adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid admin registration secret',
        code: 'INVALID_ADMIN_SECRET'
      });
    }

    // Set admin flag and proceed with normal registration
    req.body.isAdmin = true;
    return register(req, res);

  } catch (error) {
    console.error('Admin Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Admin registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'ADMIN_REGISTRATION_FAILED'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    return sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'LOGIN_FAILED'
    });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'PROFILE_FETCH_FAILED'
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      // Delete token from database
      await Token.deleteOne({ token });
    }

    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN || 'localhost'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: 'LOGOUT_FAILED'
    });
  }
};