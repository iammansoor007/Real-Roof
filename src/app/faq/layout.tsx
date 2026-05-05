import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Roofing & Home Improvement FAQ",
  description:
    "Get answers to common questions about roofing, siding, windows, decks, and gutter services from Eagle Revolution in St. Louis, MO. Insurance claims, financing, timelines & more.",
  keywords: [
    "roofing FAQ St. Louis",
    "roof replacement questions",
    "home improvement FAQ Missouri",
    "roofing insurance claims questions",
    "how long does roof replacement take",
  ],
  alternates: {
    canonical: "https://eaglerevolution.com/faq",
  },
  openGraph: {
    title: "FAQ | Eagle Revolution Roofing & Home Improvement",
    description:
      "Common questions about our roofing, siding, window, and deck services answered by our expert team.",
    url: "https://eaglerevolution.com/faq",
    type: "website",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
