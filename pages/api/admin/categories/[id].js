import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
import Game from '../../../../models/Game';
import { authMiddleware } from '../../../../middleware/auth';

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Error updating category' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if category has games
      const gamesCount = await Game.countDocuments({ category: id });
      if (gamesCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category that has games. Please remove or reassign games first.' 
        });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Error deleting category' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler); 