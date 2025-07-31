import express from 'express';
import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getAllHotels, 
} from '../controllers/hotelController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// ------------------------------
// PUBLIC ROUTES
// ------------------------------

/**
 * @desc    Fetch all hotels
 * @route   GET /api/v1/hotels
 * @access  Public
 */
router.get('/', getHotels);

/**
 * @desc    Fetch single hotel by ID
 * @route   GET /api/v1/hotels/:id
 * @access  Public
 */
router.get('/all', getAllHotels);
router.get('/:id', getHotel);

// ------------------------------
// ADMIN PROTECTED ROUTES
// ------------------------------

/**
 * @desc    Create a new hotel
 * @route   POST /api/v1/hotels
 * @access  Private/Admin
 */
router.post('/', verifyToken, verifyAdmin, createHotel);

/**
 * @desc    Update an existing hotel
 * @route   PUT /api/v1/hotels/:id
 * @access  Private/Admin
 */
router.put('/:id', verifyToken, verifyAdmin, updateHotel);

/**
 * @desc    Delete a hotel
 * @route   DELETE /api/v1/hotels/:id
 * @access  Private/Admin
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteHotel);

export default router;