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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col h-full rounded-[2rem] overflow-hidden"
    >
      <Link href={`/services/${service.slug || '#'}`} className="absolute inset-0 z-20" />
      
      {/* Top Banner with Image or Icon */}
      {imageUrl ? (
        <div className="relative w-full h-56 sm:h-64 bg-slate-100 overflow-hidden">
          {/* Dark Overlay that appears on hover */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-500 z-10 flex items-center justify-center">
             <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/95 backdrop-blur-sm text-slate-900 font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
                Explore Service <Icon name="ArrowRight" className="w-4 h-4 text-primary" />
             </div>
          </div>
          <Image 
            src={imageUrl} 
            alt={service.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="bg-slate-50 h-56 sm:h-64 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-primary transition-transform duration-500 group-hover:scale-110 relative z-10">
            <Icon name={service.icon} className="w-10 h-10" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-8 sm:p-10 flex flex-col flex-1 relative z-10 bg-white">
        {/* Floating icon overlapping the image */}
        <div className="absolute -top-6 left-8 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(var(--primary),0.5)] transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
           <Icon name={service.icon || "Shield"} className="w-7 h-7" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 mt-4 tracking-tight group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        
        <div className="text-slate-600 text-base leading-relaxed mb-8 flex-1 font-medium">
          <RichTextRenderer
            content={service.description}
            className="line-clamp-3"
            stripParagraphs={true}
          />
        </div>
        
        <div className="inline-flex items-center gap-3 text-slate-900 font-bold text-sm tracking-[0.2em] uppercase transition-colors group-hover:text-primary mt-auto pt-6 border-t border-slate-100 w-full">
          Learn More
          <Icon name="ArrowRight" className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
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
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tighter">
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