import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import ReviewsTemplate from "@/components/templates/ReviewsTemplate";
import { BASE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const reviewsData = content?.data?.reviewsPage || content?.data?.reviews || {};
  const seo = reviewsData.seo || {};
  const pageUrl = `${BASE_URL}/reviews`;

  return {
    title: seo.metaTitle || "Customer Reviews & Testimonials",
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || "Customer Reviews",
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      type: "website",
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

export default function TestimonialsPage() {
  return <ReviewsTemplate />;
}
