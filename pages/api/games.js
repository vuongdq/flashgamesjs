import dbConnect from '../../lib/mongodb';
import Game from '../../models/Game';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const games = await Game.find()
        .populate('category')
        .sort({ createdAt: -1 });

      // Tự động tạo slug cho games chưa có
      for (let game of games) {
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
      }
      
      res.status(200).json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Error fetching games' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 