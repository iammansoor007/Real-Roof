import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://ammansoor0077_db_user:IVIuSAD1EiIGKuxH@ac-0nknxvb-shard-00-00.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-01.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-02.chmqmrp.mongodb.net:27017/eagle_revolution?ssl=true&replicaSet=atlas-pqmvql-shard-0&authSource=admin&appName=Cluster0";

const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true, collection: 'site_contents' });

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function checkData() {
    await mongoose.connect(MONGODB_URI, { dbName: "eagle_revolution" });
    const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
    if (content?.data?.services) {
        console.log("Services object keys:", Object.keys(content.data.services));
        console.log("Headline:", JSON.stringify(content.data.services.headline, null, 2));
    }
    process.exit(0);
}

checkData().catch(err => {
    console.error(err);
    process.exit(1);
});
