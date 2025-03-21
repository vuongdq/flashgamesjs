import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'admin'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema); 