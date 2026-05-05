import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Roofing & Home Improvement Estimate",
  description:
    "Contact Eagle Revolution for a free roofing, siding, windows, or deck estimate in St. Louis, MO. Call 636-449-9714 or fill out our quick quote form. Veteran-owned, locally operated.",
  keywords: [
    "contact roofing contractor St. Louis",
    "free roofing estimate Missouri",
    "Eagle Revolution phone number",
    "schedule roof inspection St. Louis",
    "home improvement quote St. Louis MO",
  ],
  alternates: {
    canonical: "https://eaglerevolution.com/contact",
  },
  openGraph: {
    title: "Contact Eagle Revolution | Free Estimate in St. Louis, MO",
    description:
      "Request a free estimate for roofing, siding, windows, decks, and more. Veteran-owned company serving the greater St. Louis area. Call 636-449-9714.",
    url: "https://eaglerevolution.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
