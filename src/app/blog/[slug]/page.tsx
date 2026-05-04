import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, Tag as TagIcon, ChevronLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const post = await Post.findOne({ slug, status: 'published' });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription,
      images: [post.seo?.ogImage || post.featuredImage].filter(Boolean) as string[],
    },
    alternates: {
      canonical: post.seo?.canonicalUrl,
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectToDatabase();
  
  const post = await Post.findOne({ slug, status: 'published' })
    .populate('categories tags author');

  if (!post) notFound();

  // Automated Table of Contents Logic
  // Extract H1 and H2 headings and inject IDs
  let tableOfContents: { id: string; text: string; level: number }[] = [];
  let processedContent = post.content;

  // Regex to find H1 and H2 tags
  const headingRegex = /<(h[12])>(.*?)<\/h[12]>/gi;
  let match;
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  while ((match = headingRegex.exec(post.content)) !== null) {
    const level = parseInt(match[1][1]);
    const text = match[2].replace(/<[^>]*>/g, ''); // strip any nested tags
    const id = slugify(text);
    tableOfContents.push({ id, text, level });
    
    // Inject ID into the tag for the processed content
    const originalTag = match[0];
    const newTag = `<${match[1]} id="${id}">${match[2]}</${match[1]}>`;
    processedContent = processedContent.replace(originalTag, newTag);
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Breadcrumb Section */}
      <div className="relative h-[65vh] min-h-[450px] w-full bg-[#111827] overflow-hidden">
        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <div className="mb-6 flex items-center gap-2 text-white/60 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/40 truncate max-w-[200px]">{post.title}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.categories?.map((cat: any) => (
              <span key={cat._id} className="bg-blue-600 text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-full shadow-lg shadow-blue-600/30">
                {cat.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 max-w-5xl leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-8 text-white/80 text-sm border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-blue-500/50 overflow-hidden">
                <User className="w-full h-full p-2 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-widest text-white/40">Written By</span>
                <span className="block font-bold text-white">{post.author?.username || 'Eagle Admin'}</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-left">
              <span className="block text-[10px] uppercase tracking-widest text-white/40">Published On</span>
              <div className="flex items-center gap-2 font-bold text-white">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Left Side: Blog Content */}
          <div className="flex-1 min-w-0">
            <div 
              className="prose prose-lg md:prose-xl max-w-none 
                prose-headings:text-[#111827] prose-headings:font-black prose-headings:tracking-tight
                prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-p:text-slate-600 prose-p:leading-[1.8]
                prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                prose-strong:text-[#111827]
                [&>*:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-3">
                {post.tags.map((tag: any) => (
                  <span key={tag._id} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer border border-slate-100">
                    <TagIcon className="w-3.5 h-3.5" /> {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Sticky TOC Sidebar */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="sticky top-28 space-y-10">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-blue-500" /> Table of Contents
                  </h3>
                  <nav className="space-y-4">
                    {tableOfContents.map((item, idx) => (
                      <a 
                        key={idx}
                        href={`#${item.id}`}
                        className={`block text-sm transition-all hover:text-blue-600 ${
                          item.level === 1 
                            ? "font-bold text-slate-900" 
                            : "pl-4 text-slate-500 font-medium"
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Author Widget */}
              <div className="bg-[#111827] rounded-3xl p-8 text-white">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-blue-500" /> About Author
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl">
                    {post.author?.username?.[0] || 'E'}
                  </div>
                  <div>
                    <div className="font-bold">{post.author?.username || 'Eagle Admin'}</div>
                    <div className="text-[11px] text-white/40 uppercase tracking-widest font-bold">Content Strategist</div>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-white/60">
                  Specializing in creating high-quality technical content for the Eagle Revolution community.
                </p>
              </div>

              {/* Share Card */}
              <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
                <h4 className="font-bold text-xl mb-2">Love this article?</h4>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Help others find it by sharing with your network.</p>
                <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Share2 className="w-4 h-4" /> Share Now
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </article>
  );
}

