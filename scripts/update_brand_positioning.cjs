const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'c:/Users/dell/Desktop/RealRoof/.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function updateBrandPositioning() {
    const client = new MongoClient(uri, { family: 4 });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('site_contents');
        
        const doc = await collection.findOne({ key: 'complete_data' });
        if (!doc || !doc.data) throw new Error("Could not find complete_data");

        // 1. Update Hero
        doc.data.hero = {
            ...doc.data.hero,
            badge: "Commercial & Residential Roofing Partners",
            headlines: [
                { text: "Scalable Roofing & ", highlight: false },
                { text: "Storm Restoration", highlight: true },
                { text: " Experts", highlight: false }
            ],
            description: "A highly scalable, professionally managed, multi-state commercial and residential roofing contractor. Specializing in multi-family projects, insurance claims support, and installation partnerships across SC, NC, GA, and TN.",
            stats: [
                { value: "$10M+", label: "Saved in Claims" },
                { value: "20+", label: "Years Experience" },
                { value: "4", label: "States Covered" }
            ],
            buttons: [
                { text: "Schedule Free Inspection", primary: true, link: "/#booking" },
                { text: "Instant Estimate", primary: false, link: "/#quote" }
            ]
        };

        // 2. Update Services to focus on Commercial, Multi-Family, Storm
        doc.data.services = {
            section: {
                badge: "Our Core Expertise",
                headline: "Large-Scale Capabilities. Premium Quality.",
                description: "From multi-family apartment complexes to residential storm restoration, we are operationally built to scale across the Southeast."
            },
            services: [
                {
                    id: "commercial-roofing",
                    title: "Commercial Roofing",
                    icon: "BuildingOffice2Icon",
                    description: "Flat roofing systems, TPO, EPDM, and commercial roof coatings designed for large-scale property management.",
                    features: ["Flat Roofing Systems", "TPO & EPDM", "Commercial Coatings", "Preventative Maintenance"]
                },
                {
                    id: "multi-family-roofing",
                    title: "Multi-Family Roofing",
                    icon: "HomeModernIcon",
                    description: "Expert coordination for occupied properties, vendor management, and large-scale scheduling capabilities.",
                    features: ["Tenant Coordination", "Budget Planning", "Large-Scale Scheduling", "Fast Project Turnaround"]
                },
                {
                    id: "storm-restoration",
                    title: "Storm Restoration & Claims",
                    icon: "CloudIcon",
                    description: "We've saved local property owners over $10 million in out-of-pocket expenses through insurance claims assistance.",
                    features: ["Wind & Hail Damage", "Insurance Process Support", "Emergency Tarping", "Claims Negotiation"]
                },
                {
                    id: "installation-partnerships",
                    title: "Installation Partnerships",
                    icon: "UserGroupIcon",
                    description: "Providing white-label scalable installation solutions for other roofing and restoration companies.",
                    features: ["Multi-State Scheduling", "Licensed & Insured", "Crew Management", "Overflow Support"]
                }
            ]
        };

        // 3. Update About Section
        doc.data.about = {
            section: {
                badge: "Since 2010",
                headline: "A Long-Term Strategic Partner",
                description: "Real Roof is not just a roofing company. We are a scalable commercial and residential roofing contractor capable of managing multiple installations simultaneously across multiple states."
            },
            features: [
                { title: "Insurance Claim Specialists", description: "Advocating for property owners since 2010 to navigate the complex insurance process." },
                { title: "Multi-State Operations", description: "Built to scale with operations across South Carolina, North Carolina, Georgia, and Tennessee." }
            ]
        };

        await collection.updateOne(
            { key: 'complete_data' },
            { $set: { 
                "data.hero": doc.data.hero,
                "data.services": doc.data.services,
                "data.about": doc.data.about
            }}
        );
        
        console.log("Successfully updated Brand Positioning in DB!");

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

updateBrandPositioning();
