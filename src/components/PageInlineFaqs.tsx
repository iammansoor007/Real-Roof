"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import RichTextRenderer from "./ui/RichTextRenderer";

export default function PageInlineFaqs({ faqs }: { faqs?: any[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="relative bg-background py-20 md:py-24 lg:py-28 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
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
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-6 rounded-full" />
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = openFaq === idx;
            return (
              <FaqItem
                key={idx}
                item={faq}
                index={idx}
                isOpen={isOpen}
                onToggle={() => setOpenFaq(isOpen ? null : idx)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ item, index, isOpen, onToggle }: { item: any; index: number; isOpen: boolean; onToggle: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(50);
    mouseY.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="relative group"
    >
      {/* Liquid gradient background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#liquidGradient)"
          opacity={isHovered ? 0.08 : 0.03}
          style={{
            x: useTransform(springX, [0, 100], [-5, 5]),
            y: useTransform(springY, [0, 100], [-5, 5]),
          }}
          transition={{ duration: 0.2 }}
        />
        <defs>
          <radialGradient id="liquidGradient">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </radialGradient>
        </defs>
      </svg>

      {/* Number indicator */}
      <motion.div
        className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        animate={isHovered ? {
          x: -5,
          scale: 1.1,
          opacity: 0.8
        } : {
          x: 0,
          scale: 1,
          opacity: 0.4
        }}
        transition={{ duration: 0.2 }}
      >
        <span className={`
          text-[90px] font-black leading-none tracking-tighter
          ${isOpen ? 'text-primary/15' : 'text-muted-foreground/20'}
          transition-colors duration-300
        `}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      {/* Main card */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`
          relative bg-card/90 backdrop-blur-sm rounded-2xl
          border transition-all duration-300
          ${isOpen
            ? 'border-primary/30 shadow-2xl shadow-primary/15'
            : 'border-primary/10 hover:border-primary/20 shadow-lg shadow-primary/5'
          }
        `}
      >
        {/* Animated border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.rect
            x="2"
            y="2"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="1.2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isHovered ? {
              pathLength: 1,
              opacity: 0.6
            } : {
              pathLength: 0,
              opacity: 0
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary)/80)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Corner accents */}
        <motion.div
          className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2"
          animate={isHovered ? {
            width: 14,
            height: 14,
            borderColor: 'hsl(var(--primary)/0.5)'
          } : {
            width: 24,
            height: 24,
            borderColor: 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2"
          animate={isHovered ? {
            width: 14,
            height: 14,
            borderColor: 'hsl(var(--primary)/0.5)'
          } : {
            width: 24,
            height: 24,
            borderColor: 'hsl(var(--primary)/0.2)'
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Button */}
        <button
          onClick={onToggle}
          className="w-full text-left p-7 md:p-9 focus:outline-none relative z-10"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between gap-6">
            <h3 className={`
              text-base md:text-lg lg:text-xl font-light transition-all duration-300
              ${isOpen
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 font-medium'
                : 'text-card-foreground group-hover:text-card-foreground/90'
              }
            `}>
              {item.question}
            </h3>

            {/* Toggle button */}
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
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full border-2
                  flex items-center justify-center
                  transition-all duration-300
                `}
              >
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                >
                  <motion.path
                    d={isOpen ? "M5 12h14" : "M12 5v14M5 12h14"}
                    stroke={isOpen ? 'white' : isHovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    animate={isOpen ? {
                      d: "M5 12h14"
                    } : {
                      d: "M12 5v14M5 12h14"
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.svg>
              </motion.div>

              {/* Pulse ring when open */}
              {isOpen && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>
          </div>
        </button>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="overflow-hidden"
            >
              <div className="px-7 md:px-9 pb-7 md:pb-9">
                <div className="relative pl-6 border-l-2 border-primary/20">
                  <RichTextRenderer
                    content={item.answer}
                    className="text-muted-foreground text-sm md:text-base leading-relaxed"
                    stripParagraphs={true}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}