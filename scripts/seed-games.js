const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/flashgames')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game Schema
const GameSchema = new mongoose.Schema({
  title: String,
  slug: String,
  shortDescription: String,
  longDescription: String,
  thumbnail: String,
  gameFile: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: { type: String, default: 'active' },
  playCount: { type: Number, default: 0 },
  hashtags: [String]
}, { timestamps: true });

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String
}, { timestamps: true });

// Models
const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function seedGames() {
  try {
    // Xóa dữ liệu cũ
    await Game.deleteMany({});
    await Category.deleteMany({});

    // Tạo category
    const actionCategory = await Category.create({
      name: 'Action',
      slug: 'action'
    });

    // Tạo games
    const games = [
      {
        title: 'Super Mario Flash',
        slug: 'super-mario-flash',
        shortDescription: 'Classic Mario platformer game',
        longDescription: 'Play as Mario in this classic platformer game. Run, jump and collect coins through multiple levels.',
        thumbnail: '/thumbnails/super-mario-flash.jpg',
        gameFile: '/games/super-mario-flash.swf',
        category: actionCategory._id,
        status: 'active',
        hashtags: ['mario', 'platformer', 'classic']
      },
      // Thêm các game khác ở đây
    ];

    await Game.insertMany(games);
    console.log('Games seeded successfully');

    // Log dữ liệu đã tạo
    const seededGames = await Game.find().populate('category');
    console.log('Seeded games:', seededGames);

  } catch (error) {
    console.error('Error seeding games:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedGames(); 