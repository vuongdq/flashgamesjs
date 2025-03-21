import dbConnect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Tìm game bằng slug
    let game = await Game.findOne({ slug }).populate('category');

    // Nếu không tìm thấy bằng slug, thử tìm bằng ID
    if (!game && slug.match(/^[0-9a-fA-F]{24}$/)) {
      game = await Game.findById(slug).populate('category');
    }

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Tạo slug nếu chưa có
    if (!game.slug) {
      game.slug = game.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
      await game.save();
    }

    // Tăng lượt chơi
    game.playCount += 1;
    await game.save();

    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Error fetching game' });
  }
} 