import dbConnect from '../../../lib/mongodb';
import Game from '../../../models/Game';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.redirect('/404');
    }
    res.redirect(301, `/game/${game.slug}`);
  } catch (error) {
    res.redirect('/404');
  }
} 