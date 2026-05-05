"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion';
import {
  Home, Layout, TreePine, Building2, Building, Droplets,
  CheckCircle, ArrowRight, Phone, Clock, Shield, Award,
  ChevronRight, Star, ThumbsUp, Truck,
  ChevronDown, ArrowUpRight, Users, Trophy, Loader2,
  FileText, ClipboardCheck, Hammer, Minus, Plus, Sparkles, Zap, Palette, Sun, Snowflake,
  ShieldCheck, BadgeCheck, TrendingUp, Check, Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer,
  Shovel, Fence, Drill, Square, Box, Construction, PenTool as Tool,
  Map, MapPin, Search, Settings, Mail, Globe, Layers,
  Warehouse, Factory, Store, Landmark, Castle, Mountain, Trees,
  Droplet, FlameKindling, Lightbulb, Power
} from 'lucide-react';
import { notFound } from 'next/navigation';
import breakcrumb from '@/assets/Breadcrumb-Image.jpeg';
import { useContent } from "../../hooks/useContent";
import RichTextRenderer from "../ui/RichTextRenderer";
import BlogSection from "../sections/BlogSection";

import roofingImg from '@/assets/roof1.jpg.jpeg';
import windowsImg from '@/assets/window5.jpeg';
import decksImg from '@/assets/outdoor-sitting-desk.png';
import commercialImg from '@/assets/commercial-tpo.png';
import sidingImg from '@/assets/siding5.jpg.jpeg';
import gutter from '@/assets/gutterinstallation.jpg.jpeg';
import pvcdecks from '@/assets/pvcdecks.jpg.jpeg';

const iconMap: Record<string, any> = {
  Home, Layout, TreePine, Building2, Building, Droplets,
  Shield, Trophy, Users, ThumbsUp, FileText, ClipboardCheck,
  Truck, Hammer, CheckCircle, Award, Clock, Sparkles, Zap, Palette, Sun, Snowflake, Star,
  ShieldCheck, BadgeCheck, TrendingUp, Check, Wrench, HardHat, Ruler, Paintbrush, Wind, Flame, Thermometer,
  Shovel, Fence, Drill, Square, Box, Construction, Tool,
  Map, MapPin, Search, Settings, Phone, Mail, Globe, Layers,
  Warehouse, Factory, Store, Landmark, Castle, Mountain, Trees,
  Droplet, FlameKindling, Lightbulb, Power
};

const imageMap: Record<string, any> = {
  'Residential Roofing': roofingImg,
  'Windows & Doors': windowsImg,
  'Custom Decks': decksImg,
  'Commercial Roofing': commercialImg,
  'Siding, Soffit & Fascia': sidingImg,
  'Gutters & Protection': gutter,
  'PVC Decking': pvcdecks
};

// --- Counter Component ---
const Counter = ({ value, suffix = "", duration = 2, start = false }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (start) {
      let startTime: number | undefined;
      const animate = (timestamp: any) => {
        if (startTime === undefined) startTime = timestamp;
        const progress = Math.min((timestamp - startTime!) / (duration * 1000), 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easedProgress * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [start, value, duration]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// --- StatCard Component ---
const StatCard = ({ stat, index }: any) => {
  const cardRef = useRef<any>(null);
  const inView = useInView(cardRef, { once: true, margin: "50px" });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: any) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const StatIcon = iconMap[stat.icon] || Shield;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative group lg:px-2"
    >
      <div className="relative h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-8 overflow-hidden transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-primary/30 group-hover:shadow-[0_20px_50px_rgba(36,48,210,0.15)]">
        <div className="absolute -inset-24 bg-primary/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="icon-container w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:!bg-primary group-hover:!border-primary transition-all duration-300">
              <StatIcon className="icon w-5 h-5 sm:w-6 sm:h-6 !text-primary group-hover:!text-white transition-all duration-300" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="text-2xl xs:text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              <Counter
                value={parseInt(stat.value?.toString().replace(/[^0-9]/g, '') || "0")}
                suffix={stat.value?.toString().includes('%') ? '%' : (stat.value?.toString().includes('+') ? '+' : '')}
                start={inView}
              />
            </h3>
            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {stat.label}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Process Card Component ---
const ProcessCard = ({ step, index }: { step: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });
  const StepIcon = iconMap[step.icon] || Shield;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative group h-full"
    >
      <div className="relative h-full bg-card/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border/50 p-6 sm:p-10 flex flex-col z-10 overflow-hidden hover:border-primary/30 transition-all duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-8 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
          <StepIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Phase {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
        <RichTextRenderer
          content={step.description}
          className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-1"
        />
      </div>
    </motion.div>
  );
};

// --- Benefit Card Component ---
const BenefitCard = ({ benefit, index }: { benefit: any, index: number }) => {
  const Icon = iconMap[benefit.icon] || Shield;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
      <RichTextRenderer
        content={benefit.description}
        className="text-muted-foreground text-sm leading-relaxed"
      />
    </motion.div>
  );
};

// --- FAQ Item Component ---
const FAQItem = ({ faq, index, isOpen, onToggle }: { faq: any, index: number, isOpen: boolean, onToggle: (i: number) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
    >
      <div className={`relative bg-card/90 backdrop-blur-sm rounded-xl border transition-all duration-300 ${isOpen ? 'border-primary/40 shadow-2xl shadow-primary/10' : 'border-primary/10 hover:border-primary/25 shadow-lg'}`}>
        <button onClick={() => onToggle(index)} className="w-full text-left p-6 sm:p-8 focus:outline-none relative z-10">
          <div className="flex items-center justify-between gap-6">
            <h3 className={`text-sm sm:text-lg lg:text-xl font-semibold transition-all duration-300 ${isOpen ? 'text-primary' : 'text-foreground'}`}>{faq.question}</h3>
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white' : 'border-border bg-background'}`}>
              {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-8 pb-8">
                <RichTextRenderer content={faq.answer} className="text-muted-foreground text-sm sm:text-base leading-relaxed" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function ServiceDetailTemplate({ pageData, params: syncParams }: { pageData?: any, params?: any }) {
  const { services: servicesData, allBlogs } = useContent();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (pageData?.slug) setSlug(pageData.slug);
    else if (syncParams?.slug) {
      const pSlug = syncParams.slug;
      setSlug(Array.isArray(pSlug) ? pSlug.join('/') : pSlug);
    }
  }, [pageData, syncParams]);

  const servicesList = (servicesData as any).services || [];
  const service = servicesList.find((s: any) => s.slug === slug);

  useEffect(() => {
    if (service) {
      setIsDataLoaded(true);
    }
  }, [service]);



  if (!service || !isDataLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Syncing Service Intelligence...</p>
      </div>
    );
  }

  const faqs = service.faq || [];
  const processSteps = service.process || [];
  const statsData = service.stats || [];
  const benefits = service.benefits || [];
  const features = (service.features || []).map((f: any) => typeof f === 'string' ? { text: f, icon: "CheckCircle" } : f);

  return (
    <main className="bg-background text-foreground font-body">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[500px] w-full">
        {service.breadcrumbImage ? (
          <img src={service.breadcrumbImage} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Image src={breakcrumb} alt={service.title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <nav className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-3 text-white/70 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] mb-6">
                <Link href="/" className="hover:text-primary transition-colors text-white">Home</Link>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <Link href="/services" className="hover:text-primary transition-colors text-white">Services</Link>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white">{service.title}</span>
              </div>
              <h1 className="text-4xl sm:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
                {service.title}
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat: any, idx: number) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-6xl font-bold mb-8 leading-tight">{service.overviewTitle || "Craftsmanship Without Compromise."}</h2>
            <RichTextRenderer
              content={service.overview}
              className="text-lg text-muted-foreground mb-10 leading-relaxed"
            />
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((f: any, i: number) => {
                const Icon = iconMap[f.icon] || CheckCircle;
                return (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-700">{f.text}</span>
                  </div>
                );
              })}
            </div>
            <Link href={service.cta?.link || "/contact"} className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-xl hover:text-white transition-all">
              {service.cta?.text || "Start Your Project"} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border border-border/50">
              <img
                src={service.overviewImage || (imageMap[service.title] ? (imageMap[service.title] as any).src : "/src/assets/roof1.jpg.jpeg")}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-6xl font-bold mb-4">Key Benefits</h2>
              <p className="text-lg text-muted-foreground">Why our {service.title.toLowerCase()} solutions stand out.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit: any, idx: number) => (
                <BenefitCard key={idx} benefit={benefit} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl font-bold mb-4">Precision in every detail</h2>
            <p className="text-lg text-muted-foreground">Our battle-tested methodology ensures consistency and quality.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step: any, idx: number) => (
              <ProcessCard key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold text-center mb-16">Your Questions, Answered</h2>
          <div className="space-y-4">
            {faqs.map((faq: any, idx: number) => (
              <FAQItem key={idx} faq={faq} index={idx} isOpen={openFaq === idx} onToggle={() => setOpenFaq(openFaq === idx ? null : idx)} />
            ))}
          </div>
        </div>
      </section>

      <BlogSection
        title={service.blogSection?.title}
        subtitle={service.blogSection?.subtitle}
        description={service.blogSection?.description}
        posts={allBlogs.filter((p: any) => service.blogSection?.selectedPosts?.includes(p._id))}
      />
    </main>
  );
}
