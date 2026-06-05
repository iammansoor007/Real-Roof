const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define terms and replacements
const replacements = [
  { regex: /Brandon Anderson/g, replacement: 'Elisha Sellers' },
  { regex: /brandon-anderson/g, replacement: 'elisha-sellers' },
  { regex: /Brandon\s+Anderson\.webp/gi, replacement: 'elisha-sellers.webp' },
  { regex: /BrandonAnderson/g, replacement: 'ElishaSellers' },
  { regex: /banderson@RealRoof\.com/gi, replacement: 'esellers@RealRoof.com' },
  { regex: /banderson/gi, replacement: 'esellers' },
  { regex: /\bBrandon\b(?!\s+Sales|\s+Sutton)/g, replacement: 'Elisha' },
  { regex: /Veteran Owned & Operated/gi, replacement: 'Locally Owned & Operated' },
  { regex: /Veteran-Owned & Operated/gi, replacement: 'Locally-Owned & Operated' },
  { regex: /Veteran Owned/gi, replacement: 'Locally Owned' },
  { regex: /Veteran-Owned/gi, replacement: 'Locally-Owned' },
  { regex: /veteran owned/gi, replacement: 'locally owned' },
  { regex: /veteran-owned/gi, replacement: 'locally-owned' },
  { regex: /veteran-grade/gi, replacement: 'premium-grade' },
  { regex: /veteran precision/gi, replacement: 'premium precision' }
];

function performReplacements(str) {
  if (typeof str !== 'string') return str;
  let s = str;
  for (const r of replacements) {
    s = s.replace(r.regex, r.replacement);
  }
  return s;
}

function traverseAndReplace(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return performReplacements(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => traverseAndReplace(item));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      let newKey = key;
      if (key === 'BrandonAnderson') {
        newKey = 'ElishaSellers';
      }
      newObj[newKey] = traverseAndReplace(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'realroof';
  console.log(`Connecting to MongoDB...`);
  
  await mongoose.connect(uri, { dbName });
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log(`Scanning and updating all ${collections.length} collections for any leftovers...`);

  for (const collInfo of collections) {
    const collName = collInfo.name;
    // Let's skip system collections if any
    if (collName.startsWith('system.')) continue;

    const collection = db.collection(collName);
    const cursor = collection.find({});
    
    let updatedDocs = 0;
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const docStr = JSON.stringify(doc);
      
      // Check if document needs update
      let needsUpdate = false;
      for (const r of replacements) {
        if (r.regex.test(docStr)) {
          needsUpdate = true;
          break;
        }
      }

      if (needsUpdate) {
        const updatedDoc = traverseAndReplace(doc);
        // Remove _id from set statement if updating
        const { _id, ...updateFields } = updatedDoc;
        await collection.updateOne({ _id: doc._id }, { $set: updateFields });
        updatedDocs++;
      }
    }
    if (updatedDocs > 0) {
      console.log(`Updated ${updatedDocs} documents in collection "${collName}".`);
    }
  }

  console.log('Cleanup script executed successfully.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('Error running cleanup:', err);
  process.exit(1);
});
