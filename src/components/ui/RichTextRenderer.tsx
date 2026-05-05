"use client";

import React from "react";
import DOMPurify from "dompurify";

interface RichTextRendererProps {
  content: string | string[];
  className?: string;
  stripParagraphs?: boolean;
}

export default function RichTextRenderer({ content, className = "", stripParagraphs = false }: RichTextRendererProps) {
  // Safe sanitize helper that handles Next.js ESM/CJS interop and SSR
  const safeSanitize = (html: string) => {
    if (typeof window === "undefined") return html;
    
    // Handle different import patterns (default vs named)
    const purify = (DOMPurify as any).default || DOMPurify;
    if (purify && typeof purify.sanitize === "function") {
      return purify.sanitize(html);
    }
    return html;
  };

  // Handle array of strings (legacy bio/description pattern)
  if (Array.isArray(content)) {
    return (
      <div className={`space-y-4 ${className}`}>
        {content.map((p, i) => (
          <div 
            key={i} 
            dangerouslySetInnerHTML={{ __html: safeSanitize(p) }} 
            className="rich-text-content"
          />
        ))}
      </div>
    );
  }

  if (!content) return null;

  // Sanitize and render single HTML string
  let sanitizedHtml = safeSanitize(content as string);

  if (stripParagraphs) {
    sanitizedHtml = sanitizedHtml.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '');
  }

  return (
    <div 
      className={`rich-text-content 
        font-body text-foreground/80 leading-relaxed
        ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
