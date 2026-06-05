import React from 'react';
import HomeTemplate from './HomeTemplate';
import AboutTemplate from './AboutTemplate';
import ServiceDetailTemplate from './ServiceDetailTemplate';
import TeamTemplate from './TeamTemplate';
import CareersTemplate from './CareersTemplate';
import ReviewsTemplate from './ReviewsTemplate';
import FAQTemplate from './FAQTemplate';
import ContactTemplate from './ContactTemplate';
import GalleryTemplate from './GalleryTemplate';
import ServicesTemplate from './ServicesTemplate';
import ServiceAreaTemplate from './ServiceAreaTemplate';
import PageInlineFaqs from '../PageInlineFaqs';

import { ContentProvider } from "@/context/ContentContext";

export const TEMPLATE_MAP: Record<string, React.ComponentType<any>> = {
  'home': HomeTemplate,
  'about': AboutTemplate,
  'service-detail': ServiceDetailTemplate,
  'team': TeamTemplate,
  'careers': CareersTemplate,
  'reviews': ReviewsTemplate,
  'faq': FAQTemplate,
  'contact': ContactTemplate,
  'gallery': GalleryTemplate,
  'services': ServicesTemplate,
  'service-area': ServiceAreaTemplate,
};

export const getTemplate = (name: string) => {
  return TEMPLATE_MAP[name] || HomeTemplate;
};

export const TemplateWrapper = ({ templateName, pageData, params }: any) => {
  const Template = getTemplate(templateName);
  
  // Only append the inline FAQ section if this page isn't already the FAQ template
  // and it has page-specific FAQs defined in its content.
  // We also exclude 'service-detail', 'about', 'service-area', and 'services' because those templates manually render their own FAQs.
  const hasInlineFaqs = !['faq', 'service-detail', 'about', 'service-area', 'services'].includes(templateName) && 
                        pageData?.content?.faqs && 
                        Array.isArray(pageData.content.faqs) && 
                        pageData.content.faqs.length > 0;

  return (
    <ContentProvider initialData={pageData.content}>
       <Template pageData={pageData} params={params} />
       {hasInlineFaqs && (
         <PageInlineFaqs faqs={pageData.content.faqs} />
       )}
    </ContentProvider>
  );
};
