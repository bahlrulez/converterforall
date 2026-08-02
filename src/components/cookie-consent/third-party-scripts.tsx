"use client";

import Script from "next/script";
import { useCookieConsent } from "./cookie-context";

export function ThirdPartyScripts() {
  const { consent } = useCookieConsent();

  if (!consent) return null;

  return (
    <>
      {/* Google Analytics 4 - Only load if Analytics consent is granted */}
      {consent.analytics && (
        <>
          <Script 
            strategy="lazyOnload"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" 
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `}
          </Script>

          {/* Microsoft Clarity - Only load if Analytics consent is granted */}
          <Script id="microsoft-clarity" strategy="lazyOnload">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "XXXXXXX");
            `}
          </Script>
        </>
      )}

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
