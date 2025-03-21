import dbConnect from '../../../lib/mongodb';
import Game from '../../../models/Game';
import Category from '../../../models/Category';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { slug } = req.query;

    console.log('Fetching game with slug:', slug);

    const game = await Game.findOne({ slug }).populate('category');

    if (!game) {
      console.log('Game not found');
      return res.status(404).json({ error: 'Game not found' });
    }

    // Kiểm tra file game
    const publicPath = path.join(process.cwd(), 'public');
    const gameFilePath = game.gameFile?.replace(/^\//, '');
    const fullGamePath = path.join(publicPath, gameFilePath);

    console.log('Checking game file at:', fullGamePath);

    if (!gameFilePath || !fs.existsSync(fullGamePath)) {
      console.log('Game file not found');
      return res.status(200).json({
        ...game.toObject(),
        gameFileError: 'Game file not available'
      });
    }

    // Tăng số lượt chơi
    await Game.findByIdAndUpdate(game._id, { $inc: { playCount: 1 } });

    console.log('Game found and updated');
    res.status(200).json(game.toObject());

  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 