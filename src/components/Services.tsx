import { useRef, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import RichTextRenderer from "./ui/RichTextRenderer";

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const imageUrlRaw = service.overviewImage || service.breadcrumbImage || service.image;
  const imageUrl = typeof imageUrlRaw === 'object' && imageUrlRaw !== null ? imageUrlRaw.src : imageUrlRaw;

  // Track mouse coordinates for interactive spotlight glow on each card
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-gradient-to-b from-white to-slate-50/40 hover:to-primary/[0.02] border border-slate-100 hover:border-primary/25 transition-all duration-500 hover:shadow-[0_32px_64px_-20px_rgba(30,93,154,0.16)] hover:-translate-y-2.5 flex flex-col h-full rounded-[2.5rem] p-5 overflow-hidden"
      style={{
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`
      } as React.CSSProperties}
    >
      <Link href={`/services/${service.slug || '#'}`} className="absolute inset-0 z-20" />

      {/* === FANCY GRAPHIC ACCENTS === */}
      {/* Interactive mouse follow radial spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-[2.5rem] z-0"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(30, 93, 154, 0.08), transparent 80%)`
        }}
      />

      {/* Fine-line geometric grid texture inside card */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,93,154,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,93,154,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none rounded-[2.5rem]" />

      {/* Modern gradient corner glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

      {/* Giant outline background serif number */}
      <span className="absolute top-4 right-8 text-8xl font-serif font-bold text-slate-100/70 group-hover:text-primary/5 transition-all duration-500 select-none z-0 tracking-tighter">
        {service.number || String(index + 1).padStart(2, '00')}
      </span>

      {/* Framed Image Container with Inset 3D effect */}
      {imageUrl ? (
        <div className="relative w-full h-56 sm:h-60 overflow-hidden rounded-[2rem] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.1)] border border-white/80 z-10 bg-slate-100">
          {/* Zoom and overlay screen on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-end p-6">
            <div className="flex items-center gap-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              <span className="text-white font-extrabold text-sm uppercase tracking-[0.15em]">Explore Division</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Icon name="ArrowRight" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <Image
            src={imageUrl}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
          />
        </div>
      ) : (
        <div className="h-56 sm:h-60 flex items-center justify-center relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/5 via-slate-50 to-primary/10 border border-slate-100/50 z-10 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.06)]">
          {/* Visual depth circles */}
          <div className="absolute w-48 h-48 rounded-full border border-primary/5 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute w-32 h-32 rounded-full border border-primary/10 group-hover:scale-110 transition-transform duration-500 delay-75" />
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(30,93,154,0.4)] group-hover:scale-110 transition-all duration-500">
            <Icon name={service.icon} className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Card Content Block */}
      <div className="px-3 pt-8 pb-3 flex flex-col flex-1 relative z-10">
        
        {/* Category Pill Tag with Vertical Line Accents */}
        <div className="flex items-center gap-2.5 mb-3.5 h-5">
          <div className="h-3.5 w-[2px] bg-primary rounded-full origin-center group-hover:scale-y-[1.4] transition-transform duration-300" />
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">
            Specialist Division
          </span>
        </div>

        {/* Icon Floating Badge */}
        <div className="absolute -top-10 right-4 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(30,93,154,0.45)] transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
          <Icon name={service.icon || "Shield"} className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>

        <div className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 font-medium">
          <RichTextRenderer
            content={service.description}
            className="line-clamp-3"
            stripParagraphs={true}
          />
        </div>

        {/* Subtle dot divider line */}
        <div className="h-px bg-gradient-to-r from-primary/10 via-slate-200 to-primary/10 w-full mb-6 group-hover:from-primary/20 group-hover:to-primary/20 transition-all duration-300" />

        {/* Fancy bottom interactive CTA */}
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-xs tracking-[0.25em] uppercase text-slate-900 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
            Learn More
          </span>
          <div className="relative w-9 h-9 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_12px_rgba(30,93,154,0.3)] overflow-hidden">
            <Icon name="ArrowRight" className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const Services = () => {
  const { services: servicesData } = useContent();
  const sectionRef = useRef(null);

  const {
    badge = "Our Services",
    headline = { prefix: '', highlight: 'Services', suffix: '' },
    description = "Specialized roofing and exterior solutions designed for longevity and performance.",
    services = []
  } = (servicesData || {}) as any;

  const servicesListRaw = Array.isArray(services) ? services : [];
  const servicesList = servicesListRaw
    .filter((s: any) => !s.status || s.status === 'published')
    .map((s: any, idx: number) => ({
      ...s,
      number: String(idx + 1).padStart(2, '0')
    }));

  return (
    <section ref={sectionRef} className="relative bg-white py-24 lg:py-36 overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* Premium split header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] text-xs sm:text-sm font-extrabold">{badge}</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tighter font-heading">
              {headline.prefix && <span>{headline.prefix} </span>}
              <span className="text-primary">{headline.highlight}</span>
              {headline.suffix && <span> {headline.suffix}</span>}
            </h2>
          </div>
          <div className="lg:max-w-sm flex flex-col gap-6">
            <div className="text-lg text-slate-600 leading-relaxed font-medium">
              <RichTextRenderer content={description} stripParagraphs={true} />
            </div>
            <Link href="/services" className="self-start">
              <span className="group inline-flex items-center gap-3 bg-slate-900 hover:bg-primary text-white font-bold text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/25">
                View All Services
                <Icon name="ArrowRight" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* Premium 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesList.map((service: any, index: number) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;