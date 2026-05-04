import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, Tag as TagIcon, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButton from '@/components/blog/ShareButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const post = await Post.findOne({ slug, status: 'published' });

  if (!post) return { title: 'Post Not Found' };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";
  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title: {
      absolute: post.seo?.metaTitle || `${post.title}`
    },
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: (post.updatedAt || post.publishedAt)?.toISOString(),
      images: [
        {
          url: post.seo?.ogImage || post.featuredImage || `${BASE_URL}/eagle-logo.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      images: [post.seo?.ogImage || post.featuredImage || `${BASE_URL}/eagle-logo.png`],
      site: "@EagleRevolution",
      creator: "@EagleRevolution",
    },
    robots: {
      index: post.seo?.metaRobotsIndex !== 'noindex',
      follow: post.seo?.metaRobotsIndex === 'noindex' ? false : (post.seo?.metaRobotsFollow !== 'nofollow'),
      ...(post.seo?.metaRobotsIndex !== 'noindex' && {
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      })
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || url,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();
  
  const post = await Post.findOne({ slug, status: 'published' })
    .populate('categories tags author');

  if (!post) notFound();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";
  const url = `${BASE_URL}/blog/${slug}`;
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const publishDate = post.publishedAt?.toISOString();
  const modifiedDate = (post.updatedAt || post.publishedAt)?.toISOString();
  const featuredImage = post.featuredImage || `${BASE_URL}/eagle-logo.png`;

  // Advanced Schema.org Graph JSON-LD (Yoast/RankMath style)
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}/#article`,
        'isPartOf': { '@id': url },
        'author': {
          '@id': `${BASE_URL}/#/schema/person/${post.author?._id || 'admin'}`
        },
        'headline': post.title,
        'datePublished': publishDate,
        'dateModified': modifiedDate,
        'mainEntityOfPage': { '@id': url },
        'wordCount': wordCount,
        'commentCount': 0,
        'publisher': { '@id': `${BASE_URL}/#organization` },
        'image': { '@id': `${url}/#primaryimage` },
        'thumbnailUrl': featuredImage,
        'keywords': post.tags?.map((t: any) => t.name).join(', '),
        'inLanguage': 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': url,
        'url': url,
        'name': post.seo?.metaTitle || post.title,
        'isPartOf': { '@id': `${BASE_URL}/#website` },
        'primaryImageOfPage': { '@id': `${url}/#primaryimage` },
        'datePublished': publishDate,
        'dateModified': modifiedDate,
        'description': post.seo?.metaDescription || post.excerpt,
        'breadcrumb': { '@id': `${url}/#breadcrumb` },
        'inLanguage': 'en-US',
        'potentialAction': [
          {
            '@type': 'ReadAction',
            'target': [url]
          }
        ]
      },
      {
        '@type': 'ImageObject',
        '@id': `${url}/#primaryimage`,
        'isPartOf': { '@id': url },
        'url': featuredImage,
        'contentUrl': featuredImage,
        'width': 1200,
        'height': 630,
        'inLanguage': 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@type': 'WebPage',
              '@id': BASE_URL,
              'url': BASE_URL,
              'name': 'Home'
            }
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'item': {
              '@type': 'WebPage',
              '@id': `${BASE_URL}/blog`,
              'url': `${BASE_URL}/blog`,
              'name': 'Blog'
            }
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'item': {
              'name': post.title
            }
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        'url': BASE_URL,
        'name': 'Eagle Revolution',
        'description': 'Veteran-Owned Roofing & Home Improvement',
        'publisher': { '@id': `${BASE_URL}/#organization` },
        'inLanguage': 'en-US'
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        'name': 'Eagle Revolution',
        'url': BASE_URL,
        'logo': {
          '@type': 'ImageObject',
          '@id': `${BASE_URL}/#logo`,
          'url': `${BASE_URL}/eagle-logo.png`,
          'contentUrl': `${BASE_URL}/eagle-logo.png`,
          'width': 240,
          'height': 194,
          'caption': 'Eagle Revolution'
        },
        'image': { '@id': `${BASE_URL}/#logo` }
      },
      {
        '@type': 'Person',
        '@id': `${BASE_URL}/#/schema/person/${post.author?._id || 'admin'}`,
        'name': post.author?.name || 'Eagle Revolution',
        'image': {
          '@type': 'ImageObject',
          '@id': `${BASE_URL}/#person-logo`,
          'url': post.author?.image || `${BASE_URL}/eagle-logo.png`,
          'contentUrl': post.author?.image || `${BASE_URL}/eagle-logo.png`,
          'caption': post.author?.name || 'Eagle Revolution'
        },
        'url': `${BASE_URL}/blog`
      }
    ]
  };

  // Automated Table of Contents Logic
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = post.content;

  const headingRegex = /<(h[12])>(.*?)<\/h[12]>/gi;
  let match;
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = parseInt(match[1][1]);
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = slugify(text);
    tableOfContents.push({ id, text, level });
    
    const originalTag = match[0];
    const newTag = `<${match[1]} id="${id}" class="scroll-mt-32">${match[2]}</${match[1]}>`;
    processedContent = processedContent.replace(originalTag, newTag);
  }

  return (
    <article className="min-h-screen bg-white">
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <ReadingProgress />

      {/* Clean Hero Section */}
      <div className="relative h-[300px] w-full bg-slate-900 overflow-hidden flex items-center">
        {post.featuredImage && (
          <div className="absolute inset-0">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
            {post.title}
          </h1>
          
          <div className="flex justify-center items-center gap-6 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Grid Layout */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:text-slate-900 prose-headings:font-bold
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-blue-600 prose-a:no-underline hover:underline
                  prose-img:rounded-xl prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-r-xl"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                  {post.tags.map((tag: any) => (
                    <span key={tag._id} className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                      # {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Simple Sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                
                {/* TOC */}
                {tableOfContents.length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Table of Contents</h3>
                    <nav className="space-y-3">
                      {tableOfContents.map((item, idx) => (
                        <a 
                          key={idx}
                          href={`#${item.id}`}
                          className={`block text-sm transition-all hover:text-blue-600 ${
                            item.level === 1 
                              ? "font-bold text-slate-900" 
                              : "pl-4 text-slate-500"
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Share */}
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Share Article</h4>
                  <ShareButton title={post.title} url={slug} />
                </div>

                {/* Simple CTA */}
                <div className="p-6 bg-blue-600 rounded-2xl text-white">
                  <h4 className="font-bold text-lg mb-2">Need a Quote?</h4>
                  <p className="text-blue-100 text-xs mb-6 leading-relaxed">Contact Eagle Revolution for premium exterior solutions.</p>
                  <Link href="/contact" className="block w-full text-center bg-white text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                    Contact Us
                  </Link>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>
    </article>
  );
}


