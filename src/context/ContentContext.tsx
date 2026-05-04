'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import staticData from '../src/data/completeData.json';

const ContentContext = createContext<any>(staticData);

const deepMerge = (target: any, source: any) => {
  if (!source) return target;
  if (!target) return source;
  
  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        output[key] = source[key];
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      // If it's an array and it's empty in source, but has data in target, keep target (for collections)
      if (Array.isArray(source[key]) && source[key].length === 0 && Array.isArray(target[key]) && target[key].length > 0) {
        output[key] = target[key];
      } else {
        output[key] = source[key];
      }
    }
  });
  return output;
};

export const ContentProvider = ({ children, initialData }: { children: React.ReactNode, initialData?: any }) => {
  // Merge initialData with staticData immediately to ensure global sections (navbar/footer) 
  // are available even if the page-specific data is limited.
  const [content, setContent] = useState<any>(initialData ? deepMerge(staticData, initialData) : staticData);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const globalData = await response.json();
          // Merge logic: local data takes precedence via deepMerge
          setContent(initialData ? deepMerge(globalData, initialData) : globalData);
        }

        // Fetch blogs
        const blogRes = await fetch('/api/blog');
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogs(blogData);
        }
      } catch (error) {
        console.error('Failed to fetch content from DB, falling back to static data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [initialData]);

  return (
    <ContentContext.Provider value={{ ...content, allBlogs: blogs }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentContext = () => useContext(ContentContext);
