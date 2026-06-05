const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Read MONGODB_URI and MONGODB_DB from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const uri = envFile.split('\n').find(line => line.startsWith('MONGODB_URI=')).split('MONGODB_URI=')[1].trim();
const dbName = envFile.split('\n').find(line => line.startsWith('MONGODB_DB=')).split('MONGODB_DB=')[1].trim();

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    // 1. UPDATE site_contents -> complete_data
    const siteContentsColl = db.collection('site_contents');
    const globalContent = await siteContentsColl.findOne({ key: 'complete_data' });

    if (globalContent && globalContent.data) {
      let d = globalContent.data;

      // Update footer contact
      if (d.footer && d.footer.contact) {
        d.footer.contact.address = "300 E McBee Ave, Greenville, SC 29601";
        d.footer.contact.phone = "864-558-7663";
        d.footer.contact.areas = "Headquartered in Greenville, SC • Additional Offices in Columbia, SC & Tennessee • Serving South Carolina, North Carolina, Georgia, and Tennessee";
      }

      // Update footer company tagline / copyright
      if (d.footer && d.footer.company) {
        d.footer.company.description = "Locally-Owned and operated premium roofing contractor. We specialize in commercial roofing, multi-family projects, storm restoration, and installation partnerships across the Southeast.";
      }

      // Update why choose us cta description
      if (d.whyChooseUs && d.whyChooseUs.cta) {
        d.whyChooseUs.cta.description = "Transform your property with the Southeast's premium roofing and storm restoration experts. Contact us today for quality craftsmanship and unparalleled service.";
      }

      // Update CEO Bio
      if (d.leadership && d.leadership.ceo && Array.isArray(d.leadership.ceo.description)) {
        d.leadership.ceo.description = d.leadership.ceo.description.map(paragraph => {
          return paragraph
            .replace(/Based in O'Fallon, Missouri/g, "Based in Greenville, South Carolina")
            .replace(/St\. Louis/g, "Greenville");
        });
      }

      // Update FAQs
      if (d.faq && Array.isArray(d.faq.items)) {
        d.faq.items = d.faq.items.map(item => {
          let itemStr = JSON.stringify(item);
          itemStr = itemStr
            .replace(/St\. Louis/g, "the Southeast")
            .replace(/Missouri/g, "South Carolina")
            .replace(/MO/g, "SC")
            .replace(/Illinois/g, "Tennessee")
            .replace(/Greater St\. Louis Region/g, "Southeast Region (SC, NC, GA, TN)")
            .replace(/636-449-9714/g, "864-558-7663")
            .replace(/1077 E Terra Ln, O'fallon, MO 63366/g, "300 E McBee Ave, Greenville, SC 29601")
            .replace(/Greater St\. Louis/g, "Southeast");
          
          const updatedItem = JSON.parse(itemStr);
          // Special update for area served FAQ
          if (updatedItem.id === 9) {
            updatedItem.question = "What areas do you serve?";
            updatedItem.answer = "We serve South Carolina, North Carolina, Georgia, and Tennessee, with office locations in Greenville, SC, Columbia, SC, and Tennessee.";
            updatedItem.metadata = [{ label: "Service Area", value: "Southeast Region (SC, NC, GA, TN)" }];
          }
          return updatedItem;
        });
      }

      // Update Testimonials locations
      if (d.testimonials && Array.isArray(d.testimonials.testimonials)) {
        const locations = ["Greenville, SC", "Columbia, SC", "Spartanburg, SC", "Asheville, NC", "Nashville, TN"];
        d.testimonials.testimonials = d.testimonials.testimonials.map((test, index) => {
          test.company = locations[index % locations.length];
          test.text = test.text
            .replace(/St\. Louis/g, "Greenville")
            .replace(/St\. Charles/g, "Columbia")
            .replace(/O'Fallon/g, "Spartanburg");
          return test;
        });
      }

      // Save complete_data back
      await siteContentsColl.updateOne(
        { key: 'complete_data' },
        { $set: { data: d } }
      );
      console.log("Updated site_contents complete_data document.");
    }

    // 2. UPDATE pages collection
    const pagesColl = db.collection('pages');
    const pages = await pagesColl.find({}).toArray();
    console.log(`Scanning and updating ${pages.length} pages...`);

    for (const page of pages) {
      let pageStr = JSON.stringify(page);

      // Perform bulk search and replaces
      pageStr = pageStr
        .replace(/Missouri Service Areas/g, "Southeast Service Areas")
        .replace(/surrounding Missouri communities/g, "surrounding Southeast communities")
        .replace(/Missouri homeowners/g, "Southeast homeowners")
        .replace(/across Missouri/g, "across the Southeast")
        .replace(/Missouri ZIP code/g, "ZIP code")
        .replace(/Missouri commercial properties/g, "Southeast commercial properties")
        .replace(/Elite Missouri Roofing Quality/g, "Elite Southeast Roofing Quality")
        .replace(/Missouri's climate zone/g, "the Southeast's climate zone")
        .replace(/Missouri municipalities/g, "Southeast municipalities")
        .replace(/St\. Louis storm damage/g, "Southeast storm damage")
        .replace(/St\. Louis and St\. Charles' premium/g, "the Southeast's premium")
        .replace(/St\. Louis/g, "Greenville")
        .replace(/St\. Charles/g, "Columbia")
        .replace(/O'Fallon/g, "Greenville")
        .replace(/O'fallon/g, "Greenville")
        .replace(/Jefferson/g, "Spartanburg")
        .replace(/St\. Peters/g, "Greer")
        .replace(/Missouri/g, "South Carolina")
        .replace(/Illinois/g, "Tennessee")
        .replace(/\(636\) 293-9977/g, "(864) 558-7663")
        .replace(/636-449-9714/g, "864-558-7663")
        .replace(/1077 E Terra Ln, O'fallon, MO 63366/g, "300 E McBee Ave, Greenville, SC 29601");

      const updatedPage = JSON.parse(pageStr);

      // Specific region list override if page contains a regions array
      if (updatedPage.content && Array.isArray(updatedPage.content.regions)) {
        updatedPage.content.regions = [
          {
            name: "Upstate South Carolina",
            description: "<p>Proudly serving the Upstate including Greenville, Spartanburg, Greer, Anderson, Clemson, Easley, and Simpsonville. We deliver premium-grade residential roofing, commercial TPO installations, and seamless gutter configurations with lifetime warranties.</p>",
            zipcodes: ["29601", "29602", "29603", "29604", "29605", "29606", "29607", "29609", "29615", "29301", "29302", "29303"],
            cities: []
          },
          {
            name: "Midlands South Carolina",
            description: "<p>Providing top-tier storm damage restoration, shingles repair, and gutter installations in Columbia, Lexington, Irmo, Forest Acres, and Cayce. Active storm response teams are centrally dispatched for quick inspection turnarounds.</p>",
            zipcodes: ["29201", "29202", "29203", "29204", "29205", "29206", "29209", "29063", "29072"],
            cities: []
          },
          {
            name: "Tennessee Region",
            description: "<p>Your trusted local roofing experts in Nashville, Knoxville, Chattanooga, and surrounding Tennessee areas. We specialize in asphalt shingle replacement, premium commercial TPO, and leaf-guard gutter installations to protect your property.</p>",
            zipcodes: ["37201", "37203", "37204", "37901", "37902", "37401", "37402"],
            cities: []
          }
        ];
      }

      await pagesColl.updateOne(
        { _id: page._id },
        { $set: { content: updatedPage.content, seo: updatedPage.seo, title: updatedPage.title } }
      );
    }
    console.log("All pages scanned and updated successfully.");

  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

main().catch(console.error);
