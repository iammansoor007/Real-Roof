"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Icon } from "../../config/icons";
import { useContent } from "../../hooks/useContent";
import RichTextRenderer from "../ui/RichTextRenderer";

const AccordionItem = ({ item, index, isOpen, onToggle }: any) => {
    const itemRef = useRef(null);
    const isInView = useInView(itemRef, { once: true, margin: "-30px" });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            ref={itemRef}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`
                    relative bg-card rounded-2xl
                    border transition-all duration-300
                    ${isOpen
                        ? 'border-primary/30 shadow-2xl shadow-primary/15'
                        : 'border-primary/10 hover:border-primary/20 shadow-lg shadow-primary/5'
                    }
                `}
            >
                <button
                    onClick={onToggle}
                    className="w-full text-left p-6 sm:p-8 focus:outline-none relative z-10"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center justify-between gap-6">
                        <h3 className={`
                            text-base sm:text-lg lg:text-xl font-light transition-all duration-300
                            ${isOpen
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 font-medium'
                                : 'text-card-foreground group-hover:text-card-foreground/90'
                            }
                        `}>
                            {item.question}
                        </h3>

                        <div className="relative flex-shrink-0">
                            <motion.div
                                animate={isOpen ? {
                                    rotate: 180,
                                    scale: 1.1,
                                    backgroundColor: 'hsl(var(--primary))',
                                    borderColor: 'hsl(var(--primary))',
                                } : {
                                    rotate: 0,
                                    scale: 1,
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                }}
                                transition={{ duration: 0.3 }}
                                className={`
                                    w-10 h-10 rounded-full border-2
                                    flex items-center justify-center
                                    transition-all duration-300
                                    ${isOpen ? 'bg-primary border-primary text-white' : 'bg-background text-muted-foreground'}
                                `}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform">
                                    <path
                                        d={isOpen ? "M5 12h14" : "M12 5v14M5 12h14"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                </button>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                                <div className="relative pl-6 border-l-2 border-primary/20 text-muted-foreground text-sm sm:text-base leading-relaxed">
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
    // The page editor stores FAQs in content.faqs (simple list) or content.faq.items (structured)
    const pageFaqs = pageData?.faqs || pageData?.content?.faqs || pageData?.content?.faq?.items;
    const faq = pageFaqs ? { ...globalFaq, items: pageFaqs } : globalFaq;
    const { section, items = [] } = faq || {};

    const filteredItems = useMemo(() => {
        return items.filter((item: any) => activeCategory === 'all' || item.category === activeCategory);
    }, [items, activeCategory]);

    return (
        <section className="relative bg-background py-8 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center">
                    {section?.badge && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                {section.badge}
                            </span>
                        </div>
                    )}
                    <h1 className="text-4xl sm:text-7xl font-bold text-foreground mb-6 tracking-tight">
                        {section?.headline || "Frequently Asked Questions"}
                    </h1>
                    <div className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        <RichTextRenderer content={section?.description} />
                    </div>
                </div>
                <div className="space-y-4 max-w-4xl mx-auto">
                    {filteredItems.map((item: any, index: number) => (
                        <AccordionItem
                            key={index}
                            item={item}
                            index={index}
                            isOpen={openItems.includes(index)}
                            onToggle={() => setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
