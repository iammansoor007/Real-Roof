"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Layout, TreePine, Building2, Building, Droplets, ArrowRight, Shield, Clock, Award, Users, TrendingUp, BadgeCheck, Star, ChevronRight } from 'lucide-react';
import { useContent } from "../../hooks/useContent";
import RichTextRenderer from "../ui/RichTextRenderer";
import BlogSection from "../sections/BlogSection";
import PageInlineFaqs from "@/components/PageInlineFaqs";

const iconMap: Record<string, any> = { Home, Layout, TreePine, Building2, Building, Droplets, Shield, Award, Clock, BadgeCheck, TrendingUp, Star };

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
    const slug = service.slug || service.title.toLowerCase().replace(/ & /g, '-').replace(/, /g, '-').replace(/ /g, '-');
    const Icon = iconMap[service.icon] || Shield;
    const imageUrlRaw = service.overviewImage || service.breadcrumbImage || service.image;
    const imageUrl = typeof imageUrlRaw === 'object' && imageUrlRaw !== null ? imageUrlRaw.src : imageUrlRaw;

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative bg-white border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col h-full rounded-[2rem] overflow-hidden">
            <Link href={`/services/${slug}`} className="absolute inset-0 z-20 block h-full" />
            
            {imageUrl ? (
                <div className="relative w-full h-56 sm:h-64 bg-slate-100 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-500 z-10 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/95 backdrop-blur-sm text-slate-900 font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
                            Explore Service <ArrowRight className="w-4 h-4 text-primary" />
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
                        <Icon className="w-10 h-10" />
                    </div>
                </div>
            )}

            <div className="p-8 sm:p-10 flex flex-col flex-1 relative z-10 bg-white">
                <div className="absolute -top-6 left-8 bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(var(--primary),0.5)] transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 mt-4 tracking-tight group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                
                <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">{service.tagline || service.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                    {(service.features || []).slice(0, 3).map((f: any, i: number) => (
                        <span key={i} className="text-[11px] uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1 rounded-full font-bold group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                            {typeof f === 'string' ? f : f.text}
                        </span>
                    ))}
                </div>
                
                <div className="inline-flex items-center gap-3 text-slate-900 font-bold text-sm tracking-[0.2em] uppercase transition-colors group-hover:text-primary mt-auto pt-6 border-t border-slate-100 w-full">
                    Learn More <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                </div>
            </div>
        </motion.div>
    );
};

export default function ServicesTemplate({ pageData, params }: { pageData?: any, params?: any }) {
    const { services: dataRaw, allBlogs, blogSection, faq } = useContent();
    const data = dataRaw as any;
    const services = (data?.services || []).filter((s: any) => s.status === 'published' || s.status === undefined);

    // Use services.headline if available
    const headline = data?.headline;
    const headlineJsx = headline
        ? typeof headline === 'string'
            ? <span>{headline}</span>
            : (
                <span>
                    {headline.prefix}{' '}
                    <span className="text-primary">{headline.highlight}</span>{' '}
                    {headline.suffix}
                </span>
            )
        : <span>Our Services</span>;

    return (
        <main className="min-h-screen bg-background pt-24 pb-16">

            <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 mb-6"
                >
                    <Star className="w-4 h-4 fill-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">{data?.badge || "What We Do"}</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-7xl font-bold mb-6 leading-tight"
                >
                    {headlineJsx}
                </motion.h1>
                {data?.description && (
                    <div className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        <RichTextRenderer content={Array.isArray(data.description) ? data.description[0] : data.description} />
                    </div>
                )}
            </div>
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any, index: number) => (
                    <ServiceCard key={index} service={service} index={index} />
                ))}
            </div>
            <PageInlineFaqs faqs={faq.items} />

            <BlogSection
                title={pageData?.content?.blogSection?.title || blogSection?.title}
                subtitle={pageData?.content?.blogSection?.subtitle || blogSection?.subtitle}
                description={pageData?.content?.blogSection?.description || blogSection?.description}
                posts={allBlogs.filter((p: any) => (pageData?.content?.blogSection?.selectedPosts || blogSection?.selectedPosts || []).includes(p._id))}
            />

        </main>
    );
}
