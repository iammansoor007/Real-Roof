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
    <div className="min-h-screen bg-slate-50/50">
      {/* Cinematic Hero Section */}
      <section className="bg-[#111827] pt-32 pb-24 md:pt-48 md:pb-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              Insights & Stories
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]">
              The Eagle <br/><span className="text-blue-500">Revolution</span> Blog
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              Deep dives into industry trends, professional guides, and the stories shaping the future of digital excellence.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        {/* Featured Post Card */}
        {posts.length > 0 && (
          <Link href={`/blog/${posts[0].slug}`} className="group block mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-white transition-all hover:scale-[1.01] active:scale-[0.99]">
              <div className="lg:col-span-7 relative h-[400px] lg:h-[600px] overflow-hidden">
                {posts[0].featuredImage ? (
                  <img 
                    src={posts[0].featuredImage} 
                    alt={posts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-slate-800" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
              <div className="lg:col-span-5 p-8 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-blue-600 text-[11px] font-black uppercase tracking-widest mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(posts[0].publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-8 leading-[1.1] group-hover:text-blue-600 transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-10 line-clamp-3">
                  {posts[0].excerpt || posts[0].content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-[#111827]">
                      {posts[0].author?.username?.[0] || 'E'}
                   </div>
                   <div>
                      <div className="font-bold text-[#111827] text-sm">{posts[0].author?.username || 'Eagle Admin'}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Author</div>
                   </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
           {posts.slice(1).map((post) => (
             <article key={post._id} className="flex flex-col group h-full">
                <Link href={`/blog/${post.slug}`} className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 shadow-xl shadow-slate-200 border border-white">
                   {post.featuredImage ? (
                     <img 
                       src={post.featuredImage} 
                       alt={post.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                   ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-slate-300" />
                     </div>
                   )}
                   <div className="absolute top-6 left-6">
                      {post.categories?.[0] && (
                        <span className="bg-white/90 backdrop-blur-md text-[#111827] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                           {post.categories[0].name}
                        </span>
                      )}
                   </div>
                </Link>
                <div className="flex-1 px-2">
                   <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>5 min read</span>
                   </div>
                   <h3 className="text-2xl font-black text-[#111827] mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                   </h3>
                   <p className="text-slate-500 text-sm leading-[1.8] mb-8 line-clamp-3">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                   </p>
                   <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-3 text-[#111827] text-sm font-black group/link hover:text-blue-600 transition-colors">
                      Read Article <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-600 group-hover/link:text-white transition-all"><ArrowRight className="w-4 h-4" /></div>
                   </Link>
                </div>
             </article>
           ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <BookOpen className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-3xl font-black text-[#111827]">No Stories Yet.</h3>
             <p className="text-slate-500 mt-4 text-lg">Our writers are working hard on the next big thing. Stay tuned!</p>
             <Link href="/" className="inline-block mt-10 bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all">
                Back to Homepage
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
