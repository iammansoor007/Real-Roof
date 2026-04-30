import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog - Eagle Revolution',
  description: 'Stay updated with the latest news, tutorials, and insights from Eagle Revolution.',
};

export default async function BlogIndexPage() {
  await connectToDatabase();
  const posts = await Post.find({ status: 'published' })
    .populate('categories author')
    .sort({ publishedAt: -1 });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#1d2327] py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#72aee6] via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Blog</h1>
           <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             Explore our latest stories, industry insights, and professional tips. 
             Discover the revolution in every post.
           </p>
        </div>
      </section>

      {/* Featured Post (Optional first post) */}
      <section className="py-16 container mx-auto px-4">
        {posts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
             <div className="relative h-[300px] lg:h-auto overflow-hidden">
                {posts[0].featuredImage && (
                  <img 
                    src={posts[0].featuredImage} 
                    alt={posts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute top-4 left-4">
                   <span className="bg-[#2271b1] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                      Featured
                   </span>
                </div>
             </div>
             <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-slate-500 text-sm mb-4">
                   <Calendar className="w-4 h-4" />
                   <span>{new Date(posts[0].publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-3xl font-bold text-[#1d2327] mb-6 line-clamp-2">
                   {posts[0].title}
                </h2>
                <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                   {posts[0].excerpt || posts[0].content.replace(/<[^>]*>/g, '').substring(0, 160)}...
                </p>
                <Link href={`/blog/${posts[0].slug}`} className="inline-flex items-center gap-2 text-[#2271b1] font-bold group/btn">
                   Read Full Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
             </div>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.slice(1).map((post) => (
             <article key={post._id} className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-[#72aee6]/30 shadow-sm hover:shadow-xl transition-all group h-full">
                <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                   {post.featuredImage ? (
                     <img 
                       src={post.featuredImage} 
                       alt={post.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                   ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-slate-300" />
                     </div>
                   )}
                   <div className="absolute top-4 left-4">
                      {post.categories?.[0] && (
                        <span className="bg-white/90 backdrop-blur-sm text-[#1d2327] px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
                           {post.categories[0].name}
                        </span>
                      )}
                   </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                   <div className="flex items-center gap-3 text-slate-400 text-[12px] mb-4">
                      <div className="flex items-center gap-1">
                         <User className="w-3.5 h-3.5" />
                         <span>{post.author?.username || 'Admin'}</span>
                      </div>
                      <span className="text-slate-200">•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                   </div>
                   <h3 className="text-xl font-bold text-[#1d2327] mb-4 group-hover:text-[#2271b1] transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                   </h3>
                   <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                   </p>
                   <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#2271b1] text-sm font-bold group/link">
                      Read More <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </article>
           ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
             <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-[#1d2327]">No posts published yet.</h3>
             <p className="text-slate-500 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </section>
    </div>
  );
}
