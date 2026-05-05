import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Auto-schema logic moved to centralized generator

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const service = content?.data?.services?.services?.find((s: any) => s.slug === slug);

  if (!service) return {};

  const seo = service.seo || {};
  const pageUrl = `${BASE_URL}/${slug}`;

  return {
    title: {
      absolute: seo.metaTitle || `${service.title}`
    },
    description: seo.metaDescription || service.description,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: {
      index: seo.metaRobotsIndex !== 'noindex',
      follow: seo.metaRobotsIndex !== 'noindex' && seo.metaRobotsFollow !== 'nofollow',
      ...(seo.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || service.title,
      description: seo.ogDescription || seo.metaDescription || service.description,
      url: pageUrl,
      siteName: "Eagle Revolution",
      type: "website",
      images: [
        {
          url: getAbsoluteUrl(seo.featuredImage || seo.ogImage || service.image) || `${BASE_URL}/eagle-logo.png`,
          width: 1200,
          height: 630,
          alt: service.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || service.title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || service.description,
      images: [getAbsoluteUrl(seo.featuredImage || seo.twitterImage || seo.ogImage || service.image) || `${BASE_URL}/eagle-logo.png`],
      site: "@EagleRevolution",
      creator: "@EagleRevolution",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const serviceDoc = content?.data?.services?.services?.find((s: any) => 
    s.slug === resolvedParams.slug && (s.status !== 'draft')
  );
  if (!serviceDoc) return notFound();
  const service = JSON.parse(JSON.stringify(serviceDoc));
  const globalData = content?.data || {};
  const allFaqs = globalData.faq?.items || [];

  // Detect FAQs relevant to this specific service
  const faqs = allFaqs.filter((item: any) =>
    item.visibility === 'global' ||
    (item.visibility === 'specific' && item.targetPages?.includes(resolvedParams.slug))
  );

  // Determine featured image for schema (Manual SEO Featured Image > OG Image > Service Main Image)
  const featuredImage = getAbsoluteUrl(service?.seo?.featuredImage || service?.seo?.ogImage || service?.seo?.twitterImage || service?.image);

  const schema = generateSchema({
    title: service?.seo?.metaTitle || service?.title || "",
    description: service?.seo?.metaDescription || service?.description || "",
    slug: `services/${resolvedParams.slug}`,
    type: "Service",
    faqs: faqs,
    breadcrumbTitle: service?.seo?.breadcrumbTitle,
    isService: true,
    image: featuredImage
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServiceDetailTemplate params={resolvedParams} />
    </>
  );
}