import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Veteran-Owned Roofing & Home Improvement Experts",
  description:
    "Learn about Eagle Revolution – a veteran-owned roofing and home improvement company in St. Louis, MO. Military precision, award-winning craftsmanship, and a commitment to excellence since day one.",
  keywords: [
    "about Eagle Revolution",
    "veteran owned roofing company St. Louis",
    "roofing company history Missouri",
    "military precision home improvement",
    "trusted roofing contractor St. Louis MO",
  ],
  alternates: {
    canonical: "https://eaglerevolution.com/about",
  },
  openGraph: {
    title: "About Eagle Revolution | Veteran-Owned, St. Louis Based",
    description:
      "Veteran-owned roofing & home improvement experts serving the St. Louis metro. Learn our story, values, and commitment to military-grade craftsmanship.",
    url: "https://eaglerevolution.com/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
