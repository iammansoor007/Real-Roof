const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB });
  const db = mongoose.connection.db;

  const targetPageIds = [
    '69fb3b7b3d4223c476965fe7',
    '6a034a2cb444ee84b4adbdd4',
    '6a05d0ce5997ad2f275faf12',
    '69fb395f3d4223c476965fde',
    '6a0b20cbbafe27f469c1535e'
  ];

  for (const id of targetPageIds) {
    const page = await db.collection('pages').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (page) {
      console.log(`PAGE: Slug: ${page.slug}, Title: ${page.title}`);
      // Find where 'brandon' or 'veteran' or 'military' occurs in the document
      const pageStr = JSON.stringify(page);
      const terms = [/brandon/i, /veteran/i, /military/i, /army/i];
      for (const term of terms) {
        if (term.test(pageStr)) {
          console.log(`  Matches regex: ${term}`);
        }
      }
      // Print page structure or some content
      console.log(`  Keys: ${Object.keys(page)}`);
      if (page.content) {
        console.log(`  Content keys: ${Object.keys(page.content)}`);
        // Let's print a small snippet of page.content where they match
      }
    }
  }

  const mediaIds = [
    '6a0b0c50619ccd6487a9436d',
    '69fcd147be385263065aaffd',
    '6a0b134bdb81f869169d25fc',
    '69fcd15ebe385263065ab000',
    '6a035dfe1574af8f6a43b312',
    '6a0b0bd1619ccd6487a9436a'
  ];

  for (const id of mediaIds) {
    const med = await db.collection('media').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (med) {
      console.log(`MEDIA: ID: ${id}, Title: ${med.title || med.name}, URL: ${med.url || med.secure_url}`);
      console.log(`  Full:`, JSON.stringify(med, null, 2));
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
