"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import AggressiveRoofingSection from "@/components/RoofingExperts";
import Services from "@/components/Services";
import TeamValues from "@/components/TeamValues";

const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: false });
const BrandStore = dynamic(() => import("@/components/BrandStore"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowWeWork = dynamic(() => import("@/components/HowWeWork"), { ssr: false });
const QAForm = dynamic(() => import("@/components/QAForm"), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: false });
const QuickQuote = dynamic(() => import("@/components/QuickQuote"), { ssr: false });
const BlogSection = dynamic(() => import("@/components/sections/BlogSection"), { ssr: false });

import { useContent } from "@/hooks/useContent";
import PageInlineFaqs from "@/components/PageInlineFaqs";

export default function HomeTemplate({ pageData, params }: { pageData?: any, params?: any }) {
  const { allBlogs, blogSection } = useContent();
  return (
    <div className="relative">
      <Hero />
      <section id="roofingexperts">
        <AggressiveRoofingSection />
      </section>
      <section id="services">
        <Services />
      </section>
      <TeamValues />
      <section id="portfolio">
        <Portfolio />
      </section>
      <BrandStore />
      <Testimonials />
      <section id="about">
        <HowWeWork />
      </section>
      <section id="contact">
        <QAForm />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      
      <BlogSection 
        title={blogSection?.title}
        subtitle={blogSection?.subtitle}
        description={blogSection?.description}
        posts={allBlogs.filter((p: any) => blogSection?.selectedPosts?.includes(p._id))}
      />

      <QuickQuote />
      <PageInlineFaqs faqs={pageData?.content?.faqs || pageData?.faqs || []} />
    </div>
  );
}

