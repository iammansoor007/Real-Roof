const { MongoClient } = require('mongodb');

// Use the standard connection string format that avoids the SRV DNS issue
const newUri = "mongodb://ammansoor0077_db_user:pP1POdWvhGhSd2vl@ac-y705ywg-shard-00-00.j35q4rb.mongodb.net:27017,ac-y705ywg-shard-00-01.j35q4rb.mongodb.net:27017,ac-y705ywg-shard-00-02.j35q4rb.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-l0v8y6-shard-0&appName=Cluster0";
const dbName = 'realroof';

async function updateHero() {
    const client = new MongoClient(newUri, { family: 4 });

    try {
        await client.connect();
        console.log(`Connected to NEW Database.`);
        const db = client.db(dbName);
        
        const collection = db.collection('site_contents');
        const doc = await collection.findOne({ key: 'complete_data' });
        
        if (doc && doc.data && doc.data.hero) {
            // Update the hero title
            doc.data.hero.title = "Welcome to the New RealRoof Database!";
            doc.data.hero.subtitle = "This subtitle proves you are connected to the completely new MongoDB cluster.";
            
            await collection.updateOne(
                { key: 'complete_data' }, 
                { $set: { "data.hero": doc.data.hero } }
            );
            console.log("Hero content updated in the new database successfully!");
        } else {
            console.log("Could not find complete_data or hero section.");
        }

    } catch (err) {
        console.error("Error updating:", err);
    } finally {
        await client.close();
    }
}
updateHero();
