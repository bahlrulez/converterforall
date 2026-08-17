"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { ToolEngine } from "@/components/upload/tool-engine";

const ToolLoading = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading interactive tool...</p>
  </div>
);

// Client-only dynamic imports to prevent server-side Node.js crashes (DOMMatrix, canvas, WebWorker)
const LiveRuler = dynamic(() => import("@/components/tools/live-ruler").then(m => m.LiveRuler), { ssr: false, loading: ToolLoading });
const CameraMeasure = dynamic(() => import("@/components/tools/camera-measure").then(m => m.CameraMeasure), { ssr: false, loading: ToolLoading });
const LengthConverter = dynamic(() => import("@/components/tools/length-converter").then(m => m.LengthConverter), { ssr: false, loading: ToolLoading });
const AgeCalculator = dynamic(() => import("@/components/tools/age-calculator").then(m => m.AgeCalculator), { ssr: false, loading: ToolLoading });
const QRGenerator = dynamic(() => import("@/components/tools/qr-generator").then(m => m.QRGenerator), { ssr: false, loading: ToolLoading });
const BarcodeGenerator = dynamic(() => import("@/components/tools/barcode-generator").then(m => m.BarcodeGenerator), { ssr: false, loading: ToolLoading });
const PasswordGenerator = dynamic(() => import("@/components/tools/password-generator").then(m => m.PasswordGenerator), { ssr: false, loading: ToolLoading });
const FuelCalculator = dynamic(() => import("@/components/tools/fuel-calculator").then(m => m.FuelCalculator), { ssr: false, loading: ToolLoading });
const MileageCalculator = dynamic(() => import("@/components/tools/mileage-calculator").then(m => m.MileageCalculator), { ssr: false, loading: ToolLoading });
const FontConverter = dynamic(() => import("@/components/tools/font-converter").then(m => m.FontConverter), { ssr: false, loading: ToolLoading });
const FontDetector = dynamic(() => import("@/components/tools/font-detector").then(m => m.FontDetector), { ssr: false, loading: ToolLoading });
const UnicodeTools = dynamic(() => import("@/components/tools/unicode-tools").then(m => m.UnicodeTools), { ssr: false, loading: ToolLoading });
const PassportMaker = dynamic(() => import("@/components/tools/passport-maker").then(m => m.PassportMaker), { ssr: false, loading: ToolLoading });
const OcrPdfTool = dynamic(() => import("@/components/tools/ocr-pdf"), { ssr: false, loading: ToolLoading });
const RepairPdfTool = dynamic(() => import("@/components/tools/repair-pdf"), { ssr: false, loading: ToolLoading });
const PdfToWordTool = dynamic(() => import("@/components/tools/pdf-to-word"), { ssr: false, loading: ToolLoading });
const WordToPdfTool = dynamic(() => import("@/components/tools/word-to-pdf"), { ssr: false, loading: ToolLoading });
const ImageCompressor = dynamic(() => import("@/components/tools/image-compressor"), { ssr: false, loading: ToolLoading });
const QrScanner = dynamic(() => import("@/components/tools/qr-scanner").then(m => m.QrScanner), { ssr: false, loading: ToolLoading });
const PresentationMaker = dynamic(() => import("@/components/tools/presentation-maker").then(m => m.PresentationMaker), { ssr: false, loading: ToolLoading });
const MergePdfTool = dynamic(() => import("@/components/tools/merge-pdf"), { ssr: false, loading: ToolLoading });
const ScreenRecorder = dynamic(() => import("@/components/tools/screen-recorder").then(m => m.ScreenRecorder), { ssr: false, loading: ToolLoading });

interface ToolRendererProps {
  toolSlug: string;
  categorySlug: string;
  tool: any;
  defaultFrom: string;
  defaultTo: string;
  defaultFontFrom: string;
  defaultFontTo: string;
}

export function ToolRenderer({
  toolSlug,
  categorySlug,
  tool,
  defaultFrom,
  defaultTo,
  defaultFontFrom,
  defaultFontTo
}: ToolRendererProps) {
  if (tool.isInteractive) {
    return (
      <>
        {toolSlug === "live-ruler" && <LiveRuler />}
        {toolSlug === "camera-measure" && <CameraMeasure />}
        {toolSlug === "age-calculator" && <AgeCalculator />}
        {toolSlug === "qr-generator" && <QRGenerator />}
        {toolSlug === "barcode-generator" && <BarcodeGenerator />}
        {toolSlug === "password-generator" && <PasswordGenerator />}
        {toolSlug === "fuel-calculator" && <FuelCalculator />}
        {toolSlug === "mileage-calculator" && <MileageCalculator />}
        {tool.converterType === "length" && <LengthConverter defaultFrom={defaultFrom} defaultTo={defaultTo} />}
        {tool.converterType === "font" && <FontConverter defaultFrom={defaultFontFrom} defaultTo={defaultFontTo} category={tool.fontCategory} />}
        {tool.converterType === "font-detector" && <FontDetector />}
        {tool.converterType === "unicode-tools" && <UnicodeTools toolType={tool.toolType} />}
        {toolSlug === "passport-photo-maker" && <PassportMaker />}
        {toolSlug === "ocr-pdf" && <OcrPdfTool />}
        {toolSlug === "repair-pdf" && <RepairPdfTool />}
        {toolSlug === "pdf-to-word" && <PdfToWordTool />}
        {toolSlug === "word-to-pdf" && <WordToPdfTool />}
        {(toolSlug === "compress-jpg" || toolSlug === "compress-png") && <ImageCompressor />}
        {toolSlug === "qr-scanner" && <QrScanner />}
        {toolSlug === "presentation-maker" && <PresentationMaker />}
        {toolSlug === "merge-pdf" && <MergePdfTool />}
        {toolSlug === "screen-recorder" && <ScreenRecorder />}
      </>
    );
  }

  return (
    <ToolEngine 
      category={categorySlug}
      toolSlug={toolSlug}
      acceptedTypes={tool.acceptedTypes}
      targetFormat={tool.outputFormat}
      actionLabel={tool.actionName}
    />
  );
}
