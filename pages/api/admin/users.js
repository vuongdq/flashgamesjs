import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { authMiddleware } from '../../../middleware/auth';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler); 