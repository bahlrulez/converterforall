"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2, Download, Camera } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import heic2any from "heic2any";
import { getPendingFile } from "@/lib/file-transfer";

interface FileUploaderProps {
  onProcessFile: (file: File, onProgress?: (progress: number) => void) => Promise<{ blob: Blob, filename: string }>;
  acceptedTypes?: Record<string, string[]>;
  actionLabel?: string;
  optionsRenderer?: (disabled: boolean) => React.ReactNode;
  allowCamera?: boolean;
  isDynamicBackgroundRemoval?: boolean;
  toolSlug?: string;
}

export function FileUploader({ onProcessFile, acceptedTypes, actionLabel = "Process File", optionsRenderer, allowCamera = false, isDynamicBackgroundRemoval = false, toolSlug }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "converting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-consume transferred pending file and auto-start execution
  useEffect(() => {
    let isMounted = true;
    let started = false;

    async function checkPending() {
      if (started) return;
      const pendingFile = await getPendingFile(toolSlug);
      if (pendingFile && isMounted && !started) {
        started = true;
        setFile(pendingFile);
        executeProcess(pendingFile);
      }
    }

    checkPending();
    const timer = setTimeout(checkPending, 250);
    const timer2 = setTimeout(checkPending, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [toolSlug]);

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

  const executeProcess = async (targetFile: File) => {
    setStatus("uploading");
    try {
      setStatus("converting");
      setProgress(0);

      // Delegate processing to the specialized engine
      const { blob, filename } = await onProcessFile(targetFile, (p) => setProgress(p));

      setStatus("success");

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(filename);
      setDownloadBlob(blob);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    executeProcess(file);
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
            className={`group relative overflow-hidden rounded-[2rem] border-2 border-dashed p-16 sm:p-24 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-6 ${
              isDragActive 
                ? "border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_rgba(59,130,246,0.15)]" 
                : "border-border/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-2xl"
            }`}
          >
            <input {...getInputProps()} />
            
            {/* Animated Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 group-hover:scale-175 group-hover:bg-primary/30 transition-all duration-500" />
              <div className="relative rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-5 text-white shadow-lg group-hover:-translate-y-1 transition-transform duration-300">
                <UploadCloud className="h-10 w-10" />
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-2xl font-bold tracking-tight">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-base text-muted-foreground mt-2">
                or <span className="text-primary font-medium group-hover:underline underline-offset-4 cursor-pointer">browse from your computer</span>
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
        <div className="rounded-2xl border bg-card p-6 shadow-xl relative overflow-hidden backdrop-blur-sm bg-background/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
              {file.type.startsWith("image/") ? (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-muted/50 border flex-shrink-0 shadow-sm relative group">
                  <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
              ) : (
                <div className="rounded-xl bg-primary/10 p-4 sm:p-5 text-primary flex-shrink-0 shadow-sm border border-primary/20">
                  <FileIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden pr-2">
                <p className="font-semibold truncate text-base sm:text-lg">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(2)} MB <span className="mx-1">•</span> <span className="uppercase text-xs font-bold bg-muted px-2 py-0.5 rounded-full">{file.type.split('/')[1] || 'FILE'}</span>
                </p>
              </div>
            </div>

            {status === "idle" && (
              <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full h-10 w-10 flex-shrink-0 transition-colors ml-2">
                <X className="h-5 w-5" />
              </Button>
            )}

            {status === "success" && (
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
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

          {status === "converting" && progress > 0 && !isDynamicBackgroundRemoval && (
            <div className="mt-4 space-y-2">
              <style>{`
                @keyframes shine {
                  from { transform: translateX(-100%); }
                  to { transform: translateX(200%); }
                }
                .animate-shine {
                  animation: shine 1.5s infinite;
                }
              `}</style>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-shine" />
                </div>
              </div>
            </div>
          )}

          {status === "converting" && isDynamicBackgroundRemoval && file && (
            <div className="mt-6 relative w-full aspect-video md:aspect-[16/7] rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center border shadow-inner">
              <style>{`
                @keyframes scanline {
                  0% { transform: translateY(0); }
                  50% { transform: translateY(100%); }
                  100% { transform: translateY(0); }
                }
              `}</style>
              <img 
                src={URL.createObjectURL(file)} 
                className="w-full h-full object-contain opacity-70 scale-95 transition-transform duration-500 ease-out" 
                alt="Processing preview" 
              />
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="w-full h-[100%] absolute top-0 animate-[scanline_3s_ease-in-out_infinite]">
                  <div className="w-full h-1 bg-primary shadow-[0_0_20px_rgba(var(--primary),1)] absolute top-0" />
                  <div className="w-full h-full bg-gradient-to-b from-primary/20 to-transparent absolute top-0 mix-blend-overlay" />
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
                <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-full border shadow-sm text-sm font-medium flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Removing Background...
                </div>
              </div>
            </div>
          )}

          {status === "success" && isDynamicBackgroundRemoval && file && downloadUrl && (
            <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 rounded-xl border bg-muted/20 overflow-hidden flex flex-col relative aspect-square md:aspect-auto">
                <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur text-xs font-medium px-2 py-1 rounded-md border shadow-sm">
                  Original
                </div>
                <img src={URL.createObjectURL(file)} className="w-full h-full object-contain p-4" alt="Original" />
              </div>
              <div 
                className="flex-1 rounded-xl border overflow-hidden flex flex-col relative aspect-square md:aspect-auto"
                style={{
                  backgroundColor: "#f8f9fa",
                  backgroundImage: "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                }}
              >
                <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur text-xs font-medium px-2 py-1 rounded-md border shadow-sm text-primary">
                  Result
                </div>
                <img src={downloadUrl} className="w-full h-full object-contain p-4 drop-shadow-xl" alt="Result with removed background" />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            {status !== "success" && status !== "converting" && status !== "uploading" && (
              <Button onClick={handleConvert} className="w-full sm:w-auto">
                {actionLabel}
              </Button>
            )}

            {(status === "uploading" || status === "converting") && !isDynamicBackgroundRemoval && (
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
                    className={cn("w-full sm:w-auto", isDynamicBackgroundRemoval && "bg-primary text-primary-foreground hover:bg-primary/90")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Result
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
