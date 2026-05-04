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

  const categories = await connectToDatabase().then(() => 
    import('@/models/Category').then(m => m.default.find({}))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-blue-600 selection:text-white">
      {/* Ultra-Modern Hero Section */}
      <section className="bg-[#0B0F1A] pt-40 pb-32 md:pt-60 md:pb-52 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(37,99,235,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(37,99,235,0.05)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-px bg-blue-600" />
               <span className="text-blue-500 text-[11px] font-black uppercase tracking-[0.4em]">The Intelligence Hub</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white mb-12 tracking-tighter leading-[0.85] drop-shadow-2xl">
              Digital <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200">Revolution.</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium tracking-tight">
              Strategic insights, technical deep-dives, and the future of digital product excellence.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-32 relative z-30">
        
        {/* Interactive Filter Bar */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-4 mb-20 border border-white shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex flex-wrap items-center gap-2 p-2">
              <button className="px-8 py-3 rounded-2xl bg-[#0B0F1A] text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20">All Posts</button>
              {categories.slice(0, 4).map((cat: any) => (
                <button key={cat._id} className="px-8 py-3 rounded-2xl bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">{cat.name}</button>
              ))}
           </div>
           <div className="relative w-full md:w-96 px-4">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search the revolution..." 
                className="w-full bg-slate-100/50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-[#0B0F1A] focus:ring-2 focus:ring-blue-600 transition-all outline-none"
              />
           </div>
        </div>

        {/* Cinematic Featured Post */}
        {posts.length > 0 && (
          <Link href={`/blog/${posts[0].slug}`} className="group block mb-32">
            <div className="relative rounded-[4rem] overflow-hidden bg-[#0B0F1A] shadow-3xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[500px] lg:h-[750px] overflow-hidden">
                  {posts[0].featuredImage && (
                    <img 
                      src={posts[0].featuredImage} 
                      alt={posts[0].title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A] via-transparent to-transparent hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent lg:hidden" />
                </div>
                <div className="p-12 md:p-24 flex flex-col justify-center relative z-10">
                  <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-10 w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Editor's Choice
                  </div>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-10 leading-[0.95] tracking-tighter group-hover:text-blue-400 transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-slate-400 text-xl leading-relaxed mb-12 line-clamp-3 font-medium">
                    {posts[0].excerpt || posts[0].content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white">
                           {posts[0].author?.username?.[0] || 'E'}
                        </div>
                        <div>
                           <div className="font-black text-white text-sm">{posts[0].author?.username || 'Eagle Admin'}</div>
                           <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Thought Leader</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* High-Definition Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-40">
           {posts.slice(1).map((post) => (
             <article key={post._id} className="flex flex-col group">
                <Link href={`/blog/${post.slug}`} className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-10 shadow-2xl shadow-blue-900/5 group-hover:shadow-blue-900/20 transition-all border-4 border-white">
                   {post.featuredImage ? (
                     <img 
                       src={post.featuredImage} 
                       alt={post.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                     />
                   ) : (
                     <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-slate-800" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute bottom-10 left-10 right-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <div className="bg-white text-[#0B0F1A] px-8 py-4 rounded-2xl font-black text-xs text-center uppercase tracking-widest">
                         Read Article
                      </div>
                   </div>
                   <div className="absolute top-10 left-10">
                      {post.categories?.[0] && (
                        <span className="bg-white/90 backdrop-blur-xl text-[#0B0F1A] px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                           {post.categories[0].name}
                        </span>
                      )}
                   </div>
                </Link>
                <div className="px-6">
                   <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <div className="w-1 h-1 rounded-full bg-blue-500" />
                      <span className="text-blue-500">Premium Insight</span>
                   </div>
                   <h3 className="text-3xl font-black text-[#0B0F1A] mb-6 leading-[1.1] tracking-tighter group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                   </h3>
                   <p className="text-slate-500 text-base leading-relaxed mb-10 line-clamp-3 font-medium">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 140)}...
                   </p>
                   <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-4 text-[#0B0F1A] text-[11px] font-black uppercase tracking-widest group/link hover:text-blue-600 transition-colors">
                      Explore Post 
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover/link:bg-[#0B0F1A] group-hover/link:text-white group-hover/link:border-[#0B0F1A] group-hover/link:rotate-45 transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                   </Link>
                </div>
             </article>
           ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-52 bg-white rounded-[5rem] border-4 border-dashed border-slate-100">
             <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
               <BookOpen className="w-12 h-12 text-slate-300" />
             </div>
             <h3 className="text-5xl font-black text-[#0B0F1A] tracking-tighter">The Vault is Empty.</h3>
             <p className="text-slate-500 mt-6 text-xl max-w-xl mx-auto font-medium leading-relaxed">Our intelligence team is currently synthesizing new digital strategies. Check back momentarily.</p>
             <Link href="/" className="inline-flex mt-12 bg-[#0B0F1A] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-900/20">
                Return to Core
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}

