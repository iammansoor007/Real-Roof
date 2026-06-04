const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const coll = client.db(process.env.MONGODB_DB).collection('site_contents');
  const doc = await coll.findOne({ key: 'complete_data' });

  const newServices = doc.data.services.services.map((s, i) => {
    return {
      ...s,
      slug: s.id,
      status: 'published',
      tag: 'Roofing',
      overview: s.description,
      tagline: 'Expert Solutions',
      heroDescription: s.description,
      breadcrumbText: s.title,
      overviewTitlePrefix: 'Why Choose',
      overviewTitleHighlight: s.title,
      overviewTitleSuffix: '?',
      cta: { text: 'Get a Quote', link: '/#quote' },
      features: s.features ? s.features.map(f => ({ text: f, icon: 'CheckCircle' })) : []
    };
  });

  await coll.updateOne(
    { key: 'complete_data' },
    { $set: { 'data.services.services': newServices } }
  );

  console.log('Fixed services schema');
  await client.close();
}

run();
