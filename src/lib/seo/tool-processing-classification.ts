import { Tool } from "@/lib/tools-db";

export type ProcessingClassification =
  | "cloud-opt-in"
  | "external-ai"
  | "client-ai"
  | "client-wasm-pdf"
  | "client-wasm-media"
  | "client-canvas-image"
  | "client-font"
  | "client-developer"
  | "client-utility"
  | "neutral-fallback";

export interface ToolProcessingBadges {
  classification: ProcessingClassification;
  heroBadge: string;
  trustBadge: string;
}

/**
 * Returns explicit per-tool processing classifications and trust disclosures.
 * Replaces blanket marketing claims with truthful technical indicators:
 * - Cloud/external services (Cloudmersive, Google Gemini) are explicitly disclosed.
 * - Genuine on-device engines (ISNet, Tesseract, WebCodecs, WebAssembly, Canvas) are noted.
 * - Unclassified utilities fall back to neutral descriptions without unverified local claims.
 */
export function getToolProcessingBadges(
  toolSlug: string,
  tool?: Tool,
  categorySlug?: string
): ToolProcessingBadges {
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
      classification: "external-ai",
      heroBadge: "In-Browser Slides & PPTX Export (AI via Google Gemini)",
      trustBadge: "AI prompts processed by Google Gemini; PPTX generated in browser",
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

  if (toolSlug === "video-caption-generator") {
    return {
      classification: "client-ai",
      heroBadge: "In-Browser AI Caption Studio",
      trustBadge: "Client-side transcription & WebCodecs video export",
    };
  }

  // 3. Genuine client-side WebAssembly PDF utilities
  const isPdfTool =
    categorySlug === "document" ||
    toolSlug.includes("pdf") ||
    tool?.outputFormat === "pdf" ||
    tool?.inputFormat === "pdf";

  if (isPdfTool && categorySlug === "document") {
    return {
      classification: "client-wasm-pdf",
      heroBadge: "In-Browser WebAssembly PDF Utility",
      trustBadge: "Client-side PDF engine · Documents stay in browser memory",
    };
  }

  // 4. Genuine client-side Media / WebCodecs / WebAssembly
  if (categorySlug === "video" || categorySlug === "audio") {
    return {
      classification: "client-wasm-media",
      heroBadge: "In-Browser Media Processor",
      trustBadge: "WebAssembly & WebCodecs engine · Processed on your device",
    };
  }

  // 5. Client-side Font & Unicode mapping
  if (categorySlug === "fonts" || tool?.converterType === "font") {
    return {
      classification: "client-font",
      heroBadge: "Client-Side Font & Unicode Converter",
      trustBadge: "In-browser character mapping · On-Device Browser Processing",
    };
  }

  // 6. Client-side Image / Canvas / Exam tools
  if (categorySlug === "image") {
    return {
      classification: "client-canvas-image",
      heroBadge: "In-Browser Image Converter",
      trustBadge: "Client-side Canvas & image processing · No uploads",
    };
  }

  if (categorySlug === "exam") {
    return {
      classification: "client-canvas-image",
      heroBadge: "In-Browser Photo Utility",
      trustBadge: "Client-side image processing · Files stay on your device",
    };
  }

  // 7. Client-side Developer and Interactive Utilities
  if (categorySlug === "developer") {
    return {
      classification: "client-developer",
      heroBadge: "Client-Side Developer Utility",
      trustBadge: "In-browser formatting & encoding · No data transmitted",
    };
  }

  if (categorySlug === "utilities" || tool?.converterType === "length") {
    return {
      classification: "client-utility",
      heroBadge: "Client-Side Interactive Utility",
      trustBadge: "In-browser calculation & processing · No data stored",
    };
  }

  // 8. Neutral fallback for unclassified tools (no unverified local-only claims)
  return {
    classification: "neutral-fallback",
    heroBadge: "Free Online Utility",
    trustBadge: "Browser-based file utility · No account required",
  };
}
