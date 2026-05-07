import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { Metadata } from "next";
import { BASE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const faqData = content?.data?.faqPage || content?.data?.faq || {};
  const seo = faqData.seo || {};
  const pageUrl = `${BASE_URL}/faq`;

  return {
    title: seo.metaTitle || "Frequently Asked Questions",
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "FAQ",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      type: "website",
    },
  };
}

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
