"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CookieConsentState = {
  essential: boolean; // Always true
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
};

type CookieConsentContextType = {
  consent: CookieConsentState | null; // null means no choice made yet
  isBannerVisible: boolean;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (preferences: CookieConsentState) => void;
};

const CONSENT_VERSION = "v1";
const STORAGE_KEY = `cfa_cookie_consent_${CONSENT_VERSION}`;

const defaultState: CookieConsentState = {
  essential: true,
  analytics: false,
  advertising: false,
  functional: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsentState;
        setConsent(parsed);
        updateConsentMode(parsed);
      } catch (e) {
        setIsBannerVisible(true);
      }
    } else {
      setIsBannerVisible(true);
    }
  }, []);

  const updateConsentMode = (state: CookieConsentState) => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag("consent", "update", {
        analytics_storage: state.analytics ? "granted" : "denied",
        ad_storage: state.advertising ? "granted" : "denied",
        ad_user_data: state.advertising ? "granted" : "denied",
        ad_personalization: state.advertising ? "granted" : "denied",
        personalization_storage: state.functional ? "granted" : "denied",
        functionality_storage: state.functional ? "granted" : "denied",
        security_storage: "granted", // essential
      });
    }
  };

  const persistAndApply = (state: CookieConsentState) => {
    setConsent(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateConsentMode(state);
    setIsBannerVisible(false);
    setModalOpen(false);
    
    // Dispatch a custom event to notify external listeners (like a Toast)
    window.dispatchEvent(new CustomEvent("cookie-consent-saved"));
  };

  const acceptAll = () => {
    persistAndApply({
      essential: true,
      analytics: true,
      advertising: true,
      functional: true,
    });
  };

  const rejectOptional = () => {
    persistAndApply(defaultState);
  };

  const savePreferences = (preferences: CookieConsentState) => {
    // Ensure essential is always true
    persistAndApply({ ...preferences, essential: true });
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        isBannerVisible,
        isModalOpen,
        setModalOpen,
        acceptAll,
        rejectOptional,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
