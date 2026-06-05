import type { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import { BASE_URL } from "@/lib/constants";

// ─────────────────────────────────────────────
// Per-page SEO map — title, description, keywords, JSON-LD
// ─────────────────────────────────────────────
const seoMap: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    faqJsonLd: object;
    serviceJsonLd: object;
  }
> = {
  "commercial-roofing": {
    title:
      "Commercial Roofing Contractor Greenville SC | TPO & Flat Roofs | RealRoof",
    description:
      "Expert commercial roofing services in Greenville, SC, Columbia, SC & Tennessee. TPO, EPDM, and flat roof systems with No Dollar Limit (NDL) warranties. Call 864-558-7663.",
    keywords: [
      "commercial roofing Greenville SC",
      "TPO roofing Greenville SC",
      "EPDM roofing Columbia SC",
      "flat roof contractor Greenville SC",
      "commercial roof replacement South Carolina",
      "commercial roof repair Tennessee",
      "flat roof installation Georgia",
      "no dollar limit warranty roofing Greenville",
      "warehouse roofing contractor Greenville",
      "industrial roofing Tennessee",
      "TPO vs EPDM roofing",
      "commercial roofing company South Carolina",
      "certified commercial roofing contractor Greenville",
      "hot air welded TPO roofing",
      "commercial flat roof leak repair",
      "tapered insulation flat roof Greenville",
      "commercial roof inspection SC",
      "24 hour commercial roof repair",
      "best commercial roofer Greenville SC",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/services/commercial-roofing/#service`,
      name: "Commercial Roofing Greenville SC",
      serviceType: "Commercial Roofing",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: [
        { "@type": "State", name: "South Carolina" },
        { "@type": "State", name: "North Carolina" },
        { "@type": "State", name: "Georgia" },
        { "@type": "State", name: "Tennessee" },
      ],
      description:
        "TPO, EPDM, and flat-roof commercial roofing systems with No Dollar Limit warranties. Zero downtime installation, complex HVAC flashing, and tapered insulation for standing water correction.",
      url: `${BASE_URL}/services/commercial-roofing`,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
      },
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the difference between TPO and EPDM commercial roofing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "TPO is a white heat-reflective membrane hot-air welded for superior seam strength and energy savings. EPDM (rubber) is highly impact-resistant but absorbs heat. RealRoof recommends TPO for most Southeast commercial buildings due to its energy efficiency and watertight seam integrity.",
          },
        },
        {
          "@type": "Question",
          name: "What is a No Dollar Limit (NDL) warranty?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An NDL warranty covers 100% of all labor and material costs required to repair a leak during the warranty period, backed directly by the manufacturer — not just the contractor. RealRoof's certifications allow us to offer NDL warranties of up to 20 years.",
          },
        },
        {
          "@type": "Question",
          name: "Will commercial roof work disrupt my business operations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RealRoof strategically stages all equipment, cranes, and dumpsters to minimize impact on your parking, loading docks, and daily operations. We can schedule phased installations or weekend work to ensure zero business disruption.",
          },
        },
      ],
    },
  },

  "multi-family-roofing": {
    title:
      "Multi-Family Roofing Specialists Greenville SC | RealRoof",
    description:
      "Expert roofing solutions for multi-family communities and apartment complexes in SC, NC, GA, and TN. Specialized vendor coordination and large-scale scheduling. Call 864-558-7663.",
    keywords: [
      "multi family roofing Greenville SC",
      "apartment complex roofing Columbia SC",
      "condo roof replacement Tennessee",
      "multi family roof repair Georgia",
      "property management roofing contractor SC",
      "HOA roofing contractor Greenville",
      "large scale roofing contractor Greenville SC",
      "commercial shingle roofing South Carolina",
      "tenant coordination roofing contractor",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/services/multi-family-roofing/#service`,
      name: "Multi-Family Roofing Greenville SC",
      serviceType: "Multi-Family Roofing",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: [
        { "@type": "State", name: "South Carolina" },
        { "@type": "State", name: "North Carolina" },
        { "@type": "State", name: "Georgia" },
        { "@type": "State", name: "Tennessee" },
      ],
      description:
        "Specialized multi-family roofing services with complete tenant coordination, budget planning, and large-scale scheduling capabilities for property managers.",
      url: `${BASE_URL}/services/multi-family-roofing`,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
      },
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does RealRoof coordinate roofing replacements on occupied properties?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We provide comprehensive resident communication templates, color-coded scheduling maps, and on-site managers to coordinate parking adjustments and work phases, minimizing disturbance to tenants.",
          },
        },
        {
          "@type": "Question",
          name: "Can you assist property managers with budget planning?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We offer complete multi-year capital budget planning, detailed roof assessments, and prioritized scopes of work to optimize asset management and budgeting schedules.",
          },
        },
      ],
    },
  },

  "storm-restoration": {
    title:
      "Storm Damage Roof Restoration Greenville SC | Insurance Claims | RealRoof",
    description:
      "Save on out-of-pocket roof replacement costs after wind or hail storm damage. Complete insurance claim assistance in Greenville, SC, Columbia, SC & TN. Call 864-558-7663.",
    keywords: [
      "storm damage roof restoration Greenville SC",
      "roof insurance claim help Greenville",
      "hail damage roof replacement Columbia SC",
      "wind damage roof repair Tennessee",
      "emergency roof tarping Greenville SC",
      "free storm damage roof inspection SC",
      "hail storm damage roof inspection Greenville",
      "will insurance cover roof replacement",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/services/storm-restoration/#service`,
      name: "Storm Restoration & Claims Greenville SC",
      serviceType: "Storm Restoration",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: [
        { "@type": "State", name: "South Carolina" },
        { "@type": "State", name: "North Carolina" },
        { "@type": "State", name: "Georgia" },
        { "@type": "State", name: "Tennessee" },
      ],
      description:
        "Advocating for property owners through wind and hail damage insurance claims. Free drone inspections and direct claims negotiation to cover your roof replacement.",
      url: `${BASE_URL}/services/storm-restoration`,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
      },
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does RealRoof help with roof insurance claims?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. RealRoof works directly with your insurance adjuster to document all storm and hail damage, ensuring you receive the maximum coverage for a complete roof replacement — often at no out-of-pocket cost beyond your deductible.",
          },
        },
        {
          "@type": "Question",
          name: "How do I know if my roof has hail damage?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Look for dents on gutters or downspouts, dark spots or bruising on shingle surfaces, granule loss in gutters, and cracked or missing shingles. RealRoof offers free drone-assisted roof inspections to accurately assess storm damage without disturbing your roof.",
          },
        },
      ],
    },
  },

  "installation-partnerships": {
    title:
      "Roofing Subcontractor & Installation Partner SC NC GA TN | RealRoof",
    description:
      "Scalable, licensed, and insured installation subcontractor partner for commercial and residential roofing companies across the Southeast. Call 864-558-7663.",
    keywords: [
      "roofing subcontractor SC",
      "roofing installation partner NC",
      "roofing subcontractor Georgia",
      "roofing subcontractor Tennessee",
      "white label roofing contractor Southeast",
      "roofing crew provider SC",
      "roofing overflow crew management",
    ],
    serviceJsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/services/installation-partnerships/#service`,
      name: "Installation Partnerships Southeast",
      serviceType: "Installation Partnerships",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: [
        { "@type": "State", name: "South Carolina" },
        { "@type": "State", name: "North Carolina" },
        { "@type": "State", name: "Georgia" },
        { "@type": "State", name: "Tennessee" },
      ],
      description:
        "Providing white-label scalable installation solutions, multi-state scheduling, crew management, and overflow support for other roofing companies.",
      url: `${BASE_URL}/services/installation-partnerships`,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
      },
    },
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you provide white-label roofing subcontracting?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We offer fully white-labeled installations, utilizing your brand parameters while managing crews, safety protocols, and build quality on site.",
          },
        },
        {
          "@type": "Question",
          name: "What states are covered for installation partnerships?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We provide scalable installation partnerships and subcontractor crew coverage across South Carolina, North Carolina, Georgia, and Tennessee.",
          },
        },
      ],
    },
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const services = content?.data?.services?.services || [];
  const service = services.find((s: any) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const seo = service.seo || {};

  const title = seo.metaTitle || seo.title || service.title;
  const description = seo.metaDescription || seo.description;

  return {
    title,
    description,
    robots: {
      index: seo.metaRobotsIndex !== 'noindex',
      follow: seo.metaRobotsFollow !== 'nofollow',
      ...(seo.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    },
    alternates: {
      canonical: `${BASE_URL}/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/services/${slug}`,
      type: "website",
      images: [
        {
          url: seo.featuredImage || seo.ogImage || `${BASE_URL}/realrooflogo.webp`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.featuredImage || seo.twitterImage || seo.ogImage || `${BASE_URL}/realrooflogo.webp`],
    },
  };
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export { seoMap };
