const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function check() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('site_contents');
        const doc = await collection.findOne({ key: 'complete_data' });
        console.log("DB Name:", dbName);
        console.log("URI:", uri.split('@')[1]); // Hide password
        console.log("Hero Title:", doc?.data?.hero?.title);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
