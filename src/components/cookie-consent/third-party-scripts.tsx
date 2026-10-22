"use client";

import Script from "next/script";
import { useCookieConsent } from "./cookie-context";

export function ThirdPartyScripts() {
  const { consent } = useCookieConsent();

  if (!consent) return null;

  return (
    <>
      {/* Google Analytics is loaded in layout.tsx using native Consent Mode v2 */}

      {/* Google AdSense - Only load if Advertising consent is granted */}
      {consent.advertising && (
        <Script 
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
