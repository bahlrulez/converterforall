"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { FileDown, UploadCloud, X, FileText, ArrowRight, Loader2, GripVertical, FileType, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingFile } from "@/lib/file-transfer";

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'pdf' | 'word' | 'image';
}

async function imageToPngBytes(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.drawImage(img, 0, 0);
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

function detectFileType(file: File): 'pdf' | 'word' | 'image' {
  const name = file.name.toLowerCase();
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

  useEffect(() => {
    async function checkPending() {
      const pending = await getPendingFile("merge-pdf");
      if (pending) {
        setFiles([{
          id: Math.random().toString(36).substring(7),
          file: pending,
          previewUrl: URL.createObjectURL(pending),
          type: detectFileType(pending)
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
      type: detectFileType(file)
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
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    }
  });

  const removeFile = (idToRemove: string) => {
    setFiles(prev => prev.filter(f => f.id !== idToRemove));
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

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setProcessingStatus(`Processing ${i + 1} of ${files.length}: ${item.file.name}...`);

        if (item.type === 'pdf') {
          const fileBuffer = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        } else if (item.type === 'word') {
          const { convertWordToPdf } = await import("@/lib/converters/word");
          const wordPdfBlob = await convertWordToPdf(item.file);
          const wordPdfBuffer = await wordPdfBlob.arrayBuffer();
          const wordPdfDoc = await PDFDocument.load(wordPdfBuffer);
          const copiedPages = await mergedPdf.copyPages(wordPdfDoc, wordPdfDoc.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        } else if (item.type === 'image') {
          let pngBytes: ArrayBuffer;
          if (item.file.type === 'image/jpeg' || item.file.name.toLowerCase().endsWith('.jpg') || item.file.name.toLowerCase().endsWith('.jpeg')) {
            const rawBytes = await item.file.arrayBuffer();
            try {
              const image = await mergedPdf.embedJpg(rawBytes);
              const page = mergedPdf.addPage([image.width, image.height]);
              page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
              continue;
            } catch {
              pngBytes = await imageToPngBytes(item.file);
            }
          } else if (item.file.type === 'image/png' || item.file.name.toLowerCase().endsWith('.png')) {
            const rawBytes = await item.file.arrayBuffer();
            try {
              const image = await mergedPdf.embedPng(rawBytes);
              const page = mergedPdf.addPage([image.width, image.height]);
              page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
              continue;
            } catch {
              pngBytes = await imageToPngBytes(item.file);
            }
          } else {
            pngBytes = await imageToPngBytes(item.file);
          }

          const image = await mergedPdf.embedPng(pngBytes);
          const page = mergedPdf.addPage([image.width, image.height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
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
              {isDragActive ? 'Drop files to combine' : 'Select PDF, Word (DOCX) & Image files'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Drag &amp; drop your documents here. 100% private and processed on-device.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
              <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full shadow-sm">PDF</span>
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full shadow-sm">DOCX / DOC</span>
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
            <div className="space-y-4 bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h4 className="font-extrabold text-lg text-foreground">Selected Documents ({files.length})</h4>
                  <p className="text-xs text-muted-foreground">Drag and reorder files into your preferred page sequence.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
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

                    <button 
                      onClick={() => removeFile(item.id)}
                      className="absolute top-2 right-2 z-10 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <div className="w-full aspect-[3/4] bg-background rounded-xl border border-border/60 flex items-center justify-center overflow-hidden relative shadow-inner">
                      {item.type === 'image' ? (
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                      ) : item.type === 'word' ? (
                        <div className="flex flex-col items-center justify-center text-blue-500 p-2 text-center">
                          <FileType className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">DOCX</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-red-500 p-2 text-center">
                          <FileText className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">PDF</span>
                        </div>
                      )}
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

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
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
                      <span>Merge {files.length} Files into PDF</span>
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
            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-foreground tracking-tight">Your PDF is Ready!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              All your PDFs, Word documents, and images have been successfully stitched into one unified PDF document.
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
