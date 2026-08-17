"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  PenTool, 
  Highlighter, 
  Square, 
  Circle, 
  EyeOff, 
  Signature, 
  Stamp, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Trash2, 
  Undo, 
  Redo, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  FileText,
  MousePointer,
  Check,
  X,
  Palette
} from "lucide-react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { cn } from "@/lib/utils";

type ToolMode = "select" | "text" | "draw" | "highlight" | "rectangle" | "redact" | "signature" | "stamp";

interface TextAnnotation {
  id: string;
  type: "text";
  page: number;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  text: string;
  fontSize: number;
  color: string;
  isBold?: boolean;
}

interface ShapeAnnotation {
  id: string;
  type: "rectangle" | "redact";
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  fill?: boolean;
}

interface SignatureAnnotation {
  id: string;
  type: "signature" | "stamp";
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  dataUrl: string;
}

interface DrawPath {
  page: number;
  color: string;
  width: number;
  opacity: number;
  points: { x: number; y: number }[];
}

const PRESET_STAMPS = [
  { label: "APPROVED", color: "#10B981" },
  { label: "CONFIDENTIAL", color: "#EF4444" },
  { label: "DRAFT", color: "#F59E0B" },
  { label: "PAID", color: "#3B82F6" },
  { label: "FINAL", color: "#8B5CF6" },
];

export function PdfEditor() {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageRotation, setPageRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("document.pdf");

  // Active Tool & Style State
  const [toolMode, setToolMode] = useState<ToolMode>("select");
  const [brushColor, setBrushColor] = useState<string>("#EF4444");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(16);

  // Annotations Store
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [shapeAnnotations, setShapeAnnotations] = useState<ShapeAnnotation[]>([]);
  const [signatureAnnotations, setSignatureAnnotations] = useState<SignatureAnnotation[]>([]);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  // Drawing Canvas State
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  // Signature Pad Modal
  const [showSigModal, setShowSigModal] = useState<boolean>(false);
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [typedSigText, setTypedSigText] = useState<string>("");
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSigDrawing, setIsSigDrawing] = useState<boolean>(false);

  // PDF Page Canvas & Overlay
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load PDF into pdfjs
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setFileName(file.name);
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setPdfBytes(bytes);

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      
      // Reset Annotations
      setTextAnnotations([]);
      setShapeAnnotations([]);
      setSignatureAnnotations([]);
      setDrawPaths([]);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      alert("Failed to load PDF file. Please ensure it is a valid, unprotected PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render Current PDF Page
  useEffect(() => {
    if (!pdfBytes || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(currentPage);

        const viewport = page.getViewport({ scale: zoom * 1.5, rotation: pageRotation });
        const canvas = canvasRef.current;
        if (!canvas || !isMounted) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext as any).promise;

        // Resize & sync drawing overlay canvas
        if (overlayCanvasRef.current) {
          overlayCanvasRef.current.width = viewport.width;
          overlayCanvasRef.current.height = viewport.height;
          redrawDrawingOverlay();
        }
      } catch (err) {
        console.error("Render page error:", err);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [pdfBytes, currentPage, zoom, pageRotation]);

  // Redraw Freehand & Highlight strokes on overlay canvas
  const redrawDrawingOverlay = () => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Draw all paths for current page
    drawPaths
      .filter((p) => p.page === currentPage)
      .forEach((path) => {
        if (path.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width * zoom * 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = path.opacity;

        const first = path.points[0];
        ctx.moveTo((first.x / 100) * overlay.width, (first.y / 100) * overlay.height);

        for (let i = 1; i < path.points.length; i++) {
          const pt = path.points[i];
          ctx.lineTo((pt.x / 100) * overlay.width, (pt.y / 100) * overlay.height);
        }
        ctx.stroke();
        ctx.restore();
      });
  };

  useEffect(() => {
    redrawDrawingOverlay();
  }, [drawPaths, currentPage]);

  // Overlay Canvas Mouse Events for Freehand / Highlighter
  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode !== "draw" && toolMode !== "highlight") return;

    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const rect = overlay.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDrawing(true);
    currentPathRef.current = [{ x, y }];
  };

  const handleOverlayMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || (toolMode !== "draw" && toolMode !== "highlight")) return;

    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const rect = overlay.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    currentPathRef.current.push({ x, y });

    // Live stroke drawing
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    const pts = currentPathRef.current;
    if (pts.length > 1) {
      const prev = pts[pts.length - 2];
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = (toolMode === "highlight" ? 18 : brushSize) * zoom * 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = toolMode === "highlight" ? 0.35 : 0.9;
      ctx.moveTo((prev.x / 100) * overlay.width, (prev.y / 100) * overlay.height);
      ctx.lineTo((x / 100) * overlay.width, (y / 100) * overlay.height);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handleOverlayMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPathRef.current.length > 1) {
      const newPath: DrawPath = {
        page: currentPage,
        color: brushColor,
        width: toolMode === "highlight" ? 18 : brushSize,
        opacity: toolMode === "highlight" ? 0.35 : 0.9,
        points: [...currentPathRef.current],
      };
      setDrawPaths([...drawPaths, newPath]);
    }
    currentPathRef.current = [];
  };

  // Click on Page to Insert Text / Shapes
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (toolMode === "select" || toolMode === "draw" || toolMode === "highlight") return;

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    if (toolMode === "text") {
      const newText: TextAnnotation = {
        id: Math.random().toString(36).substring(2, 9),
        type: "text",
        page: currentPage,
        x,
        y,
        text: "Type here...",
        fontSize,
        color: brushColor,
        isBold: false,
      };
      setTextAnnotations([...textAnnotations, newText]);
      setActiveAnnotationId(newText.id);
      setToolMode("select");
    } else if (toolMode === "rectangle") {
      const newShape: ShapeAnnotation = {
        id: Math.random().toString(36).substring(2, 9),
        type: "rectangle",
        page: currentPage,
        x,
        y,
        w: 25,
        h: 12,
        color: brushColor,
        fill: false,
      };
      setShapeAnnotations([...shapeAnnotations, newShape]);
      setActiveAnnotationId(newShape.id);
      setToolMode("select");
    } else if (toolMode === "redact") {
      const newRedact: ShapeAnnotation = {
        id: Math.random().toString(36).substring(2, 9),
        type: "redact",
        page: currentPage,
        x,
        y,
        w: 22,
        h: 6,
        color: "#000000",
        fill: true,
      };
      setShapeAnnotations([...shapeAnnotations, newRedact]);
      setActiveAnnotationId(newRedact.id);
      setToolMode("select");
    }
  };

  // Signature Pad Drawing Logic
  const handleSigMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    setIsSigDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleSigMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSigDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1E293B";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleSigMouseUp = () => {
    setIsSigDrawing(false);
  };

  const clearSignaturePad = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const applySignature = () => {
    let dataUrl = "";
    if (sigMode === "draw" && sigCanvasRef.current) {
      dataUrl = sigCanvasRef.current.toDataURL("image/png");
    } else if (sigMode === "type" && typedSigText.trim()) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 400;
      tempCanvas.height = 140;
      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        ctx.font = "italic bold 42px 'Brush Script MT', 'Caveat', cursive, sans-serif";
        ctx.fillStyle = "#1E3A8A";
        ctx.fillText(typedSigText, 20, 85);
        dataUrl = tempCanvas.toDataURL("image/png");
      }
    }

    if (dataUrl) {
      const newSig: SignatureAnnotation = {
        id: Math.random().toString(36).substring(2, 9),
        type: "signature",
        page: currentPage,
        x: 40,
        y: 50,
        w: 24,
        h: 10,
        dataUrl,
      };
      setSignatureAnnotations([...signatureAnnotations, newSig]);
      setActiveAnnotationId(newSig.id);
    }
    setShowSigModal(false);
  };

  const addStamp = (stamp: typeof PRESET_STAMPS[0]) => {
    const stampCanvas = document.createElement("canvas");
    stampCanvas.width = 300;
    stampCanvas.height = 100;
    const ctx = stampCanvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = stamp.color;
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, 280, 80);
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = stamp.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(stamp.label, 150, 50);
      const dataUrl = stampCanvas.toDataURL("image/png");

      const newStamp: SignatureAnnotation = {
        id: Math.random().toString(36).substring(2, 9),
        type: "stamp",
        page: currentPage,
        x: 35,
        y: 40,
        w: 25,
        h: 10,
        dataUrl,
      };
      setSignatureAnnotations([...signatureAnnotations, newStamp]);
      setActiveAnnotationId(newStamp.id);
    }
  };

  // Compile & Export PDF with pdf-lib
  const handleExportPdf = async () => {
    if (!pdfBytes) return;

    try {
      setIsExporting(true);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const pageNum = pIdx + 1;
        const page = pages[pIdx];
        const { width, height } = page.getSize();

        // 1. Draw Text Annotations
        const pageTexts = textAnnotations.filter((t) => t.page === pageNum);
        for (const t of pageTexts) {
          const hex = t.color.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
          const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
          const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

          const targetX = (t.x / 100) * width;
          // Invert y because pdf-lib coordinates start from bottom-left
          const targetY = height - (t.y / 100) * height - t.fontSize;

          page.drawText(t.text, {
            x: targetX,
            y: targetY,
            size: t.fontSize,
            color: rgb(r, g, b),
          });
        }

        // 2. Draw Shapes & Redactions
        const pageShapes = shapeAnnotations.filter((s) => s.page === pageNum);
        for (const s of pageShapes) {
          const hex = s.color.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16) / 255 || 0;
          const g = parseInt(hex.substring(2, 4), 16) / 255 || 0;
          const b = parseInt(hex.substring(4, 6), 16) / 255 || 0;

          const targetX = (s.x / 100) * width;
          const targetW = (s.w / 100) * width;
          const targetH = (s.h / 100) * height;
          const targetY = height - (s.y / 100) * height - targetH;

          if (s.type === "redact" || s.fill) {
            page.drawRectangle({
              x: targetX,
              y: targetY,
              width: targetW,
              height: targetH,
              color: rgb(r, g, b),
            });
          } else {
            page.drawRectangle({
              x: targetX,
              y: targetY,
              width: targetW,
              height: targetH,
              borderColor: rgb(r, g, b),
              borderWidth: 2,
            });
          }
        }

        // 3. Draw Signatures & Stamps
        const pageSigs = signatureAnnotations.filter((sig) => sig.page === pageNum);
        for (const sig of pageSigs) {
          try {
            const pngImage = await pdfDoc.embedPng(sig.dataUrl);
            const targetX = (sig.x / 100) * width;
            const targetW = (sig.w / 100) * width;
            const targetH = (sig.h / 100) * height;
            const targetY = height - (sig.y / 100) * height - targetH;

            page.drawImage(pngImage, {
              x: targetX,
              y: targetY,
              width: targetW,
              height: targetH,
            });
          } catch (sigErr) {
            console.warn("Failed to embed signature:", sigErr);
          }
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Edited_${fileName}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export edited PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      
      {/* Upload Banner if No PDF Loaded */}
      {!pdfBytes ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#080e22]/90 backdrop-blur-md shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
            Upload PDF to Edit in Browser
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            Add text, signatures, highlights, drawings, and redactions directly on your device with 100% privacy.
          </p>

          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Loading PDF...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Choose PDF File</span>
                </>
              )}
            </div>
            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={isLoading} />
          </label>
        </div>
      ) : (
        <>
          {/* Main Top Studio Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#080e22]/95 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md">
            
            {/* Left Tool Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                size="sm"
                variant={toolMode === "select" ? "default" : "ghost"}
                onClick={() => setToolMode("select")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Select & Move Tool"
              >
                <MousePointer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Select</span>
              </Button>

              <Button
                size="sm"
                variant={toolMode === "text" ? "default" : "ghost"}
                onClick={() => setToolMode("text")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Add Text"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Text</span>
              </Button>

              <Button
                size="sm"
                variant={toolMode === "draw" ? "default" : "ghost"}
                onClick={() => setToolMode("draw")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Freehand Draw"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Draw</span>
              </Button>

              <Button
                size="sm"
                variant={toolMode === "highlight" ? "default" : "ghost"}
                onClick={() => setToolMode("highlight")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Highlighter"
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Highlight</span>
              </Button>

              <Button
                size="sm"
                variant={toolMode === "rectangle" ? "default" : "ghost"}
                onClick={() => setToolMode("rectangle")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Draw Rectangle"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shape</span>
              </Button>

              <Button
                size="sm"
                variant={toolMode === "redact" ? "default" : "ghost"}
                onClick={() => setToolMode("redact")}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5"
                title="Redact Blackout"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Redact</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSigModal(true)}
                className="h-9 px-3 rounded-xl text-xs font-bold gap-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                title="Insert Signature"
              >
                <Signature className="w-3.5 h-3.5" />
                <span>Sign</span>
              </Button>

              {/* Quick Stamps Dropdown */}
              <div className="relative group">
                <Button size="sm" variant="ghost" className="h-9 px-2.5 rounded-xl text-xs font-bold gap-1">
                  <Stamp className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Stamps</span>
                </Button>
                <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-col gap-1 p-2 rounded-xl bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 shadow-xl z-50 min-w-[140px]">
                  {PRESET_STAMPS.map((st) => (
                    <button
                      key={st.label}
                      onClick={() => addStamp(st)}
                      className="px-2.5 py-1.5 text-xs font-bold text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      style={{ color: st.color }}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Color & Size Picker */}
            <div className="flex items-center gap-2">
              {["#EF4444", "#3B82F6", "#10B981", "#000000", "#F59E0B"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBrushColor(c)}
                  className={cn(
                    "w-5 h-5 rounded-full transition-transform",
                    brushColor === c ? "scale-125 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#080e22]" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Right Zoom, Pagination & Export Actions */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                <button
                  onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold px-1 text-slate-600 dark:text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(2.2, zoom + 0.15))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPageRotation((pageRotation + 90) % 360)}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white ml-1"
                  title="Rotate Page"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Editor Workspace: Page Navigation & PDF Document Canvas */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-100/70 dark:bg-[#060b1a] border border-slate-200 dark:border-slate-800/80 min-h-[600px] overflow-auto">
            
            {/* Page Pagination Bar */}
            <div className="flex items-center gap-3 mb-4 bg-white dark:bg-[#0a1128] px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Document Interactive Container */}
            <div
              ref={containerRef}
              onClick={handlePageClick}
              className="relative shadow-2xl rounded-lg overflow-hidden cursor-crosshair bg-white"
            >
              {/* 1. Underlying Rendered PDF Canvas */}
              <canvas ref={canvasRef} className="block pointer-events-none" />

              {/* 2. Freehand Drawing & Highlighter Overlay Canvas */}
              <canvas
                ref={overlayCanvasRef}
                onMouseDown={handleOverlayMouseDown}
                onMouseMove={handleOverlayMouseMove}
                onMouseUp={handleOverlayMouseUp}
                className={cn(
                  "absolute inset-0 z-10",
                  (toolMode === "draw" || toolMode === "highlight") ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
                )}
              />

              {/* 3. Interactive Text Annotations Layer */}
              {textAnnotations
                .filter((t) => t.page === currentPage)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAnnotationId(item.id);
                    }}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      fontSize: `${item.fontSize * zoom}px`,
                      color: item.color,
                    }}
                    className={cn(
                      "absolute z-20 cursor-move group select-none",
                      activeAnnotationId === item.id ? "ring-2 ring-blue-500 rounded p-1" : ""
                    )}
                  >
                    <input
                      value={item.text}
                      onChange={(e) => {
                        setTextAnnotations(
                          textAnnotations.map((t) =>
                            t.id === item.id ? { ...t, text: e.target.value } : t
                          )
                        );
                      }}
                      className="bg-transparent border-none outline-none font-semibold"
                    />
                    {activeAnnotationId === item.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTextAnnotations(textAnnotations.filter((t) => t.id !== item.id));
                        }}
                        className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

              {/* 4. Interactive Shapes & Redactions Layer */}
              {shapeAnnotations
                .filter((s) => s.page === currentPage)
                .map((shape) => (
                  <div
                    key={shape.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAnnotationId(shape.id);
                    }}
                    style={{
                      left: `${shape.x}%`,
                      top: `${shape.y}%`,
                      width: `${shape.w}%`,
                      height: `${shape.h}%`,
                      backgroundColor: shape.fill ? shape.color : "transparent",
                      borderColor: shape.color,
                    }}
                    className={cn(
                      "absolute z-20 cursor-move border-2 rounded",
                      activeAnnotationId === shape.id ? "ring-2 ring-blue-500" : ""
                    )}
                  >
                    {activeAnnotationId === shape.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShapeAnnotations(shapeAnnotations.filter((s) => s.id !== shape.id));
                        }}
                        className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

              {/* 5. Interactive Signatures & Stamps Layer */}
              {signatureAnnotations
                .filter((sig) => sig.page === currentPage)
                .map((sig) => (
                  <div
                    key={sig.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAnnotationId(sig.id);
                    }}
                    style={{
                      left: `${sig.x}%`,
                      top: `${sig.y}%`,
                      width: `${sig.w}%`,
                      height: `${sig.h}%`,
                    }}
                    className={cn(
                      "absolute z-20 cursor-move group select-none flex items-center justify-center",
                      activeAnnotationId === sig.id ? "ring-2 ring-blue-500 rounded" : ""
                    )}
                  >
                    <img src={sig.dataUrl} alt="Signature" className="max-h-full max-w-full object-contain pointer-events-none" />
                    {activeAnnotationId === sig.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatureAnnotations(signatureAnnotations.filter((s) => s.id !== sig.id));
                        }}
                        className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Digital Signature Pad Modal */}
      {showSigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0a1128] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Signature className="w-4 h-4 text-blue-500" />
                <span>Add Digital Signature</span>
              </h3>
              <button onClick={() => setShowSigModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Signature Draw vs Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setSigMode("draw")}
                className={cn("py-1.5 text-xs font-bold rounded-lg transition-all", sigMode === "draw" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSigMode("type")}
                className={cn("py-1.5 text-xs font-bold rounded-lg transition-all", sigMode === "type" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Type Signature
              </button>
            </div>

            {sigMode === "draw" ? (
              <div className="space-y-2">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-[#060b1a] overflow-hidden">
                  <canvas
                    ref={sigCanvasRef}
                    width={380}
                    height={150}
                    onMouseDown={handleSigMouseDown}
                    onMouseMove={handleSigMouseMove}
                    onMouseUp={handleSigMouseUp}
                    className="w-full h-36 cursor-crosshair block"
                  />
                </div>
                <div className="flex justify-end">
                  <button onClick={clearSignaturePad} className="text-[11px] font-bold text-slate-500 hover:text-rose-500">
                    Clear Pad
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  value={typedSigText}
                  onChange={(e) => setTypedSigText(e.target.value)}
                  placeholder="Type your full name..."
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#060b1a] text-sm font-semibold"
                />
                {typedSigText && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060b1a] border border-slate-200 dark:border-slate-700 text-center font-script text-3xl text-blue-700 dark:text-blue-400 italic">
                    {typedSigText}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setShowSigModal(false)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={applySignature} className="rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white">
                Insert Signature
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
