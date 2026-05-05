import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials | 5-Star Rated Contractor",
  description:
    "Read verified reviews from Eagle Revolution customers in St. Louis, MO. 4.9-star rated roofing, siding, windows, and deck contractor. 500+ satisfied homeowners.",
  keywords: [
    "Eagle Revolution reviews",
    "roofing contractor reviews St. Louis",
    "5 star roofing company Missouri",
    "customer testimonials home improvement",
    "best rated roofer St. Louis MO",
  ],
  alternates: {
    canonical: "https://eaglerevolution.com/reviews",
  },
  openGraph: {
    title: "Customer Reviews | Eagle Revolution – 4.9★ Rated",
    description:
      "500+ satisfied homeowners trust Eagle Revolution for roofing and home improvement. Read their stories.",
    url: "https://eaglerevolution.com/reviews",
    type: "website",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
