import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://converterforall.com"),
  title: {
    default: "Private Online File Converter | 100% In-Browser & Serverless",
    template: "%s | ConverterForAll"
  },
  description: "Experience the next-gen client-side file converter. Our revolutionary WebAssembly technology processes your documents, images, and video directly inside your browser. No server uploads, zero wait times, and absolute privacy—your files never leave your device.",
  keywords: ["private file converter", "client-side converter", "in-browser file conversion", "serverless converter", "secure file converter", "free offline converter"],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: "ConverterForAll" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://converterforall.com",
    siteName: "ConverterForAll",
    title: "100% Private File Converter — Process Documents & Media Entirely on Your Device",
    description: "Experience the next-gen client-side file converter. Our revolutionary WebAssembly technology processes your documents, images, and video directly inside your browser. No server uploads, zero wait times, and absolute privacy—your files never leave your device.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Serverless File Converter: Fast, Free, and 100% Private",
    description: "Experience the next-gen client-side file converter. Our revolutionary WebAssembly technology processes your documents, images, and video directly inside your browser. No server uploads, zero wait times, and absolute privacy—your files never leave your device.",
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
      <body className="min-h-full flex flex-col font-sans">
        <CookieConsentProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            
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
