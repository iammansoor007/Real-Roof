const { MongoClient } = require('mongodb');

const oldUri = "mongodb://ammansoor0077_db_user:IVIuSAD1EiIGKuxH@ac-0nknxvb-shard-00-00.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-01.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-02.chmqmrp.mongodb.net:27017/eagle_revolution?ssl=true&replicaSet=atlas-pqmvql-shard-0&authSource=admin&appName=Cluster0";

async function listCollections() {
    const client = new MongoClient(oldUri);
    try {
        await client.connect();
        const db = client.db('eagle_revolution');
        const collections = await db.listCollections().toArray();
        console.log(collections.map(c => c.name));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
listCollections();
