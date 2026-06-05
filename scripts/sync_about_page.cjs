/**
 * One-time sync script: copies all content from the about-us page in the
 * `pages` collection to `complete_data.data.aboutPage` in `site_contents`.
 * 
 * Run with: node scripts/sync_about_page.cjs
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Read .env.local to get MONGODB_URI
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local not found at', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function syncAboutPage() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB || 'realroof');

    // Find the about-us page
    const aboutPage = await db.collection('pages').findOne({
      slug: 'about-us',
      isTrashed: { $ne: true }
    });

    if (!aboutPage) {
      console.error('ERROR: No about-us page found in pages collection');
      process.exit(1);
    }

    const content = aboutPage.content || {};
    console.log('\nFound about-us page:', aboutPage._id.toString());
    console.log('Sections in page content:', Object.keys(content));

    if (content.story?.portrait?.image) {
      console.log('\n✅ Portrait image found:', content.story.portrait.image);
    } else {
      console.log('\n⚠️  No portrait image found in story.portrait.image');
    }

    // Build the sync set
    const sectionsToSync = [
      'hero', 'mission', 'story', 'values', 'capabilities',
      'stats', 'ctaBanner', 'recognition', 'services', 'faqs', 'blogSection'
    ];
    const syncSet = {};

    for (const section of sectionsToSync) {
      if (content[section] !== undefined) {
        syncSet[`data.aboutPage.${section}`] = content[section];
        console.log(`  Syncing section: ${section}`);
      }
    }

    if (Object.keys(syncSet).length === 0) {
      console.log('\n⚠️  No sections found to sync. Check if about-us page has content.');
      process.exit(0);
    }

    // Update complete_data
    const result = await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { ...syncSet, lastUpdated: new Date() } }
    );

    if (result.matchedCount === 0) {
      console.error('\nERROR: complete_data document not found in site_contents');
      process.exit(1);
    }

    console.log(`\n✅ Successfully synced ${Object.keys(syncSet).length} sections to complete_data.data.aboutPage`);
    console.log('Modified count:', result.modifiedCount);

    // Verify portrait was synced
    const updated = await db.collection('site_contents').findOne({ key: 'complete_data' });
    const portraitUrl = updated?.data?.aboutPage?.story?.portrait?.image;
    if (portraitUrl) {
      console.log('\n✅ Portrait image is now in complete_data:', portraitUrl);
    } else {
      console.log('\n⚠️  Portrait image was not found in about-us page content.story.portrait.image');
      console.log('    This is normal if the admin has not saved the portrait via the dashboard yet.');
    }

  } finally {
    await client.close();
    console.log('\nDone! Refresh http://localhost:3000/about to see the changes.');
  }
}

syncAboutPage().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
