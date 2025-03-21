import dbConnect from '../../../lib/mongodb';
import Category from '../../../models/Category';
import { authMiddleware } from '../../../middleware/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const categories = await Category.find().sort({ name: 1 });
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Error fetching categories' });
    }
  } else if (req.method === 'POST') {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Error creating category' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler); 