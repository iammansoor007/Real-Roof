import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Eagle Revolution privacy policy. Learn how we collect, use, and protect your personal information when you use our roofing and home improvement services.",
  alternates: {
    canonical: "https://eaglerevolution.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
