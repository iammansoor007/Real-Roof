const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Read MONGODB_URI from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const uri = mongoUriLine.split('MONGODB_URI=')[1].trim();

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('eagle_revolution');
    const pagesCollection = db.collection('pages');
    
    const pages = await pagesCollection.find({}).toArray();
    console.log(`Found ${pages.length} total pages in database:`);
    for (const page of pages) {
      console.log(`- _id: ${page._id}, title: ${page.title}, slug: ${page.slug}, template: ${page.template}, status: ${page.status}`);
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
