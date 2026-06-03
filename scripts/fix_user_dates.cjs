const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function fixUserDates() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');

        const allUsers = await users.find({}).toArray();
        for (const user of allUsers) {
            let needsUpdate = false;
            let updateFields = {};

            // Check createdAt
            if (!user.createdAt || typeof user.createdAt === 'object' && !(user.createdAt instanceof Date)) {
                updateFields.createdAt = new Date();
                needsUpdate = true;
            }

            // Check updatedAt
            if (!user.updatedAt || typeof user.updatedAt === 'object' && !(user.updatedAt instanceof Date)) {
                updateFields.updatedAt = new Date();
                needsUpdate = true;
            }

            // Check lastLogin
            if (user.lastLogin !== null && user.lastLogin !== undefined && typeof user.lastLogin === 'object' && !(user.lastLogin instanceof Date)) {
                updateFields.lastLogin = new Date();
                needsUpdate = true;
            }

            if (needsUpdate) {
                await users.updateOne(
                    { _id: user._id },
                    { $set: updateFields }
                );
                console.log(`Fixed corrupted dates for user: ${user.username}`);
            }
        }
        
        console.log("Date fix completed.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
fixUserDates();
