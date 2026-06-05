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
        const globalContent = await db.collection('site_contents').findOne({ key: 'complete_data' });
        if (globalContent && globalContent.data) {
            console.log("\nServices object:", JSON.stringify(globalContent.data.services, null, 2));
        } else {
            console.log("No complete_data found!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
