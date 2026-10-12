"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Download, Image as ImageIcon, ArrowRight, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConvertedFile {
  id: string;
  originalFile: File;
  originalUrl: string;
  status: "pending" | "converting" | "done" | "error";
  convertedBlob?: Blob;
  convertedUrl?: string;
  errorMsg?: string;
}

export default function WebpConverter({ defaultFormat = "image/jpeg" }: { defaultFormat?: string }) {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>(defaultFormat);
  const [quality, setQuality] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const processFile = async (cFile: ConvertedFile, format: string, q: number): Promise<ConvertedFile> => {
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load WEBP image."));
        img.src = cFile.originalUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Canvas context not available.");

      // If JPG, fill white background to prevent transparent areas from turning black
      if (format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), format, q / 100);
      });

      if (!blob) throw new Error("Conversion returned empty data.");

      const convertedUrl = URL.createObjectURL(blob);
      return { ...cFile, status: "done", convertedBlob: blob, convertedUrl };
    } catch (err: any) {
      return { ...cFile, status: "error", errorMsg: err.message || "Conversion failed." };
    }
  };

  const startConversion = async (currentFiles: ConvertedFile[], format: string, q: number) => {
    setIsProcessing(true);
    
    // Process files one by one to avoid UI freeze, but do it asynchronously
    const updatedFiles = [...currentFiles];
    
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === "done" && targetFormat === format && quality === q) {
        continue; // Skip if already done with same settings
      }
      
      setFiles(prev => prev.map(f => f.id === updatedFiles[i].id ? { ...f, status: "converting" } : f));
      
      const processed = await processFile(updatedFiles[i], format, q);
      updatedFiles[i] = processed;
      
      setFiles(prev => prev.map(f => f.id === processed.id ? processed : f));
    }
    
    setIsProcessing(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        originalFile: file,
        originalUrl: URL.createObjectURL(file),
        status: "pending" as const
      }));
      
      setFiles(prev => {
        const combined = [...prev, ...newFiles];
        // Automatically start conversion for new files
        startConversion(combined, targetFormat, quality);
        return combined;
      });
    }
  }, [targetFormat, quality]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/webp": [".webp"] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const toRemove = prev.find(f => f.id === id);
      if (toRemove?.originalUrl) URL.revokeObjectURL(toRemove.originalUrl);
      if (toRemove?.convertedUrl) URL.revokeObjectURL(toRemove.convertedUrl);
      return filtered;
    });
  };

  const resetAll = () => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    setTargetFormat(format);
    startConversion(files, format, quality);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = parseInt(e.target.value, 10);
    setQuality(q);
  };

  const handleQualityRelease = () => {
    // Only trigger conversion when user releases the slider to prevent lag
    startConversion(files, targetFormat, quality);
  };

  const downloadFile = (file: ConvertedFile) => {
    if (!file.convertedUrl) return;
    const a = document.createElement("a");
    a.href = file.convertedUrl;
    const ext = targetFormat === "image/jpeg" ? ".jpg" : ".png";
    const baseName = file.originalFile.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-converted${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    const doneFiles = files.filter(f => f.status === "done" && f.convertedUrl);
    // Trigger sequential downloads with small delay
    doneFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file);
      }, index * 200);
    });
  };

  if (files.length === 0) {
    return (
      <div className="bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-background rounded-full shadow-sm mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload WEBP Images</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop multiple WEBP files here, or click to browse
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border">
            <Settings className="h-3 w-3 text-emerald-500" />
            <span>Fast client-side batch processing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
      
      {/* Global Controls */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        
        <div className="flex flex-col gap-2 flex-1 w-full max-w-sm">
          <label className="text-sm font-semibold">Output Format</label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={targetFormat}
            onChange={handleFormatChange}
            disabled={isProcessing}
          >
            <option value="image/jpeg">JPG Document</option>
            <option value="image/png">PNG (Preserves Transparency)</option>
          </select>
        </div>

        {targetFormat === "image/jpeg" && (
          <div className="flex flex-col gap-2 flex-1 w-full max-w-sm">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">JPG Quality</label>
              <span className="text-sm font-bold text-primary">{quality}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={quality}
              onChange={handleQualityChange}
              onMouseUp={handleQualityRelease}
              onTouchEnd={handleQualityRelease}
              disabled={isProcessing}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>

      {/* Batch List */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-muted/50 p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-sm">Processed Files ({files.length})</h3>
          <div className="flex gap-2">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <Button variant="outline" size="sm" disabled={isProcessing}>Add More</Button>
            </div>
            <Button variant="destructive" size="sm" onClick={resetAll} disabled={isProcessing}>Clear</Button>
            <Button 
              size="sm" 
              onClick={downloadAll} 
              disabled={isProcessing || !files.some(f => f.status === "done")}
              className="gap-2"
            >
              <Download className="w-4 h-4" /> Download All
            </Button>
          </div>
        </div>

        <div className="divide-y max-h-[500px] overflow-y-auto">
          {files.map(file => (
            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden relative">
                  {file.convertedUrl ? (
                    <img src={file.convertedUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-primary" />
                  )}
                </div>
                
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-xs" title={file.originalFile.name}>
                    {file.originalFile.name}
                  </p>
                  
                  {file.status === "error" ? (
                    <p className="text-xs text-destructive mt-1">{file.errorMsg}</p>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 text-xs font-medium">
                      <span className="text-muted-foreground">{formatSize(file.originalFile.size)}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      
                      {file.status === "done" && file.convertedBlob ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {formatSize(file.convertedBlob.size)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> processing...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {file.status === "done" && (
                  <Button size="sm" variant="secondary" onClick={() => downloadFile(file)}>
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
