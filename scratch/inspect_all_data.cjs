const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function check() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log("Connected to DB:", dbName);
        
        // 1. Pages
        const pages = await db.collection('pages').find({}).toArray();
        console.log(`\nFound ${pages.length} pages:`);
        pages.forEach(p => {
            console.log(`- Page: ${p.title} (${p.slug}) | Template: ${p.template} | Status: ${p.status}`);
            console.log(`  Content Keys:`, Object.keys(p.content || {}));
        });
        
        // 2. Site Content
        const globalContent = await db.collection('site_contents').findOne({ key: 'complete_data' });
        if (globalContent && globalContent.data) {
            console.log(`\nGlobal complete_data Keys:`, Object.keys(globalContent.data));
            
            // Log structure of key sections
            const keySections = ['testimonials', 'team', 'careers', 'galleryPage', 'contactPage', 'services', 'faq'];
            keySections.forEach(sec => {
                if (globalContent.data[sec]) {
                    console.log(`\n--- Section [${sec}] ---`);
                    console.log(JSON.stringify(globalContent.data[sec], null, 2).substring(0, 1000) + '...');
                } else {
                    console.log(`\n--- Section [${sec}] ---: MISSING`);
                }
            });
        } else {
            console.log("\nNo complete_data found!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
