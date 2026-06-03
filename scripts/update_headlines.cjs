const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function updateHeadlines() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('site_contents');
        
        const doc = await collection.findOne({ key: 'complete_data' });
        if (doc && doc.data && doc.data.hero) {
            // Update the headlines array correctly
            doc.data.hero.headlines = [
                { text: "Welcome to the New", highlight: false },
                { text: " RealRoof Database!", highlight: true }
            ];
            
            await collection.updateOne(
                { key: 'complete_data' },
                { $set: { "data.hero.headlines": doc.data.hero.headlines } }
            );
            console.log("Successfully updated headlines in the new database!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
updateHeadlines();
