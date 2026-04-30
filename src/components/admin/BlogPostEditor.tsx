"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, Loader2, Eye, Calendar, Settings, 
  Image as ImageIcon, Tag, Folder, 
  ChevronRight, ArrowLeft, ExternalLink, Globe,
  CheckCircle2, AlertCircle, BarChart3, Search
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import MediaSelector from "./MediaSelector";
import SeoEditor from "./SeoEditor";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

interface BlogPostEditorProps {
  id?: string;
  initialData?: any;
}

export default function BlogPostEditor({ id, initialData }: BlogPostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id && !initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [post, setPost] = useState(initialData || {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    status: "draft",
    categories: [],
    tags: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      canonicalUrl: "",
      metaRobotsIndex: "index",
      metaRobotsFollow: "follow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image"
    }
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  useEffect(() => {
    if (id && !initialData) {
      fetchPost();
    }
    fetchCategories();
    fetchTags();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`);
      const data = await res.json();
      if (res.ok) setPost(data);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/blog/categories');
    const data = await res.json();
    if (res.ok) setCategories(data);
  };

  const fetchTags = async () => {
    const res = await fetch('/api/admin/blog/tags');
    const data = await res.json();
    if (res.ok) setTags(data);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = id ? `/api/admin/blog/posts/${id}` : '/api/admin/blog/posts';
      const method = id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Post saved successfully!");
        if (!id && data._id) {
          const newId = String(data._id);
          router.push(`/admin/blog/${newId}`);
        }
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    if (!post.title) return;
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setPost({ ...post, slug });
  };

  if (loading) return <div className="p-10 text-center text-[#646970]">Loading editor...</div>;

  return (
    <div className="bg-[#f0f0f1] min-h-screen font-sans pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[23px] font-normal text-[#1d2327] font-serif">{id ? 'Edit Post' : 'Add New Post'}</h1>
          {!id && <button onClick={handleSave} className="bg-white border border-[#2271b1] text-[#2271b1] text-[13px] px-2 py-0.5 rounded-[3px] hover:bg-[#f0f6fb] transition-colors">Save Draft</button>}
        </div>
        <div className="flex items-center gap-3">
            {id && (
              <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-1.5 text-[#2271b1] text-[13px] hover:text-[#135e96]">
                <ExternalLink className="w-4 h-4" /> View Post
              </Link>
            )}
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-[#2271b1] text-white text-[13px] font-semibold px-4 py-1.5 rounded-[3px] border border-[#135e96] shadow-[0_1px_0_#135e96] hover:bg-[#135e96] disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {id ? 'Update' : 'Publish'}
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Main Column */}
        <div className="flex-1 w-full space-y-4">
          <div className="bg-white">
            <input 
              type="text" 
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              onBlur={generateSlug}
              placeholder="Enter title here"
              className="w-full border border-[#c3c4c7] px-3 py-2 text-[18px] font-medium text-[#1d2327] focus:border-[#2271b1] focus:ring-0 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-[12px] text-[#646970]">
            <strong>Permalink:</strong>
            <span className="bg-[#f0f0f1] px-1 rounded border border-[#c3c4c7]">https://eaglerevolution.com/blog/{post.slug}</span>
            <button onClick={() => {
              const s = prompt("Enter slug:", post.slug);
              if(s) setPost({...post, slug: s});
            }} className="border border-[#c3c4c7] px-2 rounded hover:bg-[#f6f7f7]">Edit</button>
          </div>

          {/* Editor Tabs */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-hidden">
             <div className="flex border-b border-[#f0f0f1] bg-[#f6f7f7]">
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2.5 text-[13px] font-semibold border-r border-[#c3c4c7] transition-all ${activeTab === 'content' ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"}`}
                >
                  Post Content
                </button>
                <button 
                  onClick={() => setActiveTab('seo')}
                  className={`px-4 py-2.5 text-[13px] font-semibold border-r border-[#c3c4c7] transition-all ${activeTab === 'seo' ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"}`}
                >
                  SEO (Yoast-style)
                </button>
             </div>

             <div className="p-0">
                {activeTab === 'content' ? (
                  <div className="p-0 min-h-[500px]">
                    <RichTextEditor 
                      content={post.content} 
                      onChange={(html) => setPost({ ...post, content: html })} 
                    />
                  </div>
                ) : (
                  <SeoEditor 
                    data={post.seo} 
                    setData={(seo) => setPost({ ...post, seo })} 
                    pageSlug={post.slug}
                    pageTitle={post.title}
                    pageContent={post.content}
                  />
                )}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[280px] space-y-5">
          {/* Publish Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
            <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Publish</h2>
            </div>
            <div className="p-3 space-y-3 text-[12px] text-[#2c3338]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-[#82878c]" /> Status:</span>
                <select 
                  value={post.status}
                  onChange={(e) => setPost({ ...post, status: e.target.value })}
                  className="bg-white border border-[#8c8f94] px-1 py-0.5 rounded outline-none focus:border-[#2271b1]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-[#82878c]" /> Visibility:</span>
                <strong>Public</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#82878c]" /> {post.status === 'published' ? 'Published on:' : 'Publish immediately'}</span>
                <strong>{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</strong>
              </div>
            </div>
            <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-2 flex items-center justify-between">
              <button className="text-[#d63638] underline text-[12px] hover:text-[#b32d2e]">Move to Trash</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#2271b1] text-white text-[12px] font-semibold px-3 py-1 rounded-[3px] border border-[#135e96] shadow-[0_1px_0_#135e96] hover:bg-[#135e96]"
              >
                {saving ? "..." : id ? "Update" : "Publish"}
              </button>
            </div>
          </div>

          {/* Categories Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
            <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Categories</h2>
            </div>
            <div className="p-3 max-h-48 overflow-y-auto space-y-1.5">
              {categories.map(cat => (
                <label key={cat._id} className="flex items-center gap-2 text-[12px] text-[#2c3338] cursor-pointer hover:text-[#2271b1]">
                  <input 
                    type="checkbox" 
                    checked={post.categories?.includes(cat._id)}
                    onChange={(e) => {
                      const newCats = e.target.checked 
                        ? [...post.categories, cat._id]
                        : post.categories.filter((id: string) => id !== cat._id);
                      setPost({ ...post, categories: newCats });
                    }}
                  />
                  {cat.name}
                </label>
              ))}
              <button onClick={() => router.push('/admin/blog/categories')} className="text-[#2271b1] underline text-[11px] block mt-2">+ Add New Category</button>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
            <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Featured Image</h2>
            </div>
            <div className="p-3 space-y-3 text-center">
              {post.featuredImage ? (
                <div className="relative group">
                  <img src={post.featuredImage} alt="" className="w-full aspect-video object-cover rounded border border-[#c3c4c7]" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                     <button onClick={() => setPost({...post, featuredImage: ""})} className="text-white text-[12px] font-bold underline">Remove image</button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#c3c4c7] p-5 rounded-sm flex flex-col items-center gap-2">
                   <ImageIcon className="w-8 h-8 text-[#dcdcde]" />
                   <p className="text-[11px] text-[#646970]">Set featured image</p>
                </div>
              )}
              <button 
                onClick={() => setShowMediaSelector(true)}
                className="bg-[#f6f7f7] border border-[#2271b1] text-[#2271b1] text-[12px] font-semibold px-4 py-1.5 rounded-[3px] hover:bg-[#f0f6fb]"
              >
                {post.featuredImage ? "Replace image" : "Set featured image"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMediaSelector && (
        <MediaSelector 
          onSelect={(item) => setPost({ ...post, featuredImage: item.url })}
          onClose={() => setShowMediaSelector(false)}
          title="Select Featured Image"
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`fixed bottom-10 right-10 z-[100] px-4 py-2 bg-white border-l-4 text-[12px] shadow-lg ${message.includes("Error") ? "border-[#d63638]" : "border-[#00a32a]"}`}>
            <p className="text-[#1d2327] m-0">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
