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
    console.log("Keys in complete_data.data:", Object.keys(content?.data || {}));
    if (content?.data?.services) {
        const services = content.data.services;
        console.log("Services data type:", typeof services);
        console.log("Is array:", Array.isArray(services));
        
        if (Array.isArray(services)) {
            console.log("Number of services (array):", services.length);
            if (services.length > 0) {
                console.log("First service:", JSON.stringify(services[0], null, 2).substring(0, 500));
            }
        } else if (services.services) {
            console.log("Number of services (obj.services):", services.services.length);
            if (services.services.length > 0) {
                console.log("First service:", JSON.stringify(services.services[0], null, 2).substring(0, 500));
            }
        }
    } else {
        console.log("Services key missing in complete_data.data");
    }
    process.exit(0);
}

checkData().catch(err => {
    console.error(err);
    process.exit(1);
});
