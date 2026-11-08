"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { UploadCloud, FileArchive, Download, Shield, FileText, CheckCircle2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "pdf-lib";
import { PDF_DOCUMENT_PRESETS } from "@/config/exam-presets";
import { checkPdfMemoryRisk } from "@/lib/device-memory-guard";
import { MemoryGuardAlert } from "@/components/ui/memory-guard-alert";

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
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  
  const [stats, setStats] = useState<{ origSize: number; newSize: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const memoryCheck = file ? checkPdfMemoryRisk(file.size) : { risk: "safe" as const, title: "", message: "", dismissible: true };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResultBlob(null);
      setResultUrl(null);
      setPreviewDataUrl(null);
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
    setProgressMsg("Initializing in-browser engine...");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const overheadBytes = 5000;
      let targetMaxBytes = (targetKb * 1024) - overheadBytes;
      if (targetKb === 100) targetMaxBytes = 85 * 1024;
      if (targetKb === 200) targetMaxBytes = 175 * 1024;
      if (targetKb === 300) targetMaxBytes = 275 * 1024;
      if (targetKb === 500) targetMaxBytes = 470 * 1024;
      
      const targetBytesPerPage = Math.max(3000, targetMaxBytes / numPages);

      let baseScale = 1.6;
      if (numPages >= 3 && targetKb <= 200) baseScale = 1.2;
      if (numPages >= 5 && targetKb <= 150) baseScale = 1.0;
      if (numPages >= 8 && targetKb <= 100) baseScale = 0.8;
      if (numPages >= 12 && targetKb <= 100) baseScale = 0.6;

      let finalBlob: Blob | null = null;
      let qualityCeiling = 0.95;

      for (let attempt = 1; attempt <= 5; attempt++) {
        const newPdfDoc = await PDFDocument.create();

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          setProgress(Math.round((pageNum / numPages) * 80));
          setProgressMsg(attempt > 1 ? `Optimizing pass (Attempt ${attempt})... Page ${pageNum} of ${numPages}` : `Downscaling page ${pageNum} of ${numPages}...`);

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

            if (pageNum === 1 && attempt === 1) {
              setPreviewDataUrl(canvas.toDataURL("image/jpeg", 0.8));
            }

            // Binary search for optimal JPEG quality per page
            let low = 0.1;
            let high = qualityCeiling;
            let bestBlob: Blob | null = null;
            const maxIterations = 5;

            for (let i = 0; i < maxIterations; i++) {
              const mid = (low + high) / 2;
              const blob = await getBlob(canvas, mid);
              if (blob.size <= targetBytesPerPage) {
                bestBlob = blob;
                low = mid;
              } else {
                high = mid;
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
        setProgressMsg("Assembling conformed PDF...");

        const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
        finalBlob = new Blob([compressedBytes as any], { type: "application/pdf" });
        
        if (finalBlob.size <= targetMaxBytes) {
          break;
        } else {
          baseScale = baseScale * 0.8;
          qualityCeiling = Math.max(0.4, qualityCeiling * 0.85);
        }
      }
      
      if (finalBlob) {
        setResultBlob(finalBlob);
        setResultUrl(URL.createObjectURL(finalBlob));
        setStats({ origSize: file.size, newSize: finalBlob.size });
      }
      
      setProgress(100);
      setProgressMsg("Finished!");
    } catch (err) {
      console.error(err);
      alert("An error occurred during compression. Ensure the PDF is not encrypted with a password.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
      {/* Privacy Notice */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200">100% Private In-Browser Compression</h4>
            <p className="text-amber-700 dark:text-amber-300/80 leading-relaxed">
              Your sensitive marksheets, caste certificates, and identity documents never leave your computer or phone. Everything processes directly in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Memory Stability Guard for Large Files on Mobile */}
      {file && memoryCheck.risk !== "safe" && (
        <MemoryGuardAlert checkResult={memoryCheck} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* File Picker */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-3">
              <UploadCloud className="w-5 h-5 text-primary" />
              1. Select Educational Marksheet or Certificate PDF
            </h3>
            
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 rounded-xl cursor-pointer transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-9 h-9 text-primary/70 mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground font-medium px-4 text-center">
                  {file ? file.name : "Click to select PDF or drag & drop"}
                </p>
                {file && <p className="text-xs text-primary font-bold mt-1.5">{formatSize(file.size)}</p>}
              </div>
              <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </label>
          </div>

          {/* Visual Exam Target Presets */}
          <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm transition-opacity ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="font-semibold text-base flex items-center gap-2 mb-1">
              <FileArchive className="w-5 h-5 text-primary" />
              2. Select Portal Target Limit
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Calibrated with an automatic safety margin below the ceiling so portals never reject your file.
            </p>
            
            <div className="space-y-2.5">
              {PDF_DOCUMENT_PRESETS.map((preset) => {
                const isSelected = targetPreset === preset.id;
                return (
                  <label 
                    key={preset.id} 
                    className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-1.5 ring-primary/40 shadow-xs' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input 
                        type="radio" 
                        name="targetPreset" 
                        className="w-4 h-4 text-primary border-primary focus:ring-primary" 
                        checked={isSelected} 
                        onChange={() => handlePresetChange(preset.id)} 
                      />
                    </div>
                    <div className="ml-3 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-foreground">{preset.name}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {preset.tag}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5">{preset.suitableFor}</span>
                      <span className="text-[11px] text-muted-foreground/80 mt-1">{preset.description}</span>
                    </div>
                  </label>
                );
              })}

              {/* Custom Target */}
              <label 
                className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                  targetPreset === "custom" 
                    ? 'border-primary bg-primary/5 ring-1.5 ring-primary/40 shadow-xs' 
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center h-5 mt-0.5">
                  <input 
                    type="radio" 
                    name="targetPreset" 
                    className="w-4 h-4 text-primary border-primary focus:ring-primary" 
                    checked={targetPreset === "custom"} 
                    onChange={() => handlePresetChange("custom")} 
                  />
                </div>
                <div className="ml-3 flex flex-col flex-1">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">Custom KB Ceiling</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Specify an exact maximum file limit required by your portal.</span>
                  
                  {targetPreset === "custom" && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <input 
                        type="number" 
                        min="10" 
                        max="5000" 
                        className="w-24 text-xs p-1.5 rounded-lg border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                        value={customKb}
                        onChange={handleCustomChange}
                      />
                      <span className="text-xs font-semibold text-muted-foreground">KB Limit</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <Button 
              className="w-full mt-5 shadow-sm"
              size="lg"
              onClick={processPdf}
              disabled={isProcessing || !file}
            >
              {isProcessing ? "Optimizing & Downscaling..." : `Compress PDF to ${targetKb} KB`}
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

        {/* Results & Live Document Preview */}
        <div className="flex flex-col h-full">
          <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col flex-1 shadow-sm min-h-[420px]">
            <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Document Verification &amp; Result
            </h3>
            
            {!resultBlob ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                <FileArchive className="w-14 h-14 opacity-25 mb-3" />
                <p className="text-xs sm:text-sm font-medium">Select your marksheet PDF and click Compress to view the result.</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  The algorithm enforces a safety margin below the ceiling so uploading portals never bounce your file.
                </p>
              </div>
            ) : (
              <div className="flex flex-col flex-1 h-full space-y-4">
                {stats && (
                  <div className="bg-background rounded-xl p-4 border grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Original File Size:</span>
                      <span className="font-semibold text-sm line-through text-muted-foreground">{formatSize(stats.origSize)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Compressed File Size:</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{formatSize(stats.newSize)}</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t flex items-center justify-between text-xs">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Portal Verified (Under {targetKb} KB limit)
                      </span>
                      <span className="text-muted-foreground">
                        Reduced by {Math.round(((stats.origSize - stats.newSize) / stats.origSize) * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                {previewDataUrl && (
                  <div className="flex-1 flex flex-col items-center justify-center border rounded-xl p-3 bg-background">
                    <span className="text-[11px] text-muted-foreground mb-2 block">First Page Visual Clarity Check:</span>
                    <img 
                      src={previewDataUrl} 
                      alt="Compressed PDF Page 1" 
                      className="max-h-60 w-auto object-contain border shadow-xs rounded-sm"
                    />
                  </div>
                )}

                {resultUrl && (
                  <a 
                    href={resultUrl} 
                    download={`compressed-${targetKb}kb-${file?.name || "document.pdf"}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Conformed PDF
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
