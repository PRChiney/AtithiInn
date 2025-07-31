import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});


AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password') && !this.isModified('secretKey')) return next();
  
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    if (this.isModified('secretKey')) {
      this.secretKey = await bcrypt.hash(this.secretKey, 12);
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Admin', AdminSchema);