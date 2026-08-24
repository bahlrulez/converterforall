import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FAQ } from "@/components/home/faq";
import { AllToolsGrid } from "@/components/home/all-tools-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://www.converterforall.com/',
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
                "url": "https://www.converterforall.com/",
                "name": "ConverterForAll",
                "description": "Next-gen client-side file converter powered by WebGPU, WebGL, and WebAssembly.",
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
      
      <HowItWorks />
      
      <AllToolsGrid />

      <Features />
      
      <FAQ />
    </>
  );
}
