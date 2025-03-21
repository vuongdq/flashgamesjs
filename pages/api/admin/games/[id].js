import dbConnect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';
import { authMiddleware } from '../../../../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let dest = 'public/games';
      if (file.fieldname === 'thumbnail') {
        dest = 'public/thumbnails';
      } else if (file.fieldname === 'walkthroughImages') {
        dest = 'public/images';
      }
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'DELETE') {
    try {
      const game = await Game.findById(id);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Delete associated files
      if (game.url) {
        try {
          await fs.unlink(path.join(process.cwd(), 'public', game.url));
        } catch (e) {
          console.error('Error deleting game file:', e);
        }
      }
      
      if (game.thumbnail) {
        try {
          await fs.unlink(path.join(process.cwd(), 'public', game.thumbnail));
        } catch (e) {
          console.error('Error deleting thumbnail:', e);
        }
      }
      
      if (game.walkthroughImages) {
        for (const img of game.walkthroughImages) {
          try {
            await fs.unlink(path.join(process.cwd(), 'public', img));
          } catch (e) {
            console.error('Error deleting walkthrough image:', e);
          }
        }
      }

      await Game.findByIdAndDelete(id);
      res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({ error: 'Error deleting game' });
    }
  } else if (req.method === 'PUT') {
    upload.fields([
      { name: 'swf', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'walkthroughImages', maxCount: 5 }
    ])(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const game = await Game.findById(id);
        if (!game) {
          return res.status(404).json({ error: 'Game not found' });
        }

        const updateData = { ...req.body };

        // Handle file updates
        if (req.files.swf) {
          // Delete old SWF file
          if (game.url) {
            try {
              await fs.unlink(path.join(process.cwd(), 'public', game.url));
            } catch (e) {
              console.error('Error deleting old SWF file:', e);
            }
          }
          updateData.url = `/games/${req.files.swf[0].filename}`;
        }

        if (req.files.thumbnail) {
          // Delete old thumbnail
          if (game.thumbnail) {
            try {
              await fs.unlink(path.join(process.cwd(), 'public', game.thumbnail));
            } catch (e) {
              console.error('Error deleting old thumbnail:', e);
            }
          }
          updateData.thumbnail = `/thumbnails/${req.files.thumbnail[0].filename}`;
        }

        if (req.files.walkthroughImages) {
          // Delete old walkthrough images
          if (game.walkthroughImages) {
            for (const img of game.walkthroughImages) {
              try {
                await fs.unlink(path.join(process.cwd(), 'public', img));
              } catch (e) {
                console.error('Error deleting old walkthrough image:', e);
              }
            }
          }
          updateData.walkthroughImages = req.files.walkthroughImages.map(file => 
            `/images/${file.filename}`
          );
        }

        // Update hashtags
        if (updateData.hashtags) {
          updateData.hashtags = updateData.hashtags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        }

        const updatedGame = await Game.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        ).populate('category');

        res.status(200).json(updatedGame);
      } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ error: 'Error updating game' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);

export const config = {
  api: {
    bodyParser: false,
  },
}; 