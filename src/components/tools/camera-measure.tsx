"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  Ruler,
  AlertCircle,
  Download,
  FlipHorizontal,
  Crosshair,
  Compass,
  CheckCircle2,
  HelpCircle,
  Square,
  ZoomIn,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferenceObject {
  name: string;
  category: "Cards" | "Coins" | "Paper" | "Custom";
  widthCm: number;
  heightCm?: number;
  hint: string;
}

const REFERENCE_PRESETS: Record<string, ReferenceObject> = {
  "credit-card": {
    name: "Standard Credit / Debit Card / ID",
    category: "Cards",
    widthCm: 8.56,
    heightCm: 5.398,
    hint: "Align calibration line along the long edge (8.56 cm)",
  },
  "a4-paper-width": {
    name: "A4 Paper (Short Edge)",
    category: "Paper",
    widthCm: 21.0,
    heightCm: 29.7,
    hint: "Align across the top/bottom edge (21.0 cm)",
  },
  "us-letter-width": {
    name: "US Letter Paper (Short Edge)",
    category: "Paper",
    widthCm: 21.59,
    heightCm: 27.94,
    hint: "Align across the top/bottom edge (21.59 cm / 8.5 in)",
  },
  "us-quarter": {
    name: "US Quarter Coin ($0.25)",
    category: "Coins",
    widthCm: 2.426,
    hint: "Align across the coin diameter (2.43 cm)",
  },
  "euro-1": {
    name: "1 Euro Coin (€1)",
    category: "Coins",
    widthCm: 2.325,
    hint: "Align across the coin diameter (2.33 cm)",
  },
  "euro-2": {
    name: "2 Euro Coin (€2)",
    category: "Coins",
    widthCm: 2.575,
    hint: "Align across the coin diameter (2.58 cm)",
  },
  "uk-pound": {
    name: "UK £1 Coin",
    category: "Coins",
    widthCm: 2.303,
    hint: "Align across the coin diameter (2.30 cm)",
  },
  "inr-10-coin": {
    name: "Indian ₹10 Coin",
    category: "Coins",
    widthCm: 2.70,
    hint: "Align across the coin diameter (2.70 cm)",
  },
  "custom": {
    name: "Custom Known Object",
    category: "Custom",
    widthCm: 10.0,
    hint: "Enter custom exact measurement",
  },
};

type Point = { x: number; y: number };
type MeasureMode = "distance" | "rectangle";
type UnitType = "cm" | "mm" | "inch" | "ft";

interface MeasurementItem {
  id: string;
  type: MeasureMode;
  start: Point;
  end: Point;
  isCalibration?: boolean;
  label?: string;
}

export function CameraMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [frozenImage, setFrozenImage] = useState<HTMLImageElement | null>(null);

  // Available Cameras
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // Calibration & Measuring State
  const [refKey, setRefKey] = useState<string>("credit-card");
  const [customWidthCm, setCustomWidthCm] = useState<number>(10.0);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(true);
  const [pixelsPerCm, setPixelsPerCm] = useState<number | null>(null);
  const [unit, setUnit] = useState<UnitType>("cm");
  const [measureMode, setMeasureMode] = useState<MeasureMode>("distance");

  // Line & Rectangle Measurements
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([]);
  const [currentLine, setCurrentLine] = useState<MeasurementItem | null>(null);
  const [activePoint, setActivePoint] = useState<{ id: string; which: "start" | "end" } | null>(null);

  // Loupe / Magnifier
  const [loupePoint, setLoupePoint] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mobile Gyro Level Indicator
  const [orientation, setOrientation] = useState<{ gamma: number; beta: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // -------------------------------------------------------------
  // Camera Setup with High-Res / Multi-Camera Constraints
  // -------------------------------------------------------------
  const getCameras = async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        // Default to environment/back camera if available
        const backCam = videoDevices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment"));
        setSelectedDeviceId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
      }
    } catch {
      // Ignored
    }
  };

  const startCamera = async (deviceId?: string, mode?: "environment" | "user") => {
    stopCamera();
    setError("");
    setIsCameraReady(false);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          ...(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: mode || facingMode }),
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };
      }
      await getCameras();
    } catch (err: any) {
      console.warn("High-res camera failed, falling back to basic stream:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraReady(true);
          };
        }
      } catch (finalErr: any) {
        setError("Unable to access camera. Please check camera permissions in your browser.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera(selectedDeviceId, facingMode);
    return () => stopCamera();
  }, [selectedDeviceId, facingMode]);

  // Handle device orientation for level indicator
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setOrientation({ gamma: Math.round(e.gamma), beta: Math.round(e.beta) });
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  // -------------------------------------------------------------
  // Freeze / Snapshot Capture
  // -------------------------------------------------------------
  const toggleFreezeFrame = () => {
    if (!isFrozen) {
      // Capture current video frame to an off-screen image
      const video = videoRef.current;
      if (!video) return;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = video.videoWidth || 1280;
      offCanvas.height = video.videoHeight || 720;
      const offCtx = offCanvas.getContext("2d");
      if (offCtx) {
        offCtx.drawImage(video, 0, 0, offCanvas.width, offCanvas.height);
        const img = new Image();
        img.src = offCanvas.toDataURL("image/jpeg", 0.95);
        img.onload = () => {
          setFrozenImage(img);
          setIsFrozen(true);
        };
      }
    } else {
      setIsFrozen(false);
      setFrozenImage(null);
    }
  };

  // -------------------------------------------------------------
  // Unit Formatting Helper
  // -------------------------------------------------------------
  const formatLength = (cmVal: number) => {
    switch (unit) {
      case "mm":
        return `${(cmVal * 10).toFixed(1)} mm`;
      case "inch":
        return `${(cmVal * 0.393701).toFixed(2)} in`;
      case "ft":
        return `${(cmVal * 0.0328084).toFixed(3)} ft`;
      case "cm":
      default:
        return `${cmVal.toFixed(2)} cm`;
    }
  };

  const getActiveRefWidth = () => {
    if (refKey === "custom") return customWidthCm;
    return REFERENCE_PRESETS[refKey]?.widthCm || 8.56;
  };

  // -------------------------------------------------------------
  // Touch / Pointer Event Handlers
  // -------------------------------------------------------------
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = getCanvasCoords(e);
    setIsDragging(true);
    setLoupePoint(p);

    // Check if clicking near any existing handle to drag it
    const handleHitRadius = 25;
    for (const item of measurements) {
      const dStart = Math.hypot(p.x - item.start.x, p.y - item.start.y);
      if (dStart < handleHitRadius) {
        setActivePoint({ id: item.id, which: "start" });
        return;
      }
      const dEnd = Math.hypot(p.x - item.end.x, p.y - item.end.y);
      if (dEnd < handleHitRadius) {
        setActivePoint({ id: item.id, which: "end" });
        return;
      }
    }

    // Otherwise, start a new line / measurement
    const newItem: MeasurementItem = {
      id: "m-" + Date.now(),
      type: isCalibrating ? "distance" : measureMode,
      start: p,
      end: p,
      isCalibration: isCalibrating,
    };
    setCurrentLine(newItem);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const p = getCanvasCoords(e);
    setLoupePoint(p);

    if (activePoint) {
      // Modifying existing handle
      setMeasurements((prev) =>
        prev.map((item) => {
          if (item.id !== activePoint.id) return item;
          const updated = { ...item };
          if (activePoint.which === "start") updated.start = p;
          else updated.end = p;

          // If calibration line was modified, recalibrate
          if (updated.isCalibration) {
            const dx = updated.end.x - updated.start.x;
            const dy = updated.end.y - updated.start.y;
            const pxLen = Math.sqrt(dx * dx + dy * dy);
            if (pxLen > 10) {
              setPixelsPerCm(pxLen / getActiveRefWidth());
            }
          }
          return updated;
        })
      );
    } else if (currentLine) {
      setCurrentLine({ ...currentLine, end: p });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setLoupePoint(null);
    setActivePoint(null);

    if (currentLine) {
      const dx = currentLine.end.x - currentLine.start.x;
      const dy = currentLine.end.y - currentLine.start.y;
      const pxLen = Math.sqrt(dx * dx + dy * dy);

      if (pxLen > 15) {
        if (isCalibrating) {
          const refWidth = getActiveRefWidth();
          const calculatedPpc = pxLen / refWidth;
          setPixelsPerCm(calculatedPpc);
          setMeasurements([{ ...currentLine, isCalibration: true }]);
          setIsCalibrating(false);
        } else {
          setMeasurements((prev) => [...prev, currentLine]);
        }
      }
      setCurrentLine(null);
    }
  };

  // -------------------------------------------------------------
  // Canvas Rendering & Draw Loop
  // -------------------------------------------------------------
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If in freeze frame mode, draw the captured image background
    if (isFrozen && frozenImage) {
      ctx.drawImage(frozenImage, 0, 0, canvas.width, canvas.height);
    }

    const drawHandle = (pt: Point, color: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = color + "88";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const drawDistanceLine = (item: MeasurementItem, color: string, label: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(item.start.x, item.start.y);
      ctx.lineTo(item.end.x, item.end.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      drawHandle(item.start, color);
      drawHandle(item.end, color);

      // Label background pill
      const midX = (item.start.x + item.end.x) / 2;
      const midY = (item.start.y + item.end.y) / 2;

      ctx.font = "bold 15px sans-serif";
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const padX = 12;
      const padY = 6;

      ctx.fillStyle = "rgba(10, 18, 44, 0.88)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(midX - textWidth / 2 - padX, midY - 24 - padY, textWidth + padX * 2, 24 + padY, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, midX, midY - 12);
      ctx.restore();
    };

    const drawRectangle = (item: MeasurementItem, color: string) => {
      const minX = Math.min(item.start.x, item.end.x);
      const minY = Math.min(item.start.y, item.end.y);
      const width = Math.abs(item.end.x - item.start.x);
      const height = Math.abs(item.end.y - item.start.y);

      ctx.save();
      ctx.fillStyle = color + "22";
      ctx.fillRect(minX, minY, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(minX, minY, width, height);

      drawHandle(item.start, color);
      drawHandle(item.end, color);

      if (pixelsPerCm) {
        const wCm = width / pixelsPerCm;
        const hCm = height / pixelsPerCm;
        const areaCm2 = wCm * hCm;
        const label = `${formatLength(wCm)} × ${formatLength(hCm)} (${areaCm2.toFixed(1)} cm²)`;

        const midX = minX + width / 2;
        const midY = minY + height / 2;

        ctx.font = "bold 14px sans-serif";
        const textWidth = ctx.measureText(label).width;

        ctx.fillStyle = "rgba(10, 18, 44, 0.9)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(midX - textWidth / 2 - 10, midY - 14, textWidth + 20, 28, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, midX, midY);
      }
      ctx.restore();
    };

    // Draw saved measurements
    measurements.forEach((item) => {
      const dx = item.end.x - item.start.x;
      const dy = item.end.y - item.start.y;
      const pixelLength = Math.hypot(dx, dy);

      if (item.isCalibration) {
        const refWidth = getActiveRefWidth();
        drawDistanceLine(item, "#10b981", `📐 Reference: ${formatLength(refWidth)}`);
      } else if (item.type === "rectangle") {
        drawRectangle(item, "#8b5cf6");
      } else if (pixelsPerCm) {
        const lengthCm = pixelLength / pixelsPerCm;
        drawDistanceLine(item, "#06b6d4", formatLength(lengthCm));
      }
    });

    // Draw current actively drawn item
    if (currentLine) {
      const activeColor = isCalibrating ? "#10b981" : currentLine.type === "rectangle" ? "#8b5cf6" : "#06b6d4";
      if (currentLine.type === "rectangle") {
        drawRectangle(currentLine, activeColor);
      } else {
        const dx = currentLine.end.x - currentLine.start.x;
        const dy = currentLine.end.y - currentLine.start.y;
        const pxLen = Math.hypot(dx, dy);
        let previewLabel = isCalibrating ? "Set Reference Line" : "Measuring...";
        if (!isCalibrating && pixelsPerCm) {
          previewLabel = formatLength(pxLen / pixelsPerCm);
        }
        drawDistanceLine(currentLine, activeColor, previewLabel);
      }
    }

    // Draw Zoom Loupe Magnifier when dragging
    if (loupePoint && isDragging) {
      const loupeRadius = 60;
      const loupeMargin = 20;
      // Position loupe in top-right unless cursor is there
      const loupeX = loupePoint.x > canvas.width - 150 && loupePoint.y < 150 ? loupeMargin + loupeRadius : canvas.width - loupeRadius - loupeMargin;
      const loupeY = loupeRadius + loupeMargin;

      ctx.save();
      ctx.beginPath();
      ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
      ctx.clip();

      // Draw magnified view (2.5x)
      const zoom = 2.5;
      const sourceW = (loupeRadius * 2) / zoom;
      const sourceH = (loupeRadius * 2) / zoom;

      if (isFrozen && frozenImage) {
        ctx.drawImage(
          frozenImage,
          loupePoint.x - sourceW / 2,
          loupePoint.y - sourceH / 2,
          sourceW,
          sourceH,
          loupeX - loupeRadius,
          loupeY - loupeRadius,
          loupeRadius * 2,
          loupeRadius * 2
        );
      } else if (videoRef.current && isCameraReady) {
        ctx.drawImage(
          videoRef.current,
          loupePoint.x - sourceW / 2,
          loupePoint.y - sourceH / 2,
          sourceW,
          sourceH,
          loupeX - loupeRadius,
          loupeY - loupeRadius,
          loupeRadius * 2,
          loupeRadius * 2
        );
      }

      // Draw loupe crosshairs
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(loupeX - loupeRadius, loupeY);
      ctx.lineTo(loupeX + loupeRadius, loupeY);
      ctx.moveTo(loupeX, loupeY - loupeRadius);
      ctx.lineTo(loupeX, loupeY + loupeRadius);
      ctx.stroke();

      ctx.restore();

      // Loupe border frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(loupeX, loupeY, loupeRadius + 2, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#0ea5e9";
      ctx.stroke();
      ctx.restore();
    }
  }, [measurements, currentLine, pixelsPerCm, isCalibrating, refKey, customWidthCm, isFrozen, frozenImage, isDragging, loupePoint, unit, isCameraReady]);

  // Sync canvas size to video size
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (canvas) {
        const targetWidth = isFrozen && frozenImage ? frozenImage.width : video?.videoWidth || 1280;
        const targetHeight = isFrozen && frozenImage ? frozenImage.height : video?.videoHeight || 720;

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }
        redrawCanvas();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [redrawCanvas, isFrozen, frozenImage]);

  // -------------------------------------------------------------
  // Export Measured Image with Dimensions Stamp
  // -------------------------------------------------------------
  const handleExportImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Draw video background if not frozen
    if (!isFrozen && video && isCameraReady) {
      ctx.drawImage(video, 0, 0, exportCanvas.width, exportCanvas.height);
    } else if (isFrozen && frozenImage) {
      ctx.drawImage(frozenImage, 0, 0, exportCanvas.width, exportCanvas.height);
    }

    // Draw overlay measurements
    ctx.drawImage(canvas, 0, 0);

    // Watermark badge
    ctx.save();
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "rgba(10, 18, 44, 0.85)";
    ctx.fillRect(20, exportCanvas.height - 50, 240, 32);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ConverterForAll Camera Measure", 30, exportCanvas.height - 28);
    ctx.restore();

    const link = document.createElement("a");
    link.download = `camera-measurement-${Date.now()}.jpg`;
    link.href = exportCanvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const isLevel = orientation ? Math.abs(orientation.gamma) < 5 && Math.abs(orientation.beta) < 5 : true;

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-slate-900 dark:text-slate-100">
      
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-[#080e22]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Optical Reference Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Camera Measurement Studio</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Precision dimension measurement using physical reference scale. Supports Mobile (iOS/Android) &amp; HD Webcams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Freeze / Live Camera Button */}
            <Button
              variant={isFrozen ? "default" : "outline"}
              size="sm"
              onClick={toggleFreezeFrame}
              className={`rounded-xl font-bold gap-2 ${isFrozen ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
            >
              {isFrozen ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isFrozen ? "Resume Live Camera" : "Freeze / Snapshot Frame"}</span>
            </Button>

            {/* Export Measured Image */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportImage}
              className="rounded-xl font-bold gap-2 border-slate-300 dark:border-slate-700"
            >
              <Download className="w-4 h-4 text-blue-500" />
              <span>Export Photo</span>
            </Button>
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* Reference Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Reference Calibration Scale</span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">{REFERENCE_PRESETS[refKey]?.category}</span>
            </label>
            <select
              value={refKey}
              onChange={(e) => {
                setRefKey(e.target.value);
                setMeasurements([]);
                setPixelsPerCm(null);
                setIsCalibrating(true);
              }}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1430] px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(REFERENCE_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name} ({item.widthCm} cm)
                </option>
              ))}
            </select>
            {refKey === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Width (cm):</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={customWidthCm}
                  onChange={(e) => setCustomWidthCm(parseFloat(e.target.value) || 1)}
                  className="w-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1430] px-2 py-1 text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Unit Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Measurement Units
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              {(["cm", "mm", "inch", "ft"] as UnitType[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    unit === u
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Tool Mode: Distance vs Area Box */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Measure Mode
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setMeasureMode("distance")}
                className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  measureMode === "distance"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Line / Length</span>
              </button>
              <button
                onClick={() => setMeasureMode("rectangle")}
                className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  measureMode === "rectangle"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>2D Area Box</span>
              </button>
            </div>
          </div>

          {/* Camera Device Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Active Camera</span>
              <button
                onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <FlipHorizontal className="w-3 h-3" />
                <span>Flip Camera</span>
              </button>
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1430] px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {devices.length === 0 && <option value="">Default Camera</option>}
              {devices.map((d, idx) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Controls & Calibration Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          
          <div className="flex items-center gap-2">
            <Button
              variant={isCalibrating ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMeasurements([]);
                setPixelsPerCm(null);
                setIsCalibrating(true);
              }}
              className={`rounded-xl font-bold text-xs gap-1.5 ${isCalibrating ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isCalibrating ? "Setting Calibration..." : "Recalibrate Reference"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={measurements.length === 0}
              onClick={() => {
                const calib = measurements.find((m) => m.isCalibration);
                setMeasurements(calib ? [calib] : []);
              }}
              className="rounded-xl font-bold text-xs text-rose-500 hover:text-rose-600 border-slate-300 dark:border-slate-700"
            >
              Clear Measurements
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Calibration Status Badge */}
            {pixelsPerCm ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Calibrated: {pixelsPerCm.toFixed(1)} px/cm</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Step 1: Calibration Required</span>
              </span>
            )}

            {/* Gyro Level Indicator */}
            {orientation && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  isLevel
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                }`}
                title="Keep phone level to avoid perspective distortion error"
              >
                <Compass className={`w-3.5 h-3.5 ${isLevel ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span>{isLevel ? "Level: 0° (Accurate)" : `Tilt: ${Math.abs(orientation.beta)}°`}</span>
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-video touch-none select-none">
        
        {/* Live Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isFrozen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Interactive Measurement & Overlay Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full z-10 cursor-crosshair touch-none"
        />

        {/* Error Fallback */}
        {error && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Camera Access Blocked</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-5 leading-relaxed">{error}</p>
            <Button onClick={() => startCamera()} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700">
              Grant Permission &amp; Retry
            </Button>
          </div>
        )}

        {/* Top Step Guidance Pill */}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none px-4">
          <div className="bg-slate-950/80 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-ping bg-blue-400" />
            <span>
              {isCalibrating
                ? `👉 Step 1: Draw a line across your ${REFERENCE_PRESETS[refKey]?.name} (${getActiveRefWidth()} cm)`
                : `👉 Step 2: Drag across any object to measure (${unit}) • Tap 'Freeze Frame' if hand shakes`}
            </span>
          </div>
        </div>

        {/* Bottom Sub-Pixel Hint */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[11px] text-slate-300 border border-white/10">
          <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hold &amp; Drag for 2.5x Zoom Loupe with Crosshair Precision</span>
        </div>

      </div>

      {/* Accuracy Guide & Pro-Tips Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#080e22] border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
            <Ruler className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">1. Keep Card &amp; Object on Same Plane</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Place your credit card or coin directly next to the object you are measuring so both are at the exact same distance from the camera lens.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#080e22] border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
            <Compass className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">2. Keep Phone Parallel (0° Tilt)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Hold your smartphone directly overhead or straight in front of the target. Watch the green Level indicator to eliminate perspective skew.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#080e22] border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3">
            <Camera className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">3. Use Freeze Frame on Mobile</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tap &quot;Freeze / Snapshot Frame&quot; to freeze a crystal-clear high-res still photo, allowing you to draw and adjust with pinpoint precision.
          </p>
        </div>

      </div>

    </div>
  );
}
