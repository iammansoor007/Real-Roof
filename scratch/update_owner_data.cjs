const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Paths
const jsonPath = path.join(__dirname, '..', 'homepage_data.json');

// Helper to update founder bio and descriptions
function updateFounderBio(bioArray) {
  if (!Array.isArray(bioArray)) return bioArray;
  return [
    "Based in O'Fallon, Missouri, RealRoof was founded by Elisha Sellers, a seasoned home improvement professional who brings discipline, precision, and accountability to every project. With years of leadership experience at some of the largest home improvement companies in North America, Elisha saw firsthand how the industry had shifted away from homeowners and toward profits, leaving people with high prices, poor communication, and broken trust.",
    "Elisha knew it didn't have to be that way. RealRoof was created to restore what the industry lost—trust, craftsmanship, and doing the job right the first time. Today, we stand as a local company built to compete with the biggest names in the country, not through gimmicks, but through transparency, quality work, and a relentless commitment to our customers.",
    "Our systems are built for precision, but our strength is our people—driven professionals who take ownership, communicate clearly, and treat every home like their own."
  ];
}

function updateFounderTeamDescription(descArray) {
  if (!Array.isArray(descArray)) return descArray;
  return [
    "Originally from Nashville, Tennessee, Elisha was raised in Southern Illinois. Growing up in a challenging environment, Elisha faced obstacles that inspired a strong work ethic early on. Later, Elisha's grandparents stepped in to teach what it truly means to show up for family and build something stronger than what you were given.",
    "Elisha carried those lessons into professional leadership in the home improvement industry, developing discipline, resilience, and the ability to perform under pressure. This experience reinforced a mindset that still defines Elisha today. No excuses. No shortcuts. Just execution.",
    "After years of leadership at top-tier home improvement organizations, Elisha founded RealRoof to bring trust, transparency, and elite craftsmanship back to homeowners."
  ];
}

// Perform replacements on any string
function replaceTextsInString(str) {
  if (typeof str !== 'string') return str;
  let s = str;

  // Exact names/emails
  s = s.replace(/Brandon Anderson/g, 'Elisha Sellers');
  s = s.replace(/brandon-anderson/g, 'elisha-sellers');
  s = s.replace(/BrandonAnderson/g, 'ElishaSellers');
  s = s.replace(/banderson@RealRoof\.com/gi, 'esellers@RealRoof.com');

  // Replace Brandon, but only if it's not brandon-sales or BrandonSales or part of a sales rep reference
  // Let's do selective word boundary replacements
  // Since we already replaced Brandon Anderson and BrandonAnderson/brandon-anderson, any leftover 'Brandon'
  // referring to Brandon Anderson can be replaced. Let's make sure it doesn't match Brandon Sales or BrandonSales.
  s = s.replace(/\bBrandon\b(?!\s+Sales|\s+Sutton)/g, 'Elisha');

  // Veteran / Military Terminology
  s = s.replace(/Veteran Owned & Operated/gi, 'Locally Owned & Operated');
  s = s.replace(/Veteran-Owned & Operated/gi, 'Locally-Owned & Operated');
  s = s.replace(/Veteran-owned & operated/gi, 'Locally-owned & operated');
  s = s.replace(/Veteran owned & operated/gi, 'Locally owned & operated');
  s = s.replace(/Veteran-Owned/gi, 'Locally-Owned');
  s = s.replace(/Veteran-owned/gi, 'Locally-owned');
  s = s.replace(/Veteran owned/gi, 'Locally owned');
  s = s.replace(/Veteran Owned/gi, 'Locally Owned');
  s = s.replace(/veteran-owned/gi, 'locally-owned');
  s = s.replace(/veteran owned/gi, 'locally owned');
  
  s = s.replace(/veteran-grade/gi, 'premium-grade');
  s = s.replace(/veteran grade/gi, 'premium grade');
  s = s.replace(/veteran precision/gi, 'premium precision');
  s = s.replace(/veteran-grade/gi, 'premium-grade');
  s = s.replace(/veteran owned standards/gi, 'elite quality standards');
  s = s.replace(/Veteran Owned Standards/g, 'Elite Quality Standards');
  
  s = s.replace(/U\.S\. Army veteran/gi, 'experienced roofing professional');
  s = s.replace(/Army veteran/gi, 'seasoned home improvement professional');
  s = s.replace(/battlefield discipline meets boardroom precision/gi, 'uncompromising discipline meets executive precision');
  s = s.replace(/battlefield discipline and boardroom precision/gi, 'uncompromising discipline and executive precision');
  s = s.replace(/battlefield discipline/gi, 'uncompromising discipline');
  s = s.replace(/boardroom precision/gi, 'executive precision');

  s = s.replace(/military precision/gi, 'uncompromising precision');
  s = s.replace(/military-grade/gi, 'commercial-grade');
  s = s.replace(/military grade/gi, 'commercial grade');
  s = s.replace(/military-grade standards/gi, 'premium-grade standards');
  s = s.replace(/military-grade installation/gi, 'premium-grade installation');
  s = s.replace(/military precision and architectural excellence/gi, 'uncompromising precision and architectural excellence');
  s = s.replace(/military accuracy/gi, 'uncompromising precision');
  
  s = s.replace(/🇺🇸 Locally Owned & Operated/g, '🏡 Locally Owned & Operated');
  s = s.replace(/🇺🇸 Veteran Owned & Operated/g, '🏡 Locally Owned & Operated');
  s = s.replace(/🇺🇸 Veteran Owned/g, '🏡 Locally Owned');
  
  s = s.replace(/Military Grade Protection/g, 'Premium Grade Protection');
  s = s.replace(/Military-grade accuracy/gi, 'Premium accuracy');

  return s;
}

// Deep traversal replacement
function traverseAndReplace(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return replaceTextsInString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => traverseAndReplace(item));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key of Object.keys(obj)) {
      let newKey = key;
      if (key === 'BrandonAnderson') {
        newKey = 'ElishaSellers';
      }
      newObj[newKey] = traverseAndReplace(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Main update logic for homepage data
function updateDataObj(data) {
  // Update CEO details
  if (data.leadership && data.leadership.ceo) {
    const ceo = data.leadership.ceo;
    ceo.name = "Elisha Sellers";
    ceo.title = "Founder & CEO";
    ceo.image = "elisha";
    ceo.alt = "Elisha Sellers - Founder, RealRoof";
    if (ceo.badges) ceo.badges.top = "LOCALLY OWNED";
    ceo.description = updateFounderBio(ceo.description);
    if (ceo.social) ceo.social.email = "esellers@RealRoof.com";
  }

  // Update team member Brandon Anderson to Elisha Sellers
  if (data.team && Array.isArray(data.team.members)) {
    data.team.members = data.team.members.map(member => {
      if (member.id === 'brandon-anderson') {
        return {
          id: "elisha-sellers",
          name: "Elisha Sellers",
          role: "Founder & CEO",
          image: "ElishaSellers",
          badge1: "FOUNDER & CEO",
          badge2: "VISION • INTEGRITY",
          description: updateFounderTeamDescription(member.description)
        };
      }
      return member;
    });
  }

  // Update About Story founder details
  if (data.aboutPage && data.aboutPage.story) {
    const story = data.aboutPage.story;
    if (story.portrait) {
      story.portrait.badgeLeft = "LOCALLY OWNED";
    }
    if (story.founder) {
      const founder = story.founder;
      founder.name = "Elisha Sellers";
      founder.title = "Founder & CEO";
      founder.bio = updateFounderBio(founder.bio);
      founder.footer = "— Elisha Sellers, CEO";
      founder.email = "esellers@RealRoof.com";
    }
  }

  // Update Hero Stats if any
  if (data.hero && Array.isArray(data.hero.stats)) {
    data.hero.stats = data.hero.stats.map(stat => {
      if (stat.value === 'Veteran' && stat.label === 'Owned') {
        return {
          value: "Locally",
          label: "Owned",
          icon: "BadgeCheck"
        };
      }
      return stat;
    });
  }

  // Update footer certifications
  if (data.footer && Array.isArray(data.footer.certifications)) {
    data.footer.certifications = data.footer.certifications.map(cert => {
      if (cert.cert === 'Veteran Owned') {
        return {
          cert: "Locally Owned",
          number: "St. Charles, MO",
          icon: "Home"
        };
      }
      return cert;
    });
  }

  // Fallback recursive replacement
  return traverseAndReplace(data);
}

async function run() {
  console.log("Starting owner and brand terminology updates...");

  // 1. Update local JSON file
  if (fs.existsSync(jsonPath)) {
    console.log("Updating local homepage_data.json...");
    const jsonRaw = fs.readFileSync(jsonPath, 'utf8');
    let dataObj = JSON.parse(jsonRaw);
    dataObj = updateDataObj(dataObj);
    fs.writeFileSync(jsonPath, JSON.stringify(dataObj, null, 2), 'utf8');
    console.log("Local homepage_data.json updated successfully.");
  } else {
    console.warn("homepage_data.json not found!");
  }

  // 2. Connect to MongoDB and update collections
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri || !dbName) {
    console.error("Missing MONGODB_URI or MONGODB_DB in env!");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (DB: ${dbName})...`);
  await mongoose.connect(uri, { dbName });
  const db = mongoose.connection.db;

  // A. Update site_contents collection (complete_data)
  console.log("Updating site_contents.complete_data...");
  const completeDataDoc = await db.collection('site_contents').findOne({ key: 'complete_data' });
  if (completeDataDoc && completeDataDoc.data) {
    const updatedData = updateDataObj(completeDataDoc.data);
    await db.collection('site_contents').updateOne(
      { key: 'complete_data' },
      { $set: { data: updatedData } }
    );
    console.log("site_contents.complete_data updated.");
  } else {
    console.warn("site_contents.complete_data not found in database!");
  }

  // B. Update pages collection content
  const targetPageSlugs = ['about-us', 'about/our-team', 'testing', 'services', 'testserviceareapage'];
  console.log(`Updating pages collection for slugs: ${targetPageSlugs.join(', ')}...`);
  for (const slug of targetPageSlugs) {
    const page = await db.collection('pages').findOne({ slug });
    if (page) {
      // Traverse content and seo objects
      const updatedContent = page.content ? updateDataObj(page.content) : page.content;
      const updatedSeo = page.seo ? traverseAndReplace(page.seo) : page.seo;
      const updatedTitle = page.title ? replaceTextsInString(page.title) : page.title;
      
      await db.collection('pages').updateOne(
        { _id: page._id },
        { 
          $set: { 
            content: updatedContent, 
            seo: updatedSeo,
            title: updatedTitle,
            updatedAt: new Date()
          } 
        }
      );
      console.log(`Page "${slug}" updated.`);
    } else {
      console.warn(`Page "${slug}" not found in database.`);
    }
  }

  // C. Update media collection
  const mediaIds = [
    '6a0b0c50619ccd6487a9436d',
    '69fcd147be385263065aaffd',
    '6a0b134bdb81f869169d25fc',
    '69fcd15ebe385263065ab000',
    '6a0b0bd1619ccd6487a9436a'
  ];
  console.log("Updating alts and names in media collection...");
  for (const id of mediaIds) {
    const mediaDoc = await db.collection('media').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (mediaDoc) {
      let newAlt = mediaDoc.alt;
      let newName = mediaDoc.name;
      if (newAlt === 'Brandon Anderson') {
        newAlt = 'Elisha Sellers';
      }
      if (newName === 'brandon-anderson.webp') {
        newName = 'elisha-sellers.webp';
      }
      if (newName === 'realroof-veteran-owned.webp') {
        newName = 'realroof-locally-owned.webp';
        newAlt = 'realroof-locally-owned';
      }
      await db.collection('media').updateOne(
        { _id: mediaDoc._id },
        { $set: { alt: newAlt, name: newName } }
      );
      console.log(`Media document ID ${id} updated (name: ${newName}, alt: ${newAlt}).`);
    }
  }

  console.log("Migration complete!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
