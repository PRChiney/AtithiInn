import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middlewares/async.js';

// @desc    Get all rooms with pagination

export const getRooms = asyncHandler(async (req, res, next) => {
  const { hotelId } = req.params;
  const { limit, page, ...queryParams } = req.query;

  const query = {
    ...queryParams,
    ...(hotelId && { hotel: hotelId }),
  };

  const roomsPerPage = Number(limit) > 0 ? Number(limit) : 20;
  const currentPage = page ? Number(page) : 1;


  const rooms = await Room.find(query)
    .limit(roomsPerPage)
    .skip(roomsPerPage * (currentPage - 1));

  const totalCount = await Room.countDocuments(query); 

  res.status(200).json({
    success: true,
    count: rooms.length,
    totalCount,
    currentPage,
    totalPages: Math.ceil(totalCount / roomsPerPage),
    data: rooms,
  });
});

// @desc    Get single room

export const getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate('hotel');

  if (!room) {
    return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create new room (Admin only)

export const createRoom = async (req, res) => {
  try {
    const { title, price, maxPeople, description, image, roomNumbers, hotel } = req.body;

    if (!title || !price || !maxPeople || !description || !image || !roomNumbers || !hotel) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

  
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) {
      return res.status(404).json({ success: false, message: `No hotel found with id of ${hotel}` });
    }

    // Create room
    const room = new Room({
      title,
      price,
      maxPeople,
      description,
      image,
      roomNumbers,
      hotel,
    });

    await room.save();

 
    hotelDoc.rooms.push(room._id);
    await hotelDoc.save();

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    console.error('Room creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update room (Admin only)

export const updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Delete room (Admin only)

export const deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse(`Room not found with id of ${req.params.id}`, 404));
  }


  await Hotel.findByIdAndUpdate(room.hotel, {
    $pull: { rooms: room._id },
  });

  await room.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
