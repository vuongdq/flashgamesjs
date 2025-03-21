import dbConnect from '../../../lib/mongodb';
import Game from '../../../models/Game';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const game = await Game.findById(id).populate('category');
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Increment play count
      game.playCount += 1;
      await game.save();

      res.status(200).json(game);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching game' });
    }
  }
} 