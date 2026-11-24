import type { Metadata } from "next";
import { SITE_ORIGIN, SITE_TITLE_TEMPLATE } from "./site-config";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Free Online File Converter | Browser-First PDF, Image, Video & Font Tools",
    template: SITE_TITLE_TEMPLATE
  },
  description: "Convert PDFs, images, videos, audio, and Indic fonts easily. Most tools run directly in your browser so files stay on your device; optional cloud and AI features use external processing. No registration required.",
  authors: [{ name: "ConverterForAll" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_ORIGIN,
    siteName: "ConverterForAll",
    title: "Free Online File Converter | Browser-First PDF, Image, Video & Font Tools",
    description: "Most tools process files locally in your browser. Selected features offer optional cloud conversion or AI generation through external services. No registration required.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ConverterForAll - Browser-First Online File Converter",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online File Converter | Browser-First PDF, Image & Video Tools",
    description: "Most file tools run locally in your browser. Selected features offer optional cloud or AI-assisted processing. No registration required.",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/icon.png",
  },
};
