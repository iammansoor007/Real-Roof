import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import SiteContent from '@/models/Content';
import { getTemplate } from '@/components/templates/TemplateRegistry';
import { Metadata } from 'next';
import Script from 'next/script';
import { generateSchema } from '@/lib/schema-generator';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Auto-schema logic moved to centralized generator

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  const page = await Page.findOne({ slug, status: 'published' }).lean();

  if (!page) return {};

  const seo = page.seo || {};
  const pageUrl = `${BASE_URL}/${slug}`;

  return {
    title: seo.metaTitle || page.title,
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: {
      index: seo.metaRobotsIndex === 'index',
      follow: seo.metaRobotsFollow === 'follow',
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || page.title,
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      siteName: "Eagle Revolution",
      type: "website",
      images: seo.featuredImage ? [{ url: getAbsoluteUrl(seo.featuredImage) || "" }] : (seo.ogImage ? [{ url: getAbsoluteUrl(seo.ogImage) || "" }] : []),
    },
    twitter: {
      card: (seo.twitterCard as any) || 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || page.title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: seo.featuredImage ? [getAbsoluteUrl(seo.featuredImage) || ""] : (seo.twitterImage ? [getAbsoluteUrl(seo.twitterImage) || ""] : (seo.ogImage ? [getAbsoluteUrl(seo.ogImage) || ""] : [])),
      site: "@EagleRevolution",
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();

  // Find the page in MongoDB
  const pageDoc = await Page.findOne({
    slug: slug,
    status: 'published'
  }).lean();

  if (!pageDoc) {
    // If no page found in DB, 404
    notFound();
  }

  // Convert to plain object to avoid Mongoose serialization issues in Client Components
  const page = JSON.parse(JSON.stringify(pageDoc));

  // Fetch global content for FAQ detection if needed
  const globalContent = await SiteContent.findOne({ key: 'complete_data' }).lean() as any;
  const globalData = globalContent?.data || {};

  // Helper to validate FAQ items
  const isValidFaq = (items: any) => Array.isArray(items) && items.length > 0 && items.every((i: any) => i.question && i.answer);

  // Detect FAQs ONLY if this is the FAQ template (as requested)
  let faqs = undefined;
  if (page.template === 'faq') {
    const allFaqs = globalData.faq?.items || [];
    faqs = allFaqs.filter((item: any) => 
      item.visibility === 'global' || 
      (item.visibility === 'specific' && item.targetPages?.includes(slug))
    );
  }

  // Determine page type for schema
  let pageType: any = "WebPage";
  if (page.template === 'about') pageType = "AboutPage";
  if (page.template === 'contact') pageType = "ContactPage";
  if (page.template === 'gallery') pageType = "CollectionPage";

  // Determine featured image for schema (Manual SEO Featured Image > OG Image > Hero Image)
  const featuredImage = getAbsoluteUrl(page.seo?.featuredImage || page.seo?.ogImage || page.seo?.twitterImage || page.content?.hero?.image);

  const schema = generateSchema({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || "",
    slug: page.slug,
    type: pageType,
    faqs: faqs,
    breadcrumbTitle: page.seo?.breadcrumbTitle,
    image: featuredImage
  });

  // Use TemplateWrapper to handle local content context overrides
  const { TemplateWrapper } = await import('@/components/templates/TemplateRegistry');

  return (
    <main>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TemplateWrapper
        templateName={page.template}
        pageData={page}
        params={resolvedParams}
      />
    </main>
  );
}

// Generate static params for ISR/SSG optimization
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const pages = await Page.find({ status: 'published' }).select('slug');

    return pages
      .filter((page: any) => page.slug)
      .map((page: any) => ({
        slug: page.slug.split('/'),
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
