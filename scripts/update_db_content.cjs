const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = 'eagle_revolution'; // keeping the same dbname as the existing one in .env

async function updateDB() {
    if (!uri) {
        console.error("MONGODB_URI not found");
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log(`Connected to MongoDB. Target DB: ${dbName}`);

        const db = client.db(dbName);
        const collection = db.collection('site_contents');

        // Fetch the complete_data document
        const doc = await collection.findOne({ key: 'complete_data' });
        
        if (!doc) {
            console.error("Could not find complete_data document in DB.");
            return;
        }

        console.log("Found complete_data. Performing replacements...");

        // Deep replace function
        function replaceStrings(obj) {
            if (typeof obj === 'string') {
                let newStr = obj;
                newStr = newStr.replace(/Eagle Revolution/gi, 'RealRoof');
                newStr = newStr.replace(/EagleRevolution/gi, 'RealRoof');
                newStr = newStr.replace(/eagle-revolution/gi, 'realroof');
                newStr = newStr.replace(/\/eagle-logo\.png/gi, '/realrooflogo.webp');
                newStr = newStr.replace(/eagle-logo\.png/gi, 'realrooflogo.webp');
                newStr = newStr.replace(/\bEagle\b/g, 'RealRoof'); // Case-sensitive replacement for Eagle
                newStr = newStr.replace(/\beagle\b/g, 'realroof');
                newStr = newStr.replace(/eaglerevolution\.com/gi, 'realroof.com');
                return newStr;
            } else if (Array.isArray(obj)) {
                return obj.map(item => replaceStrings(item));
            } else if (obj !== null && typeof obj === 'object') {
                const newObj = {};
                for (const [k, v] of Object.entries(obj)) {
                    // Also replace keys if needed, but usually we just replace values
                    newObj[k] = replaceStrings(v);
                }
                return newObj;
            }
            return obj;
        }

        const updatedData = replaceStrings(doc.data);

        // Save back to DB
        const result = await collection.updateOne(
            { key: 'complete_data' },
            { 
                $set: { 
                    data: updatedData,
                    lastUpdated: new Date()
                } 
            }
        );

        console.log(`Successfully updated database. Modified: ${result.modifiedCount}`);

        // Update pages collection
        const pagesCollection = db.collection('pages');
        const pages = await pagesCollection.find({}).toArray();
        let pagesUpdated = 0;
        
        for (const page of pages) {
            const newContent = replaceStrings(page.content);
            const newMetadata = replaceStrings(page.metadata);
            
            const r = await pagesCollection.updateOne(
                { _id: page._id },
                { $set: { content: newContent, metadata: newMetadata } }
            );
            if (r.modifiedCount > 0) pagesUpdated++;
        }
        
        console.log(`Successfully updated ${pagesUpdated} pages.`);

        // Update blog posts if any
        const blogCollection = db.collection('posts');
        const posts = await blogCollection.find({}).toArray();
        let postsUpdated = 0;
        
        for (const post of posts) {
            const newTitle = replaceStrings(post.title);
            const newContent = replaceStrings(post.content);
            const newExcerpt = replaceStrings(post.excerpt);
            
            const r = await blogCollection.updateOne(
                { _id: post._id },
                { $set: { title: newTitle, content: newContent, excerpt: newExcerpt } }
            );
            if (r.modifiedCount > 0) postsUpdated++;
        }
        
        console.log(`Successfully updated ${postsUpdated} blog posts.`);

    } catch (err) {
        console.error("Error updating database:", err);
    } finally {
        await client.close();
    }
}

updateDB();
