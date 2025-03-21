import dbConnect from '../../../lib/mongodb';
import Game from '../../../models/Game';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const games = await Game.find({ status: 'active' })
      .populate('category')
      .sort({ playCount: -1 })
      .limit(12);
    
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching popular games:', error);
    res.status(500).json({ error: 'Error fetching popular games' });
  }
} 