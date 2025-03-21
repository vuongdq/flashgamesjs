import dbConnect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const games = await Game.find({ 
      category: id,
      status: 'active'
    })
    .populate('category')
    .sort({ playCount: -1 });
    
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching category games:', error);
    res.status(500).json({ error: 'Error fetching category games' });
  }
} 