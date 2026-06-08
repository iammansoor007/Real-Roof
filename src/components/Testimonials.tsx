import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import RichTextRenderer from "./ui/RichTextRenderer";

const Testimonials = () => {
  const { testimonials: testimonialsData } = useContent();
  const sectionRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const defaultData = {
    section: { badge: 'Testimonials', headline: 'Client Success Stories', description: 'Hear directly from our partners and homeowners about their experience working with our premium exterior specialists.' },
    testimonials: [
      {
        name: "John Smith",
        position: "Homeowner",
        rating: 5,
        text: "<p>The team at RealRoof completely transformed our home. They were professional, on time, and the new roof looks absolutely stunning. I highly recommend them to anyone looking for top-tier service.</p>",
      },
      {
        name: "Sarah Johnson",
        position: "Property Manager",
        rating: 5,
        text: "<p>We have used RealRoof for multiple properties and they never disappoint. Their attention to detail and commitment to quality is unmatched in the industry.</p>",
      },
      {
        name: "Michael Brown",
        position: "Commercial Developer",
        rating: 5,
        text: "<p>After a severe storm, we needed immediate commercial roofing repairs. They responded quickly, provided a fair quote, and finished the job ahead of schedule. Exceptional work.</p>",
      }
    ],
    stats: { subscribers: '500' }
  };

  const section = testimonialsData?.section || defaultData.section;
  const testimonials = testimonialsData?.testimonials && testimonialsData.testimonials.length > 0 ? testimonialsData.testimonials : defaultData.testimonials;

  if (!isClient) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-16 md:py-24 lg:py-28 overflow-hidden"
    >
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-60" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[90px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[70px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">

        {/* Top Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:flex md:flex-wrap lg:flex-nowrap items-center justify-items-center md:justify-center lg:justify-between gap-6 sm:gap-8 mb-20 p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100 w-full"
        >
          {[
            { value: "500+", label: "Happy Clients", icon: "Users" },
            { value: "5.0", label: "Average Rating", icon: "Star" },
            { value: "12+", label: "Years of Trust", icon: "Award" },
            { value: "98%", label: "Satisfaction Rate", icon: "BadgeCheck" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name={stat.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-[2px] w-12 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] text-xs sm:text-sm font-extrabold">
                {section.badge}
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tighter">
              {section.headline}
            </h2>

            <div className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
              {section.description}
            </div>
          </div>

          <div className="flex items-center gap-3 hidden md:flex">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg group"
            >
              <Icon name="ArrowLeft" className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-14 h-14 rounded-full bg-slate-900 text-white hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-lg group flex items-center justify-center"
            >
              <Icon name="ArrowRight" className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden px-4 py-8 -mx-4 -my-8" ref={emblaRef}>
          <div className="flex -ml-5 touch-pan-y items-stretch">
            {testimonials.map((testimonial: any, idx: number) => (
              <div key={idx} className="flex-none w-[90%] sm:w-[75%] md:w-[52%] lg:w-[36%] pl-5">
                <div
                  className="h-full flex flex-col bg-gradient-to-br from-slate-50/80 via-white to-primary/[0.02] hover:from-white hover:via-primary/[0.03] hover:to-primary/[0.08] rounded-3xl p-8 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.05)] border border-slate-100/80 hover:border-primary/20 transition-all duration-400 relative overflow-hidden group"
                >
                  {/* Decorative top-left accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-l-2xl z-20" />

                  {/* Dynamic gradient background glows */}
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

                  {/* Subtle dot grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Subtle quote watermark */}
                  <Icon name="Quote" className="w-10 h-10 text-primary/5 group-hover:text-primary/10 absolute top-6 right-6 pointer-events-none transform -rotate-12 group-hover:scale-110 transition-all duration-500 z-10" />

                  {/* Top Row: User info and Google badge */}
                  <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shadow-inner">
                        {testimonial.avatar && (testimonial.avatar.startsWith('http') || testimonial.avatar.startsWith('/uploads')) ? (
                          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{testimonial.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">{testimonial.name}</h4>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">{testimonial.position}</p>
                      </div>
                    </div>
                    {/* Google Icon Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-100 shadow-sm">
                      <Icon name="Google" className="w-3.5 h-3.5 text-primary" />
                      <span>Review</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < (testimonial.rating || 5) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review text */}
                  <div className="text-slate-600 text-base sm:text-[17px] leading-[1.75] flex-1 font-medium relative z-10 line-clamp-6">
                    <RichTextRenderer content={testimonial.text} stripParagraphs={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress / Dot indicators */}
        <div className="flex items-center justify-between mt-10">
          <div className="flex items-center gap-2">
            {testimonials.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${idx === selectedIndex ? 'w-10 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2 md:hidden">
            <button onClick={() => emblaApi?.scrollPrev()} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
              <Icon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Icon name="ArrowRight" className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;