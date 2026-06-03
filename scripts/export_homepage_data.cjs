const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function exportData() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('site_contents');
        
        const doc = await collection.findOne({ key: 'complete_data' });
        
        if (doc && doc.data) {
            const exportPath = path.join('c:/Users/dell/Desktop/RealRoof', 'homepage_data.json');
            fs.writeFileSync(exportPath, JSON.stringify(doc.data, null, 2));
            console.log(`Successfully exported data to ${exportPath}`);
        } else {
            console.log("Could not find complete_data in the database.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

exportData();
