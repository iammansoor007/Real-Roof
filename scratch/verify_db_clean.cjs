const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'realroof';
  console.log(`Connecting to MongoDB at: ${uri.replace(/:([^:@]+)@/, ':***@')} (db: ${dbName})`);
  
  await mongoose.connect(uri, { dbName });
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log(`Found ${collections.length} collections.`);

  const searchTerms = [
    { name: 'Brandon Anderson', regex: /brandon\s+anderson/i },
    { name: 'banderson', regex: /banderson/i },
    { name: 'veteran owned', regex: /veteran\s+owned/i }
  ];

  let matchesCount = 0;

  for (const collInfo of collections) {
    const collName = collInfo.name;
    const collection = db.collection(collName);
    
    console.log(`Scanning collection: ${collName}...`);
    const docs = await collection.find({}).toArray();
    
    for (const doc of docs) {
      const docStr = JSON.stringify(doc);
      
      for (const term of searchTerms) {
        if (term.regex.test(docStr)) {
          matchesCount++;
          console.log(`[MATCH] Collection "${collName}", Doc ID: ${doc._id || 'unknown'} matched term "${term.name}"`);
          findAndPrintMatches(doc, term.regex, term.name);
        }
      }
    }
  }

  console.log(`\nScan complete. Found ${matchesCount} total occurrences of target terms in the database.`);
  await mongoose.disconnect();
  process.exit(0);
}

function findAndPrintMatches(obj, regex, termName, path = '') {
  if (!obj) return;
  
  if (typeof obj === 'string') {
    if (regex.test(obj)) {
      console.log(`  Path: "${path}" => "${obj.substring(0, 100)}${obj.length > 100 ? '...' : ''}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      findAndPrintMatches(item, regex, termName, `${path}[${index}]`);
    });
  } else if (typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      findAndPrintMatches(obj[key], regex, termName, path ? `${path}.${key}` : key);
    });
  }
}

run().catch(err => {
  console.error('Error running scan:', err);
  process.exit(1);
});
