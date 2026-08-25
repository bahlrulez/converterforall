"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import {
  UploadCloud,
  FileText,
  Trash2,
  RotateCw,
  RotateCcw,
  ZoomIn,
  Plus,
  GripVertical,
  Undo2,
  Download,
  RefreshCw,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  FilePlus,
  Check,
  Sparkles,
  ArrowUpDown,
  CheckSquare,
  Square,
  FileDown,
  Loader2,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPendingFile } from "@/lib/file-transfer";

export interface PageItem {
  id: string;
  fileId: string;
  fileName: string;
  sourcePageIndex: number; // 0-based index in the original source document
  originalPageNumber: number; // 1-based human display page number
  rotation: number; // 0, 90, 180, 270 (relative angle added by user)
  thumbnailUrl: string | null;
  aspectRatio: number;
  isImage?: boolean;
  imageBlob?: Blob;
  isBlank?: boolean;
  selected?: boolean;
}

interface SourceDocument {
  id: string;
  file: File;
  name: string;
  size: number;
  fileBytes: Uint8Array;
  numPages: number;
  isImage?: boolean;
}

interface DeletedItem {
  page: PageItem;
  index: number;
}

export function OrganizePdfTool() {
  const [sourceDocs, setSourceDocs] = useState<SourceDocument[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [deletedHistory, setDeletedHistory] = useState<DeletedItem[]>([]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Zoom / Preview Lightbox Modal State
  const [previewPageIndex, setPreviewPageIndex] = useState<number | null>(null);

  // Multi-select & Batch
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // File input ref for "Add More Files"
  const addFilesInputRef = useRef<HTMLInputElement | null>(null);

  // Format bytes helper
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper to load pdfjs with robust local worker
  const getPdfJsLib = async () => {
    const pdfjsLib = await import("pdfjs-dist");
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
    return pdfjsLib;
  };

  // Check pending file on mount
  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("organize-pdf");
      if (pending) {
        processFiles([pending]);
      }
    }
    checkPending();
  }, []);

  // Process uploaded files (PDFs and Images)
  const processFiles = async (newFiles: File[], append = false) => {
    if (!newFiles || newFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const pdfjsLib = await getPdfJsLib();

      const newDocs: SourceDocument[] = [];
      const newPageItems: PageItem[] = [];

      for (let fIdx = 0; fIdx < newFiles.length; fIdx++) {
        const file = newFiles[fIdx];
        const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
        const isImg = file.type.startsWith("image/") || /\.(jpe?g|png|webp|bmp)$/i.test(file.name);

        if (!isPdf && !isImg) {
          continue;
        }

        const fileId = "doc_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
        const rawBuffer = await file.arrayBuffer();
        const fileBytes = new Uint8Array(rawBuffer);

        if (isPdf) {
          setLoadingText(`Reading document ${fIdx + 1} of ${newFiles.length}: ${file.name}...`);
          
          // Pass a cloned slice to avoid buffer detachment
          const loadingTask = pdfjsLib.getDocument({ data: fileBytes.slice(0) });
          const pdfDoc = await loadingTask.promise;
          const numPages = pdfDoc.numPages;

          const docEntry: SourceDocument = {
            id: fileId,
            file,
            name: file.name,
            size: file.size,
            fileBytes,
            numPages,
          };
          newDocs.push(docEntry);

          // Create page skeleton entries
          for (let pNum = 1; pNum <= numPages; pNum++) {
            newPageItems.push({
              id: `p_${fileId}_${pNum}_${Math.random().toString(36).substring(2, 6)}`,
              fileId,
              fileName: file.name,
              sourcePageIndex: pNum - 1,
              originalPageNumber: pNum,
              rotation: 0,
              thumbnailUrl: null,
              aspectRatio: 0.707, // standard default
            });
          }
        } else if (isImg) {
          setLoadingText(`Loading image ${file.name}...`);
          newDocs.push({
            id: fileId,
            file,
            name: file.name,
            size: file.size,
            fileBytes,
            numPages: 1,
            isImage: true,
          });

          const imgUrl = URL.createObjectURL(file);
          newPageItems.push({
            id: `p_${fileId}_1_${Math.random().toString(36).substring(2, 6)}`,
            fileId,
            fileName: file.name,
            sourcePageIndex: 0,
            originalPageNumber: 1,
            rotation: 0,
            thumbnailUrl: imgUrl,
            aspectRatio: 1,
            isImage: true,
            imageBlob: file,
          });
        }
      }

      if (newDocs.length === 0) {
        throw new Error("No valid PDF or image files found. Please upload a PDF.");
      }

      const updatedDocs = append ? [...sourceDocs, ...newDocs] : newDocs;
      const updatedPages = append ? [...pages, ...newPageItems] : newPageItems;

      setSourceDocs(updatedDocs);
      setPages(updatedPages);
      setIsLoading(false);

      // Render thumbnails immediately page-by-page
      renderThumbnails(newDocs);
    } catch (err: any) {
      console.error("Failed to load PDF:", err);
      setError(err?.message || "Failed to load the PDF. Please make sure the file is not password-protected or corrupted.");
      setIsLoading(false);
    }
  };

  // Render thumbnail previews for PDF pages
  const renderThumbnails = async (docsToRender: SourceDocument[]) => {
    try {
      const pdfjsLib = await getPdfJsLib();

      for (const doc of docsToRender) {
        if (doc.isImage) continue;

        try {
          // Always pass a fresh slice of fileBytes
          const loadingTask = pdfjsLib.getDocument({ data: doc.fileBytes.slice(0) });
          const pdfDoc = await loadingTask.promise;

          for (let p = 1; p <= doc.numPages; p++) {
            try {
              const page = await pdfDoc.getPage(p);
              const unscaledViewport = page.getViewport({ scale: 1.0 });
              const targetWidth = Math.min(320, Math.max(160, unscaledViewport.width));
              const scale = targetWidth / unscaledViewport.width;
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement("canvas");
              canvas.width = Math.round(viewport.width);
              canvas.height = Math.round(viewport.height);
              const ctx = canvas.getContext("2d", { alpha: false });

              if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const renderContext = {
                  canvasContext: ctx,
                  viewport: viewport,
                };

                // @ts-expect-error pdfjs-dist types
                await page.render(renderContext).promise;

                const thumbUrl = canvas.toDataURL("image/jpeg", 0.85);
                const ratio = viewport.width / viewport.height;

                setPages((prev) =>
                  prev.map((item) => {
                    if (item.fileId === doc.id && item.sourcePageIndex === p - 1) {
                      return {
                        ...item,
                        thumbnailUrl: thumbUrl,
                        aspectRatio: ratio,
                      };
                    }
                    return item;
                  })
                );
              }
            } catch (pageErr) {
              console.warn(`Error rendering thumbnail for page ${p}:`, pageErr);
            }
          }
        } catch (docErr) {
          console.error(`Error loading doc ${doc.name} for thumbnails:`, docErr);
        }
      }
    } catch (e) {
      console.error("Thumbnail rendering engine error:", e);
    }
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFiles(acceptedFiles, false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
    noClick: pages.length > 0,
  });

  // Reorder Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const updated = [...pages];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setPages(updated);
    setDraggedIndex(null);
    setLastActionMessage(`Moved page #${draggedIndex + 1} to position #${targetIndex + 1}`);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move page Left (up) or Right (down)
  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const updated = [...pages];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setPages(updated);
    setLastActionMessage(`Moved page #${fromIndex + 1} to position #${toIndex + 1}`);
  };

  // Rotate individual page
  const rotatePage = (index: number, angleChange = 90) => {
    setPages((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newRot = (item.rotation + angleChange) % 360;
          return { ...item, rotation: newRot < 0 ? newRot + 360 : newRot };
        }
        return item;
      })
    );
  };

  // Rotate all pages
  const rotateAllPages = (angleChange = 90) => {
    setPages((prev) =>
      prev.map((item) => {
        const newRot = (item.rotation + angleChange) % 360;
        return { ...item, rotation: newRot < 0 ? newRot + 360 : newRot };
      })
    );
    setLastActionMessage(`Rotated all pages ${angleChange > 0 ? "90° clockwise" : "90° counter-clockwise"}`);
  };

  // Delete individual page
  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      setError("Document must have at least one page.");
      return;
    }
    const pageToDelete = pages[index];
    setDeletedHistory((prev) => [...prev, { page: pageToDelete, index }]);
    setPages((prev) => prev.filter((_, i) => i !== index));
    setLastActionMessage(`Removed page #${index + 1} (Original Page ${pageToDelete.originalPageNumber})`);
  };

  // Duplicate page
  const duplicatePage = (index: number) => {
    const target = pages[index];
    const clone: PageItem = {
      ...target,
      id: `p_clone_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    };
    const updated = [...pages];
    updated.splice(index + 1, 0, clone);
    setPages(updated);
    setLastActionMessage(`Duplicated page #${index + 1}`);
  };

  // Undo last deletion
  const handleUndo = () => {
    if (deletedHistory.length === 0) return;
    const lastDeleted = deletedHistory[deletedHistory.length - 1];
    setDeletedHistory((prev) => prev.slice(0, -1));

    const updated = [...pages];
    const insertIdx = Math.min(lastDeleted.index, updated.length);
    updated.splice(insertIdx, 0, lastDeleted.page);
    setPages(updated);
    setLastActionMessage(`Restored Page ${lastDeleted.page.originalPageNumber}`);
  };

  // Reverse page order
  const handleReverseOrder = () => {
    setPages((prev) => [...prev].reverse());
    setLastActionMessage("Reversed page order");
  };

  // Reset to original document order
  const handleResetOrder = () => {
    const originalPages: PageItem[] = [];
    sourceDocs.forEach((doc) => {
      for (let p = 1; p <= doc.numPages; p++) {
        const existing = pages.find((pg) => pg.fileId === doc.id && pg.sourcePageIndex === p - 1);
        originalPages.push({
          id: existing?.id || `p_${doc.id}_${p}_${Math.random().toString(36).substring(2, 6)}`,
          fileId: doc.id,
          fileName: doc.name,
          sourcePageIndex: p - 1,
          originalPageNumber: p,
          rotation: 0,
          thumbnailUrl: existing?.thumbnailUrl || null,
          aspectRatio: existing?.aspectRatio || 0.707,
          isImage: doc.isImage,
          imageBlob: existing?.imageBlob,
        });
      }
    });

    setPages(originalPages);
    setDeletedHistory([]);
    setLastActionMessage("Reset to original document order");
  };

  // Toggle selection for batch actions
  const togglePageSelection = (index: number) => {
    setPages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const selectAll = (selected: boolean) => {
    setPages((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const deleteSelected = () => {
    const count = pages.filter((p) => p.selected).length;
    if (count === 0) return;
    if (count >= pages.length) {
      setError("Cannot delete all pages. At least one page must remain.");
      return;
    }

    const removed: DeletedItem[] = [];
    pages.forEach((p, idx) => {
      if (p.selected) removed.push({ page: p, index: idx });
    });

    setDeletedHistory((prev) => [...prev, ...removed]);
    setPages((prev) => prev.filter((p) => !p.selected));
    setLastActionMessage(`Deleted ${count} selected page${count > 1 ? "s" : ""}`);
  };

  const rotateSelected = (angleChange = 90) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.selected) {
          const newRot = (p.rotation + angleChange) % 360;
          return { ...p, rotation: newRot < 0 ? newRot + 360 : newRot };
        }
        return p;
      })
    );
  };

  // Add more files trigger
  const handleAddMoreFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files), true);
    }
  };

  // Add blank page
  const addBlankPage = () => {
    const blankPage: PageItem = {
      id: `p_blank_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      fileId: "blank_page",
      fileName: "Blank Page",
      sourcePageIndex: -1,
      originalPageNumber: 0,
      rotation: 0,
      thumbnailUrl: null,
      aspectRatio: 0.707,
      isBlank: true,
    };
    setPages((prev) => [...prev, blankPage]);
    setLastActionMessage("Added a blank page to the end");
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (previewPageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewPageIndex(null);
      } else if (e.key === "ArrowLeft") {
        setPreviewPageIndex((curr) => (curr !== null && curr > 0 ? curr - 1 : curr));
      } else if (e.key === "ArrowRight") {
        setPreviewPageIndex((curr) => (curr !== null && curr < pages.length - 1 ? curr + 1 : curr));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewPageIndex, pages.length]);

  // Export and download the organized PDF
  const handleExport = async () => {
    if (pages.length === 0) return;

    setIsExporting(true);
    setExportProgress(10);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      const loadedPdfLibDocs: Record<string, PDFDocument> = {};

      // Load all source PDFs cleanly
      for (const doc of sourceDocs) {
        if (!doc.isImage && !loadedPdfLibDocs[doc.id]) {
          try {
            const pdfDoc = await PDFDocument.load(doc.fileBytes.slice(0), { ignoreEncryption: true });
            loadedPdfLibDocs[doc.id] = pdfDoc;
          } catch (loadErr: any) {
            console.error(`Failed to load source doc ${doc.name}:`, loadErr);
            throw new Error(`Failed to parse "${doc.name}" with pdf-lib: ${loadErr?.message || "Unknown error"}`);
          }
        }
      }

      setExportProgress(30);

      // Iterate through the current ordered pages
      for (let i = 0; i < pages.length; i++) {
        const item = pages[i];
        setExportProgress(Math.round(30 + ((i + 1) / pages.length) * 55));

        if (item.isBlank) {
          // Add blank standard A4 page (595.28 x 841.89 points)
          mergedPdf.addPage([595.28, 841.89]);
        } else if (item.isImage && item.imageBlob) {
          // Embed image page
          const imgArrayBuffer = await item.imageBlob.arrayBuffer();
          let embeddedImg;
          if (item.imageBlob.type === "image/png" || item.fileName.toLowerCase().endsWith(".png")) {
            embeddedImg = await mergedPdf.embedPng(imgArrayBuffer);
          } else {
            embeddedImg = await mergedPdf.embedJpg(imgArrayBuffer);
          }

          const { width, height } = embeddedImg.scale(1);
          const newImgPage = mergedPdf.addPage([width, height]);
          newImgPage.drawImage(embeddedImg, {
            x: 0,
            y: 0,
            width,
            height,
          });

          if (item.rotation !== 0) {
            newImgPage.setRotation(degrees((item.rotation + 360) % 360));
          }
        } else {
          // Copy page from source PDF document
          const srcPdf = loadedPdfLibDocs[item.fileId];
          if (srcPdf) {
            const [copiedPage] = await mergedPdf.copyPages(srcPdf, [item.sourcePageIndex]);

            // Calculate combined rotation: original rotation + user added rotation
            let origRotation = 0;
            try {
              const rotObj = copiedPage.getRotation();
              if (rotObj && typeof rotObj.angle === "number") {
                origRotation = rotObj.angle;
              }
            } catch (e) {
              origRotation = 0;
            }

            const finalRotation = (origRotation + (item.rotation || 0)) % 360;
            copiedPage.setRotation(degrees((finalRotation + 360) % 360));

            mergedPdf.addPage(copiedPage);
          }
        }
      }

      setExportProgress(90);
      const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultSize(pdfBytes.length);
      setExportProgress(100);
      setLastActionMessage("PDF successfully organized and ready to download!");
    } catch (err: any) {
      console.error("Export error:", err);
      setError(err?.message || "Failed to assemble the organized PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const primaryName = sourceDocs[0]?.name.replace(/\.[^/.]+$/, "") || "document";
    a.download = `${primaryName}-organized.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hidden File Input for Adding Extra Files */}
      <input
        type="file"
        ref={addFilesInputRef}
        onChange={handleAddMoreFiles}
        accept=".pdf,image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
      />

      {/* 1. Initial Upload Dropzone View */}
      {pages.length === 0 && (
        <div
          {...getRootProps()}
          className={cn(
            "relative group border-2 border-dashed rounded-3xl p-10 md:p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden",
            "bg-gradient-to-b from-white/80 to-slate-50/80 dark:from-slate-900/60 dark:to-slate-950/60 backdrop-blur-xl",
            isDragActive
              ? "border-blue-500 bg-blue-500/10 scale-[0.99] shadow-2xl shadow-blue-500/20"
              : "border-slate-300/80 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-400/60 hover:shadow-xl shadow-slate-200/50 dark:shadow-none"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                <Layers className="w-10 h-10 stroke-[1.8]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Choose or Drop your PDF here
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Preview every page as a visual card, drag and drop to reorder, rotate, delete, or add pages effortlessly.
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              className="rounded-xl px-8 font-semibold shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-5 h-5 mr-2" />
              Select PDF File
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Live page previews
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Drag & drop reorder
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> In-browser processing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton during initial parsing */}
      {isLoading && (
        <div className="p-12 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
              Preparing Document Pages...
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{loadingText || "Extracting page thumbnails..."}</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold">Notice:</span>
            <span>{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-500/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 2. Interactive Organizer Workspace View */}
      {pages.length > 0 && !resultUrl && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Header Summary & Actions Bar */}
          <div className="p-4 md:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* File Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base">
                    {sourceDocs.length === 1 ? sourceDocs[0].name : `${sourceDocs.length} Documents Combined`}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                    {pages.length} {pages.length === 1 ? "Page" : "Pages"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Total Size: {formatBytes(sourceDocs.reduce((acc, d) => acc + d.size, 0))} • Drag cards to rearrange page order
                </p>
              </div>
            </div>

            {/* Quick Document Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addFilesInputRef.current?.click()}
                className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs h-9"
              >
                <FilePlus className="w-4 h-4 mr-1.5 text-blue-500" />
                Add More Pages
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={addBlankPage}
                className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs h-9"
              >
                <Plus className="w-4 h-4 mr-1 text-slate-500" />
                Blank Page
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetOrder}
                className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs h-9 text-slate-600 dark:text-slate-300"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Reset Order
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPages([]);
                  setSourceDocs([]);
                  setDeletedHistory([]);
                }}
                className="rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-xs h-9"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="p-3 md:p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left Batch Tools */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => rotateAllPages(90)}
                className="h-8 rounded-lg px-2.5 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                title="Rotate all pages 90 degrees clockwise"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Rotate All CW
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => rotateAllPages(-90)}
                className="h-8 rounded-lg px-2.5 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                title="Rotate all pages 90 degrees counter-clockwise"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Rotate All CCW
              </Button>

              <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReverseOrder}
                className="h-8 rounded-lg px-2.5 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                title="Flip entire document order backwards"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                Reverse Order
              </Button>

              <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

              {/* Selection Mode Toggle */}
              <Button
                variant={isSelectionMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setIsSelectionMode(!isSelectionMode);
                  if (isSelectionMode) selectAll(false);
                }}
                className={cn(
                  "h-8 rounded-lg px-2.5 font-medium transition-colors",
                  isSelectionMode
                    ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600"
                    : "hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                )}
              >
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
                {isSelectionMode ? "Exit Multi-Select" : "Select Pages"}
              </Button>

              {/* Multi-Select Sub-actions */}
              {isSelectionMode && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectAll(selectedCount !== pages.length)}
                    className="h-8 rounded-lg px-2 text-slate-600 dark:text-slate-300"
                  >
                    {selectedCount === pages.length ? "Deselect All" : "Select All"}
                  </Button>

                  {selectedCount > 0 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => rotateSelected(90)}
                        className="h-8 rounded-lg px-2 text-blue-600 dark:text-blue-400"
                      >
                        <RotateCw className="w-3 h-3 mr-1" />
                        Rotate ({selectedCount})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={deleteSelected}
                        className="h-8 rounded-lg px-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete ({selectedCount})
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Status / Undo */}
            <div className="flex items-center gap-2">
              {deletedHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  className="h-8 rounded-lg px-2.5 font-medium border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs"
                >
                  <Undo2 className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" />
                  Undo Last Removal ({deletedHistory.length})
                </Button>
              )}
            </div>
          </div>

          {/* Last Action Notification Toast */}
          {lastActionMessage && (
            <div className="py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-500" />
                {lastActionMessage}
              </span>
              <button
                onClick={() => setLastActionMessage(null)}
                className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* 3. Visual Grid of Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pages.map((page, index) => {
              const isSelected = !!page.selected;
              const isDragged = draggedIndex === index;
              const isDragTarget = dragOverIndex === index;

              return (
                <div
                  key={page.id}
                  draggable={!isSelectionMode}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden",
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/30 dark:border-blue-400"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-400/60 dark:hover:border-blue-500/60 hover:shadow-md",
                    isDragged && "opacity-40 scale-95 border-dashed border-blue-400",
                    isDragTarget && "ring-4 ring-blue-500/50 scale-[1.03] z-10",
                    !isSelectionMode && "cursor-grab active:cursor-grabbing"
                  )}
                >
                  {/* Top Bar: Sequence Number & Checkbox / Move Indicators */}
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {!isSelectionMode && (
                        <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        #{index + 1}
                      </span>
                    </div>

                    {isSelectionMode ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePageSelection(index);
                        }}
                        className={cn(
                          "w-5 h-5 rounded flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        )}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[90px]">
                        {page.isBlank ? "Blank" : `Orig p.${page.originalPageNumber}`}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Canvas / Image Viewport */}
                  <div
                    onClick={() => {
                      if (isSelectionMode) {
                        togglePageSelection(index);
                      } else {
                        setPreviewPageIndex(index);
                      }
                    }}
                    className="relative aspect-[3/4] p-3 flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 overflow-hidden cursor-pointer"
                  >
                    {page.isBlank ? (
                      <div className="w-full h-full border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-1">
                        <Square className="w-8 h-8 stroke-1" />
                        <span className="text-[11px] font-medium">Blank Page</span>
                      </div>
                    ) : page.thumbnailUrl ? (
                      <div
                        className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
                        style={{
                          transform: `rotate(${page.rotation}deg)`,
                        }}
                      >
                        <img
                          src={page.thumbnailUrl}
                          alt={`Page ${index + 1}`}
                          className="max-w-full max-h-full object-contain rounded shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="text-[10px] font-medium">Rendering...</span>
                      </div>
                    )}

                    {/* Hover Quick Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2 pointer-events-none group-hover:pointer-events-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPageIndex(index);
                        }}
                        className="h-7 px-3 rounded-lg text-xs font-semibold shadow bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center gap-1.5"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-blue-500" />
                        Zoom Preview
                      </Button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotatePage(index, 90);
                          }}
                          className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow transition-transform active:scale-90"
                          title="Rotate 90° Clockwise"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicatePage(index);
                          }}
                          className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow transition-transform active:scale-90"
                          title="Duplicate Page"
                        >
                          <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(index);
                          }}
                          className="w-7 h-7 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-rose-500 text-slate-700 hover:text-white dark:text-slate-200 flex items-center justify-center shadow transition-transform active:scale-90"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500 group-hover/btn:text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Quick Toolbar */}
                  <div className="px-2 py-1.5 bg-slate-50/80 dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          movePage(index, index - 1);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === pages.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          movePage(index, index + 1);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePage(index, 90);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                        title="Rotate Page"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePage(index);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Sticky Action Card */}
          <div className="sticky bottom-4 z-20 p-4 md:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Ready to Export {pages.length} {pages.length === 1 ? "Page" : "Pages"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Processed on-device • 100% private in your browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleResetOrder}
                className="rounded-xl border-slate-300 dark:border-slate-700 h-11 px-5 font-semibold text-xs text-slate-600 dark:text-slate-300"
              >
                Reset
              </Button>

              <Button
                type="button"
                size="lg"
                disabled={isExporting || pages.length === 0}
                onClick={handleExport}
                className="w-full sm:w-auto rounded-xl px-8 h-11 font-bold shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-all hover:scale-[1.02]"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF ({exportProgress}%)...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 mr-2" />
                    Save & Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Success Download Screen */}
      {resultUrl && (
        <div className="p-8 md:p-12 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Your PDF is Organized & Ready!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Successfully generated document containing {pages.length} pages ({formatBytes(resultSize)}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              size="lg"
              onClick={handleDownload}
              className="w-full sm:w-auto rounded-xl px-8 font-bold shadow-lg shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all hover:scale-[1.02]"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Organized PDF
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setResultUrl(null);
              }}
              className="w-full sm:w-auto rounded-xl px-6 border-slate-300 dark:border-slate-700 font-semibold"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Continue Editing
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setPages([]);
                setSourceDocs([]);
                setResultUrl(null);
                setDeletedHistory([]);
              }}
              className="w-full sm:w-auto rounded-xl px-6 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Organize Another PDF
            </Button>
          </div>
        </div>
      )}

      {/* 5. Full-Screen Page Preview Lightbox Modal */}
      {previewPageIndex !== null && pages[previewPageIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs">
                  Page #{previewPageIndex + 1} of {pages.length}
                </span>
                <span className="text-xs text-slate-400">
                  {pages[previewPageIndex].isBlank
                    ? "Blank Page"
                    : `Original: ${pages[previewPageIndex].fileName} (Page ${pages[previewPageIndex].originalPageNumber})`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rotatePage(previewPageIndex, 90)}
                  className="h-8 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw className="w-4 h-4 mr-1 text-blue-400" />
                  Rotate
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deletePage(previewPageIndex);
                    if (previewPageIndex >= pages.length - 1) {
                      setPreviewPageIndex(Math.max(0, pages.length - 2));
                    }
                  }}
                  className="h-8 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  title="Delete this page"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>

                <div className="w-px h-5 bg-slate-800 mx-1" />

                <button
                  type="button"
                  onClick={() => setPreviewPageIndex(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Image Zoom Viewport */}
            <div className="flex-1 min-h-0 p-6 flex items-center justify-center bg-slate-950 overflow-auto relative">
              {pages[previewPageIndex].isBlank ? (
                <div className="w-80 h-[450px] bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center text-slate-400">
                  <Square className="w-12 h-12 stroke-1 mb-2" />
                  <span className="font-semibold text-sm">Blank Page</span>
                </div>
              ) : pages[previewPageIndex].thumbnailUrl ? (
                <div
                  className="relative transition-transform duration-300 flex items-center justify-center max-h-[70vh]"
                  style={{
                    transform: `rotate(${pages[previewPageIndex].rotation}deg)`,
                  }}
                >
                  <img
                    src={pages[previewPageIndex].thumbnailUrl!}
                    alt={`Page ${previewPageIndex + 1}`}
                    className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-xs">Loading high resolution preview...</p>
                </div>
              )}

              {/* Prev / Next Navigation Arrows */}
              {previewPageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setPreviewPageIndex(previewPageIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {previewPageIndex < pages.length - 1 && (
                <button
                  type="button"
                  onClick={() => setPreviewPageIndex(previewPageIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60">
              <span>Use Left / Right arrow keys to navigate pages, Esc to close</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={previewPageIndex === 0}
                  onClick={() => setPreviewPageIndex(previewPageIndex - 1)}
                  className="h-7 text-xs text-slate-300"
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={previewPageIndex === pages.length - 1}
                  onClick={() => setPreviewPageIndex(previewPageIndex + 1)}
                  className="h-7 text-xs text-slate-300"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizePdfTool;
