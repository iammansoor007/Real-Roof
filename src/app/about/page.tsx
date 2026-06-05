import AboutTemplate from "@/components/templates/AboutTemplate";
export const revalidate = 60; // Cache for 1 minute
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Page from "@/models/Page";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";
import { BASE_URL } from "@/lib/constants";


export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();

  // Try to get SEO from the dynamic about-us page first
  const dynamicPage = await Page.findOne({ slug: "about-us", isTrashed: { $ne: true } }).lean() as any;
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = content?.data?.aboutPage;

  const seo = dynamicPage?.seo || aboutData?.seo || {};
  const pageUrl = `${BASE_URL}/about`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      absolute: seo.metaTitle || dynamicPage?.title || aboutData?.hero?.headline
    },
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || aboutData?.hero?.headline || "About Us",
      description: seo.ogDescription || seo.metaDescription || aboutData?.hero?.description,
      url: pageUrl,
      siteName: "RealRoof",
      type: "website",
      images: seo.featuredImage ? [{ url: seo.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage].filter(Boolean) as string[],
    },
    robots: {
      index: seo.metaRobotsIndex !== 'noindex',
      follow: seo.metaRobotsFollow !== 'nofollow',
      ...(seo.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    }
  };
}

export default async function AboutPage() {
  await connectToDatabase();

  // Fetch the dynamic about-us page from the pages collection (where admin saves to)
  const dynamicPage = await Page.findOne({ slug: "about-us", isTrashed: { $ne: true } }).lean() as any;

  // Also fetch complete_data as fallback for sections not yet edited in dashboard
  const siteContent = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = siteContent?.data?.aboutPage;

  const schema = generateSchema({
    title: dynamicPage?.title || aboutData?.hero?.headline || "About Us",
    description: aboutData?.hero?.description || "",
    slug: "/about",
    type: "AboutPage"
  });

  // Merge dynamic page content with fallback from complete_data
  // Dynamic page content takes priority (this is what the admin edits)
  const pageData = dynamicPage
    ? {
        ...dynamicPage,
        content: {
          // Start with complete_data aboutPage as base fallback
          hero: aboutData?.hero,
          mission: aboutData?.mission,
          story: aboutData?.story,
          values: aboutData?.values,
          capabilities: aboutData?.capabilities,
          stats: aboutData?.stats,
          ctaBanner: aboutData?.ctaBanner,
          recognition: aboutData?.recognition,
          services: aboutData?.services,
          // Override with admin-saved dynamic page content (takes priority)
          ...(dynamicPage.content || {}),
        }
      }
    : null;

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AboutTemplate pageData={pageData} />
    </>
  );
}
