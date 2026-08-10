import { ToolEngine } from "@/components/upload/tool-engine";
import { LiveRuler } from "@/components/tools/live-ruler";
import { CameraMeasure } from "@/components/tools/camera-measure";
import { LengthConverter } from "@/components/tools/length-converter";
import { AgeCalculator } from "@/components/tools/age-calculator";
import { QRGenerator } from "@/components/tools/qr-generator";
import { BarcodeGenerator } from "@/components/tools/barcode-generator";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { FuelCalculator } from "@/components/tools/fuel-calculator";
import { MileageCalculator } from "@/components/tools/mileage-calculator";
import { FontConverter } from "@/components/tools/font-converter";
import { FontDetector } from "@/components/tools/font-detector";
import { UnicodeTools } from "@/components/tools/unicode-tools";
import { PassportMaker } from "@/components/tools/passport-maker";
import OcrPdfTool from "@/components/tools/ocr-pdf";
import RepairPdfTool from "@/components/tools/repair-pdf";
import PdfToWordTool from "@/components/tools/pdf-to-word";
import WordToPdfTool from "@/components/tools/word-to-pdf";
import ImageCompressor from "@/components/tools/image-compressor";
import { QrScanner } from "@/components/tools/qr-scanner";
import { PresentationMaker } from "@/components/tools/presentation-maker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-db";
import { getToolContent } from "@/lib/tool-content";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const toolData = getToolBySlug(resolvedParams.slug);
  
  if (!toolData) {
    return { title: "Not Found" };
  }

  return {
    title: `${toolData.tool.title} - Free Online Converter`,
    description: toolData.tool.description,
    openGraph: {
      title: `${toolData.tool.title} - Free Online Converter`,
      description: toolData.tool.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolData.tool.title} - Free Online Converter`,
      description: toolData.tool.description,
    },
    alternates: {
      canonical: `https://converterforall.com/${resolvedParams.slug}`,
    }
  };
}

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const toolData = getToolBySlug(params.slug);
  
  if (!toolData) {
    notFound();
  }

  const { categorySlug, toolSlug, tool } = toolData;

  // Extract from/to from slug if it's a length converter (e.g. "inches-to-centimeters")
  let defaultFrom = "inches";
  let defaultTo = "centimeters";
  if ((tool as any).converterType === "length") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFrom = parts[0];
      defaultTo = parts[1];
    }
  }

  // Extract from/to from slug if it's a font converter
  let defaultFontFrom = "unicode";
  let defaultFontTo = "krutidev";
  if ((tool as any).converterType === "font") {
    const parts = toolSlug.split("-to-");
    if (parts.length === 2) {
      defaultFontFrom = parts[0];
      defaultFontTo = parts[1];
    }
  }

  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://converterforall.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": tool.title,
        "item": `https://converterforall.com/${toolSlug}`
      }
    ]
  };

  // Generate SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.title,
    "operatingSystem": "All",
    "applicationCategory": "UtilitiesApplication",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": tool.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Inject JSON-LD Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />

      <div className="mb-12 print:hidden flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors bg-muted/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-border/50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all tools
        </Link>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">
          {tool.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="relative mb-20">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[80%] max-w-3xl h-[80%] blur-[100px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-primary via-blue-400 to-purple-500 rounded-full" />
        </div>

        <div className={`${(tool as any).isInteractive ? '' : 'bg-background/60 backdrop-blur-xl rounded-3xl p-6 sm:p-12 border border-border/50 shadow-2xl'} relative z-10`}>
        {(tool as any).isInteractive ? (
          <>
            {toolSlug === "live-ruler" && <LiveRuler />}
            {toolSlug === "camera-measure" && <CameraMeasure />}
            {toolSlug === "age-calculator" && <AgeCalculator />}
            {toolSlug === "qr-generator" && <QRGenerator />}
            {toolSlug === "barcode-generator" && <BarcodeGenerator />}
            {toolSlug === "password-generator" && <PasswordGenerator />}
            {toolSlug === "fuel-calculator" && <FuelCalculator />}
            {toolSlug === "mileage-calculator" && <MileageCalculator />}
            {(tool as any).converterType === "length" && <LengthConverter defaultFrom={defaultFrom} defaultTo={defaultTo} />}
            {(tool as any).converterType === "font" && <FontConverter defaultFrom={defaultFontFrom} defaultTo={defaultFontTo} category={(tool as any).fontCategory} />}
            {(tool as any).converterType === "font-detector" && <FontDetector />}
            {(tool as any).converterType === "unicode-tools" && <UnicodeTools toolType={(tool as any).toolType} />}
            {toolSlug === "passport-photo-maker" && <PassportMaker />}
            {toolSlug === "ocr-pdf" && <OcrPdfTool />}
            {toolSlug === "repair-pdf" && <RepairPdfTool />}
            {toolSlug === "pdf-to-word" && <PdfToWordTool />}
            {toolSlug === "word-to-pdf" && <WordToPdfTool />}
            {(toolSlug === "compress-jpg" || toolSlug === "compress-png") && <ImageCompressor />}
            {toolSlug === "qr-scanner" && <QrScanner />}
            {toolSlug === "presentation-maker" && <PresentationMaker />}
          </>
        ) : (
          <ToolEngine 
            category={categorySlug}
            toolSlug={toolSlug}
            acceptedTypes={tool.acceptedTypes}
            targetFormat={tool.outputFormat}
            actionLabel={(tool as any).actionName}
          />
        )}
        </div>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none prose-lg print:hidden">
        {getToolContent(toolSlug, tool.title, tool.description).map((section, index) => (
          <section key={index} className="mb-12">
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        ))}
      </article>
    </div>
  );
}
