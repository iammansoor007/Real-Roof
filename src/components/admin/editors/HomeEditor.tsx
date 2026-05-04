"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Loader2, Image as ImageIcon, 
  LayoutTemplate, Type, Settings, Star,
  CheckCircle2, List, HelpCircle, Mail, Briefcase, 
  ChevronRight, X
} from "lucide-react";
import dynamic from "next/dynamic";
import ContentSelector from "@/components/admin/ContentSelector";
import IconSelector from "@/components/admin/IconSelector";
import ImageField from "@/components/admin/ImageField";
import BlogSelector from "@/components/admin/BlogSelector";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-[#f6f7f7] animate-pulse border border-[#c3c4c7] rounded-sm flex items-center justify-center text-[#8c8f94] text-xs">Loading Rich Text Editor...</div>
});
import { UI } from "./styles";

export default function HomeEditor({ pageId, data, setData }: { pageId: string, data: any, setData: (d: any) => void }) {
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    if (data && Object.keys(data).length === 0) {
      setData({
        hero: { badge: "", headlines: [{ text: "", highlight: false }], description: "", buttons: [{ text: "", href: "", primary: true }], stats: [], images: [], bgImageAlt: "" },
        about: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: "", image: { src: "", alt: "", badge: "" }, points: [] },
        services: { badge: "", headline: { prefix: "", highlight: "", suffix: "" }, description: [], stats: [], services: [] },
        whyChooseUs: { section: { badge: "", headline: "", description: "" }, features: [], stats: [] },
        portfolio: { section: { badge: "", headline: "" }, projects: [], button: { text: "", link: "" } },
        testimonials: { section: { badge: "", headline: "", featured: "" }, stats: { subscribers: "" }, testimonials: [] },
        faq: { section: { badge: "", headline: "", description: "" }, questions: [] },
        quote: { section: { badge: "", headline: "", description: "" }, success: { title: "", message: "", buttonText: "" }, services: [], timelines: [] }
      });
    }
  }, [data, setData]);

  if (!data) return <div className="flex items-center justify-center h-64"><Loader2 className="w-5 h-5 text-[#2271b1] animate-spin" /></div>;

  const updateSection = (section: string, field: string | null, value: any) => {
    if (field) {
      setData({ ...data, [section]: { ...(data[section] || {}), [field]: value } });
    } else {
      setData({ ...data, [section]: value });
    }
  };

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "whyChooseUs", label: "Value Props" },
    { id: "portfolio", label: "Work" },
    { id: "testimonials", label: "Reviews" },
    { id: "faq", label: "FAQ" },
    { id: "blog", label: "Blog" },
    { id: "quote", label: "Quote Config" },
  ];

  return (
    <div className="bg-white max-w-3xl mx-auto pb-20">
      {/* WP Tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-10 text-[13px] border-b border-[#f0f0f1] pb-1 sticky top-0 bg-white z-10 pt-2">
        {tabs.map((tab: any, idx: number) => (
          <React.Fragment key={tab.id}>
            <button 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-1 py-1 transition-colors ${activeTab === tab.id ? 'text-[#1d2327] font-bold border-b-2 border-[#2271b1]' : 'text-[#2271b1] hover:text-[#135e96]'}`}
            >
              {tab.label}
            </button>
            {idx < tabs.length - 1 && <span className="text-[#c3c4c7] px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          className="space-y-12"
        >
          {/* HERO SECTION */}
          {activeTab === "hero" && (
            <div className="space-y-12">
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Branding</h3>
                  <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.hero?.badge || ""} onChange={(e) => updateSection("hero", "badge", e.target.value)} className={UI.input} /></div>
               </div>
               <div className="space-y-8">
                  <h3 className={UI.sectionHeader}>2. Animated Headline</h3>
                  <div className="space-y-4">
                     {(data.hero?.headlines || []).map((h: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="flex justify-between items-center border-b border-[#f0f0f1] pb-2">
                              <span className="text-[10px] font-bold text-[#646970]">Line #{i+1}</span>
                              <button onClick={() => {
                                 const newH = data.hero.headlines.filter((_: any, idx: number) => idx !== i); updateSection("hero", "headlines", newH);
                              }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <input type="text" value={h.text || ""} onChange={(e) => {
                              const newH = [...data.hero.headlines]; newH[i].text = e.target.value; updateSection("hero", "headlines", newH);
                           }} className={UI.input + " font-bold"} />
                           <label className="flex items-center gap-2 cursor-pointer text-[12px]">
                              <input type="checkbox" checked={h.highlight} onChange={(e) => {
                                 const newH = [...data.hero.headlines]; newH[i].highlight = e.target.checked; updateSection("hero", "headlines", newH);
                              }} /> Highlighted Style
                           </label>
                        </div>
                     ))}
                     <button onClick={() => updateSection("hero", "headlines", [...(data.hero?.headlines || []), { text: "", highlight: false }])} className={UI.buttonAdd}>+ Add Line</button>
                  </div>
               </div>
                <div className="space-y-6">
                   <RichTextEditor 
                      label="3. Description Narrative" 
                      content={data.hero?.description || ""} 
                      onChange={(html) => updateSection("hero", "description", html)} 
                   />
                </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>4. Buttons</h3>
                  <div className="space-y-4">
                     {(data.hero?.buttons || []).map((btn: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="space-y-1.5"><label className={UI.label}>Text</label><input type="text" value={btn.text || ""} onChange={(e) => { const newB = [...data.hero.buttons]; newB[i].text = e.target.value; updateSection("hero", "buttons", newB); }} className={UI.input} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Link</label><input type="text" value={btn.href || ""} onChange={(e) => { const newB = [...data.hero.buttons]; newB[i].href = e.target.value; updateSection("hero", "buttons", newB); }} className={UI.input} /></div>
                           <label className="flex items-center gap-2 cursor-pointer text-[12px]"><input type="checkbox" checked={btn.primary} onChange={(e) => { const newB = [...data.hero.buttons]; newB[i].primary = e.target.checked; updateSection("hero", "buttons", newB); }} /> Primary Style</label>
                           <button onClick={() => { const newB = data.hero.buttons.filter((_: any, idx: number) => idx !== i); updateSection("hero", "buttons", newB); }} className="text-[#d63638] text-[11px] font-bold">Remove Button</button>
                        </div>
                     ))}
                     <button onClick={() => updateSection("hero", "buttons", [...(data.hero?.buttons || []), { text: "", href: "", primary: false }])} className={UI.buttonAdd}>+ Add Button</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>5. Trust Stats</h3>
                  <div className="space-y-4">
                     {(data.hero?.stats || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="space-y-1.5"><label className={UI.label}>Value</label><input type="text" value={s.value || ""} onChange={(e) => { const newS = [...data.hero.stats]; newS[i].value = e.target.value; updateSection("hero", "stats", newS); }} className={UI.inputLarge} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Label</label><input type="text" value={s.label || ""} onChange={(e) => { const newS = [...data.hero.stats]; newS[i].label = e.target.value; updateSection("hero", "stats", newS); }} className={UI.input} /></div>
                           <IconSelector label="Icon" value={s.icon} onChange={(val) => { const newS = [...data.hero.stats]; newS[i].icon = val; updateSection("hero", "stats", newS); }} />
                           <button onClick={() => { const newS = data.hero.stats.filter((_: any, idx: number) => idx !== i); updateSection("hero", "stats", newS); }} className="text-[#d63638] text-[11px] font-bold">Remove Stat</button>
                        </div>
                     ))}
                     <button onClick={() => updateSection("hero", "stats", [...(data.hero?.stats || []), { label: "", value: "", icon: "Shield" }])} className={UI.buttonAdd}>+ Add Stat</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>6. Media</h3>
                  <ImageField label="Background Image" value={data.hero?.images?.[0]} onChange={(url) => { const imgs = [...(data.hero?.images || [])]; imgs[0] = url; updateSection("hero", "images", imgs); }} />
                  <div className="space-y-1.5"><label className={UI.label}>Alt Text</label><input type="text" value={data.hero?.bgImageAlt || ""} onChange={(e) => updateSection("hero", "bgImageAlt", e.target.value)} className={UI.input} /></div>
               </div>
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeTab === "about" && (
            <div className="space-y-10">
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Identity</h3>
                  <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.about?.badge || ""} onChange={(e) => updateSection("about", "badge", e.target.value)} className={UI.input} /></div>
                  <div className="space-y-4">
                     <label className={UI.label}>Headline (Structured)</label>
                     <div className="space-y-2">
                        <input type="text" value={data.about?.headline?.prefix || ""} onChange={(e) => updateSection("about", "headline", { ...(data.about?.headline || {}), prefix: e.target.value })} className={UI.input} placeholder="Prefix" />
                        <input type="text" value={data.about?.headline?.highlight || ""} onChange={(e) => updateSection("about", "headline", { ...(data.about?.headline || {}), highlight: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} placeholder="Highlighted" />
                        <input type="text" value={data.about?.headline?.suffix || ""} onChange={(e) => updateSection("about", "headline", { ...(data.about?.headline || {}), suffix: e.target.value })} className={UI.input} placeholder="Suffix" />
                     </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>2. Brand Narrative</h3>
                  <RichTextEditor 
                     label="2. Brand Narrative" 
                     content={data.about?.description || ""} 
                     onChange={(html) => updateSection("about", "description", html)} 
                  />
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>3. Action Buttons</h3>
                  <div className="space-y-4">
                     {(data.about?.buttons || []).map((btn: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                              <span className="text-[10px] font-bold text-[#646970] uppercase">Button #{i+1}</span>
                              <button onClick={() => { const newB = data.about.buttons.filter((_: any, idx: number) => idx !== i); updateSection("about", "buttons", newB); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <div className="space-y-1.5"><label className={UI.label}>Text</label><input type="text" value={btn.text || ""} onChange={(e) => { const newB = [...data.about.buttons]; newB[i].text = e.target.value; updateSection("about", "buttons", newB); }} className={UI.input} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Link</label><input type="text" value={btn.href || ""} onChange={(e) => { const newB = [...data.about.buttons]; newB[i].href = e.target.value; updateSection("about", "buttons", newB); }} className={UI.input} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Icon Name</label><input type="text" value={btn.icon || ""} onChange={(e) => { const newB = [...data.about.buttons]; newB[i].icon = e.target.value; updateSection("about", "buttons", newB); }} className={UI.input} placeholder="e.g. ArrowRight" /></div>
                           <label className="flex items-center gap-2 cursor-pointer text-[12px]"><input type="checkbox" checked={btn.primary || false} onChange={(e) => { const newB = [...data.about.buttons]; newB[i].primary = e.target.checked; updateSection("about", "buttons", newB); }} /> Primary Style</label>
                        </div>
                     ))}
                     <button onClick={() => updateSection("about", "buttons", [...(data.about?.buttons || []), { text: "", href: "", primary: false, icon: "ArrowRight" }])} className={UI.buttonAdd}>+ Add Button</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>4. Stats</h3>
                  <div className="space-y-4">
                     {(data.about?.stats || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                              <span className="text-[10px] font-bold text-[#646970] uppercase">Stat #{i+1}</span>
                              <button onClick={() => { const newS = data.about.stats.filter((_: any, idx: number) => idx !== i); updateSection("about", "stats", newS); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <div className="space-y-1.5"><label className={UI.label}>Value</label><input type="number" value={s.value || 0} onChange={(e) => { const newS = [...data.about.stats]; newS[i].value = parseInt(e.target.value); updateSection("about", "stats", newS); }} className={UI.inputLarge} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Suffix (e.g. +, %)</label><input type="text" value={s.suffix || ""} onChange={(e) => { const newS = [...data.about.stats]; newS[i].suffix = e.target.value; updateSection("about", "stats", newS); }} className={UI.input} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Label</label><input type="text" value={s.label || ""} onChange={(e) => { const newS = [...data.about.stats]; newS[i].label = e.target.value; updateSection("about", "stats", newS); }} className={UI.input} /></div>
                        </div>
                     ))}
                     <button onClick={() => updateSection("about", "stats", [...(data.about?.stats || []), { value: 0, suffix: "+", label: "" }])} className={UI.buttonAdd}>+ Add Stat</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>5. Trust Badges</h3>
                  <div className={UI.card + " space-y-4"}>
                     <div className="space-y-1.5"><label className={UI.label}>Happy Clients Count</label><input type="number" value={data.about?.trustBadges?.happyClients || 0} onChange={(e) => updateSection("about", "trustBadges", { ...(data.about?.trustBadges || {}), happyClients: parseInt(e.target.value) })} className={UI.inputLarge} /></div>
                     <div className="space-y-1.5"><label className={UI.label}>Emergency Availability</label><input type="text" value={data.about?.trustBadges?.emergency || ""} onChange={(e) => updateSection("about", "trustBadges", { ...(data.about?.trustBadges || {}), emergency: e.target.value })} className={UI.input} placeholder="e.g. 24/7" /></div>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>6. Core Values</h3>
                  <div className="space-y-3">
                     {(data.about?.coreValues || []).map((v: string, i: number) => (
                        <div key={i} className="flex gap-2">
                           <input type="text" value={v} onChange={(e) => { const newV = [...data.about.coreValues]; newV[i] = e.target.value; updateSection("about", "coreValues", newV); }} className={UI.input} />
                           <button onClick={() => { const newV = data.about.coreValues.filter((_: any, idx: number) => idx !== i); updateSection("about", "coreValues", newV); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     ))}
                     <button onClick={() => updateSection("about", "coreValues", [...(data.about?.coreValues || []), ""])} className="text-[#2271b1] text-[12px] font-bold uppercase">+ Add Value</button>
                  </div>
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>7. Media</h3>
                  <ImageField label="Section Image" value={data.about?.image?.src || ""} onChange={(url) => updateSection("about", "image", { ...(data.about?.image || {}), src: url })} />
                  <div className="space-y-1.5"><label className={UI.label}>Alt Text</label><input type="text" value={data.about?.image?.alt || ""} onChange={(e) => updateSection("about", "image", { ...(data.about?.image || {}), alt: e.target.value })} className={UI.input} /></div>
                  <div className="space-y-1.5"><label className={UI.label}>Floating Badge</label><input type="text" value={data.about?.image?.badge || ""} onChange={(e) => updateSection("about", "image", { ...(data.about?.image || {}), badge: e.target.value })} className={UI.input} /></div>
               </div>
            </div>
          )}

          {/* SERVICES SECTION */}
          {activeTab === "services" && (
            <div className="space-y-12">
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Intro</h3>
                  <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.services?.badge || ""} onChange={(e) => updateSection("services", "badge", e.target.value)} className={UI.input} /></div>
                  <div className="space-y-2">
                     <input type="text" value={data.services?.headline?.prefix || ""} onChange={(e) => updateSection("services", "headline", { ...(data.services?.headline || {}), prefix: e.target.value })} className={UI.input} />
                     <input type="text" value={data.services?.headline?.highlight || ""} onChange={(e) => updateSection("services", "headline", { ...(data.services?.headline || {}), highlight: e.target.value })} className={UI.input + " font-bold border-[#2271b1]"} />
                     <input type="text" value={data.services?.headline?.suffix || ""} onChange={(e) => updateSection("services", "headline", { ...(data.services?.headline || {}), suffix: e.target.value })} className={UI.input} />
                  </div>
                  <RichTextEditor 
                     label="Description Narrative" 
                     content={Array.isArray(data.services?.description) ? data.services.description.join("") : (data.services?.description || "")} 
                     onChange={(html) => updateSection("services", "description", html)} 
                  />
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>2. Metrics</h3>
                  <div className="space-y-4">
                     {(data.services?.stats || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-3"}>
                           <div className="space-y-1.5"><label className={UI.label}>Value</label><input type="number" value={s.value || 0} onChange={(e) => { const newS = [...data.services.stats]; newS[i].value = parseInt(e.target.value); updateSection("services", "stats", newS); }} className={UI.inputLarge} /></div>
                           <div className="space-y-1.5"><label className={UI.label}>Label</label><input type="text" value={s.label || ""} onChange={(e) => { const newS = [...data.services.stats]; newS[i].label = e.target.value; updateSection("services", "stats", newS); }} className={UI.input} /></div>
                           <button onClick={() => { const newS = data.services.stats.filter((_: any, idx: number) => idx !== i); updateSection("services", "stats", newS); }} className="text-[#d63638] text-[11px] font-bold">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateSection("services", "stats", [...(data.services?.stats || []), { value: 0, label: "" }])} className={UI.buttonAdd}>+ Add Metric</button>
                  </div>
               </div>
               <div className="space-y-6 pt-10 border-t border-[#f0f0f1]">
                  <h3 className={UI.sectionHeader}>3. Selection</h3>
                  <ContentSelector type="services" label="Featured Services" selectedItems={data.services?.services} onSelect={(items) => updateSection("services", "services", items)} />
               </div>
            </div>
          )}

          {/* WHY CHOOSE US */}
          {activeTab === "whyChooseUs" && (
            <div className="space-y-12">
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Narrative</h3>
                  <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.whyChooseUs?.section?.badge || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), badge: e.target.value })} className={UI.input} /></div>
                  <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.whyChooseUs?.section?.headline || ""} onChange={(e) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), headline: e.target.value })} className={UI.inputLarge} /></div>
                  <RichTextEditor 
                     label="Intro Narrative" 
                     content={data.whyChooseUs?.section?.description || ""} 
                     onChange={(html) => updateSection("whyChooseUs", "section", { ...(data.whyChooseUs?.section || {}), description: html })} 
                  />
               </div>
               <div className="space-y-8">
                  <h3 className={UI.sectionHeader}>2. Features</h3>
                  <div className="space-y-4">
                     {(data.whyChooseUs?.features || []).map((f: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-4"}>
                           <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                              <span className="text-[10px] font-bold">Feature #{i+1}</span>
                              <button onClick={() => { const newF = data.whyChooseUs.features.filter((_: any, idx: number) => idx !== i); updateSection("whyChooseUs", "features", newF); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                           </div>
                           <IconSelector label="Icon" value={f.icon || ""} onChange={(val) => { const newF = [...data.whyChooseUs.features]; newF[i].icon = val; updateSection("whyChooseUs", "features", newF); }} />
                           <input type="text" value={f.title || ""} onChange={(e) => { const newF = [...data.whyChooseUs.features]; newF[i].title = e.target.value; updateSection("whyChooseUs", "features", newF); }} className={UI.input + " font-bold"} placeholder="Title" />
                           <RichTextEditor 
                              label="Feature Detail" 
                              content={f.description} 
                              onChange={(html) => { const newF = [...data.whyChooseUs.features]; newF[i].description = html; updateSection("whyChooseUs", "features", newF); }} 
                           />
                        </div>
                     ))}
                     <button onClick={() => updateSection("whyChooseUs", "features", [...(data.whyChooseUs?.features || []), { title: "", description: "", icon: "Star" }])} className={UI.buttonAdd}>+ Add Feature</button>
                  </div>
               </div>
               <div className="space-y-6 pt-10 border-t border-[#f0f0f1]">
                  <h3 className={UI.sectionHeader}>3. Metrics</h3>
                  <div className="space-y-4">
                     {(data.whyChooseUs?.stats || []).map((s: any, i: number) => (
                        <div key={i} className={UI.card + " space-y-3"}>
                           <input type="text" value={s.value || ""} onChange={(e) => { const newS = [...data.whyChooseUs.stats]; newS[i].value = e.target.value; updateSection("whyChooseUs", "stats", newS); }} className={UI.inputLarge} />
                           <input type="text" value={s.label || ""} onChange={(e) => { const newS = [...data.whyChooseUs.stats]; newS[i].label = e.target.value; updateSection("whyChooseUs", "stats", newS); }} className={UI.input} />
                           <button onClick={() => { const newS = data.whyChooseUs.stats.filter((_: any, idx: number) => idx !== i); updateSection("whyChooseUs", "stats", newS); }} className="text-[#d63638] text-[11px] font-bold">Remove</button>
                        </div>
                     ))}
                     <button onClick={() => updateSection("whyChooseUs", "stats", [...(data.whyChooseUs?.stats || []), { value: "", label: "" }])} className={UI.buttonAdd}>+ Add Metric</button>
                  </div>
               </div>
            </div>
          )}

          {/* PORTFOLIO SECTION */}
          {activeTab === "portfolio" && (
             <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>1. Branding</h3>
                   <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.portfolio?.section?.badge || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), badge: e.target.value })} className={UI.input} /></div>
                   <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.portfolio?.section?.headline || ""} onChange={(e) => updateSection("portfolio", "section", { ...(data.portfolio?.section || {}), headline: e.target.value })} className={UI.inputLarge} /></div>
                </div>
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>2. Work Selection</h3>
                   <ContentSelector type="projects" label="Featured Projects" selectedItems={data.portfolio?.projects} onSelect={(items) => updateSection("portfolio", "projects", items)} />
                </div>
                <div className="space-y-6 pt-10 border-t border-[#f0f0f1]">
                   <h3 className={UI.sectionHeader}>3. Button</h3>
                   <div className="space-y-4">
                      <div className="space-y-1.5"><label className={UI.label}>Text</label><input type="text" value={data.portfolio?.button?.text || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), text: e.target.value })} className={UI.input} /></div>
                      <div className="space-y-1.5"><label className={UI.label}>Link</label><input type="text" value={data.portfolio?.button?.link || ""} onChange={(e) => updateSection("portfolio", "button", { ...(data.portfolio?.button || {}), link: e.target.value })} className={UI.input} /></div>
                   </div>
                </div>
             </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === "testimonials" && (
             <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>1. Branding</h3>
                   <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.testimonials?.section?.badge || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), badge: e.target.value })} className={UI.input} /></div>
                   <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.testimonials?.section?.headline || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), headline: e.target.value })} className={UI.inputLarge} /></div>
                   <div className="space-y-1.5"><label className={UI.label}>Seal Text</label><input type="text" value={data.testimonials?.section?.featured || ""} onChange={(e) => updateSection("testimonials", "section", { ...(data.testimonials?.section || {}), featured: e.target.value })} className={UI.input} /></div>
                </div>
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>2. Selection</h3>
                   <ContentSelector type="reviews" label="Client Reviews" selectedItems={data.testimonials?.testimonials} onSelect={(items) => updateSection("testimonials", "testimonials", items)} />
                </div>
                <div className="space-y-6 pt-10 border-t border-[#f0f0f1]">
                   <h3 className={UI.sectionHeader}>3. Global Metric</h3>
                   <div className="space-y-1.5"><label className={UI.label}>Happy Client Count</label><input type="text" value={data.testimonials?.stats?.subscribers || ""} onChange={(e) => updateSection("testimonials", "stats", { ...(data.testimonials?.stats || {}), subscribers: e.target.value })} className={UI.inputLarge} /></div>
                </div>
             </div>
          )}

          {/* FAQ SECTION */}
          {activeTab === "faq" && (
             <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>1. Header</h3>
                   <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.faq?.section?.badge || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), badge: e.target.value })} className={UI.input} /></div>
                   <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.faq?.section?.headline || ""} onChange={(e) => updateSection("faq", "section", { ...(data.faq?.section || {}), headline: e.target.value })} className={UI.inputLarge} /></div>
                   <RichTextEditor 
                      label="Intro Narrative" 
                      content={data.faq?.section?.description || ""} 
                      onChange={(html) => updateSection("faq", "section", { ...(data.faq?.section || {}), description: html })} 
                   />
                </div>
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>2. Questions</h3>
                   <ContentSelector type="faq" label="Featured Questions" selectedItems={data.faq?.questions} onSelect={(items) => updateSection("faq", "questions", items)} />
                </div>
             </div>
          )}

          {/* QUOTE SECTION */}
          {activeTab === "quote" && (
             <div className="space-y-12">
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>1. Narrative</h3>
                   <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.quote?.section?.badge || ""} onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), badge: e.target.value })} className={UI.input} /></div>
                   <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.quote?.section?.headline || ""} onChange={(e) => updateSection("quote", "section", { ...(data.quote?.section || {}), headline: e.target.value })} className={UI.inputLarge} /></div>
                   <RichTextEditor 
                      label="Intro Narrative" 
                      content={data.quote?.section?.description || ""} 
                      onChange={(html) => updateSection("quote", "section", { ...(data.quote?.section || {}), description: html })} 
                   />
                </div>
                <div className="space-y-6">
                   <h3 className={UI.sectionHeader}>2. Success State</h3>
                   <div className={UI.card + " space-y-4"}>
                      <div className="space-y-1.5"><label className={UI.label}>Title</label><input type="text" value={data.quote?.success?.title || ""} onChange={(e) => updateSection("quote", "success", { ...(data.quote?.success || {}), title: e.target.value })} className={UI.input} /></div>
                      <div className="space-y-1.5">
                         <label className={UI.label}>Message</label>
                         <RichTextEditor 
                            content={data.quote?.success?.message || ""} 
                            onChange={(html) => updateSection("quote", "success", { ...(data.quote?.success || {}), message: html })} 
                         />
                      </div>
                      <div className="space-y-1.5"><label className={UI.label}>Button Text</label><input type="text" value={data.quote?.success?.buttonText || ""} onChange={(e) => updateSection("quote", "success", { ...(data.quote?.success || {}), buttonText: e.target.value })} className={UI.input} /></div>
                   </div>
                </div>
                <div className="space-y-8 pt-10 border-t border-[#f0f0f1]">
                   <h3 className={UI.sectionHeader}>3. Options</h3>
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <label className={UI.label}>Project Types</label>
                         <div className="space-y-2">
                           {(data.quote?.services || []).map((s: any, i: number) => (
                             <div key={i} className="flex gap-2 bg-[#f6f7f7] p-2 border border-[#c3c4c7]">
                                <input type="text" value={s.title || ""} onChange={(e) => { const newS = [...data.quote.services]; newS[i].title = e.target.value; updateSection("quote", "services", newS); }} className="flex-1 bg-transparent border-none text-[13px] font-bold outline-none" />
                                <button onClick={() => { const newS = data.quote.services.filter((_: any, idx: number) => idx !== i); updateSection("quote", "services", newS); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                             </div>
                           ))}
                           <button onClick={() => updateSection("quote", "services", [...(data.quote?.services || []), { title: "New Service", id: Date.now() }])} className="text-[#2271b1] text-[12px] font-bold">+ Add Service</button>
                         </div>
                      </div>
                      <div className="space-y-4 border-t border-[#f0f0f1] pt-6">
                         <label className={UI.label}>Timelines</label>
                         <div className="space-y-2">
                           {(data.quote?.timelines || []).map((t: any, i: number) => (
                             <div key={i} className="flex gap-2 bg-[#f6f7f7] p-2 border border-[#c3c4c7]">
                                <input type="text" value={t.label || ""} onChange={(e) => { const newT = [...data.quote.timelines]; newT[i].label = e.target.value; updateSection("quote", "timelines", newT); }} className="flex-1 bg-transparent border-none text-[13px] font-bold outline-none" />
                                <button onClick={() => { const newT = data.quote.timelines.filter((_: any, idx: number) => idx !== i); updateSection("quote", "timelines", newT); }} className="text-[#d63638]"><Trash2 className="w-4 h-4" /></button>
                             </div>
                           ))}
                           <button onClick={() => updateSection("quote", "timelines", [...(data.quote?.timelines || []), { label: "Immediate", value: "immediate" }])} className="text-[#2271b1] text-[12px] font-bold">+ Add Timeline</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* BLOG SECTION */}
          {activeTab === "blog" && (
            <div className="space-y-12">
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>1. Header</h3>
                  <div className="space-y-1.5"><label className={UI.label}>Badge</label><input type="text" value={data.blogSection?.subtitle || ""} onChange={(e) => updateSection("blogSection", "subtitle", e.target.value)} className={UI.input} /></div>
                  <div className="space-y-1.5"><label className={UI.label}>Headline</label><input type="text" value={data.blogSection?.title || ""} onChange={(e) => updateSection("blogSection", "title", e.target.value)} className={UI.inputLarge} /></div>
                  <RichTextEditor 
                     label="Description Narrative" 
                     content={data.blogSection?.description || ""} 
                     onChange={(html) => updateSection("blogSection", "description", html)} 
                  />
               </div>
               <div className="space-y-6">
                  <h3 className={UI.sectionHeader}>2. Selected Posts</h3>
                  <BlogSelector 
                   selectedIds={data.blogSection?.selectedPosts || []} 
                   onChange={(ids) => updateSection("blogSection", "selectedPosts", ids)} 
                  />
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
