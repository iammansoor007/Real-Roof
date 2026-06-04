const { MongoClient } = require('mongodb');
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
      let changed = false;
      const update = {};

      if (post.categories && Array.isArray(post.categories)) {
        const newCats = post.categories.map(cat => {
          if (cat && (cat._bsontype === 'Binary' || cat.buffer)) return null;
          if (typeof cat === 'object' && (cat.buffer || Object.keys(cat).every(k => !isNaN(k)))) return null;
          return cat;
        }).filter(cat => cat !== null);
        if (newCats.length !== post.categories.length) {
          update.categories = newCats;
          changed = true;
        }
      }

      if (post.tags && Array.isArray(post.tags)) {
        const newTags = post.tags.map(tag => {
          if (tag && (tag._bsontype === 'Binary' || tag.buffer)) return null;
          if (typeof tag === 'object' && (tag.buffer || Object.keys(tag).every(k => !isNaN(k)))) return null;
          return tag;
        }).filter(tag => tag !== null);
        if (newTags.length !== post.tags.length) {
          update.tags = newTags;
          changed = true;
        }
      }

      if (post.author) {
        let auth = post.author;
        if (auth && (auth._bsontype === 'Binary' || auth.buffer || (typeof auth === 'object' && Object.keys(auth).every(k => !isNaN(k))))) {
          update.author = null;
          changed = true;
        }
      }

      if (changed) {
        await postsColl.updateOne({ _id: post._id }, { $set: update });
        fixed++;
        console.log('Fixed post:', post.title, 'update:', Object.keys(update));
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
