import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo/site-metadata";
import { GOOGLE_ANALYTICS_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION_TOKEN, ENABLE_VERCEL_ANALYTICS } from "@/lib/seo/site-config";
import { Inter, Geist, Caveat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = localFont({
  src: "../fonts/plus-jakarta-sans/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "400 800",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = siteMetadata;

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CookieConsentProvider } from "@/components/cookie-consent/cookie-context";
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";
import { CookieModal } from "@/components/cookie-consent/cookie-modal";
import { CookieToast } from "@/components/cookie-consent/cookie-toast";
import { ThirdPartyScripts } from "@/components/cookie-consent/third-party-scripts";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} antialiased h-full`} suppressHydrationWarning>
      <head>
        {/* Google Consent Mode v2 Default (Strict Denial) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'personalization_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted',
              });
            `,
          }}
        />
        {/* Google Analytics Script (Runs in consent mode) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_MEASUREMENT_ID}');
            `,
          }}
        />
        {/* Google Site Verification Placeholder */}
        <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION_TOKEN} />
      </head>
      <body className={cn(geist.variable, inter.variable, plusJakarta.variable, caveat.variable, "min-h-full flex flex-col font-sans antialiased bg-background text-foreground transition-colors duration-200")}>
        <CookieConsentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </div>
            
            {/* Cookie Consent UI */}
            <CookieBanner />
            <CookieModal />
            <CookieToast />
            <ThirdPartyScripts />
            {ENABLE_VERCEL_ANALYTICS && <Analytics />}
          </ThemeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
