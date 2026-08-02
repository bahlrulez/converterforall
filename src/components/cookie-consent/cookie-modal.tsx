"use client";

import React, { useEffect, useState } from "react";
import { useCookieConsent, CookieConsentState } from "./cookie-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieModal() {
  const { consent, isModalOpen, setModalOpen, savePreferences } = useCookieConsent();
  
  // Local state for modal toggles
  const [preferences, setPreferences] = useState<CookieConsentState>({
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
  });

  // Sync with global state when opened
  useEffect(() => {
    if (isModalOpen && consent) {
      setPreferences(consent);
    }
  }, [isModalOpen, consent]);

  if (!isModalOpen) return null;

  const handleSave = () => {
    savePreferences(preferences);
  };

  const categories = [
    {
      id: "essential",
      title: "Essential Cookies",
      description: "These cookies are strictly necessary for the website to function properly and securely. They cannot be disabled.",
      required: true,
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Allow us to use Google Analytics 4 and Microsoft Clarity to understand how you interact with our website, helping us improve the user experience.",
      required: false,
    },
    {
      id: "advertising",
      title: "Advertising",
      description: "Allow Google AdSense to serve personalized advertisements based on your interests and browsing behavior.",
      required: false,
    },
    {
      id: "functional",
      title: "Functional",
      description: "Enable advanced features like theme preferences, language selection, and layout customizations.",
      required: false,
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-card border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 id="cookie-modal-title" className="text-xl font-bold tracking-tight">Privacy Preferences</h2>
              <p className="text-sm text-muted-foreground">Manage how we use your data.</p>
            </div>
          </div>
          <button 
            onClick={() => setModalOpen(false)}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close preferences"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="flex gap-4 p-4 rounded-xl border bg-muted/20">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{category.title}</h3>
                  {category.required && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">Required</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="shrink-0 flex items-start pt-1">
                <Switch 
                  checked={category.required ? true : preferences[category.id as keyof CookieConsentState]}
                  disabled={category.required}
                  onCheckedChange={(checked) => {
                    if (!category.required) {
                      setPreferences(prev => ({ ...prev, [category.id]: checked }));
                    }
                  }}
                  aria-label={`Toggle ${category.title} cookies`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-muted/30 shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={() => setModalOpen(false)} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button onClick={handleSave} className="sm:w-auto w-full">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
