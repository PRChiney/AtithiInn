import express from 'express';
import {
  getMyBookings,  // Changed from getBookings
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  createMultiRoomBooking
} from '../controllers/bookingController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router({ mergeParams: true });

// Middleware to secure all booking routes
router.use(verifyToken);
router.post('/', createMultiRoomBooking);
router.post('/', createBooking);

router.route('/mybookings')  // Add this new route
  .get(getMyBookings)
    .post(createBooking);

router.post('/rooms/:roomId/bookings', createBooking);  

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;