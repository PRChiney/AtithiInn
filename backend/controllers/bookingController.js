import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/async.js';

//  Get all bookings
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate([
    { path: 'room', select: 'name price' },
    { path: 'hotel', select: 'name' }
  ]);

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// Get single booking
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('hotel', 'name')
    .populate('room', 'title price');


  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID: ${req.params.id}`, 404));
  }

  const bookingUserId = booking.user?._id?.toString() || booking.user.toString();


  if (bookingUserId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this booking`, 401));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

//Create new booking
export const createBooking = asyncHandler(async (req, res, next) => {
  req.body.room = req.params.roomId;
  req.body.user = req.user.id;

  const room = await Room.findById(req.params.roomId);

  if (!room) {
    return next(new ErrorResponse(`No room found with ID: ${req.params.roomId}`, 404));
  }

  const { checkInDate, checkOutDate } = req.body;

  if (!checkInDate || !checkOutDate) {
    return next(new ErrorResponse('Please provide both check-in and check-out dates', 400));
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn) || isNaN(checkOut)) {
    return next(new ErrorResponse('Invalid check-in or check-out date', 400));
  }

  if (checkOut <= checkIn) {
    return next(new ErrorResponse('Check-out date must be after check-in date', 400));
  }

  const daysOfStay = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  req.body.daysOfStay = daysOfStay;
  req.body.amountPaid = room.price * daysOfStay;

  req.body.paymentInfo = {
    id: 'TEST_PAYMENT_ID',
    status: 'succeeded',
  };
  req.body.paidAt = Date.now();

  const booking = await Booking.create(req.body);

  res.status(201).json({
    success: true,
    data: booking,
  });
});

//   Update booking

export const updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID: ${req.params.id}`, 404));
  }

  const bookingUserId = booking.user?._id?.toString() || booking.user.toString();

  if (bookingUserId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 401));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: booking,
  });
});

//  Delete booking

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with ID: ${req.params.id}`, 404));
  }

  const bookingUserId = booking.user?._id?.toString() || booking.user.toString();

  if (bookingUserId !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this booking`, 401));
  }

  await booking.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

export const createMultiRoomBooking = asyncHandler(async (req, res, next) => {
  const { rooms, hotel, user, paymentMethod, checkInDate, checkOutDate, guests } = req.body;
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return next(new ErrorResponse('No rooms provided', 400));
  }

  const bookings = [];
  for (const roomId of rooms) {
    const room = await Room.findById(roomId);
    if (!room) {
      return next(new ErrorResponse(`No room found with ID: ${roomId}`, 404));
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const daysOfStay = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const booking = await Booking.create({
  hotel,
  room: roomId,
  user,
  paymentMethod,
  checkIn: checkInDate,      
  checkOut: checkOutDate,    
  daysOfStay,
  totalPrice: room.price * daysOfStay, 
  guests: guests,
  paymentInfo: { id: 'TEST_PAYMENT_ID', status: 'succeeded' },
  paidAt: Date.now(),
});
    bookings.push(booking);
  }

  res.status(201).json({
    success: true,
    data: bookings,
  });
});