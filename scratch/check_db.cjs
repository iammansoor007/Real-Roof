const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true, collection: 'site_contents' });

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

async function checkSlugs() {
  const uri = "mongodb://ammansoor0077_db_user:IVIuSAD1EiIGKuxH@ac-0nknxvb-shard-00-00.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-01.chmqmrp.mongodb.net:27017,ac-0nknxvb-shard-00-02.chmqmrp.mongodb.net:27017/eagle_revolution?ssl=true&replicaSet=atlas-pqmvql-shard-0&authSource=admin&appName=Cluster0";
  await mongoose.connect(uri);
  const content = await SiteContent.findOne({ key: "complete_data" });
  if (!content) {
    console.log("No complete_data found");
    return;
  }
  const services = content.data.services.services;
  console.log(`Registered Service Slugs (${services.length}):`);
  services.forEach(s => {
    console.log(`- ${s.slug} (Status: ${s.status}, Title: ${s.title})`);
  });
  process.exit(0);
}

checkSlugs();
