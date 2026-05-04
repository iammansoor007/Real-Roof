import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, Tag as TagIcon, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
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
    <article className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <ReadingProgress />

      {/* Ultra-Premium Hero Breadcrumb Section */}
      <div className="relative h-[75vh] min-h-[550px] w-full bg-[#0B0F1A] overflow-hidden">
        {post.featuredImage && (
          <div className="absolute inset-0">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-40 animate-pulse-slow"
            />
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="absolute inset-0 w-full h-full object-contain z-10 p-20 hidden md:block"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0F1A]/80 to-[#0B0F1A] z-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.15)_0%,_transparent_50%)] z-20" />
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-20 items-center text-center z-30">
          <div className="mb-10 flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-fade-in">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <Link href="/blog" className="hover:text-blue-400 transition-colors">Insights</Link>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/20 truncate max-w-[150px]">{post.title}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {post.categories?.map((cat: any) => (
              <span key={cat._id} className="bg-blue-600/10 text-blue-400 border border-blue-500/20 backdrop-blur-md px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {cat.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 max-w-6xl leading-[0.95] tracking-tighter drop-shadow-2xl">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-xs border-t border-white/5 pt-10 w-full max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-[0.3em] text-white/30 mb-0.5">Editor</span>
                <span className="block font-black text-white text-sm tracking-tight">{post.author?.username || 'Eagle Admin'}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/5 hidden sm:block" />
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-[0.3em] text-white/30 mb-0.5">Date</span>
              <div className="flex items-center gap-2 font-black text-white text-sm tracking-tight">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/5 hidden sm:block" />
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-[0.3em] text-white/30 mb-0.5">Read Time</span>
              <div className="flex items-center gap-2 font-black text-white text-sm tracking-tight">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>8 Min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sophisticated Grid Layout */}
      <div className="bg-[#F8FAFC]">
        <div className="container mx-auto px-4 py-32">
          <div className="flex flex-col lg:flex-row gap-20 relative">
            
            {/* Left Side: Content with Premium Typography */}
            <div className="flex-1 min-w-0">
              <div 
                className="prose prose-xl md:prose-2xl max-w-none 
                  prose-headings:text-[#0F172A] prose-headings:font-black prose-headings:tracking-tight
                  prose-h1:text-5xl prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-10 prose-h2:border-l-8 prose-h2:border-blue-600 prose-h2:pl-8
                  prose-p:text-slate-600 prose-p:leading-[2] prose-p:mb-10
                  prose-a:text-blue-600 prose-a:font-black prose-a:no-underline prose-a:border-b-4 prose-a:border-blue-100 hover:prose-a:border-blue-600 transition-all
                  prose-img:rounded-[3rem] prose-img:shadow-2xl prose-img:my-20
                  prose-blockquote:border-none prose-blockquote:bg-blue-600 prose-blockquote:text-white prose-blockquote:p-12 prose-blockquote:rounded-[3rem] prose-blockquote:font-black prose-blockquote:text-3xl prose-blockquote:tracking-tighter prose-blockquote:leading-tight
                  prose-strong:text-[#0F172A] prose-strong:font-black
                  [&>*:first-child]:mt-0"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-24 pt-16 border-t border-slate-200 flex flex-wrap gap-4">
                  {post.tags.map((tag: any) => (
                    <span key={tag._id} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:scale-105 transition-all cursor-pointer shadow-sm border border-slate-100">
                      <TagIcon className="w-3.5 h-3.5" /> {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Glassmorphism Sidebar */}
            <aside className="lg:w-[380px] shrink-0">
              <div className="sticky top-32 space-y-12">
                
                {/* Table of Contents - Glass */}
                {tableOfContents.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white shadow-2xl shadow-blue-900/5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 flex items-center gap-3">
                      <div className="w-6 h-1 bg-blue-600 rounded-full" /> Navigation
                    </h3>
                    <nav className="space-y-6">
                      {tableOfContents.map((item, idx) => (
                        <a 
                          key={idx}
                          href={`#${item.id}`}
                          className={`group flex items-start gap-4 text-sm transition-all hover:text-blue-600 ${
                            item.level === 1 
                              ? "font-black text-slate-900 text-base" 
                              : "pl-6 text-slate-500 font-bold"
                          }`}
                        >
                          <span className="text-blue-200 group-hover:text-blue-600 transition-colors">0{idx + 1}.</span>
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Shared Widget - Impactful */}
                <div className="bg-[#0B0F1A] rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-all" />
                  <h4 className="text-2xl font-black mb-4 tracking-tighter leading-none">Spread the <br/><span className="text-blue-500">Revolution.</span></h4>
                  <p className="text-white/50 text-sm mb-10 leading-relaxed font-medium">Found this insight valuable? Share it with your colleagues and network.</p>
                  
                  <ShareButton title={post.title} url={slug} />
                </div>

                {/* Newsletter-ish Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-600/30">
                  <BookOpen className="w-10 h-10 mb-6 text-white/30" />
                  <h4 className="font-black text-2xl mb-2 tracking-tighter">Stay Updated</h4>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">Join 2,000+ professionals receiving weekly digital strategies.</p>
                  <Link href="/contact" className="block w-full text-center bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">
                    Get Started
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


