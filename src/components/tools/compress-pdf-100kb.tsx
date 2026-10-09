"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, FileArchive, Download, Shield, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "pdf-lib";

export function CompressPdf100kb() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(100);
  const [customKb, setCustomKb] = useState<string>("100");
  const [targetPreset, setTargetPreset] = useState<string>("100");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  const [stats, setStats] = useState<{ origSize: number; newSize: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResultBlob(null);
      setResultUrl(null);
      setStats(null);
    }
  };

  const handlePresetChange = (preset: string) => {
    setTargetPreset(preset);
    if (preset !== "custom") {
      setTargetKb(parseInt(preset, 10));
    } else {
      setTargetKb(parseInt(customKb, 10) || 100);
    }
  };

  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomKb(e.target.value);
    setTargetKb(parseInt(e.target.value, 10) || 100);
  };

  const getBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const processPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressMsg("Initializing engine...");

    try {
      // Import pdfjs-dist dynamically
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const newPdfDoc = await PDFDocument.create();
      
      const overheadBytes = 5000;
      const totalTargetBytes = targetKb * 1024;
      const targetBytesPerPage = Math.max(15000, (totalTargetBytes - overheadBytes) / numPages);

      // Adjust scale dynamically based on page count and strict limits
      let baseScale = 1.6;
      if (numPages >= 3 && targetKb <= 150) {
        baseScale = 1.2;
      }
      if (numPages >= 5 && targetKb <= 100) {
        baseScale = 1.0;
      }

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(Math.round((pageNum / numPages) * 80));
        setProgressMsg(`Optimizing page ${pageNum} of ${numPages}...`);

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: baseScale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d", { alpha: false });

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // @ts-expect-error pdfjs-dist mismatch
          await page.render({ canvasContext: ctx, viewport }).promise;

          // Binary search for optimal JPEG quality per page
          let low = 0.1;
          let high = 0.95;
          let bestBlob: Blob | null = null;
          let bestQuality = 0.1;
          const maxIterations = 5;

          for (let i = 0; i < maxIterations; i++) {
            const mid = (low + high) / 2;
            const blob = await getBlob(canvas, mid);
            if (blob.size <= targetBytesPerPage) {
              bestBlob = blob;
              bestQuality = mid;
              low = mid; // Try higher quality
            } else {
              high = mid; // Need lower quality
            }
          }

          if (!bestBlob) {
            bestBlob = await getBlob(canvas, 0.1);
          }

          const imgBytes = await bestBlob.arrayBuffer();
          const embeddedImage = await newPdfDoc.embedJpg(imgBytes);
          const origViewport = page.getViewport({ scale: 1.0 });

          const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
          });
        }
      }

      setProgress(95);
      setProgressMsg("Assembling compressed PDF...");

      const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes as any], { type: "application/pdf" });
      
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setStats({ origSize: file.size, newSize: blob.size });
      
      setProgress(100);
      setProgressMsg("Done!");
    } catch (err) {
      console.error(err);
      alert("An error occurred during compression. Ensure the PDF is not encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-300">100% Private Client-Side Processing</h4>
            <p className="text-sm text-amber-700 dark:text-amber-400/80">Your sensitive educational certificates and marksheets never leave your device. All processing happens inside your browser.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <UploadCloud className="w-5 h-5 text-primary" />
              1. Select PDF File
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-10 h-10 text-primary/70 mb-3" />
                <p className="text-sm text-muted-foreground font-medium px-4 text-center">
                  {file ? file.name : "Click to select a PDF"}
                </p>
                {file && <p className="text-xs text-primary font-bold mt-2">{formatSize(file.size)}</p>}
              </div>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </label>
          </div>

          <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm transition-opacity ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <FileArchive className="w-5 h-5 text-primary" />
              2. Compression Target
            </h3>
            
            <div className="space-y-3">
              {[
                { id: "100", label: "Under 100 KB (Strict)", sub: "SSC, State PSC Marksheets" },
                { id: "200", label: "Under 200 KB", sub: "UPSC, Central Portals" },
                { id: "500", label: "Under 500 KB", sub: "General Purpose" },
                { id: "custom", label: "Custom KB Target", sub: "Set a specific limit" }
              ].map(preset => (
                <label key={preset.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${targetPreset === preset.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted/50'}`}>
                  <div className="flex items-center h-5">
                    <input type="radio" name="targetPreset" className="w-4 h-4 text-primary border-primary focus:ring-primary" checked={targetPreset === preset.id} onChange={() => handlePresetChange(preset.id)} />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className="block text-sm font-semibold">{preset.label}</span>
                    <span className="block text-xs text-muted-foreground">{preset.sub}</span>
                    
                    {preset.id === "custom" && targetPreset === "custom" && (
                      <div className="mt-2 flex items-center gap-2">
                        <input 
                          type="number" 
                          min="10" 
                          max="5000" 
                          className="w-24 text-sm p-1.5 rounded border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                          value={customKb}
                          onChange={handleCustomChange}
                        />
                        <span className="text-xs font-medium">KB</span>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <Button 
              className="w-full mt-6 shadow-md"
              size="lg"
              onClick={processPdf}
              disabled={isProcessing || !file}
            >
              {isProcessing ? "Optimizing..." : "Compress PDF"}
            </Button>
            
            {isProcessing && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>{progressMsg}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col flex-1 shadow-sm min-h-[400px]">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Result &amp; Preview
            </h3>
            
            {!resultBlob ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                <FileArchive className="w-16 h-16 opacity-20 mb-4" />
                <p>Select a PDF and click Compress to view the result here.</p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full">
                {stats && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl mb-4 flex justify-between items-center text-emerald-900 dark:text-emerald-100">
                    <div>
                      <p className="text-sm font-semibold mb-0.5">Compression Successful!</p>
                      <p className="text-xs opacity-90">{formatSize(stats.origSize)} &rarr; <strong className="font-bold">{formatSize(stats.newSize)}</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {Math.round(((stats.origSize - stats.newSize) / stats.origSize) * 100)}% smaller
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 border border-border rounded-lg overflow-hidden bg-background mb-4 relative min-h-[300px]">
                  {resultUrl && (
                    <iframe src={`${resultUrl}#toolbar=0&navpanes=0`} className="w-full h-full absolute inset-0 border-none" title="PDF Preview" />
                  )}
                </div>

                <a 
                  href={resultUrl || "#"} 
                  download={`compressed_${file?.name || "document.pdf"}`}
                  className="w-full"
                >
                  <Button size="lg" className="w-full shadow-md bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Compressed PDF
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
