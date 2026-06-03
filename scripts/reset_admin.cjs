const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function resetAdmin() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');
        const roles = db.collection('roles');

        // Check if Super Admin role exists
        let superAdminRole = await roles.findOne({ name: 'Super Admin' });
        if (!superAdminRole) {
             console.log("Creating Super Admin role...");
             const res = await roles.insertOne({
                 name: 'Super Admin',
                 description: 'Full system access',
                 permissions: {
                    content: { read: true, update: true, create: true, delete: true },
                    blog: { read: true, update: true, create: true, delete: true },
                    users: { read: true, update: true, create: true, delete: true },
                    settings: { read: true, update: true, create: true, delete: true }
                 },
                 createdAt: new Date(),
                 updatedAt: new Date()
             });
             superAdminRole = { _id: res.insertedId };
        }

        const username = 'admin';
        const password = 'Password123!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await users.findOne({ username });
        if (adminUser) {
            await users.updateOne(
                { username },
                { $set: { password: hashedPassword, status: 'active', role: superAdminRole._id } }
            );
            console.log("Updated existing admin user.");
        } else {
             await users.insertOne({
                 username,
                 email: 'admin@realroof.com',
                 password: hashedPassword,
                 role: superAdminRole._id,
                 status: 'active',
                 createdAt: new Date(),
                 updatedAt: new Date()
             });
             console.log("Created new admin user.");
        }

        console.log("\n--- ADMIN CREDENTIALS ---");
        console.log("Username: " + username);
        console.log("Password: " + password);
        console.log("-------------------------\n");

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
resetAdmin();
