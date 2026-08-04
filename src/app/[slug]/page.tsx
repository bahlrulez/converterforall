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

      <div className="mb-8 print:hidden">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all tools
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          {tool.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <div className={`${(tool as any).isInteractive ? '' : 'bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm'} mb-16`}>
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
