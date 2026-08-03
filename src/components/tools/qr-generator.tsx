"use client";

import { useState, useRef } from "react";
import { QrCode, Download, Link as LinkIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function QRGenerator() {
  const [value, setValue] = useState("https://converterforall.com");
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadQR = () => {
    if (!svgRef.current) return;
    
    // Convert SVG to data URI
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // We want a high-res download
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    
    img.onload = () => {
      if (ctx) {
        // Add white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode.png";
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
            <QrCode className="h-6 w-6" />
            <h2 className="text-2xl font-bold">QR Code Generator</h2>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Enter a URL, text, email, or any other data to generate a custom QR code instantly.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">QR Content</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter URL or text here..."
                rows={4}
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-2xl p-8 border border-border">
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <QRCodeSVG 
              value={value || "https://converterforall.com"}
              size={200}
              level={"H"}
              includeMargin={true}
              ref={svgRef}
            />
          </div>
          
          <button
            onClick={downloadQR}
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
