import GalleryTemplate from "@/components/templates/GalleryTemplate";
export const revalidate = 60; // Cache for 1 minute
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://eaglerevolution.com";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const galleryData = content?.data?.galleryPage || content?.data?.portfolio;
  const seo = galleryData?.seo || {};
  const pageUrl = `${BASE_URL}/gallery`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      absolute: seo.metaTitle || galleryData?.section?.headline || galleryData?.header?.title || "Project Gallery | Eagle Revolution"
    },
    description: seo.metaDescription || galleryData?.section?.description || galleryData?.header?.description || "Browse our recent roofing, decking, and home improvement projects in St. Louis.",
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || galleryData?.section?.headline || "Project Gallery",
      description: seo.ogDescription || seo.metaDescription || galleryData?.section?.description,
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

export default async function GalleryPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const galleryData = content?.data?.portfolio;

  const schema = generateSchema({
    title: galleryData?.section?.headline || "Project Gallery",
    description: galleryData?.section?.description || "",
    slug: "/gallery",
    type: "CollectionPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GalleryTemplate pageData={{ portfolio: galleryData, galleryPage: content?.data?.galleryPage }} />
    </>
  );
}
