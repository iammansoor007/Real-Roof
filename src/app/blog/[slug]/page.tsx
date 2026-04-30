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

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-[#1d2327]">
        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map((cat: any) => (
              <span key={cat._id} className="bg-[#2271b1] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                {cat.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2271b1] flex items-center justify-center border border-white/20">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">{post.author?.username || 'Eagle Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#72aee6]" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Post Content */}
          <div 
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:text-[#1d2327] prose-headings:font-bold
              prose-p:text-[#2c3338] prose-p:leading-relaxed
              prose-a:text-[#2271b1] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-xl
              mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100 mb-12">
              <TagIcon className="w-4 h-4 text-slate-400 mr-1" />
              {post.tags.map((tag: any) => (
                <span key={tag._id} className="text-[13px] text-slate-600 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="bg-slate-50 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100">
             <div className="text-center sm:text-left">
                <h3 className="font-bold text-[#1d2327] mb-1">Found this post helpful?</h3>
                <p className="text-sm text-slate-600">Share it with your network and stay tuned for more.</p>
             </div>
             <button className="flex items-center gap-2 bg-[#2271b1] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#135e96] transition-all shadow-lg shadow-[#2271b1]/20">
                <Share2 className="w-4 h-4" /> Share Post
             </button>
          </div>
        </div>
      </div>
    </article>
  );
}
