import ContactTemplate from "@/components/templates/ContactTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";
import { BASE_URL } from "@/lib/constants";


export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const contactData = content?.data?.contactPage;
  const seo = contactData?.seo || {};
  const pageUrl = `${BASE_URL}/contact`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      absolute: seo.metaTitle || contactData?.hero?.headline
    },
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || contactData?.hero?.headline || "Contact Us",
      description: seo.ogDescription || seo.metaDescription || contactData?.hero?.description,
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

export default async function ContactPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const contactData = content?.data?.contactPage;

  const schema = generateSchema({
    title: contactData?.hero?.headline || "Contact Us",
    description: contactData?.hero?.description || "",
    slug: "/contact",
    type: "ContactPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactTemplate />
    </>
  );
}
