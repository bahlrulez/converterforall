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
    default: "ConverterForAll - Free Online File Converter",
    template: "%s | ConverterForAll"
  },
  description: "One Platform. Every Conversion. Fast, Secure, and Free. Convert documents, images, video, and audio instantly in your browser.",
  keywords: ["file converter", "online converter", "free converter", "pdf converter", "image converter"],
  authors: [{ name: "ConverterForAll" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://converterforall.com",
    siteName: "ConverterForAll",
    title: "ConverterForAll - Free Online File Converter",
    description: "One Platform. Every Conversion. Fast, Secure, and Free. Convert documents, images, video, and audio instantly in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConverterForAll - Free Online File Converter",
    description: "One Platform. Every Conversion. Fast, Secure, and Free. Convert documents, images, video, and audio instantly in your browser.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} antialiased h-full`} suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 Placeholder */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Microsoft Clarity Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "XXXXXXX");
            `,
          }}
        />
        {/* Google Site Verification Placeholder */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_SITE_VERIFICATION_TOKEN" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
