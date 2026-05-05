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
  const { scrollYProgress } = useScroll({
    target: ref,
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
  const marquee = footer?.marquee || { texts: [], speed: 30, repeats: 8 };

  return (
    <div className="relative overflow-hidden py-8 border-t border-border">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ duration: marquee.speed || 30, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(marquee.repeats || 8)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-8 group">
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icon name="Sparkles" className="w-4 h-4" />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[0]}
            </span>
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icon name="Sparkles" className="w-4 h-4" />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[1]}
            </span>
            <span className="text-xs font-mono text-primary/40 group-hover:text-primary transition-colors duration-300">
              <Icon name="Sparkles" className="w-4 h-4" />
            </span>
            <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-300">
              {marquee.texts[2]}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Footer = () => {
  const { footer } = useContent();
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const company = footer?.company || { name: "Eagle Revolution", tagline: "", description: "" };
  const quickLinks = footer?.quickLinks || [];
  const bottom = footer?.bottom || { copyright: "", rights: "", links: [], tagline: "" };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !isClient) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );
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
            quality={100}
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
            quality={100}
            className="object-cover opacity-[0.02]"
          />
        </div>
      </ParallaxLayer>

      <QuantumParticles />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-24 pb-16 border-b border-border">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
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

          <div className="lg:col-span-5">
            <ServiceLinks />
            <MaterialsSection />
          </div>

          <div className="lg:col-span-4">
            <ContactInfo />

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-mono tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2 mb-3">
                <Icon name="Sparkles" className="w-4 h-4" />
                Certifications & Accreditations
              </h4>
              <CertificationsGrid />
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