"use client";

import { useEffect, useRef } from "react";

export default function ScriptInjector({ code, target = "head" }: { code: string, target?: "head" | "body" }) {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !code) return;
    injected.current = true;
    
    try {
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      if (target === "head") {
        document.head.appendChild(fragment);
      } else {
        document.body.appendChild(fragment);
      }
    } catch (e) {
      console.error("Failed to inject script:", e);
    }
  }, [code, target]);

  return null;
}
