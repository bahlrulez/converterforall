"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Download, RefreshCw, Image as ImageIcon, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const [quality, setQuality] = useState<number>(80);
  const [downscale, setDownscale] = useState<string>("original");
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setQuality(80); // reset quality
      setDownscale("original");
      setIsGrayscale(false);
      setCompressedBlob(null);
      setCompressedUrl(null);
      setErrorMsg("");
      
      // Initial compression trigger
      runCompression(selectedFile, 80, "original", false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    multiple: false,
  });

  const reset = () => {
    setFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setQuality(80);
    setDownscale("original");
    setIsGrayscale(false);
    setErrorMsg("");
  };

  const applyGrayscale = async (sourceFile: File): Promise<File> => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceFile);
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for grayscale."));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    ctx.filter = "grayscale(100%)";
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), sourceFile.type, 1.0);
    });

    URL.revokeObjectURL(objectUrl);
    if (!blob) throw new Error("Failed to create grayscale blob");

    return new File([blob], sourceFile.name, { type: sourceFile.type });
  };

  const runCompression = async (targetFile: File, targetQuality: number, targetDownscale: string, targetGrayscale: boolean) => {
    setIsCompressing(true);
    setErrorMsg("");
    
    try {
      let fileToCompress = targetFile;
      if (targetGrayscale) {
        fileToCompress = await applyGrayscale(targetFile);
      }

      const decimalQuality = Math.max(0.01, targetQuality / 100);
      
      const options: any = {
        maxSizeMB: Number.POSITIVE_INFINITY,
        useWebWorker: true,
        initialQuality: decimalQuality,
        fileType: fileToCompress.type
      };

      if (targetDownscale !== "original") {
        options.maxWidthOrHeight = parseInt(targetDownscale, 10);
      } else {
        options.alwaysKeepResolution = true;
      }

      const compressed = await imageCompression(fileToCompress, options);
      
      // For highly optimized PNGs, browser-image-compression sometimes inflates it if we try to compress it further.
      // If the compressed size is larger, we just use the original file to prevent bad results.
      const finalBlob = compressed.size >= targetFile.size ? targetFile : compressed;
      
      setCompressedBlob(finalBlob);
      
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
      setCompressedUrl(URL.createObjectURL(finalBlob));
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to compress image. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle slider change with debounce
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuality = parseInt(e.target.value, 10);
    setQuality(newQuality);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (file) {
        runCompression(file, newQuality, downscale, isGrayscale);
      }
    }, 300); // 300ms debounce
  };

  const handleDownscaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setDownscale(newVal);
    if (file) runCompression(file, quality, newVal, isGrayscale);
  };

  const handleGrayscaleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.checked;
    setIsGrayscale(newVal);
    if (file) runCompression(file, quality, downscale, newVal);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  if (!file) {
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
          <h3 className="text-xl font-semibold mb-2">Upload your Image</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop a JPG or PNG here, or click to browse files
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border">
            <Zap className="h-3 w-3 text-amber-500" />
            <span>Interactive real-time compression</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-3xl p-6 border border-border shadow-sm flex flex-col gap-6">
      
      {/* Top Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-3 text-primary hidden sm:block">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium truncate max-w-[150px] sm:max-w-xs">{file.name}</p>
            <div className="flex items-center gap-2 mt-1 text-sm font-medium">
              <span className="text-muted-foreground">{formatSize(file.size)}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className={isCompressing ? "text-muted-foreground animate-pulse" : "text-green-600 dark:text-green-400"}>
                {compressedBlob ? formatSize(compressedBlob.size) : "..."}
              </span>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={reset} className="text-muted-foreground hover:text-destructive">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      {/* Interactive Slider Area */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Image Quality & Target Size</h3>
          <span className="text-lg font-bold text-primary">{quality}%</span>
        </div>
        
        <div className="px-2">
          <input 
            type="range" 
            min="1" 
            max="100" 
            step="1" 
            value={quality} 
            onChange={handleQualityChange} 
            className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground px-2 mt-3 mb-6">
          <span>Smaller File (Lower Quality)</span>
          <span>Original File (High Quality)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Resize (Downscale)</label>
            <select 
              value={downscale} 
              onChange={handleDownscaleChange}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="original">Keep Original Dimensions</option>
              <option value="1920">Max 1920px (HD)</option>
              <option value="1280">Max 1280px (Web)</option>
              <option value="800">Max 800px (Document)</option>
            </select>
          </div>
          <div className="flex items-center space-x-3 sm:justify-end pr-2 pt-2 sm:pt-6">
            <input 
              type="checkbox" 
              id="grayscale-toggle" 
              checked={isGrayscale}
              onChange={handleGrayscaleToggle}
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <label htmlFor="grayscale-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              Convert to Grayscale (B&W)
            </label>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          For strict targets like 20 KB, use <strong>Max 800px</strong> and <strong>Grayscale</strong>. This keeps text sharp while reducing file size drastically.
        </p>
      </div>

      {/* Visual Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex justify-between">
            <span>Original</span>
            <span>{formatSize(file.size)}</span>
          </h4>
          <div className="relative flex-1 bg-muted/20 rounded-xl border border-dashed overflow-hidden flex items-center justify-center min-h-[300px]">
            {originalUrl && (
              <img src={originalUrl} alt="Original" className="max-w-full max-h-[400px] object-contain" />
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col relative">
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3 flex justify-between">
            <span>Compressed Result</span>
            <span>{compressedBlob ? formatSize(compressedBlob.size) : "..."}</span>
          </h4>
          
          <div className="relative flex-1 bg-muted/20 rounded-xl border border-dashed overflow-hidden flex items-center justify-center min-h-[300px]">
            {isCompressing && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            {compressedUrl && (
              <img src={compressedUrl} alt="Compressed" className={`max-w-full max-h-[400px] object-contain ${isCompressing ? 'opacity-50' : 'opacity-100'}`} />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end mt-2">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Compress Another
        </Button>
        <Button 
          disabled={!compressedBlob || isCompressing}
          onClick={() => {
            if (!compressedUrl) return;
            const a = document.createElement("a");
            a.href = compressedUrl;
            // Generate nice filename
            const ext = file.name.split('.').pop();
            const name = file.name.substring(0, file.name.lastIndexOf('.'));
            a.download = `${name}-compressed.${ext}`;
            a.click();
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Compressed Image
        </Button>
      </div>

    </div>
  );
}
