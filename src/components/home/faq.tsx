"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const faqs = [
    {
      question: "Are my files uploaded to your servers?",
      answer: "No. Unlike most online converters, ConverterForAll processes your files entirely within your web browser using client-side technology (WebAssembly). Your files never leave your device, ensuring 100% privacy and security.",
    },
    {
      question: "Is this file converter actually free?",
      answer: "Yes, our converter is completely free to use. Because we don't have to pay for expensive cloud servers to process your files (your device does the processing), we don't need to charge subscription fees or put features behind a paywall.",
    },
    {
      question: "Is there a file size limit for conversions?",
      answer: "There are no artificial file size limits. However, because the processing happens in your browser, the maximum file size you can successfully convert depends on your device's available memory (RAM). For most modern devices, handling files up to several gigabytes is possible.",
    },
    {
      question: "Will I lose quality when converting video or audio?",
      answer: "No, we use industry-standard conversion algorithms (like FFmpeg) tuned to preserve the maximum possible quality. Unless you specifically choose to compress a file, the output quality will match the original input file.",
    },
    {
      question: "Do I need to install any software or apps?",
      answer: "Absolutely not. Everything runs directly inside your web browser. You do not need to download, install, or set up any third-party software, making it perfect for work or school computers.",
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 bg-background border-t">
      {/* Inject JSON-LD into the page for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about how our local file converter works.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={cn(
                "border rounded-xl transition-all duration-200 overflow-hidden",
                openIndex === index ? "bg-muted/30 border-primary/20" : "bg-card hover:bg-muted/10"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0",
                    openIndex === index && "rotate-180 text-primary"
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "grid transition-all duration-200 ease-in-out",
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
