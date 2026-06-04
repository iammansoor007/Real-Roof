"use client"

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Image from "next/image";
import Link from "next/link";
import RichTextRenderer from "./ui/RichTextRenderer";

gsap.registerPlugin(ScrollTrigger);

const ParallaxLayer = ({ children, speed = 0.05, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const ref = useRef(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { scrollYProgress } = useScroll({
    target: isClient ? ref : undefined,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`absolute inset-0 will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

const QuantumParticles = () => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  
  useEffect(() => setIsClient(true), []);

  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 0.5,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.2 + 0.05,
  }));

  if (!isClient) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {isInView && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, -15, 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const NewsletterForm = () => {
  const { footer } = useContent();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'Newsletter',
            subject: 'New Newsletter Subscription',
            name: 'Newsletter Subscriber',
            email: email,
            message: `New subscription from: ${email}`
          })
        });
      } catch (error) {
        console.error('Newsletter submission failed:', error);
      }
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center bg-muted backdrop-blur-sm rounded-full border transition-all duration-500
          ${isFocused
            ? 'border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.1)]'
            : 'border-border hover:border-border/80'
          }
        `}>
          <input
            type="email"
            placeholder={footer.newsletter?.placeholder || "Enter your email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-all duration-300 flex items-center gap-2"
          >
            {footer.newsletter?.buttonText || "Subscribe"}
            <Icon name="ArrowRight" className="w-4 h-4" />
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 text-center"
          >
            <span className="text-xs text-primary">
              ✓ Thank you for subscribing
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceLinks = () => {
  const { services: servicesData, footer } = useContent();
  const dynamicServicesRaw = ((servicesData as any).services || []).filter((s: any) => s.status === 'published' || s.status === undefined);
  const selectedServices = footer?.services?.selectedServices || [];
  
  const dynamicServices = selectedServices.length > 0 
    ? dynamicServicesRaw.filter((s: any) => selectedServices.includes(s._id))
    : dynamicServicesRaw;

  const footerServices = footer?.services || { title: "Our Services" };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
        <Icon name="Sparkles" className="w-4 h-4" />
        {footerServices.title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {dynamicServices.map((service: any) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group py-1"
          >
            <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
              <Icon name={service.icon || "Layout"} className="w-5 h-5" />
            </span>
            <span>{service.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const MaterialsSection = () => {
  const { footer } = useContent();
  const services = footer?.services || { materials: { title: "Materials", items: [] } };
  const materials = services.materials || { title: "Materials", items: [] };

  return (
    <div className="space-y-3 mt-4">
      <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/60">
        {materials.title}
      </h5>
      <div className="space-y-2">
        {(materials.items || []).map((material: any) => (
          <Link
            key={material.label}
            href={material.href}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary/80 transition-colors"
          >
            <span className="text-[8px] text-primary/40">●</span>
            {material.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const ContactInfo = () => {
  const { footer, hours } = useContent();
  const contact = footer?.contact || { title: "Contact Us", email: "", phone: "", address: "", emergency: "", areas: "" };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
          <Icon name="Sparkles" className="w-4 h-4" />
          {contact.title}
        </h4>
        <div className="space-y-4">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <span className="text-muted-foreground/60 group-hover:text-primary">
              <Icon name="Mail" className="w-5 h-5" />
            </span>
            {contact.email}
          </a>
          <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <span className="text-muted-foreground/60 group-hover:text-primary">
              <Icon name="Phone" className="w-5 h-5" />
            </span>
            {contact.phone}
          </a>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/60">
              <Icon name="MapPin" className="w-5 h-5" />
            </span>
            <span>{contact.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="text-muted-foreground/60">
              <Icon name="Infinity" className="w-5 h-5" />
            </span>
            <span>{contact.emergency}</span>
          </div>
        </div>
      </div>

      {hours && (
        <div className="space-y-3">
          <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/60">
            Office Hours
          </h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Monday - Friday:</span>
              <span>{hours.monday}</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday:</span>
              <span>{hours.saturday}</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday:</span>
              <span>{hours.sunday}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary/60">
          Service Areas
        </h5>
        <div className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
          <RichTextRenderer content={contact.areas} />
        </div>
      </div>
    </div>
  );
};

const CertificationsGrid = () => {
  const { footer } = useContent();
  const certifications = footer?.certifications || [];

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {certifications.map((cert: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="relative p-3 bg-muted backdrop-blur-sm rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
              <Icon name={cert.icon} className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-mono text-primary/80">{cert.cert}</span>
              <p className="text-[10px] text-muted-foreground">{cert.number}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const SocialLinks = () => {
  const { footer } = useContent();
  const social = footer?.social || [];

  // Map platform names to ensure proper icon mapping
  const getIconName = (item: any) => {
    // Use the icon field from data if present, otherwise fall back to platform name
    return item.icon || item.platform;
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {social.map((socialItem: any) => (
        <motion.a
          key={socialItem.platform}
          href={socialItem.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group"
          aria-label={socialItem.platform}
        >
          <Icon name={getIconName(socialItem)} className="w-5 h-5" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>
      ))}
    </div>
  );
};

const LegacyMarquee = () => {
  const { footer } = useContent();
  const certifications = footer?.certifications || [];
  const marquee = footer?.marquee || { speed: 40 };

  if (certifications.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-12 border-t border-border bg-muted/10">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: marquee.speed || 40, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 px-8">
            {certifications.map((cert: any, idx: number) => (
              <div key={`${i}-${idx}`} className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all duration-500 border border-border group-hover:border-primary/30 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5">
                  <Icon name={cert.icon} className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-foreground transition-colors">{cert.cert}</span>
                   <span className="text-[10px] font-mono text-muted-foreground/40 mt-0.5">{cert.number}</span>
                </div>
                <div className="ml-12 opacity-20">
                  <Icon name="Sparkles" className="w-3 h-3 text-primary" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

const Footer = () => {
  const { footer } = useContent();
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const company = footer?.company || { name: "RealRoof", tagline: "", description: "" };
  const quickLinks = footer?.quickLinks || [];
  const bottom = footer?.bottom || { copyright: "", rights: "", links: [], tagline: "" };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      // Intentionally left blank or can add other footer animations here
    }, sectionRef);

    return () => ctx.revert();
  }, [isClient]);

  if (!isClient) return null;

  return (
    <footer
      ref={sectionRef}
      className="relative bg-background overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent opacity-60 blur-3xl" />

      <ParallaxLayer speed={0.03} className="z-0">
        <div className="absolute top-40 right-0 w-2/5 h-2/5">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            alt="Abstract architecture"
            fill
            sizes="50vw"
            quality={85}
            className="object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <ParallaxLayer speed={0.05} className="z-0">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3">
          <Image
            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Heritage pattern"
            fill
            sizes="33vw"
            quality={85}
            className="object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <QuantumParticles />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-24 pb-16 border-b border-border">
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                {footer.company?.logo ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                    <Image src={footer.company.logo} alt={footer.company.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <span className="text-primary-foreground font-bold text-sm text-center leading-tight">ER</span>
                  </div>
                )}
                <div>
                  <span className="text-foreground font-light text-lg block">{company.name}</span>
                  <span className="text-[10px] text-primary/60 font-mono tracking-wider">{company.tagline}</span>
                </div>
              </div>

              <div className="text-muted-foreground text-xs leading-relaxed [&>p]:m-0">
                <RichTextRenderer content={company.description} />
              </div>

              <SocialLinks />
            </motion.div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                Subscribe to insights
              </h4>
              <NewsletterForm />
            </div>
          </div>

          <div className="lg:col-span-3">
            <ServiceLinks />
            <MaterialsSection />
          </div>

          <div className="lg:col-span-3">
            <ContactInfo />
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                <Icon name="MapPin" className="w-4 h-4" />
                Our Location
              </h4>
              <div className="relative w-full aspect-square lg:aspect-auto lg:h-[350px] rounded-2xl overflow-hidden border border-border shadow-2xl group transition-all duration-500 hover:border-primary/30">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.2535729046463!2d-90.68510192536498!3d38.803742752226945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa84c3b8dec6bf3f%3A0x18a7936317172933!2sEagle%20Revolution!5e0!3m2!1sen!2s!4v1778495491394!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 pointer-events-none border-[12px] border-background/20 rounded-2xl" />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono mt-2">
                1077 E Terra Ln, O&apos;Fallon, MO 63366
              </p>
            </div>
          </div>
        </div>

        <LegacyMarquee />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{bottom.copyright}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{bottom.rights}</span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {bottom.links.map((link: any) => (
              <Link key={link.label} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
            ))}
          </div>
          <div className="text-muted-foreground/60">
            <span className="font-mono">{bottom.tagline}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          className="relative block w-full h-20 md:h-24"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#footerWave)"
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
          <defs>
            <linearGradient id="footerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;