import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { Metadata } from "next";
import { BASE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const contactData = content?.data?.contactPage || content?.data?.contact || {};
  const seo = contactData.seo || {};
  const pageUrl = `${BASE_URL}/contact`;

  return {
    title: seo.metaTitle || "Contact Us",
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "Contact Us",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      type: "website",
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
