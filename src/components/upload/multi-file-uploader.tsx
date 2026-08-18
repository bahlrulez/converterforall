"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, CheckCircle, Loader2, Download, ArrowUp, ArrowDown, Plus, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MultiFileUploaderProps {
  onProcessFiles: (files: File[]) => Promise<{ blob: Blob, filename: string }>;
  acceptedTypes?: Record<string, string[]>;
  actionLabel?: string;
  optionsRenderer?: (disabled: boolean) => React.ReactNode;
}

export function MultiFileUploader({ onProcessFiles, acceptedTypes, actionLabel = "Process Files", optionsRenderer }: MultiFileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "converting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      setStatus("idle");
      setErrorMsg("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
  });

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setStatus("uploading");
    
    try {
      setStatus("converting");
      
      const { blob, filename } = await onProcessFiles(files);

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
    setFiles([]);
    setStatus("idle");
    setErrorMsg("");
    setDownloadUrl(null);
    setDownloadName("");
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {files.length === 0 ? (
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
              {isDragActive ? "Drop your files here" : "Drag & drop your files here"}
            </p>
            <p className="text-base text-muted-foreground mt-2">
              or <span className="text-primary font-medium group-hover:underline underline-offset-4 cursor-pointer">browse from your computer</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 shadow-xl relative overflow-hidden backdrop-blur-sm bg-background/50 transition-all">
          <div className="flex flex-col gap-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between border rounded-xl p-3 bg-background hover:bg-muted/30 transition-colors shadow-sm group">
                <div className="flex items-center gap-4 overflow-hidden flex-1">
                  {file.type.startsWith("image/") ? (
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted/50 border flex-shrink-0 relative">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-primary/10 p-3 text-primary flex-shrink-0 border border-primary/20">
                      <FileIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="overflow-hidden pr-2 flex-1">
                    <p className="font-semibold truncate text-sm sm:text-base">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
                      <span className="uppercase font-bold tracking-wider">{file.type.split('/')[1] || 'FILE'}</span>
                    </p>
                  </div>
                </div>
                
                {status === "idle" && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} className="h-8 w-8 text-muted-foreground">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === files.length - 1} className="h-8 w-8 text-muted-foreground">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {status === "idle" && (
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 mt-2 cursor-pointer flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all">
                <input {...getInputProps()} />
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-medium text-sm">Add more files</span>
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

          <div className="mt-6 flex gap-3 justify-end border-t pt-4">
            {status !== "success" && status !== "converting" && status !== "uploading" && (
              <Button onClick={handleConvert} className="w-full sm:w-auto" disabled={files.length < 2 && actionLabel.includes("Merge")}>
                {actionLabel}
              </Button>
            )}
            
            {(status === "uploading" || status === "converting") && (
              <Button disabled className="w-full sm:w-auto">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status === "uploading" ? "Processing..." : "Converting..."}
              </Button>
            )}
            
            {status === "success" && (
              <>
                {/* Visual Post-Conversion Privacy Trust Confirmation Badge */}
                <div className="w-full mb-3 p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <span>100% On-Device Batch Processing Complete</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </p>
                    <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90">
                      Processed securely on your device's CPU • 0 bytes uploaded to external servers
                    </p>
                  </div>
                </div>

                <Button onClick={reset} variant="outline" className="w-full sm:w-auto">
                  Start Over
                </Button>
                {downloadUrl && (
                  <a 
                    href={downloadUrl} 
                    download={downloadName}
                    className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download File
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
