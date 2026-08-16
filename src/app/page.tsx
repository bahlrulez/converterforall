import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FAQ } from "@/components/home/faq";
import { AllToolsGrid } from "@/components/home/all-tools-grid";

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
                "@id": "https://converterforall.com/#website",
                "url": "https://converterforall.com/",
                "name": "ConverterForAll",
                "description": "One Platform. Every Conversion. Fast, Secure, and Free.",
                "publisher": {
                  "@id": "https://converterforall.com/#organization"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://converterforall.com/#organization",
                "name": "ConverterForAll",
                "url": "https://converterforall.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://converterforall.com/favicon.ico"
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
