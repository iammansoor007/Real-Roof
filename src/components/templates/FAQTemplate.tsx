"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import RichTextRenderer from "../ui/RichTextRenderer";

const AccordionItem = ({ item, index, isOpen, onToggle, searchHighlight }: any) => {
    const itemRef = useRef(null);
    const isInView = useInView(itemRef, { once: true, margin: "-30px" });
    const highlightText = (text: string, query?: string) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) => part.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark> : part);
    };

    return (
        <motion.div ref={itemRef} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="relative group">
            <div className={`relative bg-card rounded-2xl border transition-all ${isOpen ? 'border-primary shadow-xl' : 'border-primary/10 shadow-lg'}`}>
                <button onClick={onToggle} className="w-full text-left p-7 focus:outline-none">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className={`text-lg font-medium ${isOpen ? 'text-primary' : 'text-card-foreground'}`}>
                                {searchHighlight ? highlightText(item.question, searchHighlight) : item.question}
                            </h3>
                        </div>
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${isOpen ? 'bg-primary text-white' : 'bg-background'}`}>
                            {isOpen ? '-' : '+'}
                        </div>
                    </div>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                             <div className="px-7 pb-7">
                                 <div className="text-muted-foreground leading-relaxed">
                                     <RichTextRenderer content={item.answer} stripParagraphs={true} />
                                 </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default function FAQTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { faq: globalFaq } = useContent();
    const [openItems, setOpenItems] = useState<number[]>([0]);
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Use page-specific FAQs if provided (e.g. from dynamic pages), otherwise fallback to global
    // The page editor stores FAQs in content.faqs; support both locations
    const pageFaqs = pageData?.faqs || pageData?.content?.faqs;
    const faq = pageFaqs ? { ...globalFaq, items: pageFaqs } : globalFaq;
    const { section, items = [] } = faq || {};

    const filteredItems = useMemo(() => {
        return items.filter((item: any) => activeCategory === 'all' || item.category === activeCategory);
    }, [items, activeCategory]);

    return (
        <section className="relative bg-background py-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-6xl font-medium mb-4">{section?.headline}</h2>
                     <div className="text-muted-foreground text-lg">
                        <RichTextRenderer content={section?.description} />
                     </div>
                </div>
                <div className="space-y-4">
                    {filteredItems.map((item: any, index: number) => (
                        <AccordionItem key={index} item={item} index={index} isOpen={openItems.includes(index)} onToggle={() => setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])} />
                    ))}
                </div>
            </div>
        </section>
    );
}
