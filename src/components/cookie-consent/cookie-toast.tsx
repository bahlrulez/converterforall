"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleConsentSaved = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3500); // Hide after 3.5 seconds
    };

    window.addEventListener("cookie-consent-saved", handleConsentSaved);
    return () => window.removeEventListener("cookie-consent-saved", handleConsentSaved);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-card border shadow-lg rounded-full px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span className="text-sm font-medium">Your privacy preferences have been saved.</span>
      </div>
    </div>
  );
}
