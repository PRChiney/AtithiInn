import mongoose from 'mongoose';
import Room from '../models/Room.js'; 
import Hotel from '../models/Hotel.js'; 

//   Get all hotels with filtering and pagination
export const getHotels = async (req, res, next) => {
  try {
    let {
      city,
      minPrice,
      maxPrice,
      ratings,
      limit,
      page,
      startDate,
      endDate,
      guests,
      ...others
    } = req.query;

    const guestCount = Number(guests) || 1;


    const hotelsPerPage = Number(limit) > 0 ? Number(limit) : 20;
    const currentPage = page ? Number(page) : 1;

    
    const hotelQuery = {
      ...others,
      ...(city && { city: { $regex: city, $options: 'i' } }),
      ...(minPrice || maxPrice
        ? {
          cheapestPrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        }
        : {}),
      ...(ratings && { rating: { $gte: Number(ratings) } }),
    };

    // Step 1: Find rooms that satisfy guest capacity and are available for date range
    let availableRoomHotelIds = [];
    
    if (startDate && endDate && guests) {
      const start = new Date(startDate);
      const end = new Date(endDate);
     

      const rooms = await Room.find({
        maxPeople: { $gte: guestCount },
        'roomNumbers.unavailableDates': {
          $not: {
            $elemMatch: {
              $gte: start,
              $lt: end
            }
          }
        }
      }).lean();

      console.log(`Rooms found for availability filter: ${rooms.length}`);
      console.log(
        `Hotel IDs from available rooms:`,
        rooms.map((room) => room.hotel.toString())
      );

      // Get unique hotel IDs from available rooms
      availableRoomHotelIds = [...new Set(rooms.map((room) => room.hotel.toString()))];
    }


  
    if (availableRoomHotelIds.length > 0) {
      const hotelObjectIds = availableRoomHotelIds.map(id => new mongoose.Types.ObjectId(id));
      hotelQuery._id = { $in: hotelObjectIds };
    } else if (startDate && endDate && guests) {
   
      return res.status(200).json({
        success: true,
        count: 0,
        totalCount: 0,
        currentPage,
        totalPages: 0,
        data: [],
      });
    }

    console.log('MongoDB hotel query:', JSON.stringify(hotelQuery, null, 2));

   
    const hotels = await Hotel.find(hotelQuery)
      .limit(hotelsPerPage)
      .skip(hotelsPerPage * (currentPage - 1))
    .populate('rooms');


    const totalCount = await Hotel.countDocuments(hotelQuery);


    console.log('Hotels to return:', hotels);
    res.status(200).json({
      success: true,
      count: hotels.length,
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / hotelsPerPage),
      data: hotels,
    });
  } catch (err) {
    console.error(`[ERROR] Error in getHotels: ${err.message}`, err);
    next(err);
  }
};



// @desc    Get single hotel by ID with populated rooms

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('rooms');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (err) {
    console.error(`[ERROR] Error in getHotel: ${err.message}`, err);
    next(err);
  }
};

// @desc    Create new hotel (Admin only)

export const createHotel = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.city || !req.body.cheapestPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, city, and cheapestPrice fields',
      });
    }

    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      data: hotel,
    });
  } catch (err) {
    console.error(`[ERROR] Error in createHotel: ${err.message}`, err);
    next(err);
  }
};

// @desc    Update hotel (Admin only)

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (err) {
    console.error(`[ERROR] Error in updateHotel: ${err.message}`, err);
    next(err);
  }
};

// @desc    Delete hotel (Admin only)

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (err) {
    console.error(`[ERROR] Error in deleteHotel: ${err.message}`, err);
    next(err);
  }
};

// @desc    Get all hotels 

export const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({});
    res.status(200).json({
      success: true,
      data: hotels,
    });
  } catch (err) {
    console.error('[ERROR] Error in getAllHotels:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};