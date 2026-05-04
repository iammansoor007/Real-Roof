"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Loader2, LayoutTemplate, ChevronRight,
  Settings, Type, Image as ImageIcon, Briefcase,
  Star, HelpCircle, Phone, Users, Globe, ArrowUpRight, Trash2, ArrowLeft, ExternalLink,
  ChevronDown, Calendar, Eye
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplateEditors } from "@/components/admin/editors";
import SeoEditor from "@/components/admin/SeoEditor";

const EDITOR_TEMPLATES = [
  { id: 'home', label: 'Home Page', icon: LayoutTemplate },
  { id: 'about', label: 'About Us', icon: Type },
  { id: 'services', label: 'Services Index', icon: Briefcase },
  { id: 'gallery', label: 'Project Gallery', icon: ImageIcon },
  { id: 'team', label: 'Team Directory', icon: Users },
  { id: 'careers', label: 'Career Board', icon: Briefcase },
  { id: 'reviews', label: 'Client Reviews', icon: Star },
  { id: 'faq', label: 'Support FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact Center', icon: Phone },
];

export default function DynamicPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [page, setPage] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [seo, setSeo] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/admin/pages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPage(data);
        setContent(data.content || {});
        setSeo(data.seo || {});
      } else {
        router.push('/admin/pages');
      }
    } catch (err) {
      console.error("Failed to fetch page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          template: page.template,
          status: page.status,
          seo: seo,
          content: content
        }),
      });
      if (res.ok) {
        setMessage("Page updated.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to move this page to Trash?")) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/pages");
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-[#646970] font-serif">Loading...</div>;

  return (
    <div className="bg-[#f0f0f1] font-sans pb-10 max-w-full overflow-hidden">
      {/* WP Header Area */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-normal text-[#1d2327] font-serif">Edit Page</h1>
          <Link href="/admin/pages" className="bg-white border border-[#2271b1] text-[#2271b1] text-[12px] px-1.5 py-0.5 rounded-[3px] hover:bg-[#f0f6fb] transition-colors">Add New</Link>
          {page?.slug && (
            <Link 
              href={page.slug === 'home' ? '/' : `/${page.slug}`} 
              target="_blank" 
              className="bg-white border border-[#c3c4c7] text-[#2c3338] text-[12px] px-1.5 py-0.5 rounded-[3px] hover:bg-[#f6f7f7] transition-colors flex items-center gap-1"
            >
              View Page <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Main Content (Left Column) */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Title Input Field */}
          <div className="bg-white">
            <input
              type="text"
              value={page.title || ""}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full border border-[#c3c4c7] px-3 py-1.5 text-[16px] font-medium text-[#1d2327] focus:border-[#2271b1] focus:ring-0 outline-none placeholder:text-[#c3c4c7]"
              placeholder="Enter title here"
            />
          </div>

          {/* Permalink / Slug Area */}
          <div className="flex flex-wrap items-center gap-1 text-[12px] text-[#646970] px-1">
            <strong>Permalink:</strong>
            <span className="bg-[#f0f0f1] border border-[#c3c4c7] px-1 rounded-sm text-[#1d2327] break-all">
              https://eaglerevolution.com/{page.slug}
            </span>
            <button 
              onClick={() => {
                const ns = prompt("Enter new slug:", page.slug);
                if(ns) setPage({...page, slug: ns});
              }}
              className="bg-white border border-[#c3c4c7] px-1.5 py-0.5 rounded-[3px] text-[#2c3338] hover:bg-[#f6f7f7]"
            >
              Edit
            </button>
          </div>

          {/* Main Editor Tabs */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm overflow-hidden">
             <div className="flex border-b border-[#f0f0f1] bg-[#f6f7f7]">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-3 py-2 text-[12px] font-semibold border-r border-[#c3c4c7] transition-all ${
                    activeTab === 'content' ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"
                  }`}
                >
                  Page Content
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`px-3 py-2 text-[12px] font-semibold border-r border-[#c3c4c7] transition-all ${
                    activeTab === 'seo' ? "bg-white text-[#1d2327]" : "text-[#2271b1] hover:text-[#135e96]"
                  }`}
                >
                  SEO Settings
                </button>
             </div>

             <div className="p-0 overflow-x-auto">
                {activeTab === 'content' ? (
                  <div className="p-4 sm:p-5">
                    {TemplateEditors[page.template] ? (
                       (() => {
                         const Editor = TemplateEditors[page.template];
                         return <Editor pageId={id} data={content} setData={setContent} />;
                       })()
                    ) : (
                      <div className="p-10 text-center text-[#646970] text-[13px]">
                        Select a template in the right sidebar to start editing.
                      </div>
                    )}
                  </div>
                ) : (
                  <SeoEditor 
                    data={seo} 
                    setData={setSeo} 
                    pageSlug={page.slug} 
                    pageTitle={page.title} 
                    pageContent={content}
                  />
                )}
             </div>
          </div>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="w-full lg:w-[260px] flex-shrink-0 space-y-4">
          {/* Publish Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
            <div className="px-3 py-1.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Publish</h2>
            </div>
            <div className="p-3 space-y-2 text-[12px] text-[#2c3338]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-[#82878c]" /> Status:</span>
                <select 
                  value={page.status || "published"}
                  onChange={(e) => setPage({ ...page, status: e.target.value })}
                  className="bg-white border border-[#8c8f94] text-[12px] px-1 py-0.5 rounded-[3px] outline-none focus:border-[#2271b1]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#82878c]" /> Date:</span>
                <strong>{new Date().toLocaleDateString()}</strong>
              </div>
              {page?.slug && (
                <div className="pt-2 border-t border-[#f0f0f1] mt-2">
                   <Link 
                    href={page.slug === 'home' ? '/' : `/${page.slug}`} 
                    target="_blank" 
                    className="text-[#2271b1] hover:underline flex items-center gap-1"
                  >
                    View Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
            <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-2 flex items-center justify-between">
              <button onClick={handleDelete} className="text-[#d63638] underline text-[12px] hover:text-[#b32d2e]">Trash</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#2271b1] text-white text-[12px] font-semibold px-3 py-1 rounded-[3px] border border-[#135e96] shadow-[0_1px_0_#135e96] hover:bg-[#135e96] disabled:opacity-50"
              >
                {saving ? "..." : "Update"}
              </button>
            </div>
          </div>

          {/* Page Attributes Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
            <div className="px-3 py-1.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Attributes</h2>
            </div>
            <div className="p-3 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#1d2327]">Template</label>
                <select 
                  value={page.template}
                  onChange={(e) => setPage({...page, template: e.target.value})}
                  className="w-full border border-[#8c8f94] bg-white px-2 py-1 text-[12px] rounded-[3px] outline-none focus:border-[#2271b1]"
                >
                  {EDITOR_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
            <div className="px-3 py-1.5 border-b border-[#c3c4c7] bg-[#f6f7f7]">
              <h2 className="text-[13px] font-semibold text-[#1d2327]">Featured Image</h2>
            </div>
            <div className="p-3">
              <button className="text-[#2271b1] underline text-[12px] hover:text-[#135e96]">Set image</button>
            </div>
          </div>
        </div>
      </div>

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
