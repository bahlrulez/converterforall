import { Tool } from "@/lib/tools-db";

export type ProcessingClassification =
  | "cloud-opt-in"
  | "external-ai-mixed"
  | "client-ai"
  | "client-webcodecs"
  | "client-wasm-video"
  | "client-wasm-audio"
  | "client-wasm-pdf"
  | "client-wasm-font"
  | "client-canvas"
  | "client-browser-api"
  | "client-font-mapping"
  | "client-developer"
  | "client-script-utility"
  | "informational-guide"
  | "neutral-fallback";

export interface ToolProcessingBadges {
  classification: ProcessingClassification;
  heroBadge: string;
  trustBadge: string;
}

/**
 * Returns explicit per-tool processing classifications and trust disclosures based on the
 * real technical implementation of each tool in ConverterForAll:
 * - WebCodecs is ONLY assigned where actual WebCodecs AudioEncoder/VideoEncoder APIs are used (e.g. video-caption-generator).
 * - WebAssembly is cleanly distinguished between FFmpeg video engines, Web Audio transcoding, and PDF engines.
 * - Hardware and browser-native APIs (camera stream, screen recorder, measurement) are distinguished from Canvas.
 * - Cloud/external services (Cloudmersive, Google Gemini, external image lookups) are prominently disclosed.
 * - Unknown or unregistered tools fall back to a neutral, unverified description.
 */
export function getToolProcessingBadges(
  toolSlug: string,
  tool?: Tool,
  categorySlug?: string
): ToolProcessingBadges {
  // Raavi is an informational Unicode-font guide, not a text converter.
  if (toolSlug === "unicode-to-raavi") {
    return {
      classification: "informational-guide",
      heroBadge: "Punjabi Unicode Font Guide",
      trustBadge: "No character conversion required · Use an installed Gurmukhi font",
    };
  }

  // 1. External services & opt-in cloud engines
  if (toolSlug === "word-to-pdf" || toolSlug === "powerpoint-to-pdf") {
    return {
      classification: "cloud-opt-in",
      heroBadge: "Browser-first conversion · Optional Cloud Engine",
      trustBadge: "Local preview; Cloud conversion requires explicit selection (Cloudmersive API)",
    };
  }

  if (toolSlug === "presentation-maker") {
    return {
      classification: "external-ai-mixed",
      heroBadge: "In-Browser Slides & PPTX Export (AI via Google Gemini)",
      trustBadge: "AI prompts processed by Google Gemini; optional image lookups may contact external image providers; PPTX generated in browser",
    };
  }

  // 2. Genuine client-side on-device AI / ML models
  if (toolSlug === "remove-background") {
    return {
      classification: "client-ai",
      heroBadge: "Client-Side AI Background Remover",
      trustBadge: "Runs in-browser with @imgly ISNet model · No file upload",
    };
  }

  if (toolSlug === "image-to-text") {
    return {
      classification: "client-ai",
      heroBadge: "Client-Side OCR Text Extractor",
      trustBadge: "Optical character recognition via Tesseract OCR in browser",
    };
  }

  // 3. WebCodecs (only video-caption-generator uses WebCodecs VideoEncoder / AudioEncoder / Mediabunny muxer)
  if (toolSlug === "video-caption-generator") {
    return {
      classification: "client-webcodecs",
      heroBadge: "In-Browser AI Caption Studio",
      trustBadge: "Client-side transcription & WebCodecs video export",
    };
  }

  // 4. Browser-native hardware & device APIs
  if (toolSlug === "qr-scanner") {
    return {
      classification: "client-browser-api",
      heroBadge: "Browser-Native QR Scanner",
      trustBadge: "Camera stream processed locally in browser · No video transmitted",
    };
  }

  if (toolSlug === "live-ruler" || toolSlug === "camera-measure") {
    return {
      classification: "client-browser-api",
      heroBadge: "Interactive Browser Measurement Tool",
      trustBadge: "Runs in-browser · Uses screen DPI and device camera locally",
    };
  }

  if (toolSlug === "screen-recorder") {
    return {
      classification: "client-browser-api",
      heroBadge: "In-Browser Screen Recorder",
      trustBadge: "Browser MediaRecorder API · Captured in browser memory",
    };
  }

  // 5. WebAssembly Video Processors (FFmpeg.wasm)
  if (categorySlug === "video" || (tool && tool.inputFormat === "video")) {
    return {
      classification: "client-wasm-video",
      heroBadge: "In-Browser WebAssembly Video Processor",
      trustBadge: "WebAssembly FFmpeg video engine · Processed on your device",
    };
  }

  // 6. WebAssembly Audio Processors (FFmpeg.wasm / Web Audio API)
  if (categorySlug === "audio" || (tool && tool.inputFormat === "audio")) {
    return {
      classification: "client-wasm-audio",
      heroBadge: "In-Browser WebAssembly Audio Processor",
      trustBadge: "WebAssembly & Web Audio engine · Processed on your device",
    };
  }

  // 7. WebAssembly PDF & Font File Utilities
  if (
    toolSlug === "web-font-converter" ||
    toolSlug === "ttf-to-woff2" ||
    toolSlug === "otf-to-woff2" ||
    toolSlug === "woff2-to-ttf"
  ) {
    return {
      classification: "client-wasm-font",
      heroBadge: "In-Browser Font File Converter",
      trustBadge: "Client-side WebAssembly font engine · Processed on your device",
    };
  }

  const isPdfTool =
    categorySlug === "document" ||
    toolSlug.includes("pdf") ||
    (tool && (tool.outputFormat === "pdf" || tool.inputFormat === "pdf"));

  if (isPdfTool) {
    return {
      classification: "client-wasm-pdf",
      heroBadge: "In-Browser WebAssembly PDF Utility",
      trustBadge: "Client-side PDF engine · Documents stay in browser memory",
    };
  }

  // 8. Client-side Font & Unicode Character Mapping
  if (
    categorySlug === "fonts" ||
    (tool &&
      (tool.converterType === "font" ||
        tool.converterType === "unicode-tools" ||
        tool.converterType === "font-detector" ||
        tool.converterType === "font-text-fixer"))
  ) {
    return {
      classification: "client-font-mapping",
      heroBadge: "Client-Side Font & Unicode Converter",
      trustBadge: "In-browser character mapping · On-Device Browser Processing",
    };
  }

  // 9. Client-side Canvas Image Processors & Exam Utilities
  if (categorySlug === "image") {
    return {
      classification: "client-canvas",
      heroBadge: "In-Browser Image Converter",
      trustBadge: "Client-side Canvas & image processing · Runs in your browser",
    };
  }

  if (categorySlug === "exam") {
    return {
      classification: "client-canvas",
      heroBadge: "In-Browser Photo Utility",
      trustBadge: "Client-side image processing · Processed in browser memory",
    };
  }

  // 10. Client-side Developer Tools
  if (categorySlug === "developer") {
    return {
      classification: "client-developer",
      heroBadge: "Client-Side Developer Utility",
      trustBadge: "In-browser formatting & encoding · No data transmitted",
    };
  }

  // 11. Interactive Utilities & Calculators
  if (categorySlug === "utilities" || (tool && tool.converterType === "length")) {
    return {
      classification: "client-script-utility",
      heroBadge: "Client-Side Interactive Utility",
      trustBadge: "In-browser calculation & processing · No data stored",
    };
  }

  // 12. Neutral fallback for unclassified tools
  return {
    classification: "neutral-fallback",
    heroBadge: "Free Online Utility",
    trustBadge: "Browser-based file utility · No account required",
  };
}
