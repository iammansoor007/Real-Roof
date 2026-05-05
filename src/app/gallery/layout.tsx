import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Gallery | Roofing, Decks, Siding & More",
  description:
    "Browse Eagle Revolution's portfolio of completed roofing, siding, deck, window, and gutter projects across St. Louis, MO. See the quality of our veteran-owned craftsmanship.",
  keywords: [
    "roofing project gallery St. Louis",
    "before and after roof replacement",
    "deck building portfolio Missouri",
    "siding installation photos",
    "Eagle Revolution completed projects",
  ],
  alternates: {
    canonical: "https://eaglerevolution.com/gallery",
  },
  openGraph: {
    title: "Project Gallery | Eagle Revolution St. Louis",
    description:
      "See our completed roofing, siding, deck, and window projects. Real results from a veteran-owned contractor in St. Louis, MO.",
    url: "https://eaglerevolution.com/gallery",
    type: "website",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
