const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB });
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  const searchTerms = [/brandon/i, /veteran/i, /military/i, /army/i];

  for (const coll of collections) {
    const name = coll.name;
    // Skip log collections or media if they are huge and not relevant, but let's check everything
    if (name === 'activitylogs') continue; // Skip activity logs search to avoid spamming output
    
    const docs = await db.collection(name).find({}).toArray();
    let matchCount = 0;
    
    for (const doc of docs) {
      const docStr = JSON.stringify(doc);
      const matched = searchTerms.some(regex => regex.test(docStr));
      if (matched) {
        matchCount++;
        // Print context of match
        console.log(`Match in collection "${name}", ID: ${doc._id || doc.key}`);
        if (name === 'site_contents') {
          console.log(`  Key: ${doc.key}`);
        } else if (name === 'pages') {
          console.log(`  Slug: ${doc.slug}, Title: ${doc.title}`);
        } else if (name === 'posts') {
          console.log(`  Slug: ${doc.slug}, Title: ${doc.title}`);
        }
      }
    }
    console.log(`Collection "${name}": found ${matchCount} matching documents.`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
