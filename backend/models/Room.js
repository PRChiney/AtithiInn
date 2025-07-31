import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  roomNumbers: [{ type: String, required: true }],
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);