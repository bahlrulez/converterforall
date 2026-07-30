"use client";

import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { processImage } from "@/lib/converters/image";
import { compressPdf, CompressionPreset } from "@/lib/converters/pdf";

interface ToolEngineProps {
  category: string;
  toolSlug: string;
  acceptedTypes: Record<string, string[]>;
  targetFormat: string;
  actionLabel?: string;
}

export function ToolEngine({ category, toolSlug, acceptedTypes, targetFormat, actionLabel }: ToolEngineProps) {
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>("balanced");
  
  const handleProcessFile = async (file: File) => {
    let blob: Blob;

    if (category === "image") {
      blob = await processImage(file, targetFormat);
    } else if (category === "document" && toolSlug === "compress-pdf") {
      blob = await compressPdf(file, compressionPreset);
    } else {
      throw new Error("This tool is not yet fully implemented for client-side processing.");
    }

    const newName = file.name.substring(0, file.name.lastIndexOf(".")) + "." + targetFormat;
    
    return {
      blob,
      filename: newName
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

  return (
    <FileUploader 
      acceptedTypes={acceptedTypes}
      actionLabel={actionLabel || `Convert to ${targetFormat.toUpperCase()}`}
      onProcessFile={handleProcessFile}
      optionsRenderer={category === "document" && toolSlug === "compress-pdf" ? renderPdfCompressionOptions : undefined}
    />
  );
}
