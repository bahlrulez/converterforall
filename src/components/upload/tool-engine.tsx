"use client";

import { FileUploader } from "./file-uploader";
import { processImage } from "@/lib/converters/image";
import { compressPdf } from "@/lib/converters/pdf";

interface ToolEngineProps {
  category: string;
  toolSlug: string;
  acceptedTypes: Record<string, string[]>;
  targetFormat: string;
  actionLabel?: string;
}

export function ToolEngine({ category, toolSlug, acceptedTypes, targetFormat, actionLabel }: ToolEngineProps) {
  
  const handleProcessFile = async (file: File) => {
    let blob: Blob;

    if (category === "image") {
      blob = await processImage(file, targetFormat);
    } else if (category === "document" && toolSlug === "compress-pdf") {
      blob = await compressPdf(file);
    } else {
      throw new Error("This tool is not yet fully implemented for client-side processing.");
    }

    const newName = file.name.substring(0, file.name.lastIndexOf(".")) + "." + targetFormat;
    
    return {
      blob,
      filename: newName
    };
  };

  return (
    <FileUploader 
      acceptedTypes={acceptedTypes}
      actionLabel={actionLabel || `Convert to ${targetFormat.toUpperCase()}`}
      onProcessFile={handleProcessFile}
    />
  );
}
