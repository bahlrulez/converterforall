"use client";

import React from "react";
import { useCookieConsent } from "./cookie-context";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectOptional, setModalOpen } = useCookieConsent();

  if (!isBannerVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-[420px] z-[90] p-4 sm:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-background/80 backdrop-blur-xl border shadow-2xl rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <span className="text-xl">🍪</span> Your Privacy Matters
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies to keep ConverterForAll running smoothly, understand how visitors use our tools, and show relevant advertisements. You can accept all cookies, reject optional cookies, or customize your preferences.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button onClick={acceptAll} className="w-full font-medium shadow-sm">
            Accept All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={rejectOptional} className="w-1/2">
              Reject Optional
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(true)} className="w-1/2">
              Customize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
