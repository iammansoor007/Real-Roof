const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fixPage() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection('pages').updateOne(
      { _id: new ObjectId('69fb1c081f5a51c8e483c600') },
      { $unset: { content: '' } }
    );
    console.log('Removed stale content from homepage document in database.', result);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

fixPage();
