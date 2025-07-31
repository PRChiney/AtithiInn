import express from 'express';
import { 
  registerAdmin, 
  loginAdmin,
  validateAdminKey,
  listUsers  
} from '../controllers/adminController.js'
import { protectAdmin } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/users', protectAdmin, listUsers);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/validate-key', validateAdminKey);

export default router;