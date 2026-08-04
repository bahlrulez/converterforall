"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const faqs = [
    {
      question: "Is it safe to use online converters?",
      answer: "Yes, but it depends on the converter you use. Many online converters upload your personal files to their servers, which can be a privacy risk. ConverterForAll is uniquely safe because it processes your files entirely within your own web browser. Your files never leave your device, ensuring complete privacy and 100% data security.",
    },
    {
      question: "What is the best free converter?",
      answer: "The best free converter is one that is fast, secure, and doesn't limit your usage. ConverterForAll is widely considered the best because it runs locally on your device, meaning there are no artificial file size limits, no waiting in server queues, and absolutely zero hidden fees or premium subscriptions.",
    },
    {
      question: "Is FreeConvert really free?",
      answer: "While many platforms brand themselves as free, they often restrict features behind paywalls or limit your daily conversions. ConverterForAll, however, is a genuinely 100% free tool. Because we use your device's processing power instead of expensive cloud servers, we can offer unlimited, high-quality file conversions without ever asking for a credit card.",
    },
    {
      question: "What is this convert?",
      answer: "ConverterForAll is a next-generation web application that lets you convert files between different formats (like PDF, JPG, MP4, and more) instantly. Instead of uploading your files to a remote server, it uses advanced WebAssembly technology to perform the conversion directly inside your browser for maximum speed and security.",
    },
    {
      question: "What is the best free image converter?",
      answer: "For converting images like JPG, PNG, WebP, or HEIC, ConverterForAll stands out as the best free option. It offers lightning-fast, high-quality image conversion directly on your device, ensuring your private photos remain secure. Plus, it handles bulk conversions instantly without any annoying usage limits.",
    },
    {
      question: "Which is the safest PDF converter?",
      answer: "The safest PDF converter is one that never stores or reads your documents. ConverterForAll is the most secure choice for PDF conversions because it works offline-first within your browser. Whether you are converting sensitive financial documents or personal records, your PDFs are never uploaded to the internet, guaranteeing total confidentiality.",
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
