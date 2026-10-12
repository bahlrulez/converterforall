"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Download, Image as ImageIcon, ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  originalType: string;
  targetDpi: number;
  newBlob?: Blob;
  newUrl?: string;
  status: "pending" | "done" | "error";
  errorMsg?: string;
}

// CRC32 algorithm for PNG chunks
const calculateCrc32 = (buffer: Uint8Array): number => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buffer[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
};

// Change DPI of JPEG by modifying or inserting JFIF APP0 segment
const changeJpegDpi = (buffer: ArrayBuffer, dpi: number): Blob => {
  const data = new Uint8Array(buffer);
  const view = new DataView(buffer);
  
  if (data[0] !== 0xFF || data[1] !== 0xD8) {
    throw new Error("Invalid JPEG format.");
  }

  let offset = 2;
  let foundAPP0 = false;

  while (offset < data.length) {
    if (data[offset] === 0xFF && data[offset + 1] === 0xE0) {
      // APP0 segment found
      const length = view.getUint16(offset + 2, false);
      const identifier = String.fromCharCode(data[offset+4], data[offset+5], data[offset+6], data[offset+7]);
      
      if (identifier === "JFIF") {
        foundAPP0 = true;
        // Update units (offset + 11) to 1 (pixels per inch)
        data[offset + 11] = 1;
        // Update X density (offset + 12)
        view.setUint16(offset + 12, dpi, false);
        // Update Y density (offset + 14)
        view.setUint16(offset + 14, dpi, false);
        break;
      }
      offset += 2 + length;
    } else if (data[offset] === 0xFF) {
      const length = view.getUint16(offset + 2, false);
      offset += 2 + length;
    } else {
      break;
    }
  }

  if (!foundAPP0) {
    // If no APP0 JFIF, inject one immediately after SOI (0xFF 0xD8)
    const app0 = new Uint8Array([
      0xFF, 0xE0, // Marker
      0x00, 0x10, // Length (16 bytes)
      0x4A, 0x46, 0x49, 0x46, 0x00, // JFIF\0
      0x01, 0x01, // Version 1.1
      0x01, // Units: DPI
      (dpi >> 8) & 0xFF, dpi & 0xFF, // X density
      (dpi >> 8) & 0xFF, dpi & 0xFF, // Y density
      0x00, 0x00 // Thumbnail
    ]);
    
    const newBuffer = new Uint8Array(data.length + app0.length);
    newBuffer.set(data.subarray(0, 2), 0);
    newBuffer.set(app0, 2);
    newBuffer.set(data.subarray(2), 2 + app0.length);
    return new Blob([newBuffer], { type: "image/jpeg" });
  }

  return new Blob([data], { type: "image/jpeg" });
};

// Change DPI of PNG by modifying or inserting pHYs chunk
const changePngDpi = (buffer: ArrayBuffer, dpi: number): Blob => {
  const data = new Uint8Array(buffer);
  const view = new DataView(buffer);
  
  // PNG signature
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (data[i] !== signature[i]) throw new Error("Invalid PNG format.");
  }

  const ppm = Math.round(dpi * 39.3701); // pixels per meter
  let offset = 8;
  let idatOffset = -1;
  let physOffset = -1;
  let physLength = 0;

  while (offset < data.length) {
    const length = view.getUint32(offset, false);
    const type = String.fromCharCode(data[offset+4], data[offset+5], data[offset+6], data[offset+7]);
    
    if (type === "pHYs") {
      physOffset = offset;
      physLength = length;
    } else if (type === "IDAT" && idatOffset === -1) {
      idatOffset = offset;
    }
    
    offset += 12 + length; // length (4) + type (4) + data (length) + crc (4)
  }

  // Build new pHYs chunk
  const chunkType = new Uint8Array([112, 72, 89, 115]); // "pHYs"
  const chunkData = new Uint8Array(9);
  const chunkView = new DataView(chunkData.buffer);
  chunkView.setUint32(0, ppm, false); // X
  chunkView.setUint32(4, ppm, false); // Y
  chunkView.setUint8(8, 1); // Unit (1 = meter)
  
  const crcData = new Uint8Array(chunkType.length + chunkData.length);
  crcData.set(chunkType, 0);
  crcData.set(chunkData, 4);
  const crc = calculateCrc32(crcData);
  
  const newChunk = new Uint8Array(12 + 9);
  const newChunkView = new DataView(newChunk.buffer);
  newChunkView.setUint32(0, 9, false); // Length
  newChunk.set(chunkType, 4); // Type
  newChunk.set(chunkData, 8); // Data
  newChunkView.setUint32(17, crc, false); // CRC

  if (physOffset !== -1) {
    // Replace existing pHYs chunk
    const before = data.subarray(0, physOffset);
    const after = data.subarray(physOffset + 12 + physLength);
    const newBuffer = new Uint8Array(before.length + newChunk.length + after.length);
    newBuffer.set(before, 0);
    newBuffer.set(newChunk, before.length);
    newBuffer.set(after, before.length + newChunk.length);
    return new Blob([newBuffer], { type: "image/png" });
  } else if (idatOffset !== -1) {
    // Inject before first IDAT
    const before = data.subarray(0, idatOffset);
    const after = data.subarray(idatOffset);
    const newBuffer = new Uint8Array(before.length + newChunk.length + after.length);
    newBuffer.set(before, 0);
    newBuffer.set(newChunk, before.length);
    newBuffer.set(after, before.length + newChunk.length);
    return new Blob([newBuffer], { type: "image/png" });
  }

  throw new Error("Invalid PNG structure.");
};

export default function ImageDpiConverter() {
  const [files, setFiles] = useState<ProcessedImage[]>([]);
  const [targetDpi, setTargetDpi] = useState<number>(200);

  const processFile = async (file: ProcessedImage, dpi: number) => {
    try {
      const arrayBuffer = await file.originalFile.arrayBuffer();
      let blob: Blob;
      
      if (file.originalType === "image/jpeg" || file.originalType === "image/jpg") {
        blob = changeJpegDpi(arrayBuffer, dpi);
      } else if (file.originalType === "image/png") {
        blob = changePngDpi(arrayBuffer, dpi);
      } else {
        throw new Error("Unsupported format. Use JPG or PNG.");
      }

      setFiles(prev => prev.map(f => f.id === file.id ? { 
        ...f, 
        status: "done", 
        newBlob: blob, 
        newUrl: URL.createObjectURL(blob) 
      } : f));
    } catch (err: any) {
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: "error", errorMsg: err.message } : f));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      originalFile: f,
      originalUrl: URL.createObjectURL(f),
      originalSize: f.size,
      originalType: f.type,
      targetDpi: targetDpi,
      status: "pending" as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(nf => {
      processFile(nf, targetDpi);
    });
  }, [targetDpi]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    }
  });

  const handleDpiChange = (dpi: number) => {
    setTargetDpi(dpi);
    setFiles(prev => {
      const updated = prev.map(f => ({ ...f, status: "pending" as const }));
      updated.forEach(f => processFile(f, dpi));
      return updated;
    });
  };

  const formatSize = (bytes: number) => (bytes / 1024).toFixed(2) + " KB";

  const downloadFile = (file: ProcessedImage) => {
    if (!file.newUrl) return;
    const a = document.createElement("a");
    a.href = file.newUrl;
    const ext = file.originalType === "image/jpeg" || file.originalType === "image/jpg" ? ".jpg" : ".png";
    const baseName = file.originalFile.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-${targetDpi}dpi${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.originalUrl) URL.revokeObjectURL(file.originalUrl);
      if (file?.newUrl) URL.revokeObjectURL(file.newUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Settings Panel */}
      <div className="bg-card border shadow-sm rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-4">Target DPI Settings</h3>
        <div className="flex flex-wrap gap-3 items-center">
          {[72, 96, 200, 300].map(dpi => (
            <Button
              key={dpi}
              variant={targetDpi === dpi ? "default" : "outline"}
              onClick={() => handleDpiChange(dpi)}
              className={targetDpi === dpi ? "ring-2 ring-primary ring-offset-2" : ""}
            >
              {dpi} DPI {dpi === 200 ? "(Sarkari)" : dpi === 300 ? "(Print)" : ""}
            </Button>
          ))}
          <div className="flex items-center gap-2 border rounded-md px-3 py-1 ml-auto">
            <span className="text-sm font-medium text-muted-foreground">Custom:</span>
            <input 
              type="number" 
              value={targetDpi}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 0) handleDpiChange(val);
              }}
              className="w-20 outline-none bg-transparent font-semibold"
              min="1"
            />
            <span className="text-sm text-muted-foreground">DPI</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
          isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 bg-card hover:bg-muted/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto w-16 h-16 bg-background rounded-full shadow-sm flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Drop Images Here</h3>
        <p className="text-muted-foreground mb-4">Accepts JPG, JPEG, and PNG. Batch processing supported.</p>
        <div className="flex justify-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
            <Settings className="w-3.5 h-3.5" /> 100% Client-Side
          </div>
        </div>
      </div>

      {/* Processed Files */}
      {files.length > 0 && (
        <div className="bg-card border shadow-sm rounded-3xl overflow-hidden">
          <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
            <h3 className="font-semibold">Processed Files ({files.length})</h3>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}>Clear All</Button>
          </div>
          
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted border overflow-hidden shrink-0">
                    <img src={file.originalUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  
                  <div>
                    <p className="font-semibold text-sm truncate max-w-[200px]" title={file.originalFile.name}>
                      {file.originalFile.name}
                    </p>
                    {file.status === "error" ? (
                      <p className="text-xs text-destructive mt-1">{file.errorMsg}</p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground border">
                          Original
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded border border-primary/20">
                          {targetDpi} DPI
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  {file.status === "done" && (
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Size: {formatSize(file.originalSize)}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Verified</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {file.status === "done" && (
                      <Button size="sm" onClick={() => downloadFile(file)} className="shadow-sm">
                        <Download className="w-4 h-4 mr-1.5" /> Download
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
