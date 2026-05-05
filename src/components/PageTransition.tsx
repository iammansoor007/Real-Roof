"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./LoadingContext";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasLoaded } = useGlobalLoading();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Synchronous state update during render to catch path changes BEFORE the first paint
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setHasNavigated(true);
    setIsTransitioning(true);
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const shouldPlayShutters = hasLoaded && hasNavigated;

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={pathname} 
          className="relative w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Delay the entrance of the new page content until shutters cover the screen
          transition={{ duration: 0.4, delay: shouldPlayShutters ? 0.4 : 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {/* Shutters removed as requested */}
      </AnimatePresence>
    </div>
  );
}