import FaqClient from "./FaqClient";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";
import { BASE_URL } from "@/lib/constants";


export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const faqData = content?.data?.faqPage || content?.data?.faq;
  const seo = faqData?.seo || {};
  const pageUrl = `${BASE_URL}/faq`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      absolute: seo.metaTitle || faqData?.title
    },
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || faqData?.section?.headline || "Frequently Asked Questions",
      description: seo.ogDescription || seo.metaDescription || faqData?.section?.description,
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

export default async function FAQPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const faqData = content?.data?.faqPage;
  const allFaqs = content?.data?.faq?.items || [];
  
  // Filter FAQs for the FAQ page
  const faqs = allFaqs.filter((item: any) => 
    item.visibility === 'global' || 
    (item.visibility === 'specific' && item.targetPages?.includes('faq'))
  );

  const schema = generateSchema({
    title: faqData?.title || "Frequently Asked Questions",
    description: faqData?.description || "",
    slug: "/faq",
    type: "WebPage",
    faqs: faqs
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FaqClient />
    </>
  );
}
