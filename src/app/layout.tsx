import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteLayout from "@/components/SiteLayout";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Post from "@/models/Post";
import { BASE_URL } from "@/lib/constants";
import ScriptInjector from "@/components/ScriptInjector";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});


export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {
    siteTitle: "",
    siteTemplate: "%s",
    favicon: "",
    siteDescription: "",
    siteKeywords: []
  };

  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' });
    if (content?.data?.settings) settings = content.data.settings;
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    metadataBase: new URL(BASE_URL),
    icons: {
      icon: settings.favicon || `${BASE_URL}/realrooflogo.webp`,
      apple: settings.favicon || `${BASE_URL}/realrooflogo.webp`,
    },
    facebook: {
      appId: "realroof-61564977483096",
    },
    title: {
      default: settings.siteTitle,
      template: settings.siteTemplate,
    },
    description: settings.siteDescription,
    keywords: settings.siteKeywords || ["RealRoof"],
    authors: [{ name: "RealRoof", url: BASE_URL }],
    creator: "RealRoof",
    publisher: "RealRoof",

    // ── Robots & Canonical ──
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    alternates: {
      canonical: BASE_URL,
    },

    // ── Open Graph (Facebook, LinkedIn) ──
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: "RealRoof",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [
        {
          url: settings.favicon || `${BASE_URL}/realrooflogo.webp`,
          width: 1200,
          height: 630,
          alt: "RealRoof – Locally Owned & Operated Roofing & Home Improvement",
          type: "image/png",
        },
      ],
    },

    // ── Twitter Cards ──
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [settings.favicon || `${BASE_URL}/realrooflogo.webp`],
      creator: "@RealRoof",
      site: "@RealRoof",
    },

    other: {
      "format-detection": "telephone=no",
    },
  };
}

import { ContentProvider } from "@/context/ContentContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Fetch CMS-managed tracking scripts from MongoDB ──
  interface SiteScript { id: string; name: string; location: string; code: string; active: boolean; }
  let siteScripts: SiteScript[] = [];
  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne({ key: 'site_scripts_v2' }).lean();
    if (Array.isArray(doc?.data)) siteScripts = doc.data;
  } catch (e) {
    // Non-fatal — site renders fine without CMS scripts
  }
  const activeScripts = siteScripts.filter((s) => s.active);
  const headScripts = activeScripts.filter((s) => s.location === 'head');
  const bodyStartScripts = activeScripts.filter((s) => s.location === 'body_start');
  const bodyEndScripts = activeScripts.filter((s) => s.location === 'body_end');

  // ── Fetch Global Content & Blogs for the Provider ──
  let initialGlobalData = null;
  let initialBlogs = [];
  try {
    const [globalContent, blogPosts] = await Promise.all([
      SiteContent.findOne({ key: 'complete_data' }).lean(),
      Post.find({ status: 'published', isTrashed: { $ne: true } }).sort({ date: -1 }).limit(10).lean()
    ]);

    if (globalContent?.data) initialGlobalData = globalContent.data;
    if (blogPosts) initialBlogs = JSON.parse(JSON.stringify(blogPosts));
  } catch (e) {
    console.error("Failed to fetch initial data for provider", e);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect + DNS-prefetch for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* ── CMS-managed <head> scripts ── */}
        {headScripts.map((s) => (
          <ScriptInjector key={s.id} code={s.code} target="head" />
        ))}
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {/* ── CMS-managed body_start scripts ── */}
        {bodyStartScripts.map((s) => (
          <ScriptInjector key={s.id} code={s.code} target="body" />
        ))}
        <ContentProvider initialData={initialGlobalData} initialBlogs={initialBlogs}>
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              {/* Common background grid for all pages */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #2563eb 1px, transparent 1px),
                      linear-gradient(to bottom, #2563eb 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                  }}
                />
              </div>

              <SiteLayout>{children}</SiteLayout>
            </div>
          </Providers>
        </ContentProvider>

        {/* ── CMS-managed body_end scripts ── */}
        {bodyEndScripts.map((s) => (
          <ScriptInjector key={s.id} code={s.code} target="body" />
        ))}
      </body>
    </html>
  );
}
