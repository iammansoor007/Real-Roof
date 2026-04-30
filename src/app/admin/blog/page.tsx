"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, MoreVertical, Edit, 
  Trash2, Copy, Eye, EyeOff, Calendar, 
  CheckCircle2, Clock, FileText, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      const url = `/api/admin/blog/posts?${statusFilter !== 'all' ? `status=${statusFilter}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      if (res.ok) fetchPosts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const duplicatePost = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/posts/duplicate/${id}`, { method: "POST" });
      if (res.ok) fetchPosts();
    } catch (err) {
      alert("Duplication failed");
    }
  };

  return (
    <div className="bg-[#f0f0f1] min-h-screen font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[23px] font-normal text-[#1d2327] font-serif">Posts</h1>
          <Link href="/admin/blog/new" className="bg-white border border-[#2271b1] text-[#2271b1] text-[13px] px-2 py-0.5 rounded-[3px] hover:bg-[#f0f6fb] transition-colors">Add New</Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-[13px]">
        <div className="flex items-center gap-2 text-[#2271b1]">
          <button onClick={() => setStatusFilter('all')} className={`${statusFilter === 'all' ? 'text-[#1d2327] font-bold' : ''}`}>All ({posts.length})</button>
          <span className="text-[#c3c4c7]">|</span>
          <button onClick={() => setStatusFilter('published')} className={`${statusFilter === 'published' ? 'text-[#1d2327] font-bold' : ''}`}>Published ({posts.filter(p => p.status === 'published').length})</button>
          <span className="text-[#c3c4c7]">|</span>
          <button onClick={() => setStatusFilter('draft')} className={`${statusFilter === 'draft' ? 'text-[#1d2327] font-bold' : ''}`}>Drafts ({posts.filter(p => p.status === 'draft').length})</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-[#8c8f94] px-2 py-1 rounded-[3px] w-48 outline-none focus:border-[#2271b1]"
            />
          </div>
          <button className="bg-white border border-[#8c8f94] px-3 py-1 rounded-[3px] hover:bg-[#f6f7f7]">Search Posts</button>
        </div>
      </div>

      <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white border-b border-[#c3c4c7] text-[13px] font-bold text-[#1d2327]">
              <th className="px-3 py-2 w-10 text-center"><input type="checkbox" /></th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Categories</th>
              <th className="px-3 py-2">Tags</th>
              <th className="px-3 py-2 w-32"><Calendar className="w-3.5 h-3.5 inline mr-1" /> Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center text-[#646970]">Loading posts...</td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-[#646970]">No posts found.</td></tr>
            ) : filteredPosts.map((post) => (
              <tr key={post._id} className="border-b border-[#f0f0f1] hover:bg-[#f6f7f7] group text-[13px] text-[#2c3338]">
                <td className="px-3 py-4 text-center"><input type="checkbox" /></td>
                <td className="px-3 py-4">
                  <div className="flex items-start gap-3">
                    {post.featuredImage && (
                      <div className="w-12 h-12 rounded border border-[#c3c4c7] overflow-hidden flex-shrink-0">
                        <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Link href={`/admin/blog/${post._id}`} className="text-[#2271b1] font-bold hover:text-[#135e96] block mb-1">
                        {post.title} {post.status === 'draft' && <span className="text-[#646970] font-normal">— Draft</span>}
                      </Link>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/blog/${post._id}`} className="text-[#2271b1] hover:text-[#135e96]">Edit</Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <button className="text-[#2271b1] hover:text-[#135e96]">Quick Edit</button>
                        <span className="text-[#c3c4c7]">|</span>
                        <button onClick={() => deletePost(post._id)} className="text-[#d63638] hover:text-[#b32d2e]">Trash</button>
                        <span className="text-[#c3c4c7]">|</span>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-[#2271b1] hover:text-[#135e96]">View</Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <button onClick={() => duplicatePost(post._id)} className="text-[#2271b1] hover:text-[#135e96]">Duplicate</button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-[#2271b1]">{post.author?.username || 'admin'}</td>
                <td className="px-3 py-4 text-[#2271b1]">
                  {post.categories?.map((c: any) => c.name).join(', ') || '—'}
                </td>
                <td className="px-3 py-4 text-[#2271b1]">
                  {post.tags?.map((t: any) => t.name).join(', ') || '—'}
                </td>
                <td className="px-3 py-4">
                  <div className="text-[12px]">
                    <span className="block text-[#646970]">{post.status === 'published' ? 'Published' : 'Last Modified'}</span>
                    <span className="block">{new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
