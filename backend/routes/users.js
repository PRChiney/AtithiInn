import express from 'express';
import { 
  registerUser, 
  loginUser, 
  adminLogin,
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  promoteUser,
  demoteUser,
  getMe, // Add this import
} from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/admin/login', adminLogin);
router.post('/login', loginUser);
router.post('/register', registerUser);

// Protected user routes (no admin requirement)
router.use(verifyToken); // Applies to all routes below

// Add these user profile routes before admin routes
router.route('/me')
  .get(getMe)

// Admin-only routes
router.use(verifyAdmin); // Applies to all routes below

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/promote', promoteUser);
router.put('/:id/demote', demoteUser);

export default router;