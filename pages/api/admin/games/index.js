import dbConnect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';

export default async function handler(req, res) {
  // Bỏ qua authentication tạm thời để test
  // const token = req.cookies.get('adminToken');
  // if (!token) {
  //   return res.status(401).json({ error: 'Authentication required' });
  // }

  try {
    await dbConnect();

    switch (req.method) {
      case 'GET':
        try {
          const games = await Game.find({})
            .populate('category')
            .sort({ createdAt: -1 });
          
          console.log('Found games:', games.length); // Debug log
          return res.status(200).json(games);
        } catch (error) {
          console.error('Error fetching games:', error);
          return res.status(500).json({ error: 'Failed to fetch games' });
        }

      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
} 