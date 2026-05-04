import HomeTemplate from "@/components/templates/HomeTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const homeData = content?.data?.home;
  const settings = content?.data?.settings;

  return {
    title: {
      absolute: homeData?.hero?.headline || settings?.siteTitle || "Eagle Revolution | #1 Roofing & Home Improvement"
    },
    description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
    openGraph: {
      title: homeData?.hero?.headline || settings?.siteTitle || "Eagle Revolution",
      description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
      url: BASE_URL,
      siteName: "Eagle Revolution",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/eagle-logo.png`,
          width: 1200,
          height: 630,
          alt: "Eagle Revolution",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeData?.hero?.headline || settings?.siteTitle || "Eagle Revolution",
      description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
      images: [`${BASE_URL}/eagle-logo.png`],
      site: "@EagleRevolution",
    }
  };
}

export default async function Index() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const homeData = content?.data?.home;
  const settings = content?.data?.settings;

  // Helper to validate FAQ items
  const isValidFaq = (items: any) => Array.isArray(items) && items.length > 0 && items.every((i: any) => i.question && i.answer);

  // Detect FAQs for Homepage (Global + specific to home)
  const allFaqs = content?.data?.faq?.items || [];
  const faqs = allFaqs.filter((item: any) => 
    item.visibility === 'global' || 
    (item.visibility === 'specific' && item.targetPages?.includes('home'))
  );

  const schema = generateSchema({
    title: settings?.siteTitle || "Eagle Revolution",
    description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
    slug: "/",
    type: "WebPage",
    faqs: faqs,
    image: `${BASE_URL}/eagle-logo.png`
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeTemplate />
    </>
  );
}
