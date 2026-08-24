import type { Metadata } from "next";
import { Inter, Geist, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.converterforall.com"),
  title: {
    default: "Free Private File Converter | WebGPU, WebGL & In-Browser WASM",
    template: "%s | ConverterForAll"
  },
  description: "Next-gen client-side file converter powered by WebGPU, WebGL, and WebAssembly. Convert PDFs, images, videos, audio, and Indic fonts locally on your device with zero cloud uploads and total privacy.",
  keywords: [
    "WebGPU file converter",
    "WebGL image converter",
    "private file converter",
    "client-side file converter",
    "AI background remover WebGPU",
    "Kruti Dev to Unicode Mangal",
    "in-browser video compressor",
    "free PDF converter no upload",
    "serverless file conversion",
    "100% offline file tools"
  ],
  authors: [{ name: "ConverterForAll" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.converterforall.com",
    siteName: "ConverterForAll",
    title: "100% Private File Converter — WebGPU & In-Browser WASM Engine",
    description: "Convert PDFs, images, videos, audio, and regional Indic fonts directly on your device using WebGPU and WebAssembly. Zero cloud uploads, total privacy.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ConverterForAll - Private Online File Converter",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebGPU & WASM File Converter: 100% Private, Fast & Free",
    description: "Convert PDFs, images, videos, and fonts locally on your device using WebGPU hardware acceleration. Zero server uploads.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-49NFK7K9W6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-49NFK7K9W6');
            `,
          }}
        />
        {/* Google Site Verification Placeholder */}
        <meta name="google-site-verification" content="google8e488f91621932b6" />
      </head>
      <body className={cn(geist.variable, inter.variable, plusJakarta.variable, caveat.variable, "min-h-full flex flex-col font-sans antialiased")}>
        <CookieConsentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
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
            <Analytics />
          </ThemeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
