import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Icon } from "../config/icons";
import { useContent } from "../hooks/useContent";
import Image from "next/image";
import Link from "next/link";
import RichTextRenderer from "./ui/RichTextRenderer";
import bbblogo from '../assets/bbblogo.png'
import goodcontracterlist from '../assets/goodcontracterlist.png'
import bgfair from "../assets/bgfair.jpg";
import videowrapper from "../assets/videowrapper.png";

const Hero = () => {
  const { hero } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadVideo = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setTimeout(() => setIsMounted(true), 1500); // 1.5s delay during idle time
        });
      } else {
        setTimeout(() => setIsMounted(true), 2500); // Fallback timeout
      }
    };

    if (document.readyState === 'complete') {
      loadVideo();
    } else {
      window.addEventListener('load', loadVideo);
      return () => window.removeEventListener('load', loadVideo);
    }
  }, []);

  const {
    badge = "Premium Exterior Solutions",
    headlines = [],
    description = "",
    buttons = [],
    stats = [],
    images = []
  } = hero || {};

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col md:pt-8 lg:pt-12 ">

      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/80 sm:bg-slate-900/70 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent z-10" />
        {isMounted ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={videowrapper.src}
            className="w-full h-full object-cover object-center"
          >
            <source src="/RealRoof.mp4" type="video/mp4" />
            <source src="/RealRoof.mp4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full relative">
            <Image
              src={videowrapper}
              alt="RealRoof Hero Background"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex-1 flex flex-col justify-center pb-16 lg:pb-24">
        <div className="max-w-3xl">

          <motion.div
            className="inline-flex items-center gap-2 bg-primary px-4 py-1 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase">{badge}</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {headlines.map((line: { text: string; highlight: boolean }, i: number) => (
              <motion.span
                key={i}
                className={`block ${line.highlight ? "text-primary" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RichTextRenderer
              content={description}
              stripParagraphs={true}
              className="text-lg sm:text-xl text-slate-200 leading-relaxed"
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {buttons.map((button: any, idx: number) => {
              return button.primary ? (
                <Link key={idx} href={button.href || button.link || '#'} className="w-full sm:w-auto">
                  <div className="w-full px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg text-center transition-colors shadow-lg">
                    {button.text}
                  </div>
                </Link>
              ) : (
                <Link key={idx} href={button.href || button.link || '#'} className="w-full sm:w-auto">
                  <div className="w-full px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-lg text-center transition-colors shadow-lg">
                    {button.text}
                  </div>
                </Link>
              );
            })}
          </motion.div>

        </div>
      </div>

      {/* Trust & Financing Bar */}
      <div className="relative z-20 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-6 gap-6">

            {/* Stats */}
            <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center lg:justify-start">
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="text-center lg:text-left">
                  <span className="block text-3xl font-extrabold text-white">{stat.value}</span>
                  <span className="block text-sm font-bold text-primary uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges & Financing */}
            <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-10">
              <div className="flex items-center gap-6 opacity-80 mix-blend-screen">
                <Image src={bbblogo} alt="BBB A+" className="h-10 w-auto object-contain brightness-0 invert" />
                <Image src={goodcontracterlist} alt="Good Contractors" className="h-10 w-auto object-contain brightness-0 invert" />
              </div>

              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 border border-white/20">
                  <div className="text-white text-left">
                    <span className="block text-sm font-bold">Flexible Financing</span>
                    <span className="block text-xs text-slate-300">Prequalify in minutes</span>
                  </div>
                  <Icon name="ArrowRight" className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
