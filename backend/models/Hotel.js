import mongoose from 'mongoose';

// Define the schema for a hotel
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    photos: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
    ],
    cheapestPrice: {
      type: Number,
      required: [true, 'Cheapest price is required'],
      min: [0, 'Price must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);


const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;