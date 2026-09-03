"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { 
  FileDown, 
  UploadCloud, 
  X, 
  FileText, 
  ArrowRight, 
  Loader2, 
  GripVertical, 
  FileType, 
  CheckCircle2,
  SlidersHorizontal,
  Maximize2,
  Layout,
  Compass,
  Square,
  Presentation,
  Info,
  ChevronDown,
  ChevronUp,
  Power,
  RotateCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingFile } from "@/lib/file-transfer";

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'pdf' | 'word' | 'powerpoint' | 'image';
  rotation?: number;
}

type PageSizeType = 'a4' | 'letter' | 'legal' | 'a3' | 'a5' | 'fit_content';
type OrientationType = 'auto' | 'portrait' | 'landscape';
type FitModeType = 'fit' | 'fill' | 'original';
type MarginSizeType = 'none' | 'small' | 'standard' | 'large';
type ApplyScopeType = 'images_only' | 'all_pages';

const PAGE_SIZE_POINTS: Record<Exclude<PageSizeType, 'fit_content'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612.0, 792.0],
  legal: [612.0, 1008.0],
  a3: [841.89, 1190.55],
  a5: [419.53, 595.28],
};

const MARGIN_POINTS: Record<MarginSizeType, number> = {
  none: 0,
  small: 14.17, // ~5mm
  standard: 36.0, // ~12.7mm / 0.5 inch
  large: 72.0, // ~25.4mm / 1 inch
};

async function imageToPngBytes(file: File, rotation: number = 0): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const rot = ((rotation % 360) + 360) % 360;
      const isOrthogonal = rot === 90 || rot === 270;

      canvas.width = isOrthogonal ? origH : origW;
      canvas.height = isOrthogonal ? origW : origH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -origW / 2, -origH / 2);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Image blob conversion failed"));
          return;
        }
        blob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${file.name}" for PDF embedding.`));
    };
    img.src = url;
  });
}

function detectFileType(file: File): 'pdf' | 'word' | 'powerpoint' | 'image' {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pptx') || name.endsWith('.ppt') || file.type.includes('presentation') || file.type.includes('powerpoint')) {
    return 'powerpoint';
  }
  if (name.endsWith('.docx') || name.endsWith('.doc') || file.type.includes('word') || file.type.includes('officedocument')) {
    return 'word';
  }
  if (file.type.includes('image') || /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(name)) {
    return 'image';
  }
  return 'pdf';
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Scaling & Layout State (Default ON)
  const [enableScaling, setEnableScaling] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<PageSizeType>('a4');
  const [orientation, setOrientation] = useState<OrientationType>('portrait');
  const [fitMode, setFitMode] = useState<FitModeType>('fit');
  const [marginSize, setMarginSize] = useState<MarginSizeType>('standard');
  const [applyScope, setApplyScope] = useState<ApplyScopeType>('images_only');
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("merge-pdf");
      if (pending) {
        setFiles([{
          id: Math.random().toString(36).substring(7),
          file: pending,
          previewUrl: URL.createObjectURL(pending),
          type: detectFileType(pending),
          rotation: 0
        }]);
      }
    }
    checkPending();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      type: detectFileType(file),
      rotation: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setSuccessUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    }
  });

  const removeFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(f => f.id !== idToRemove));
    setSuccessUrl(null);
  };

  const rotateFile = (idToRotate: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === idToRotate) {
        return {
          ...f,
          rotation: (((f.rotation || 0) + 90) % 360)
        };
      }
      return f;
    }));
    setSuccessUrl(null);
  };

  const rotateAllFiles = () => {
    setFiles(prev => prev.map(f => ({
      ...f,
      rotation: (((f.rotation || 0) + 90) % 360)
    })));
    setSuccessUrl(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newFiles = [...files];
      const dragItemContent = newFiles[dragItem.current];
      newFiles.splice(dragItem.current, 1);
      newFiles.splice(dragOverItem.current, 0, dragItemContent);
      setFiles(newFiles);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const mergedPdf = await PDFDocument.create();
      const marginPt = MARGIN_POINTS[marginSize];

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProcessingStatus(`Processing ${i + 1} of ${files.length}: ${item.file.name}...`);

        if (item.type === 'pdf') {
          const fileBuffer = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
          const pageIndices = pdfDoc.getPageIndices();

          if (!enableScaling || pageSize === 'fit_content' || applyScope === 'images_only') {
            // Keep native PDF pages 1:1 intact
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
            copiedPages.forEach(page => {
              if (item.rotation) {
                const curAngle = page.getRotation().angle;
                page.setRotation(degrees((curAngle + item.rotation) % 360));
              }
              mergedPdf.addPage(page);
            });
          } else {
            // Normalize existing PDF pages to target uniform page size (e.g. A4)
            const [baseW, baseH] = PAGE_SIZE_POINTS[pageSize as Exclude<PageSizeType, 'fit_content'>];
            
            for (const pageIdx of pageIndices) {
              const srcPage = pdfDoc.getPage(pageIdx);
              const origW = srcPage.getWidth();
              const origH = srcPage.getHeight();

              // Calculate target dimensions
              let targetW = baseW;
              let targetH = baseH;
              if (orientation === 'landscape') {
                targetW = Math.max(baseW, baseH);
                targetH = Math.min(baseW, baseH);
              } else if (orientation === 'portrait') {
                targetW = Math.min(baseW, baseH);
                targetH = Math.max(baseW, baseH);
              } else {
                const isLand = origW > origH;
                targetW = isLand ? Math.max(baseW, baseH) : Math.min(baseW, baseH);
                targetH = isLand ? Math.min(baseW, baseH) : Math.max(baseW, baseH);
              }

              const printableW = Math.max(10, targetW - 2 * marginPt);
              const printableH = Math.max(10, targetH - 2 * marginPt);

              const embeddedPage = await mergedPdf.embedPage(srcPage);

              let drawW = origW;
              let drawH = origH;
              let drawX = marginPt;
              let drawY = marginPt;

              if (fitMode === 'fit') {
                const scale = Math.min(printableW / origW, printableH / origH);
                drawW = origW * scale;
                drawH = origH * scale;
                drawX = marginPt + (printableW - drawW) / 2;
                drawY = marginPt + (printableH - drawH) / 2;

                const page = mergedPdf.addPage([targetW, targetH]);
                page.drawPage(embeddedPage, {
                  x: drawX,
                  y: drawY,
                  xScale: scale,
                  yScale: scale,
                });
                if (item.rotation) {
                  page.setRotation(degrees(item.rotation % 360));
                }
              } else if (fitMode === 'fill') {
                const scaleX = targetW / origW;
                const scaleY = targetH / origH;
                const page = mergedPdf.addPage([targetW, targetH]);
                page.drawPage(embeddedPage, {
                  x: 0,
                  y: 0,
                  xScale: scaleX,
                  yScale: scaleY,
                });
                if (item.rotation) {
                  page.setRotation(degrees(item.rotation % 360));
                }
              } else {
                // Original centered
                const page = mergedPdf.addPage([targetW, targetH]);
                page.drawPage(embeddedPage, {
                  x: (targetW - origW) / 2,
                  y: (targetH - origH) / 2,
                  xScale: 1,
                  yScale: 1,
                });
                if (item.rotation) {
                  page.setRotation(degrees(item.rotation % 360));
                }
              }
            }
          }
        } else if (item.type === 'word') {
          const { convertWordToPdf } = await import("@/lib/converters/word");
          const wordPdfBlob = await convertWordToPdf(item.file);
          const wordPdfBuffer = await wordPdfBlob.arrayBuffer();
          const wordPdfDoc = await PDFDocument.load(wordPdfBuffer);
          const copiedPages = await mergedPdf.copyPages(wordPdfDoc, wordPdfDoc.getPageIndices());
          copiedPages.forEach(page => {
            if (item.rotation) {
              const curAngle = page.getRotation().angle;
              page.setRotation(degrees((curAngle + item.rotation) % 360));
            }
            mergedPdf.addPage(page);
          });
        } else if (item.type === 'powerpoint') {
          const { convertPptxToPdf } = await import("@/lib/converters/powerpoint");
          const pptxPdfBlob = await convertPptxToPdf(item.file);
          const pptxPdfBuffer = await pptxPdfBlob.arrayBuffer();
          const pptxPdfDoc = await PDFDocument.load(pptxPdfBuffer);
          const pageIndices = pptxPdfDoc.getPageIndices();

          if (!enableScaling || pageSize === 'fit_content' || orientation === 'landscape') {
            const copiedPages = await mergedPdf.copyPages(pptxPdfDoc, pageIndices);
            copiedPages.forEach(page => {
              if (item.rotation) {
                const curAngle = page.getRotation().angle;
                page.setRotation(degrees((curAngle + item.rotation) % 360));
              }
              mergedPdf.addPage(page);
            });
          } else {
            // Scale and center each PowerPoint slide onto standard Portrait A4 page
            const [baseW, baseH] = PAGE_SIZE_POINTS[pageSize as Exclude<PageSizeType, 'fit_content'>];
            const targetW = Math.min(baseW, baseH);
            const targetH = Math.max(baseW, baseH);
            const printableW = Math.max(10, targetW - 2 * marginPt);
            const printableH = Math.max(10, targetH - 2 * marginPt);

            for (const pageIdx of pageIndices) {
              const srcPage = pptxPdfDoc.getPage(pageIdx);
              const origW = srcPage.getWidth();
              const origH = srcPage.getHeight();

              const embeddedPage = await mergedPdf.embedPage(srcPage);
              const scale = Math.min(printableW / origW, printableH / origH);
              const drawW = origW * scale;
              const drawH = origH * scale;
              const drawX = marginPt + (printableW - drawW) / 2;
              const drawY = marginPt + (printableH - drawH) / 2;

              const page = mergedPdf.addPage([targetW, targetH]);
              page.drawPage(embeddedPage, {
                x: drawX,
                y: drawY,
                xScale: scale,
                yScale: scale,
              });
              if (item.rotation) {
                page.setRotation(degrees(item.rotation % 360));
              }
            }
          }
        } else if (item.type === 'image') {
          // Embed image
          let embeddedImage: any;
          const isJpg = item.file.type === 'image/jpeg' || /\.(jpe?g)$/i.test(item.file.name);
          const isPng = item.file.type === 'image/png' || /\.png$/i.test(item.file.name);
          const rot = item.rotation || 0;

          if (rot % 360 !== 0) {
            // Render rotated image on canvas to maintain orientation and geometry
            const pngBytes = await imageToPngBytes(item.file, rot);
            embeddedImage = await mergedPdf.embedPng(pngBytes);
          } else if (isJpg) {
            const rawBytes = await item.file.arrayBuffer();
            try {
              embeddedImage = await mergedPdf.embedJpg(rawBytes);
            } catch {
              const pngBytes = await imageToPngBytes(item.file, 0);
              embeddedImage = await mergedPdf.embedPng(pngBytes);
            }
          } else if (isPng) {
            const rawBytes = await item.file.arrayBuffer();
            try {
              embeddedImage = await mergedPdf.embedPng(rawBytes);
            } catch {
              const pngBytes = await imageToPngBytes(item.file, 0);
              embeddedImage = await mergedPdf.embedPng(pngBytes);
            }
          } else {
            const pngBytes = await imageToPngBytes(item.file, 0);
            embeddedImage = await mergedPdf.embedPng(pngBytes);
          }

          const imgW = embeddedImage.width;
          const imgH = embeddedImage.height;

          if (!enableScaling || pageSize === 'fit_content') {
            // Keep native pixel size
            const page = mergedPdf.addPage([imgW, imgH]);
            page.drawImage(embeddedImage, { x: 0, y: 0, width: imgW, height: imgH });
          } else {
            // Scale and center onto target page size
            const [baseW, baseH] = PAGE_SIZE_POINTS[pageSize];
            
            let targetW = baseW;
            let targetH = baseH;
            if (orientation === 'landscape') {
              targetW = Math.max(baseW, baseH);
              targetH = Math.min(baseW, baseH);
            } else if (orientation === 'portrait') {
              targetW = Math.min(baseW, baseH);
              targetH = Math.max(baseW, baseH);
            } else {
              // Auto: match image aspect ratio
              const imgIsLandscape = imgW > imgH;
              targetW = imgIsLandscape ? Math.max(baseW, baseH) : Math.min(baseW, baseH);
              targetH = imgIsLandscape ? Math.min(baseW, baseH) : Math.max(baseW, baseH);
            }

            const printableW = Math.max(10, targetW - 2 * marginPt);
            const printableH = Math.max(10, targetH - 2 * marginPt);

            let drawW = imgW;
            let drawH = imgH;
            let drawX = marginPt;
            let drawY = marginPt;

            if (fitMode === 'fit') {
              const scale = Math.min(printableW / imgW, printableH / imgH);
              drawW = imgW * scale;
              drawH = imgH * scale;
              drawX = marginPt + (printableW - drawW) / 2;
              drawY = marginPt + (printableH - drawH) / 2;
            } else if (fitMode === 'fill') {
              drawW = targetW;
              drawH = targetH;
              drawX = 0;
              drawY = 0;
            } else {
              // Original size centered
              drawW = imgW;
              drawH = imgH;
              drawX = (targetW - drawW) / 2;
              drawY = (targetH - drawH) / 2;
            }

            const page = mergedPdf.addPage([targetW, targetH]);
            page.drawImage(embeddedImage, {
              x: drawX,
              y: drawY,
              width: drawW,
              height: drawH,
            });
          }
        }
      }

      setProcessingStatus("Generating final unified PDF...");
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSuccessUrl(url);

    } catch (err: any) {
      setError(err.message || "An error occurred while merging files.");
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {!successUrl ? (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 
              ${isDragActive ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border/60 hover:border-primary/50 hover:bg-muted/30 bg-card/40'}`}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30 shadow-lg">
                <UploadCloud className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-2 tracking-tight text-foreground">
              {isDragActive ? 'Drop files to combine' : 'Select PDF, Word, PowerPoint & Images'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Drag &amp; drop your documents here. 100% private and processed on-device.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
              <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full shadow-sm">PDF</span>
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full shadow-sm">DOCX / DOC</span>
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full shadow-sm">PPTX / PPT</span>
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full shadow-sm">JPG</span>
              <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full shadow-sm">PNG</span>
              <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-3 py-1 rounded-full shadow-sm">WEBP</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-sm font-medium">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-6 bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl">
              {/* Selected Files Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h4 className="font-extrabold text-lg text-foreground">Selected Documents ({files.length})</h4>
                  <p className="text-xs text-muted-foreground">Drag and reorder files, rotate pages, or customize layout below.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={rotateAllFiles}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-muted"
                    title="Rotate all files 90° clockwise"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate All</span>
                  </button>
                  <span className="text-border">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([]);
                      setSuccessUrl(null);
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium px-2 py-1 rounded-lg hover:bg-destructive/10"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* Grid of Draggable File Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-1">
                {files.map((item, index) => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    className="group relative bg-muted/40 hover:bg-muted/70 rounded-2xl p-3 border border-border hover:border-primary/50 transition-all cursor-move flex flex-col items-center gap-2 shadow-sm"
                  >
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-background/90 text-[10px] font-black flex items-center justify-center border shadow-sm">
                        {index + 1}
                      </span>
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                    </div>

                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotateFile(item.id);
                        }}
                        className="bg-background/90 hover:bg-primary hover:text-primary-foreground text-foreground rounded-full p-1.5 border border-border shadow-sm transition-all hover:scale-110 active:scale-95"
                        title="Rotate 90° clockwise"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>

                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(item.id);
                        }}
                        className="bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-sm transition-all hover:scale-110 active:scale-95"
                        title="Remove file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="w-full aspect-[3/4] bg-background rounded-xl border border-border/60 flex items-center justify-center overflow-hidden relative shadow-inner">
                      <div 
                        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out"
                        style={{ transform: `rotate(${item.rotation || 0}deg)` }}
                      >
                        {item.type === 'image' ? (
                          <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-contain p-1" />
                        ) : item.type === 'word' ? (
                          <div className="flex flex-col items-center justify-center text-blue-500 p-2 text-center">
                            <FileType className="w-10 h-10 mb-1" />
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">DOCX</span>
                          </div>
                        ) : item.type === 'powerpoint' ? (
                          <div className="flex flex-col items-center justify-center text-amber-500 p-2 text-center">
                            <Presentation className="w-10 h-10 mb-1" />
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">PPTX</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-red-500 p-2 text-center">
                            <FileText className="w-10 h-10 mb-1" />
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">PDF</span>
                          </div>
                        )}
                      </div>

                      {item.rotation && item.rotation % 360 !== 0 ? (
                        <div className="absolute bottom-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded bg-primary/90 text-primary-foreground text-[9px] font-black shadow-sm flex items-center gap-0.5 pointer-events-none">
                          <RotateCw className="w-2.5 h-2.5" />
                          <span>{item.rotation % 360}°</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="w-full text-center px-1">
                      <p className="text-xs font-semibold truncate text-foreground" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {(item.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ⚙️ Page Scaling & Layout Customizer Panel with ON/OFF Toggle */}
              <div className={`rounded-2xl border transition-all ${
                enableScaling 
                  ? 'border-border/80 bg-muted/20' 
                  : 'border-border/40 bg-muted/10 opacity-90'
              }`}>
                {/* Header with Switch */}
                <div className="w-full px-5 py-3.5 flex items-center justify-between bg-muted/40 rounded-t-2xl">
                  <div 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                      enableScaling 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                        <span>Page Scaling &amp; Layout Options</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                          enableScaling 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {enableScaling ? `${pageSize.toUpperCase()} Standard` : 'Original Sizes'}
                        </span>
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        {enableScaling 
                          ? "Auto-scale images & slides to fit standard dimensions with clean margins." 
                          : "Scaling turned off. Files will merge at their original native dimensions."}
                      </p>
                    </div>
                  </div>

                  {/* High-Visibility Toggle Switch Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={enableScaling}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnableScaling(!enableScaling);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all shadow-sm ${
                        enableScaling
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight select-none">
                        {enableScaling ? 'Auto-Scale: ON' : 'Auto-Scale: OFF'}
                      </span>
                      <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        enableScaling ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
                      }`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          enableScaling ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Expand / Collapse settings"
                    >
                      {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Settings Body */}
                {showSettings && (
                  <div className="p-5 space-y-5 border-t border-border/60 animate-in fade-in duration-200">
                    {enableScaling ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* 1. Target Page Size */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <Layout className="w-3.5 h-3.5 text-blue-500" />
                              <span>Target Page Size</span>
                            </label>
                            <select
                              value={pageSize}
                              onChange={(e) => setPageSize(e.target.value as PageSizeType)}
                              className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                              <option value="a4">A4 (210 × 297 mm) — Standard</option>
                              <option value="letter">US Letter (8.5 × 11 in)</option>
                              <option value="legal">US Legal (8.5 × 14 in)</option>
                              <option value="a3">A3 (297 × 420 mm) — Large</option>
                              <option value="a5">A5 (148 × 210 mm) — Booklet</option>
                              <option value="fit_content">Original Native Size</option>
                            </select>
                          </div>

                          {/* 2. Orientation */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Orientation</span>
                            </label>
                            <select
                              value={orientation}
                              onChange={(e) => setOrientation(e.target.value as OrientationType)}
                              disabled={pageSize === 'fit_content'}
                              className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                            >
                              <option value="portrait">Portrait (Vertical A4 — Recommended Uniform)</option>
                              <option value="auto">Auto (Match Image/Page)</option>
                              <option value="landscape">Landscape (Horizontal)</option>
                            </select>
                          </div>

                          {/* 3. Content Fit Mode */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Content Scaling</span>
                            </label>
                            <select
                              value={fitMode}
                              onChange={(e) => setFitMode(e.target.value as FitModeType)}
                              disabled={pageSize === 'fit_content'}
                              className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                            >
                              <option value="fit">Fit to Page (Proportional)</option>
                              <option value="fill">Fill / Stretch Full Page</option>
                              <option value="original">Original Size (Centered)</option>
                            </select>
                          </div>

                          {/* 4. Margins */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <Square className="w-3.5 h-3.5 text-purple-500" />
                              <span>Page Margins</span>
                            </label>
                            <select
                              value={marginSize}
                              onChange={(e) => setMarginSize(e.target.value as MarginSizeType)}
                              disabled={pageSize === 'fit_content' || fitMode === 'fill'}
                              className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                            >
                              <option value="standard">Standard (12.7 mm / 0.5 in)</option>
                              <option value="small">Small (5 mm)</option>
                              <option value="none">No Margin (Full Bleed)</option>
                              <option value="large">Large (25.4 mm / 1 in)</option>
                            </select>
                          </div>
                        </div>

                        {/* Scope Selector: Images only vs All Pages */}
                        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background/60 p-3.5 rounded-xl border border-border/60">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Info className="w-4 h-4 text-primary shrink-0" />
                            <span>
                              {applyScope === 'images_only' 
                                ? "Standard PDFs remain 1:1; small/large images & PowerPoint slides are scaled to fit target page." 
                                : "Every page across all PDFs, slides, and images will be resized to uniform target dimensions."}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 bg-muted/60 p-1 rounded-lg border border-border/40">
                            <button
                              type="button"
                              onClick={() => setApplyScope('images_only')}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                applyScope === 'images_only' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              Images &amp; Slides Only
                            </button>
                            <button
                              type="button"
                              onClick={() => setApplyScope('all_pages')}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                applyScope === 'all_pages' 
                                ? 'bg-background text-foreground shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              All Pages
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/60 text-xs text-muted-foreground">
                        <Info className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">Auto-scaling is disabled</p>
                          <p>All files (PDFs, images, slides) will be merged maintaining their exact native dimensions and aspect ratios without adding margins or resizing.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <Button variant="outline" size="sm" type="button" className="rounded-xl text-xs font-bold">
                    + Add More Files
                  </Button>
                </div>

                <Button 
                  onClick={handleMerge} 
                  disabled={isProcessing}
                  size="lg"
                  className="w-full sm:w-auto px-8 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>{processingStatus || "Merging Files..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{enableScaling ? `Merge ${files.length} Files into Scaled PDF` : `Merge ${files.length} Files into PDF`}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-foreground tracking-tight">Your Merged PDF is Ready!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {enableScaling 
                ? `All your documents and media have been merged with calibrated ${pageSize.toUpperCase()} page dimensions.`
                : "All your documents and media have been merged maintaining their original native dimensions."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <a 
              href={successUrl} 
              download="merged-document.pdf"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm sm:text-base shadow-xl hover:scale-105 transition-all active:scale-95 text-decoration-none"
            >
              <FileDown className="w-5 h-5" />
              <span>Download Merged PDF</span>
            </a>
            <Button 
              variant="outline" 
              onClick={() => {
                setSuccessUrl(null);
                setFiles([]);
              }}
              className="rounded-2xl px-6 py-4 text-sm font-bold"
            >
              Merge More Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
