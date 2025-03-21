const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/flashgamesjs';

async function dropDatabase() {
  try {
    await mongoose.connect(uri);
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');
  } catch (error) {
    console.error('Error dropping database:', error);
  }
}

async function seedData() {
  try {
    // Đảm bảo kết nối đến database
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Định nghĩa schemas
    const AdminSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    });

    const CategorySchema = new mongoose.Schema({
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true }
    });

    const GameSchema = new mongoose.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      shortDescription: String,
      longDescription: String,
      thumbnail: String,
      gameFile: String,
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      status: { type: String, default: 'active' },
      playCount: { type: Number, default: 0 },
      hashtags: [String]
    }, { timestamps: true });

    // Tạo models
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

    // Xóa dữ liệu cũ
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Game.deleteMany({});

    // Tạo admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      email: 'admin@example.com',
      password: hashedPassword
    });
    console.log('Admin account created');

    // Tạo categories
    const categories = await Category.create([
      { name: 'Action', slug: 'action' },
      { name: 'Adventure', slug: 'adventure' },
      { name: 'Puzzle', slug: 'puzzle' },
      { name: 'Racing', slug: 'racing' },
      { name: 'Sports', slug: 'sports' }
    ]);
    console.log('Categories created');

    // Tạo games
    await Game.create([
      {
        title: 'Super Mario Flash',
        slug: 'super-mario-flash',
        shortDescription: 'Classic Mario platformer game',
        longDescription: 'Play as Mario in this classic platformer game. Run, jump and collect coins through multiple levels.',
        thumbnail: '/thumbnails/mario.jpg',
        gameFile: '/games/mario.swf',
        category: categories[0]._id,
        status: 'active',
        playCount: 0,
        hashtags: ['mario', 'platformer', 'classic']
      },
      {
        title: 'Sonic Flash',
        slug: 'sonic-flash',
        shortDescription: 'Fast-paced Sonic adventure',
        longDescription: 'Speed through levels as Sonic the Hedgehog in this classic flash game.',
        thumbnail: '/thumbnails/sonic.jpg',
        gameFile: '/games/sonic.swf',
        category: categories[1]._id,
        status: 'active',
        playCount: 0,
        hashtags: ['sonic', 'speed', 'adventure']
      },
      {
        title: 'Tetris Flash',
        slug: 'tetris-flash',
        shortDescription: 'Classic block-matching puzzle game',
        longDescription: 'Arrange falling blocks to create and clear lines in this addictive puzzle game.',
        thumbnail: '/thumbnails/tetris.jpg',
        gameFile: '/games/tetris.swf',
        category: categories[2]._id,
        status: 'active',
        playCount: 0,
        hashtags: ['tetris', 'puzzle', 'classic']
      }
    ]);
    console.log('Games created');

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@example.com / admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Chạy các functions
async function init() {
  await dropDatabase();
  await seedData();
}

init(); 