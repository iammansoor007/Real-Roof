const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function grantAllPermissions() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const roles = db.collection('roles');

        const allPermissions = {
            dashboard: { read: true, update: true, create: true, delete: true },
            pages: { read: true, update: true, create: true, delete: true },
            blog: { read: true, update: true, create: true, delete: true },
            media: { read: true, update: true, create: true, delete: true },
            submissions: { read: true, update: true, create: true, delete: true },
            users: { read: true, update: true, create: true, delete: true },
            logs: { read: true, update: true, create: true, delete: true },
            settings: { read: true, update: true, create: true, delete: true },
            content: { read: true, update: true, create: true, delete: true }
        };

        await roles.updateOne(
            { name: 'Super Admin' },
            { $set: { permissions: allPermissions } }
        );
        console.log("Successfully granted ALL required permissions to Super Admin role.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
grantAllPermissions();
