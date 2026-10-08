import { Hero } from "@/components/home/hero";
import { SpecializedHubs } from "@/components/home/specialized-hubs";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FAQ } from "@/components/home/faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.converterforall.com',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://www.converterforall.com/#website",
                "url": "https://www.converterforall.com",
                "name": "ConverterForAll",
                "description": "Free, private file converter for PDFs, images, videos, audio, and Indic fonts. Convert files securely in your browser.",
                "publisher": {
                  "@id": "https://www.converterforall.com/#organization"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://www.converterforall.com/#organization",
                "name": "ConverterForAll",
                "url": "https://www.converterforall.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.converterforall.com/favicon.ico"
                }
              }
            ]
          })
        }}
      />
      <Hero />
      <SpecializedHubs />
      <HowItWorks />

      <Features />
      
      <FAQ />
    </>
  );
}
