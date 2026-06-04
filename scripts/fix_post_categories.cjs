const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function fix() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const postsColl = db.collection('posts');
    
    const posts = await postsColl.find({}).toArray();
    let fixed = 0;

    for (const post of posts) {
      if (post.categories && Array.isArray(post.categories)) {
        let changed = false;
        const newCats = post.categories.map(cat => {
          // If it's a Buffer (which MongoDB node driver returns for BinData/UUID)
          if (cat && cat._bsontype === 'Binary' || cat.buffer) {
            changed = true;
            return null; // Just remove it or set to a valid ObjectId
          }
          if (typeof cat === 'object' && cat.buffer) {
            changed = true;
            return null;
          }
          return cat;
        }).filter(cat => cat !== null);

        if (changed) {
          await postsColl.updateOne({ _id: post._id }, { $set: { categories: newCats } });
          fixed++;
          console.log('Fixed post:', post.title);
        }
      }
    }
    console.log(`Fixed ${fixed} posts`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

fix();
