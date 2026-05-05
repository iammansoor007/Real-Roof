"use client";

import { useContent } from "@/hooks/useContent";
import FAQ from "@/components/FAQ";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const { faqPage } = useContent();

  return (
    <main className="min-h-screen bg-background">
      {/* Dynamic Header from FAQ Page Admin */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {faqPage?.badge || "HELP CENTER"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-medium text-foreground mb-6 tracking-tight"
            >
              {faqPage?.title || "Frequently Asked Questions"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              {faqPage?.description || "Find clear answers to common questions about our services, processes, and military-grade standards."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">FAQ</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main FAQ Component with Page Specific Filtering */}
      <FAQ currentPage="faq" hideHeader={true} />

      {/* CTA Section */}
      <section className="py-20 bg-background border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block p-4 rounded-3xl bg-primary/5 mb-6">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-medium mb-4">
            {faqPage?.ctaTitle || "Still have questions?"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {faqPage?.ctaDescription || "Our team is ready to provide the detailed answers you need for your specific project."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={faqPage?.ctaPrimaryLink || "/contact"} 
              className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              {faqPage?.ctaPrimaryText || "Contact Support"}
            </Link>
            <Link 
              href="/estimate" 
              className="px-8 py-4 bg-white border border-primary/20 text-primary rounded-full font-bold hover:bg-primary/5 transition-all"
            >
              Get a Free Estimate
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
