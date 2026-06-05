
import { BASE_URL } from "./constants";

interface SchemaOptions {
  title: string;
  description: string;
  slug: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Service";
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbTitle?: string;
  isService?: boolean;
  image?: string;
}

export function generateSchema(options: SchemaOptions) {
  const { title, description, slug = "", type = "WebPage", faqs, breadcrumbTitle, isService, image } = options;
  const safeSlug = String(slug || "");
  const normalizedSlug = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const pageUrl = `${BASE_URL}${normalizedSlug === '/' ? '' : normalizedSlug}`;

  // 1. Organization Schema
  const organizationSchema = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "RealRoof",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/realrooflogo.webp`,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://www.facebook.com/RealRoof",
      "https://www.instagram.com/RealRoof",
      "https://www.linkedin.com/company/RealRoof"
    ]
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    "name": "RealRoof",
    "image": `${BASE_URL}/realrooflogo.webp`,
    "telePhone": "864-558-7663",
    "email": "esellers@RealRoof.com",
    "url": BASE_URL,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "300 E McBee Ave",
      "addressLocality": "Greenville",
      "addressRegion": "SC",
      "postalCode": "29601",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.8526,
      "longitude": -82.3940
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "South Carolina" },
      { "@type": "AdministrativeArea", "name": "North Carolina" },
      { "@type": "AdministrativeArea", "name": "Georgia" },
      { "@type": "AdministrativeArea", "name": "Tennessee" }
    ],
    "priceRange": "$$"
  };

  // 3. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": BASE_URL,
    "name": "RealRoof",
    "publisher": { "@id": `${BASE_URL}/#organization` }
  };

  // 4. BreadcrumbList Schema
  const pathSegments = safeSlug.split('/').filter(Boolean);
  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      ...pathSegments.map((segment, index) => {
        const url = `${BASE_URL}/${pathSegments.slice(0, index + 1).join('/')}`;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": index === pathSegments.length - 1 ? (breadcrumbTitle || title) : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          "item": url
        };
      })
    ]
  };

  // 5. WebPage / Service Schema
  const mainEntitySchema: any = {
    "@type": type,
    "@id": `${pageUrl}/#${type.toLowerCase()}`,
    "url": pageUrl,
    "name": title,
    "description": description,
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "breadcrumb": { "@id": `${pageUrl}/#breadcrumb` },
    "image": image ? {
      "@type": "ImageObject",
      "url": image
    } : undefined,
    "primaryImageOfPage": image ? {
      "@id": `${pageUrl}/#primaryimage`
    } : undefined
  };

  if (isService) {
    mainEntitySchema["provider"] = { "@id": `${BASE_URL}/#organization` };
  }

  // 6. FAQPage Schema (Conditional)
  let faqSchema = null;
  if (faqs && faqs.length > 0) {
    faqSchema = {
      "@type": "FAQPage",
      "@id": `${pageUrl}/#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  const graph = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    breadcrumbList,
    mainEntitySchema
  ];

  if (image) {
    graph.push({
      "@type": "ImageObject",
      "@id": `${pageUrl}/#primaryimage`,
      "url": image,
      "contentUrl": image
    });
  }

  if (faqSchema) {
    graph.push(faqSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
