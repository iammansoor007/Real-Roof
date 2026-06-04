"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import AggressiveRoofingSection from "@/components/RoofingExperts";
import Services from "@/components/Services";

import Portfolio from "@/components/Portfolio";
import Leadership from "@/components/Leadership";
import BrandStore from "@/components/BrandStore";
import Testimonials from "@/components/Testimonials";
import HowWeWork from "@/components/HowWeWork";
import QAForm from "@/components/QAForm";
import FAQ from "@/components/FAQ";
import QuickQuote from "@/components/QuickQuote";
import BlogSection from "@/components/sections/BlogSection";
import InteractiveQuoteTool from "@/components/InteractiveQuoteTool";

const ServiceAreaMap = dynamic(() => import("@/components/ServiceAreaMap"), { ssr: false });

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

      <InteractiveQuoteTool />
      <ServiceAreaMap />

      <section id="leadership">
        <Leadership />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <Testimonials />
      <section id="about">
        <HowWeWork />
      </section>

      <section id="contact">
        <QAForm />
      </section>

      <BlogSection
        title={pageData?.content?.blogSection?.title || blogSection?.title}
        subtitle={pageData?.content?.blogSection?.subtitle || blogSection?.subtitle}
        description={pageData?.content?.blogSection?.description || blogSection?.description}
        posts={allBlogs.filter((p: any) => (pageData?.content?.blogSection?.selectedPosts || []).includes(p._id))}
      />

      <QuickQuote />

    </div>
  );
}

