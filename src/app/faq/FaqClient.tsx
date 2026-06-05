"use client";

import { useContent } from "@/hooks/useContent";
import FAQ from "@/components/FAQ";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const PageBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-primary/5 to-transparent" />
    <motion.div
      animate={{
        x: [0, 20, 0, -20, 0],
        y: [0, -15, 25, 15, 0],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-40 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
    />
  </div>
);

const FloatingParticles = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {isInView && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default function FAQPage() {
  const { faqPage } = useContent();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Unified Page-Wide Background & Decorative Elements */}
      <PageBackground />
      <FloatingParticles />

      {/* Header section (transparent background, sitting above the decorative layer) */}
      <section className="relative pt-32 pb-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {faqPage?.badge || "HELP CENTER"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-bold text-foreground mb-6 tracking-tight"
            >
              {faqPage?.title || "Frequently Asked Questions"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {faqPage?.description || "Find clear answers to common questions about our services, processes, and elite quality standards."}
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Accordions Section (with transparent background setting to inherit the page-wide decorative layer) */}
      <div className="relative z-10 pb-24">
        <FAQ currentPage="faq" hideHeader={true} hideBackground={true} />
      </div>
    </main>
  );
}
