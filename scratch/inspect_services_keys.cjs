const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function check() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const globalContent = await db.collection('site_contents').findOne({ key: 'complete_data' });
        if (globalContent && globalContent.data && globalContent.data.services) {
            const sObj = globalContent.data.services;
            console.log("Root keys of services object:", Object.keys(sObj));
            console.log("Type of headline:", typeof sObj.headline, sObj.headline);
            console.log("Type of badge:", typeof sObj.badge, sObj.badge);
            console.log("Type of description:", typeof sObj.description, sObj.description);
        } else {
            console.log("No services object found!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
