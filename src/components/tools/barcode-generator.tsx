"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ScanBarcode } from "lucide-react";
import Barcode from "react-barcode";

export function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  const downloadBarcode = () => {
    if (!svgWrapperRef.current) return;
    
    // Find the svg inside the wrapper
    const svg = svgWrapperRef.current.querySelector("svg");
    if (!svg) return;

    // Convert SVG to data URI
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Barcode dimensions approx
    const w = parseInt(svg.getAttribute("width") || "300");
    const h = parseInt(svg.getAttribute("height") || "100");
    
    // Scale for high res download
    const scale = 4;
    canvas.width = w * scale;
    canvas.height = h * scale;
    
    img.onload = () => {
      if (ctx) {
        // Add white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "barcode.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="mx-auto max-w-4xl bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-8 grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <ScanBarcode className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Barcode Generator</h2>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Generate standard 1D barcodes instantly. Type any text or number combination below.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Barcode Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. 123456789012"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-2xl p-8 border border-border">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6 max-w-full overflow-hidden" ref={svgWrapperRef}>
            {value ? (
              <Barcode 
                value={value} 
                background="#ffffff"
                lineColor="#000000"
                width={2}
                height={80}
              />
            ) : (
              <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
                Enter a value to preview
              </div>
            )}
          </div>
          
          <button
            onClick={downloadBarcode}
            disabled={!value}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Download High-Res PNG
          </button>
        </div>
      </div>
    </div>
  );
}
