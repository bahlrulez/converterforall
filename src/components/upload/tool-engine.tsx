"use client";

import { useEffect, useState } from "react";
import { FileUploader } from "./file-uploader";
import { MultiFileUploader } from "./multi-file-uploader";
import { processImage, removeImageBackground, BgRemovalQuality } from "@/lib/converters/image";
import { compressPdf, imageToPdf, mergePdfs, removePages, extractPages, organizePdf, splitPdf, CompressionPreset } from "@/lib/converters/pdf";
import { convertWordToPdf } from "@/lib/converters/word";
import { convertVideo } from "@/lib/converters/video";

interface ToolEngineProps {
  category: string;
  toolSlug: string;
  acceptedTypes: Record<string, string[]>;
  targetFormat: string;
  actionLabel?: string;
}

export function ToolEngine({ category, toolSlug, acceptedTypes, targetFormat, actionLabel }: ToolEngineProps) {
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>("balanced");
  const [bgQuality, setBgQuality] = useState<BgRemovalQuality>("isnet_fp16");
  const [pageSelection, setPageSelection] = useState<string>("");

  // Fix for Next.js SPA navigation wiping out COOP/COEP headers
  useEffect(() => {
    if (category === "video" && typeof SharedArrayBuffer === "undefined") {
      window.location.reload();
    }
  }, [category]);
  
  const handleProcessFile = async (file: File, onProgress?: (p: number) => void) => {
    let blob: Blob;
    let finalFormat = targetFormat;

    if (category === "image" && toolSlug === "remove-background") {
      blob = await removeImageBackground(file, bgQuality);
    } else if (category === "image") {
      blob = await processImage(file, targetFormat);
    } else if (category === "document" && toolSlug === "compress-pdf") {
      blob = await compressPdf(file, compressionPreset);
    } else if (category === "document" && (toolSlug === "jpg-to-pdf" || toolSlug === "scan-to-pdf")) {
      blob = await imageToPdf(file);
    } else if (category === "document" && toolSlug === "word-to-pdf") {
      blob = await convertWordToPdf(file);
    } else if (category === "document" && toolSlug === "remove-pages") {
      blob = await removePages(file, pageSelection);
    } else if (category === "document" && toolSlug === "extract-pages") {
      blob = await extractPages(file, pageSelection);
    } else if (category === "document" && toolSlug === "organize-pdf") {
      blob = await organizePdf(file, pageSelection);
    } else if (category === "document" && toolSlug === "split-pdf") {
      blob = await splitPdf(file);
      finalFormat = "zip";
    } else if (category === "video") {
      blob = await convertVideo(file, targetFormat, (p) => {
        if (onProgress) onProgress(p);
      });
    } else {
      throw new Error("This tool is not yet fully implemented for client-side processing.");
    }

    const newName = file.name.substring(0, file.name.lastIndexOf(".")) + "." + finalFormat;
    
    return {
      blob,
      filename: newName
    };
  };

  const handleProcessFiles = async (files: File[]) => {
    let blob: Blob;

    if (category === "document" && toolSlug === "merge-pdf") {
      blob = await mergePdfs(files);
    } else {
      throw new Error("This tool is not yet fully implemented for multi-file processing.");
    }

    return {
      blob,
      filename: "merged_document.pdf"
    };
  };

  const renderPdfCompressionOptions = (disabled: boolean) => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Compression Level</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            disabled={disabled}
            onClick={() => setCompressionPreset("max")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              compressionPreset === "max" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Extreme</span>
            <span className="text-xs mt-1">Less quality, high compression</span>
          </button>
          
          <button
            disabled={disabled}
            onClick={() => setCompressionPreset("balanced")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              compressionPreset === "balanced" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Recommended</span>
            <span className="text-xs mt-1">Good quality, good compression</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => setCompressionPreset("lossless")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              compressionPreset === "lossless" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Less</span>
            <span className="text-xs mt-1">High quality, less compression</span>
          </button>
        </div>
      </div>
    );
  };

  const renderBgRemovalOptions = (disabled: boolean) => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">AI Model Quality</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            disabled={disabled}
            onClick={() => setBgQuality("isnet_quint8")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              bgQuality === "isnet_quint8" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Fast</span>
            <span className="text-xs mt-1">Quickest, minor artifacts</span>
          </button>
          
          <button
            disabled={disabled}
            onClick={() => setBgQuality("isnet_fp16")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              bgQuality === "isnet_fp16" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Balanced</span>
            <span className="text-xs mt-1">Good speed and quality</span>
          </button>

          <button
            disabled={disabled}
            onClick={() => setBgQuality("isnet")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
              bgQuality === "isnet" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            }`}
          >
            <span className="font-semibold text-sm">Maximum Quality</span>
            <span className="text-xs mt-1">Slower, but highest accuracy</span>
          </button>
        </div>
      </div>
    );
  };

  const isPageSelector = ["remove-pages", "extract-pages", "organize-pdf"].includes(toolSlug);
  
  const renderPageSelectionOptions = (disabled: boolean) => {
    let helperText = "Enter page numbers (e.g. 1, 3, 5-8)";
    if (toolSlug === "organize-pdf") {
      helperText = "Enter new page order (e.g. 3, 1, 2, 4-6)";
    }

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">
          {toolSlug === "organize-pdf" ? "Page Order" : "Pages to Select"}
        </h3>
        <input 
          type="text" 
          value={pageSelection}
          onChange={(e) => setPageSelection(e.target.value)}
          placeholder="e.g. 1, 3, 5-8"
          disabled={disabled}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground">{helperText}</p>
      </div>
    );
  };

  if (toolSlug === "merge-pdf") {
    return (
      <MultiFileUploader 
        acceptedTypes={acceptedTypes}
        actionLabel={actionLabel || "Merge PDFs"}
        onProcessFiles={handleProcessFiles}
      />
    );
  }

  const isCompressPdf = category === "document" && toolSlug === "compress-pdf";
  const isRemoveBg = category === "image" && toolSlug === "remove-background";

  return (
    <FileUploader 
      acceptedTypes={acceptedTypes}
      actionLabel={actionLabel || (isRemoveBg ? "Remove Background" : `Convert to ${targetFormat.toUpperCase()}`)}
      onProcessFile={handleProcessFile}
      allowCamera={toolSlug === "scan-to-pdf"}
      optionsRenderer={
        isCompressPdf ? renderPdfCompressionOptions : 
        isRemoveBg ? renderBgRemovalOptions : 
        isPageSelector ? renderPageSelectionOptions : undefined
      }
    />
  );
}
