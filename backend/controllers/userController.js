import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/async.js';
import generateToken from '../utils/token.js';
import validator from 'validator'; 

// @desc    Register a new user

export const registerUser = asyncHandler(async (req, res, next) => {
const { name, email, password } = req.body;
  // Validate input
 if (!username || !email || !password) {
  return next(new ErrorResponse('Please provide all required fields', 400));
}

  if (!validator.isEmail(email)) {
    return next(new ErrorResponse('Please provide a valid email', 400));
  }

  if (password.length < 8) {
    return next(new ErrorResponse('Password must be at least 8 characters long', 400));
  }


  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }


 const user = await User.create({
  username: name,
  email,
  password,
});

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// @desc    Admin login

export const adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Verify user is admin
  if (!user.isAdmin) {
    return next(new ErrorResponse('Admin access required', 403));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Login user

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get all users (Admin only)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('_id username email isAdmin');
  res.status(200).json({
    success: true,
    users
  });
});

// @desc    Get single user (Admin only)
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create a new user (Admin only)
export const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorResponse('Username, email, and password are required', 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  const user = await User.create({
    username,
    email,
    password,
    isAdmin: isAdmin || false,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Update user (Admin only)
export const updateUser = asyncHandler(async (req, res, next) => {
  const { username, email, isAdmin } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  }


  user.username = username || user.username;
  user.email = email || user.email;
  if (isAdmin !== undefined) user.isAdmin = isAdmin;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user (Admin only)
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});


export const promoteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  }

  user.isAdmin = true;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

export const demoteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  }

  user.isAdmin = false;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    createdAt: req.user.createdAt
  });
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('_id username email isAdmin');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};