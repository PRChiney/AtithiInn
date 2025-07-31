import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Token from '../models/Token.js';

// registerAdmin function:
export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !secretKey) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ 
        message: "Admin already exists",
        code: "ADMIN_EXISTS"
      });
    }

    // Create admin with their own secretKey
    const admin = await Admin.create({ name, email, password, secretKey });

    await Token.deleteMany({ userId: admin._id });
   // Generate token
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Save token to Token collection
    await Token.create({
  token,
  userId: admin._id,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

    res.status(201).json({
      success: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true
      },
      token,
      expiresIn: 86400
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// validate Admin Key
export const validateAdminKey = async (req, res) => {
  const { email, secretKey } = req.body;
  
  try {
    const admin = await Admin.findOne({ email }).select('+secretKey');
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(secretKey, admin.secretKey);
    res.status(200).json({ isValid: isMatch });
  } catch (error) {
    res.status(500).json({ message: "Key validation failed" });
  }
};
// amin login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        code: "MISSING_CREDENTIALS"
      });
    }

    // 2. Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(404).json({ 
        message: "Admin not found",
        code: "ADMIN_NOT_FOUND"
      });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS"
      });
    }

    await Token.deleteMany({ userId: admin._id });
     // 4. Generate token
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Save token to Token collection
    await Token.create({
  token,
  userId: admin._id,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
});

    // 5. Return response without sensitive data
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      },
      token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: "SERVER_ERROR"
    });
  }
};
// list all users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};