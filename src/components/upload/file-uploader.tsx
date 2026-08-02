"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2, Download, Camera } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import heic2any from "heic2any";

interface FileUploaderProps {
  onProcessFile: (file: File, onProgress?: (progress: number) => void) => Promise<{ blob: Blob, filename: string }>;
  acceptedTypes?: Record<string, string[]>;
  actionLabel?: string;
  optionsRenderer?: (disabled: boolean) => React.ReactNode;
  allowCamera?: boolean;
}

export function FileUploader({ onProcessFile, acceptedTypes, actionLabel = "Process File", optionsRenderer, allowCamera = false }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "converting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setErrorMsg("");
    }
  };

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
      setStatus("converting");
      setProgress(0);

      // Delegate processing to the specialized engine
      const { blob, filename } = await onProcessFile(file, (p) => setProgress(p));

      setStatus("success");

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(filename);

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
    setDownloadBlob(null);
    setDownloadName("");
    setProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {!file ? (
        <div className="flex flex-col gap-4">
          <div
            {...getRootProps()}
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${isDragActive
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

          {allowCamera && (
            <div className="flex justify-center mt-2">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
              />
              <Button
                variant="outline"
                className="w-full sm:w-auto border-dashed border-2 hover:bg-muted/50"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
            </div>
          )}
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

          {optionsRenderer && status === "idle" && (
            <div className="mt-6 border-t pt-4">
              {optionsRenderer(status !== "idle")}
            </div>
          )}

          {status === "converting" && progress > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            {status !== "success" && status !== "converting" && status !== "uploading" && (
              <Button onClick={handleConvert} className="w-full sm:w-auto">
                {actionLabel}
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
                  <Button 
                    onClick={() => {
                      const finalName = downloadName || 'converted_file.mp3';
                      
                      // For smaller files (<50MB), Data URLs are 100% immune to Chrome's Blob URL UUID bug in COEP contexts
                      if (downloadBlob && downloadBlob.size < 50 * 1024 * 1024) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const a = document.createElement('a');
                          a.href = reader.result as string;
                          a.download = finalName;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        };
                        reader.readAsDataURL(downloadBlob);
                      } else {
                        // Fallback for huge files where Base64 conversion would crash the browser
                        const a = document.createElement('a');
                        a.href = downloadUrl!;
                        a.download = finalName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }}
                    className={cn("w-full sm:w-auto")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
