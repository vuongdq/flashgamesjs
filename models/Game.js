import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String,
    unique: true,
    required: true
  },
  url: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  hashtags: [String],
  shortDescription: String,
  longDescription: String,
  thumbnail: String, // Thumbnail mặc định (medium size)
  thumbnails: { // Các kích thước thumbnail khác nhau
    original: String,
    large: String,
    medium: String,
    small: String
  },
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  playCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  hasWalkthrough: { type: Boolean, default: false },
  walkthroughVideo: String,
  walkthroughImages: [String],
  walkthroughContent: String,
  gameFile: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Tạo slug trước khi lưu
GameSchema.pre('save', function(next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
  next();
});

// Đảm bảo model chưa được compile
const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game; 