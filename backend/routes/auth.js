import express from 'express';
import validator from 'express-validator';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  registerAdmin,
} from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const { check } = validator;

const router = express.Router();

// Public route: Register
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

// Public route: Login
router.post('/login', login);


// Admin registration
router.post('/admin/register', registerAdmin);

// Authenticated user route
router.get('/me', verifyToken, getMe);

// Logout
router.post('/logout', verifyToken, logout);

export default router;