"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import RichTextRenderer from "./ui/RichTextRenderer";

export default function PageInlineFaqs({ faqs }: { faqs?: any[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-6" />
        </div>
        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative group"
              >
                <div className={`relative bg-card/90 backdrop-blur-sm rounded-xl border transition-all duration-300 ${isOpen ? 'border-primary/40 shadow-2xl shadow-primary/10' : 'border-primary/10 hover:border-primary/25 shadow-lg'}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full text-left p-6 sm:p-8 focus:outline-none relative z-10">
                    <div className="flex items-center justify-between gap-6">
                      <h3 className={`text-sm sm:text-lg lg:text-xl font-semibold transition-all duration-300 ${isOpen ? 'text-primary' : 'text-foreground'}`}>{faq.question}</h3>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'border-border bg-background'}`}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-8 pb-8">
                           <div className="text-muted-foreground text-sm sm:text-base leading-relaxed [&>p]:m-0">
                             <RichTextRenderer content={faq.answer} stripParagraphs={true} />
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
