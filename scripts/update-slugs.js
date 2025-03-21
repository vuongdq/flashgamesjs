const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'flashgames';

async function updateSlugs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const gamesCollection = db.collection('games');

    // Tìm tất cả game chưa có slug
    const games = await gamesCollection.find({ 
      $or: [{ slug: { $exists: false } }, { slug: null }] 
    }).toArray();

    console.log(`Found ${games.length} games without slugs`);

    for (const game of games) {
      // Tạo slug từ title
      const slug = game.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');

      // Cập nhật slug
      await gamesCollection.updateOne(
        { _id: game._id },
        { $set: { slug: slug } }
      );

      console.log(`Updated slug for game: ${game.title} -> ${slug}`);
    }

    console.log('Finished updating slugs');
  } catch (error) {
    console.error('Error updating slugs:', error);
  } finally {
    await client.close();
    process.exit();
  }
}

updateSlugs(); 