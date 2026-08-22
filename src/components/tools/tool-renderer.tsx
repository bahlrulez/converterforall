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
const PdfMetadataCleanerComponent = dynamic(() => import("@/components/tools/pdf-metadata-cleaner").then(m => m.default), { ssr: false, loading: ToolLoading });
const PdfEditor = dynamic(() => import("@/components/tools/pdf-editor").then(m => m.PdfEditor), { ssr: false, loading: ToolLoading });
const JwtDecoder = dynamic(() => import("@/components/tools/jwt-decoder").then(m => m.JwtDecoder), { ssr: false, loading: ToolLoading });
const JsonFormatter = dynamic(() => import("@/components/tools/json-formatter").then(m => m.JsonFormatter), { ssr: false, loading: ToolLoading });
const JsonCsvConverter = dynamic(() => import("@/components/tools/json-csv-converter").then(m => m.JsonCsvConverter), { ssr: false, loading: ToolLoading });
const Base64Converter = dynamic(() => import("@/components/tools/base64-converter").then(m => m.Base64Converter), { ssr: false, loading: ToolLoading });
const TimestampConverter = dynamic(() => import("@/components/tools/timestamp-converter").then(m => m.TimestampConverter), { ssr: false, loading: ToolLoading });
const UuidGenerator = dynamic(() => import("@/components/tools/uuid-generator").then(m => m.UuidGenerator), { ssr: false, loading: ToolLoading });
const VideoCompressor = dynamic(() => import("@/components/tools/video-compressor").then(m => m.VideoCompressor), { ssr: false, loading: ToolLoading });
const CompressPdfTool = dynamic(() => import("@/components/tools/compress-pdf").then(m => m.CompressPdfTool), { ssr: false, loading: ToolLoading });
const ImageToSvgComponent = dynamic(() => import("@/components/tools/image-to-svg").then(m => m.default), { ssr: false, loading: ToolLoading });
const AudioTrimmerComponent = dynamic(() => import("@/components/tools/audio-trimmer").then(m => m.default), { ssr: false, loading: ToolLoading });

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
        {toolSlug === "compress-pdf" && <CompressPdfTool />}
        {(toolSlug === "clean-pdf-metadata" || toolSlug === "remove-pdf-properties" || toolSlug === "pdf-privacy-scrubber") && <PdfMetadataCleanerComponent />}
        {toolSlug === "ocr-pdf" && <OcrPdfTool />}
        {toolSlug === "repair-pdf" && <RepairPdfTool />}
        {toolSlug === "pdf-to-word" && <PdfToWordTool />}
        {toolSlug === "word-to-pdf" && <WordToPdfTool />}
        {toolSlug === "presentation-maker" && <PresentationMaker />}
        {(toolSlug === "compress-jpg" || toolSlug === "compress-png") && <ImageCompressor />}
        {(toolSlug === "compress-video" || toolSlug === "video-compressor" || toolSlug.startsWith("compress-video-") || toolSlug.startsWith("compress-mp4") || toolSlug.startsWith("compress-mov") || toolSlug.startsWith("compress-mkv") || toolSlug.startsWith("compress-avi") || toolSlug.startsWith("compress-webm") || toolSlug.startsWith("compress-wmv") || toolSlug.startsWith("compress-flv")) && <VideoCompressor toolSlug={toolSlug} />}
        {toolSlug === "qr-scanner" && <QrScanner />}
        {(toolSlug === "compress-pdf" || toolSlug === "pdf-compressor" || toolSlug === "reduce-pdf-size") && <CompressPdfTool />}
        {toolSlug === "merge-pdf" && <MergePdfTool />}
        {toolSlug === "screen-recorder" && <ScreenRecorder />}
        {(toolSlug === "edit-pdf" || toolSlug === "pdf-editor" || toolSlug === "annotate-pdf" || toolSlug === "sign-pdf") && <PdfEditor />}
        {toolSlug === "image-to-svg" && <ImageToSvgComponent />}
        {(toolSlug === "trim-audio" || toolSlug === "trim-mp3-online" || toolSlug === "cut-audio-free" || toolSlug === "private-audio-trimmer" || toolSlug === "convert-whatsapp-voice-note-to-mp3") && <AudioTrimmerComponent />}
        
        {/* Data & Code Tools */}
        {(toolSlug === "jwt-decoder" || toolSlug === "decode-jwt") && <JwtDecoder />}
        {(toolSlug === "json-formatter" || toolSlug === "json-validator" || toolSlug === "format-json") && <JsonFormatter />}
        {toolSlug === "json-to-csv" && <JsonCsvConverter defaultDirection="json-to-csv" />}
        {toolSlug === "csv-to-json" && <JsonCsvConverter defaultDirection="csv-to-json" />}
        {(toolSlug === "base64-encoder-decoder" || toolSlug === "base64-encode" || toolSlug === "base64-decode" || toolSlug === "base64-converter") && <Base64Converter />}
        {(toolSlug === "unix-timestamp-converter" || toolSlug === "timestamp-converter" || toolSlug === "epoch-converter") && <TimestampConverter />}
        {(toolSlug === "uuid-generator" || toolSlug === "uuid-validator" || toolSlug === "guid-generator") && <UuidGenerator />}
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
