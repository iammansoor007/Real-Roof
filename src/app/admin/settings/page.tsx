"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Settings, LayoutTemplate, Type, Image as ImageIcon, ChevronRight, Globe, Mail, Phone, MapPin, Share2, Plus, Trash2, List, ExternalLink, Search, Check, X, Upload } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import ImageField from "@/components/admin/ImageField";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-20 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});

const COMMON_ICONS = [
  "Home", "Info", "Briefcase", "Phone", "Mail", "MapPin", "Shield", "Star", "Check", "Award",
  "Hammer", "Construction", "Wind", "Sun", "Cloud", "Zap", "Layers", "Box", "Package",
  "Facebook", "Instagram", "Twitter", "Linkedin", "Youtube", "Github", "Globe",
  "Calendar", "Clock", "User", "Users", "Camera", "Image", "Video", "FileText", "File",
  "ShieldCheck", "Trophy", "CreditCard", "Settings", "Layout", "Menu", "ExternalLink",
  "ArrowRight", "ChevronRight", "Search", "Map", "Truck", "HardHat", "Ruler", "Paintbrush"
];

function IconPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredIcons = COMMON_ICONS.filter(icon => icon.toLowerCase().includes(search.toLowerCase()));
  const CurrentIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 bg-white border border-[#8c8f94] rounded-[3px] px-3 py-1 text-[13px] hover:border-[#2271b1] transition-all">
        <CurrentIcon className="w-3.5 h-3.5 text-[#50575e]" />
        <span>{value || "Select Icon"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-[#c3c4c7] shadow-md p-3 rounded-[3px]">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px] mb-2 outline-none focus:border-[#2271b1]" autoFocus />
          <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
            {filteredIcons.map(iconName => {
              const Icon = (LucideIcons as any)[iconName];
              return (
                <button key={iconName} onClick={() => { onChange(iconName); setOpen(false); }} className={`p-1.5 rounded hover:bg-[#f0f0f1] ${value === iconName ? "bg-[#2271b1] text-white" : "text-[#50575e]"}`}>
                  {Icon && <Icon className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PageSelector({ value, pages, onChange, label }: { value: string, pages: any[], onChange: (page: any) => void, label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[12px] font-semibold text-[#1d2327]">{label}</label>}
      <select 
        value={value || ""} 
        onChange={(e) => onChange(pages.find(p => p._id === e.target.value))}
        className="border border-[#8c8f94] bg-white px-2 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1]"
      >
        <option value="">-- Custom Link --</option>
        <optgroup label="Pages">
          {pages.filter(p => p.type === 'page').map(page => <option key={page._id} value={page._id}>{page.title}</option>)}
        </optgroup>
        <optgroup label="Services">
          {pages.filter(p => p.type === 'service').map(page => <option key={page._id} value={page._id}>{page.title}</option>)}
        </optgroup>
      </select>
    </div>
  );
}

const SettingsRow = ({ label, children, description }: any) => (
  <div className="py-4 border-b border-[#f0f0f1] flex flex-col md:flex-row gap-4">
    <div className="w-full md:w-64 flex-shrink-0 pt-1">
      <label className="text-[14px] font-semibold text-[#1d2327]">{label}</label>
    </div>
    <div className="flex-1 space-y-2">
      {children}
      {description && <p className="text-[12px] text-[#646970] italic">{description}</p>}
    </div>
  </div>
);

export default function SettingsEditor() {
  const [data, setData] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/content").then((res) => res.json()).then((json) => {
        const d = { ...json };
        if (!d.settings) d.settings = { siteTitle: "RealRoof", siteTemplate: "%s | RealRoof", favicon: "/realrooflogo.webp" };
        if (!d.navbar) d.navbar = { companyLinks: [], ctaText: "Book Now", ctaLink: "/contact", logo: "/realrooflogo.webp" };
        setData(d);
      });
    Promise.all([
      fetch("/api/admin/pages").then(res => res.json()),
      fetch("/api/content").then(res => res.json())
    ]).then(([pagesJson, contentJson]) => {
      const pageList = (pagesJson || [])
        .filter((p: any) => p.status === 'published')
        .map((p: any) => ({ ...p, type: 'page' }));
      const serviceList = (contentJson.services?.services || contentJson.services || [])
        .filter((s: any) => s.status === 'published' || s.status === undefined)
        .map((s: any) => ({ ...s, _id: s._id || s.slug, type: 'service', title: s.title, slug: `services/${s.slug}` }));
      setPages([...pageList, ...serviceList]);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        setToast({ type: "ok", msg: "Settings saved." });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "err", msg: "Error saving settings." });
    } finally { setSaving(false); }
  };

  const updateData = (section: string, field: string | null, value: any) => {
    setData((prev: any) => ({ ...prev, [section]: field ? { ...prev[section], [field]: value } : value }));
  };

  if (!data) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading...</div>;

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "header", label: "Header", icon: LayoutTemplate },
    { id: "footer", label: "Footer", icon: List },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
  ];

  return (
    <div className="space-y-6">
      {/* WP Header Area */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Settings</h1>
      </div>

      {/* WP Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`px-4 py-2 bg-white border-l-4 text-[13px] shadow-sm mb-4 ${toast.type === "ok" ? "border-[#00a32a]" : "border-[#d63638]"}`}>
            <p className="text-[#1d2327] m-0">{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WP-Style Tabs (Subsubsub) */}
      <div className="flex items-center gap-2 text-[13px] mb-6">
        {tabs.map((tab, idx) => (
          <React.Fragment key={tab.id}>
            <button onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7]">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Settings Form Container */}
      <div className="bg-white border border-[#c3c4c7] p-8 rounded-sm shadow-sm max-w-4xl">
        <AnimatePresence mode="wait">
          {activeTab === "general" && (
            <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">General Settings</h2>
               <SettingsRow label="Site Title" description="The main name of your business as it appears in the browser tab.">
                  <input type="text" value={data.settings?.siteTitle || ""} onChange={(e) => updateData("settings", "siteTitle", e.target.value)} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none" />
               </SettingsRow>
               <SettingsRow label="Title Template" description="How page titles are constructed. %s will be replaced by the page name.">
                  <input type="text" value={data.settings?.siteTemplate || ""} onChange={(e) => updateData("settings", "siteTemplate", e.target.value)} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none" />
               </SettingsRow>
               <SettingsRow label="Homepage" description="Select which page or service should be displayed on the root (/) URL.">
                  <select 
                    value={data.settings?.homepageId || ""} 
                    onChange={(e) => updateData("settings", "homepageId", e.target.value)}
                    className="w-full max-w-md border border-[#8c8f94] bg-white px-3 py-1.5 text-[14px] rounded-[3px] focus:border-[#2271b1] outline-none"
                  >
                    <option value="">Default (Home Template)</option>
                    <optgroup label="Published Pages">
                      {pages.filter(p => p.type === 'page' && p.published !== false).map(page => (
                        <option key={page._id} value={page._id}>{page.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Published Services">
                      {pages.filter(p => p.type === 'service').map(page => (
                        <option key={page._id} value={page._id}>{page.title}</option>
                      ))}
                    </optgroup>
                  </select>
               </SettingsRow>
               <SettingsRow label="Site Favicon" description="Upload the small icon that appears in the browser tab.">
                  <ImageField value={data.settings?.favicon || ""} onChange={(val) => updateData("settings", "favicon", val)} label="Favicon" />
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "header" && (
            <motion.div key="header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Header & Navigation</h2>
               <SettingsRow label="Navbar Logo">
                  <ImageField value={data.navbar?.logo || ""} onChange={(val) => updateData("navbar", "logo", val)} label="Logo" />
               </SettingsRow>
               <SettingsRow label="CTA Button">
                  <div className="flex gap-4">
                     <input type="text" placeholder="Text" value={data.navbar?.ctaText || ""} onChange={(e) => updateData("navbar", "ctaText", e.target.value)} className="w-40 border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                     <input type="text" placeholder="Link" value={data.navbar?.ctaLink || ""} onChange={(e) => updateData("navbar", "ctaLink", e.target.value)} className="flex-1 border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
                  </div>
               </SettingsRow>
               
               <div className="mt-8 pt-8 border-t border-[#c3c4c7]">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-normal text-[#1d2327] font-serif">Navigation Menu</h3>
                     <button onClick={() => updateData("navbar", "companyLinks", [...(data.navbar?.companyLinks || []), { label: "New Link", href: "/", icon: "Info", subLinks: [] }])} className="text-[#2271b1] hover:underline text-[13px]">+ Add Link</button>
                  </div>
                  <div className="space-y-6">
                     {(data.navbar?.companyLinks || []).map((link: any, idx: number) => (
                        <div key={idx} className="bg-[#f6f7f7] border border-[#c3c4c7] p-5 rounded-sm space-y-5 relative">
                           <div className="absolute top-2 right-2 flex gap-1">
                              <button 
                                onClick={() => {
                                  if (idx === 0) return;
                                  const nl = [...data.navbar.companyLinks];
                                  const temp = nl[idx - 1];
                                  nl[idx - 1] = nl[idx];
                                  nl[idx] = temp;
                                  updateData("navbar", "companyLinks", nl);
                                }}
                                disabled={idx === 0}
                                className="p-1 text-[#50575e] hover:bg-[#dcdcde] rounded disabled:opacity-30 transition-colors"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button 
                                onClick={() => {
                                  if (idx === data.navbar.companyLinks.length - 1) return;
                                  const nl = [...data.navbar.companyLinks];
                                  const temp = nl[idx + 1];
                                  nl[idx + 1] = nl[idx];
                                  nl[idx] = temp;
                                  updateData("navbar", "companyLinks", nl);
                                }}
                                disabled={idx === data.navbar.companyLinks.length - 1}
                                className="p-1 text-[#50575e] hover:bg-[#dcdcde] rounded disabled:opacity-30 transition-colors"
                                title="Move Down"
                              >
                                ↓
                              </button>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pr-16">
                              <PageSelector value={link.pageId} pages={pages} label="Map to Page" onChange={(p) => {
                                 const nl = [...data.navbar.companyLinks];
                                 nl[idx] = { ...nl[idx], pageId: p?._id || "", label: p?.title || nl[idx].label, href: p ? "/"+p.slug : nl[idx].href };
                                 updateData("navbar", "companyLinks", nl);
                              }} />
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Label</label>
                                 <input type="text" value={link.label} onChange={(e) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].label = e.target.value;
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Path/URL</label>
                                 <input type="text" value={link.href} onChange={(e) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].href = e.target.value;
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1">
                                 <label className="text-[12px] font-semibold text-[#1d2327]">Icon</label>
                                 <IconPicker value={link.icon} onChange={(v) => {
                                    const nl = [...data.navbar.companyLinks];
                                    nl[idx].icon = v;
                                    updateData("navbar", "companyLinks", nl);
                                 }} />
                              </div>
                              <div className="flex flex-col gap-2 pt-5">
                                 <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#1d2327]">
                                   <input type="checkbox" checked={link.useMegaMenu || false} onChange={(e) => {
                                      const nl = [...data.navbar.companyLinks];
                                      nl[idx].useMegaMenu = e.target.checked;
                                      updateData("navbar", "companyLinks", nl);
                                   }} className="rounded-sm border-[#8c8f94]" />
                                   Use Services Mega Menu
                                 </label>
                                 <button onClick={() => updateData("navbar", "companyLinks", data.navbar.companyLinks.filter((_:any,i:number)=>i!==idx))} className="text-[#d63638] hover:underline text-[12px] text-left">Remove Parent</button>
                              </div>
                           </div>

                           {/* SUBMENU EDITOR */}
                           <div className="pl-6 border-l-2 border-[#c3c4c7] space-y-4">
                              <div className="flex items-center justify-between">
                                 <span className="text-[11px] font-bold text-[#646970] uppercase tracking-wider">Submenu Items</span>
                                 <button onClick={() => {
                                    const nl = [...data.navbar.companyLinks];
                                    if(!nl[idx].subLinks) nl[idx].subLinks = [];
                                    nl[idx].subLinks.push({ label: "New Sub Item", href: "/", icon: "ChevronRight", pageId: "" });
                                    updateData("navbar", "companyLinks", nl);
                                 }} className="text-[#2271b1] text-[11px] hover:underline font-bold">+ Add Submenu Item</button>
                              </div>
                              <div className="space-y-3">
                                 {(link.subLinks || []).map((sub: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white p-4 border border-[#dcdcde] rounded-sm shadow-sm space-y-3">
                                       <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                                          <PageSelector value={sub.pageId} pages={pages} label="Map Sub Page" onChange={(p) => {
                                             const nl = [...data.navbar.companyLinks];
                                             nl[idx].subLinks[sIdx] = { ...nl[idx].subLinks[sIdx], pageId: p?._id || "", label: p?.title || nl[idx].subLinks[sIdx].label, href: p ? "/"+p.slug : nl[idx].subLinks[sIdx].href };
                                             updateData("navbar", "companyLinks", nl);
                                          }} />
                                          <div className="flex flex-col gap-1">
                                             <label className="text-[11px] font-semibold">Sub Label</label>
                                             <input type="text" value={sub.label} onChange={(e) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].label = e.target.value;
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="border border-[#8c8f94] px-2 py-1 text-[12px] rounded-[3px]" />
                                          </div>
                                          <div className="flex flex-col gap-1">
                                             <label className="text-[11px] font-semibold">Sub Path</label>
                                             <input type="text" value={sub.href} onChange={(e) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].href = e.target.value;
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="border border-[#8c8f94] px-2 py-1 text-[12px] rounded-[3px]" />
                                          </div>
                                          <div className="flex items-center justify-between pt-4">
                                             <IconPicker value={sub.icon || "ChevronRight"} onChange={(v) => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks[sIdx].icon = v;
                                                updateData("navbar", "companyLinks", nl);
                                             }} />
                                             <button onClick={() => {
                                                const nl = [...data.navbar.companyLinks];
                                                nl[idx].subLinks = nl[idx].subLinks.filter((_:any, i:number) => i !== sIdx);
                                                updateData("navbar", "companyLinks", nl);
                                             }} className="text-[#d63638] hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "footer" && (
            <motion.div key="footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Footer Content</h2>
               <SettingsRow label="Footer Logo">
                  <ImageField value={data.footer?.company?.logo || ""} onChange={(val) => updateData("footer", "company", { ...data.footer.company, logo: val })} label="Logo" />
               </SettingsRow>
               <SettingsRow label="Company Name">
                  <input type="text" value={data.footer?.company?.name || ""} onChange={(e) => updateData("footer", "company", { ...data.footer.company, name: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Footer Description">
                  <RichTextEditor 
                    content={data.footer?.company?.description || ""} 
                    onChange={(v) => updateData("footer", "company", { ...data.footer.company, description: v })} 
                  />
               </SettingsRow>
               <SettingsRow label="Marquee Text" description="Add messages for the scrolling bottom bar.">
                  <div className="space-y-2">
                     {(data.footer?.marquee?.texts || []).map((t: string, i: number) => (
                        <div key={i} className="flex gap-2">
                           <input type="text" value={t} onChange={(e) => {
                              const nt = [...data.footer.marquee.texts];
                              nt[i] = e.target.value;
                              updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                           }} className="flex-1 border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           <button onClick={() => {
                              const nt = data.footer.marquee.texts.filter((_:any, idx:number) => idx !== i);
                              updateData("footer", "marquee", { ...data.footer.marquee, texts: nt });
                           }} className="text-[#d63638] text-xs">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateData("footer", "marquee", { ...data.footer.marquee, texts: [...(data.footer.marquee?.texts || []), "New Announcement"] })} className="text-[#2271b1] text-xs underline">+ Add Item</button>
                  </div>
               </SettingsRow>
               <SettingsRow label="Services Menu Title" description="The title for the dynamic services list in the footer.">
                  <input type="text" value={data.footer?.services?.title || "Our Services"} onChange={(e) => updateData("footer", "services", { ...data.footer.services, title: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Selected Footer Services" description="Select which services to display in the footer. If none are selected, all published services will be shown.">
                  <div className="flex flex-wrap gap-2">
                     {pages.filter(p => p.type === 'service').map(service => {
                        const isSelected = data.footer?.services?.selectedServices?.includes(service._id);
                        return (
                           <label key={service._id} className="flex items-center gap-2 bg-[#f6f7f7] border border-[#c3c4c7] px-3 py-1.5 rounded-[3px] text-[13px] cursor-pointer hover:bg-white transition-colors">
                              <input
                                 type="checkbox"
                                 checked={!!isSelected}
                                 onChange={(e) => {
                                    const selected = data.footer?.services?.selectedServices || [];
                                    if (e.target.checked) {
                                       updateData("footer", "services", { ...data.footer.services, selectedServices: [...selected, service._id] });
                                    } else {
                                       updateData("footer", "services", { ...data.footer.services, selectedServices: selected.filter((id: string) => id !== service._id) });
                                    }
                                 }}
                              />
                              {service.title}
                           </label>
                        );
                     })}
                  </div>
               </SettingsRow>
               <SettingsRow label="Certifications">
                  <div className="space-y-4">
                     {(data.footer?.certifications || []).map((cert: any, i: number) => (
                        <div key={i} className="flex gap-4 items-end bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                           <div className="flex-1 space-y-1">
                              <label className="text-[11px] font-bold">Certification Name</label>
                              <input type="text" value={cert.cert || ""} onChange={(e) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].cert = e.target.value;
                                 updateData("footer", "certifications", nc);
                              }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <label className="text-[11px] font-bold">License / Number</label>
                              <input type="text" value={cert.number || ""} onChange={(e) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].number = e.target.value;
                                 updateData("footer", "certifications", nc);
                              }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                           </div>
                           <div className="space-y-1 w-24">
                              <label className="text-[11px] font-bold">Icon</label>
                              <IconPicker value={cert.icon || "ShieldCheck"} onChange={(v) => {
                                 const nc = [...data.footer.certifications];
                                 nc[i].icon = v;
                                 updateData("footer", "certifications", nc);
                              }} />
                           </div>
                           <button onClick={() => {
                              const nc = data.footer.certifications.filter((_:any, idx:number) => idx !== i);
                              updateData("footer", "certifications", nc);
                           }} className="text-[#d63638] text-[13px] mb-1 hover:underline">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateData("footer", "certifications", [...(data.footer.certifications || []), { cert: "New Cert", number: "#123456", icon: "ShieldCheck" }])} className="text-[#2271b1] text-[13px] hover:underline">+ Add Certification</button>
                  </div>
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Global Contact Information</h2>
               <SettingsRow label="Primary Email">
                  <input type="email" value={data.footer?.contact?.email || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, email: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Primary Phone">
                  <input type="text" value={data.footer?.contact?.phone || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, phone: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Office Address">
                  <textarea rows={2} value={data.footer?.contact?.address || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, address: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="24/7 Emergency Text">
                  <input type="text" value={data.footer?.contact?.emergency || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, emergency: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Service Areas">
                  <textarea rows={3} value={data.footer?.contact?.areas || ""} onChange={(e) => updateData("footer", "contact", { ...data.footer.contact, areas: e.target.value })} className="w-full max-w-md border border-[#8c8f94] px-3 py-1.5 text-[14px] rounded-[3px]" />
               </SettingsRow>
               <SettingsRow label="Office Hours">
                  <div className="grid grid-cols-3 gap-2">
                     <div className="space-y-1">
                        <label className="text-[11px] text-[#646970]">Mon-Fri</label>
                        <input type="text" value={data.hours?.monday} onChange={(e) => updateData("hours", "monday", e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[11px] text-[#646970]">Saturday</label>
                        <input type="text" value={data.hours?.saturday} onChange={(e) => updateData("hours", "saturday", e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[11px] text-[#646970]">Sunday</label>
                        <input type="text" value={data.hours?.sunday} onChange={(e) => updateData("hours", "sunday", e.target.value)} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                     </div>
                  </div>
               </SettingsRow>
            </motion.div>
          )}

          {activeTab === "social" && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <h2 className="text-xl font-normal text-[#1d2327] mb-6 font-serif">Social Media Profiles</h2>
               <div className="space-y-4">
                  {(data.footer?.social || []).map((s: any, i: number) => (
                     <div key={i} className="flex gap-4 items-end bg-[#f6f7f7] p-4 border border-[#c3c4c7] rounded-sm">
                        <div className="flex-1 space-y-1">
                           <label className="text-[11px] font-bold">Platform Name</label>
                           <input type="text" value={s.platform} onChange={(e) => {
                              const ns = [...data.footer.social];
                              ns[i].platform = e.target.value;
                              updateData("footer", "social", ns);
                           }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <label className="text-[11px] font-bold">URL</label>
                           <input type="text" value={s.href} onChange={(e) => {
                              const ns = [...data.footer.social];
                              ns[i].href = e.target.value;
                              updateData("footer", "social", ns);
                           }} className="w-full border border-[#8c8f94] px-2 py-1 text-[13px] rounded-[3px]" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[11px] font-bold">Icon</label>
                           <IconPicker value={s.icon} onChange={(v) => {
                              const ns = [...data.footer.social];
                              ns[i].icon = v;
                              updateData("footer", "social", ns);
                           }} />
                        </div>
                        <button onClick={() => updateData("footer", "social", data.footer.social.filter((_:any,idx:number)=>idx!==i))} className="p-2 text-[#d63638] hover:bg-white rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  ))}
                  <button onClick={() => updateData("footer", "social", [...(data.footer?.social || []), { platform: "Facebook", href: "", icon: "Facebook" }])} className="text-[#2271b1] text-xs underline font-bold">+ Add New Social Profile</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-6 border-t border-[#c3c4c7]">
           <button
             onClick={handleSave}
             disabled={saving}
             className="bg-[#2271b1] text-white px-6 py-2 rounded-[3px] text-[13px] font-semibold border border-[#2271b1] hover:bg-[#135e96] hover:border-[#135e96] transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_1px_0_#135e96]"
           >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Save Changes
           </button>
        </div>
      </div>
    </div>
  );
}
