import { Hero } from "@/components/home/hero";
import { SpecializedHubs } from "@/components/home/specialized-hubs";
import { HowItWorks } from "@/components/home/how-it-works";
import { Features } from "@/components/home/features";
import { FAQ } from "@/components/home/faq";
import { Metadata } from "next";
import { buildHomepageGraphSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  keywords: [
    "free file converter",
    "online pdf tools",
    "private image converter",
    "in-browser converter",
    "remove image background",
    "kruti dev to unicode",
    "video compressor online",
    "free pdf merge",
    "convert docx to pdf",
    "indic font converter",
  ],
  alternates: {
    canonical: 'https://www.converterforall.com',
  },
};

export default function Home() {
  const homepageSchema = buildHomepageGraphSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema)
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
