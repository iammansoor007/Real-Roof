import AboutTemplate from "@/components/templates/AboutTemplate";
export const revalidate = 60; // Cache for 1 minute
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";
import { BASE_URL } from "@/lib/constants";


export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = content?.data?.aboutPage;
  const seo = aboutData?.seo || {};
  const pageUrl = `${BASE_URL}/about`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      absolute: seo.metaTitle || aboutData?.hero?.headline
    },
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || aboutData?.hero?.headline || "About Us",
      description: seo.ogDescription || seo.metaDescription || aboutData?.hero?.description,
      url: pageUrl,
      siteName: "Eagle Revolution",
      type: "website",
      images: seo.featuredImage ? [{ url: seo.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage].filter(Boolean) as string[],
    }
  };
}

export default async function AboutPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = content?.data?.aboutPage;

  const schema = generateSchema({
    title: aboutData?.hero?.headline || "About Us",
    description: aboutData?.hero?.description || "",
    slug: "/about",
    type: "AboutPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AboutTemplate />
    </>
  );
}
