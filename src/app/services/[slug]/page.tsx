import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { generateSchema } from "@/lib/schema-generator";
import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";

const BASE_URL = "https://eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const services = content?.data?.services?.services || [];
  const service = services.find((s: any) => s.slug === slug);

  if (!service) return {};

  const seo = service.seo || {};
  const title = seo.metaTitle || seo.title || `${service.title} | Eagle Revolution`;
  const description = seo.metaDescription || service.description || "";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${slug}`, // FLAT CANONICAL
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  await connectToDatabase();
  console.log(`[Service Debug] Fetching content for: ${resolvedParams.slug}`);
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  
  if (!content) {
    console.error("[Service Debug] CRITICAL: complete_data document not found in DB!");
    return notFound();
  }

  const services = content?.data?.services?.services || [];
  console.log(`[Service Debug] Total services in DB: ${services.length}`);
  console.log(`[Service Debug] Looking for slug: "${resolvedParams.slug}"`);
  
  const serviceDoc = services.find((s: any) => {
    const isMatch = s.slug === resolvedParams.slug;
    if (isMatch) console.log(`[Service Debug] MATCH FOUND! Status: ${s.status}`);
    return isMatch && (s.status !== 'draft');
  });

  if (!serviceDoc) {
    console.warn(`[Service Debug] No published service found for "${resolvedParams.slug}"`);
    console.log(`[Service Debug] Existing slugs: ${services.map((s: any) => s.slug).join(", ")}`);
    return notFound();
  }

  const service = JSON.parse(JSON.stringify(serviceDoc));
  const globalData = content?.data || {};
  const allFaqs = globalData.faq?.items || [];

  const faqs = allFaqs.filter((item: any) =>
    item.visibility === 'global' ||
    (item.visibility === 'specific' && item.targetPages?.includes(resolvedParams.slug))
  );

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