"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2, Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUploadSuccess?: (blob: Blob, filename: string) => void;
  acceptedTypes?: Record<string, string[]>;
  targetFormat: string;
}

export function FileUploader({ onUploadSuccess, acceptedTypes, targetFormat }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "converting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setErrorMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1, // Phase 2 limit to 1
  });

  const handleConvert = async () => {
    if (!file) return;
    
    setStatus("uploading");
    
    try {
      // Convert file to base64 to avoid Vercel FormData corruption
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      await new Promise<void>((resolve, reject) => {
        reader.onload = () => resolve();
        reader.onerror = (error) => reject(error);
      });

      const base64String = (reader.result as string).split(",")[1]; // Remove data URL prefix

      setStatus("converting");
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileBase64: base64String,
          targetFormat: targetFormat,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Conversion failed");
      }

      const json = await res.json();
      
      if (!json.data) {
        throw new Error("Server returned empty data.");
      }

      // Safely convert base64 to Blob using native browser fetch
      const dataUri = `data:image/${json.format};base64,${json.data}`;
      const blobRes = await fetch(dataUri);
      const blob = await blobRes.blob();
      
      setStatus("success");
      
      const newName = file.name.substring(0, file.name.lastIndexOf(".")) + "." + targetFormat;
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(newName);

      if (onUploadSuccess) {
        onUploadSuccess(blob, newName);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  const reset = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl(null);
    setDownloadName("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse from your computer
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <FileIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {status === "idle" && (
              <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:text-destructive">
                <X className="h-5 w-5" />
              </Button>
            )}
            
            {status === "success" && (
              <CheckCircle className="h-6 w-6 text-success" />
            )}
          </div>

          {status === "error" && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {errorMsg}
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            {status !== "success" && status !== "converting" && status !== "uploading" && (
              <Button onClick={handleConvert} className="w-full sm:w-auto">
                Convert to {targetFormat.toUpperCase()}
              </Button>
            )}
            
            {(status === "uploading" || status === "converting") && (
              <Button disabled className="w-full sm:w-auto">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status === "uploading" ? "Uploading..." : "Converting..."}
              </Button>
            )}
            
            {status === "success" && (
              <>
                <Button onClick={reset} variant="outline" className="w-full sm:w-auto">
                  Convert Another File
                </Button>
                {downloadUrl && (
                  <a 
                    href={downloadUrl} 
                    download={downloadName}
                    className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download {targetFormat.toUpperCase()}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
