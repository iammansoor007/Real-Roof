const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function fixPermissions() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const roles = db.collection('roles');

        await roles.updateOne(
            { name: 'Super Admin' },
            { $set: { 
                "permissions.submissions": { read: true, update: true, create: true, delete: true }
            }}
        );
        console.log("Added submissions permissions to Super Admin role.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
fixPermissions();
