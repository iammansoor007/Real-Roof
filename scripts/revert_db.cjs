const { MongoClient } = require('mongodb');

const oldUri = "mongodb://ammansoor0077_db_user:IVIuSAD1EiIGKuxH@ac-0nknxvb-shard-00-00.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-01.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-02.chmqmrp.mongodb.net:27017/eagle_revolution?ssl=true&replicaSet=atlas-pqmvql-shard-0&authSource=admin&appName=Cluster0";
const dbName = 'eagle_revolution';

async function revertDB() {
    const client = new MongoClient(oldUri);

    try {
        await client.connect();
        console.log(`Connected to Old MongoDB for reverting.`);
        const db = client.db(dbName);
        
        function revertStrings(obj) {
            if (typeof obj === 'string') {
                let newStr = obj;
                newStr = newStr.replace(/RealRoof/g, 'Eagle Revolution');
                newStr = newStr.replace(/realrooflogo\.webp/gi, '/eagle-logo.png');
                newStr = newStr.replace(/realroof\.com/gi, 'eaglerevolution.com');
                newStr = newStr.replace(/\brealroof\b/gi, 'eagle-revolution');
                return newStr;
            } else if (Array.isArray(obj)) {
                return obj.map(item => revertStrings(item));
            } else if (obj !== null && typeof obj === 'object') {
                const newObj = {};
                for (const [k, v] of Object.entries(obj)) {
                    newObj[k] = revertStrings(v);
                }
                return newObj;
            }
            return obj;
        }

        // Revert site_contents
        const collection = db.collection('site_contents');
        const doc = await collection.findOne({ key: 'complete_data' });
        if (doc) {
            const revertedData = revertStrings(doc.data);
            await collection.updateOne({ key: 'complete_data' }, { $set: { data: revertedData } });
            console.log("Reverted complete_data");
        }

        // Revert pages
        const pagesCollection = db.collection('pages');
        const pages = await pagesCollection.find({}).toArray();
        for (const page of pages) {
            await pagesCollection.updateOne(
                { _id: page._id },
                { $set: { content: revertStrings(page.content), metadata: revertStrings(page.metadata) } }
            );
        }
        console.log(`Reverted ${pages.length} pages.`);

    } catch (err) {
        console.error("Error reverting:", err);
    } finally {
        await client.close();
    }
}
revertDB();
