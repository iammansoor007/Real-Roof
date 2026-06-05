import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState, memo } from "react";
import { useContent } from "../hooks/useContent";
import Link from "next/link";
import EagleAboutImg from "../../public/realrooflogo.webp";
import RichTextRenderer from "./ui/RichTextRenderer";
import { Icon } from "../config/icons";

const Counter = memo(({ value, suffix = "", duration = 1.8 }: { value: number; suffix?: string; duration?: number }) => {
    const ref = useRef(null);
    const safeValue = typeof value === 'number' && !isNaN(value) ? value : parseFloat(String(value)) || 0;
    const [display, setDisplay] = useState(0);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const shouldReduceMotion = useReducedMotion();
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!inView || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        if (shouldReduceMotion) {
            setDisplay(safeValue);
            return;
        }

        let startTime: number;
        const durationMs = duration * 1000;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setDisplay(Math.floor(safeValue * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplay(safeValue);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, safeValue, duration, shouldReduceMotion]);

    return (
        <span ref={ref} className="tabular-nums">
            {(display ?? 0).toLocaleString()}
            {suffix}
        </span>
    );
});
Counter.displayName = "Counter";

export default function AboutSection() {
    const { about } = useContent();
    const sectionRef = useRef<HTMLElement>(null);

    const defaultAbout = {
        badge: "Our Company",
        headline: { prefix: "Built on", highlight: "Trust", suffix: "& Quality" },
        description: "With years of experience in the roofing industry, we have built a reputation for excellence. We specialize in providing high-quality, durable, and aesthetically pleasing roofing solutions for both residential and commercial properties. Our commitment to craftsmanship and customer satisfaction sets us apart.",
        image: { src: EagleAboutImg.src, alt: "Professional roofing team at work" },
        stats: [
            { value: 15, suffix: "+", label: "Years Experience" },
            { value: 5000, suffix: "+", label: "Roofs Completed" },
            { value: 100, suffix: "%", label: "Satisfaction Guarantee" }
        ],
        buttons: [
            { text: "Learn More About Us", primary: true, link: "/about" },
            { text: "Meet Our Team", primary: false, link: "/team" }
        ],
        coreValues: ["Uncompromising Quality", "Transparent Pricing", "Certified Experts", "Lifetime Warranties"]
    };

    const badge = about?.badge || defaultAbout.badge;
    const headline = about?.headline || defaultAbout.headline;
    const description = about?.description || defaultAbout.description;
    const image = about?.image || defaultAbout.image;
    const stats = about?.stats && about.stats.length > 0 ? about.stats : defaultAbout.stats;
    const buttons = about?.buttons && about.buttons.length > 0 ? about.buttons : defaultAbout.buttons;
    const coreValues = about?.coreValues && about.coreValues.length > 0 ? about.coreValues : defaultAbout.coreValues;

    const isDynamicImage = !!(image?.src && (image.src.startsWith('/') || image.src.startsWith('http')));
    const isCloudinaryOrUnsplash = !!(image?.src && (image.src.includes('res.cloudinary.com') || image.src.includes('images.unsplash.com')));
    const shouldBeUnoptimized = isDynamicImage && image.src.startsWith('http') && !isCloudinaryOrUnsplash;

    return (
        <section
            ref={sectionRef}
            className="relative bg-slate-50 dark:bg-slate-950 py-16 md:py-24 lg:py-28 overflow-x-clip"
            aria-label="About RealRoof"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Image Column */}
                    <div className="w-full lg:w-5/12 relative">
                        <div className="relative pb-12 sm:pb-16 max-w-md lg:max-w-none mx-auto">
                            {/* Accent border frame - mirrors the exact dimensions of the image */}
                            <div className="absolute top-4 left-4 right-[-16px] bottom-[32px] md:top-6 md:left-6 md:right-[-24px] md:bottom-[40px] border-2 border-primary rounded-3xl pointer-events-none" />

                            {/* Main Image Container */}
                            <div className="relative w-full aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-200/50 dark:border-slate-800/50">
                                {isDynamicImage ? (
                                    <Image
                                        src={image.src}
                                        alt={image.alt || "About RealRoof"}
                                        className="object-cover absolute inset-0 w-full h-full"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        quality={90}
                                        unoptimized={shouldBeUnoptimized}
                                    />
                                ) : (
                                    <Image
                                        src={EagleAboutImg}
                                        alt={image?.alt || "About RealRoof"}
                                        className="object-cover absolute inset-0 w-full h-full"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        quality={90}
                                    />
                                )}
                            </div>

                            {/* Floating Stats Card — styled as a premium light-themed seal */}
                            {stats && stats.length > 0 && (
                                <div className="absolute bottom-0 right-4 sm:-right-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-20 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 min-w-[150px]">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center text-primary mb-2.5">
                                        <Icon name="Award" className="w-5 h-5" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-none">
                                        <Counter value={stats[0].value} suffix={stats[0].suffix} />
                                    </div>
                                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mt-2 text-center whitespace-nowrap">
                                        {stats[0].label}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-7/12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-primary" />
                            {badge && (
                                <span className="text-primary uppercase tracking-[0.2em] text-xs sm:text-sm font-bold">{badge}</span>
                            )}
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900 dark:text-white mb-8 tracking-tight">
                            {typeof headline === 'string' ? (
                                <span>{headline}</span>
                            ) : (
                                <>
                                    {headline?.prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">{headline?.highlight}</span> {headline?.suffix}
                                </>
                            )}
                        </h2>

                        <div className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 border-l-2 border-slate-200 dark:border-slate-800 pl-6">
                            <RichTextRenderer content={description} stripParagraphs={true} />
                        </div>

                        {coreValues && coreValues.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-12">
                                {(coreValues || []).map((value: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-lg group-hover:text-primary transition-colors duration-300">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Remaining Stats Row */}
                        {stats && stats.length > 1 && (
                            <div className="flex flex-wrap items-center gap-10 mb-12 pt-10 border-t border-slate-200 dark:border-slate-800">
                                {stats.slice(1).map((stat: any, i: number) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter mb-1">
                                            <Counter value={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <div className="text-slate-500 font-medium uppercase tracking-wider text-xs">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            {buttons?.map((btn: any, i: number) => (
                                <Link
                                    key={i}
                                    href={btn.link}
                                    className={`px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 ${btn.primary
                                        ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                                        : "bg-transparent text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {btn.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};