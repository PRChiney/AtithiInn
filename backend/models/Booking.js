import mongoose from 'mongoose';


const paymentInfoSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  paymentMethod: { type: String }, 
  amountPaid: { type: Number },    
  paymentDate: { type: Date },     
}, { _id: false });


const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: [1, 'At least one guest is required'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be positive'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentInfo: paymentInfoSchema,  
}, {
  timestamps: true, 
});

bookingSchema.virtual('duration').get(function() {
  const diffTime = new Date(this.checkOut) - new Date(this.checkIn);
  return diffTime / (1000 * 3600 * 24); 
});


bookingSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    return next(new Error('Check-out date must be after check-in date.'));
  }
  next();
});


bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ status: 1 });


const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;