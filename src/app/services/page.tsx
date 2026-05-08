export const revalidate = 60; // Cache for 1 minute, updated via revalidatePath in admin panel

import ServicesTemplate from "@/components/templates/ServicesTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const servicesData = content?.data?.services;
  
  return {
    title: servicesData?.seo?.metaTitle || servicesData?.section?.headline,
    description: servicesData?.seo?.metaDescription || servicesData?.section?.description,
    robots: {
      index: servicesData?.seo?.metaRobotsIndex !== 'noindex',
      follow: servicesData?.seo?.metaRobotsFollow !== 'nofollow',
      ...(servicesData?.seo?.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    }
  };
}

export default async function ServicesPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const servicesData = content?.data?.services;

  const schema = generateSchema({
    title: servicesData?.section?.headline || "Our Services",
    description: servicesData?.section?.description || "",
    slug: "/services",
    type: "CollectionPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServicesTemplate />
    </>
  );
}
