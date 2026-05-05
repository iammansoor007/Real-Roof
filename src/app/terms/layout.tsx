import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Eagle Revolution terms and conditions of service. Review our policies for roofing, siding, windows, decks, and gutter services in St. Louis, MO.",
  alternates: {
    canonical: "https://eaglerevolution.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
