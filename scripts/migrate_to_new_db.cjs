const { MongoClient } = require('mongodb');

const oldUri = "mongodb://ammansoor0077_db_user:IVIuSAD1EiIGKuxH@ac-0nknxvb-shard-00-00.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-01.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-02.chmqmrp.mongodb.net:27017/eagle_revolution?ssl=true&replicaSet=atlas-pqmvql-shard-0&authSource=admin&appName=Cluster0";
const newUri = "mongodb://ammansoor0077_db_user:pP1POdWvhGhSd2vl@ac-y705ywg-shard-00-00.j35q4rb.mongodb.net:27017,ac-y705ywg-shard-00-01.j35q4rb.mongodb.net:27017,ac-y705ywg-shard-00-02.j35q4rb.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-l0v8y6-shard-0&appName=Cluster0";

const oldDbName = 'eagle_revolution';
const newDbName = 'realroof';

async function migrate() {
    const oldClient = new MongoClient(oldUri, { family: 4 });
    const newClient = new MongoClient(newUri, { family: 4 });

    try {
        await oldClient.connect();
        await newClient.connect();
        console.log(`Connected to BOTH databases.`);

        const oldDb = oldClient.db(oldDbName);
        const newDb = newClient.db(newDbName);

        function replaceStrings(obj) {
            if (typeof obj === 'string') {
                let newStr = obj;
                newStr = newStr.replace(/Eagle Revolution/gi, 'RealRoof');
                newStr = newStr.replace(/EagleRevolution/gi, 'RealRoof');
                newStr = newStr.replace(/eagle-revolution/gi, 'realroof');
                newStr = newStr.replace(/\/eagle-logo\.png/gi, '/realrooflogo.webp');
                newStr = newStr.replace(/eagle-logo\.png/gi, 'realrooflogo.webp');
                newStr = newStr.replace(/\bEagle\b/g, 'RealRoof');
                newStr = newStr.replace(/\beagle\b/g, 'realroof');
                newStr = newStr.replace(/eaglerevolution\.com/gi, 'realroof.com');
                return newStr;
            } else if (Array.isArray(obj)) {
                return obj.map(item => replaceStrings(item));
            } else if (obj !== null && typeof obj === 'object') {
                const newObj = {};
                for (const [k, v] of Object.entries(obj)) {
                    // Do not mutate _id
                    if (k === '_id') {
                        newObj[k] = v;
                    } else {
                        newObj[k] = replaceStrings(v);
                    }
                }
                return newObj;
            }
            return obj;
        }

        const collections = await oldDb.listCollections().toArray();
        for (const collInfo of collections) {
            const collectionName = collInfo.name;
            const oldCollection = oldDb.collection(collectionName);
            const newCollection = newDb.collection(collectionName);
            
            const docs = await oldCollection.find({}).toArray();
            
            if (docs.length === 0) continue;

            const newDocs = docs.map(doc => replaceStrings(doc));

            await newCollection.deleteMany({}); // clear first
            await newCollection.insertMany(newDocs);
            
            console.log(`Migrated ${docs.length} documents into ${collectionName}`);
        }

        console.log("Migration complete!");

    } catch (err) {
        console.error("Error migrating:", err);
    } finally {
        await oldClient.close();
        await newClient.close();
    }
}

migrate();
