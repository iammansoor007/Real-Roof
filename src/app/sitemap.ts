import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';
import { BASE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Fetch dynamic content from DB
  let dynamicServices = [];
  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' });
    if (content?.data?.services) {
        const sData = content.data.services;
        dynamicServices = Array.isArray(sData) ? sData : (sData.services || []);
    }
  } catch (e) {
    console.error("Sitemap: Failed to fetch services", e);
  }

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic service detail pages
  const serviceRoutes: MetadataRoute.Sitemap = dynamicServices.map(
    (service: any) => ({
      url: `${BASE_URL}/${service.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })
  );

  return [...staticRoutes, ...serviceRoutes];
}
