import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures all external/internal links in HTML string are "dofollow" by stripping "nofollow" from rel attribute.
 */
export function makeLinksDoFollow(html: string): string {
  if (!html) return html;
  
  // Target any <a> tag
  return html.replace(/<a\s+([^>]*?)>/gi, (match: string, attrs: string) => {
    // Check if the tag has a rel attribute
    const relRegex = /rel=(['"])(.*?)\1/gi;
    if (relRegex.test(attrs)) {
      // Clean the rel attribute
      const cleanedAttrs = attrs.replace(relRegex, (relMatch: string, quote: string, relValue: string) => {
        const cleanRel = relValue
          .split(/\s+/)
          .filter((val: string) => val.toLowerCase() !== 'nofollow')
          .join(' ')
          .trim();
        return cleanRel ? `rel=${quote}${cleanRel}${quote}` : '';
      });
      // Replace multiple spaces with a single space and trim
      const tidiedAttrs = cleanedAttrs.replace(/\s+/g, ' ').trim();
      return tidiedAttrs ? `<a ${tidiedAttrs}>` : '<a>';
    }
    return match;
  });
}

