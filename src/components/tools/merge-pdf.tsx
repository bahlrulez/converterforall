"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { FileDown, UploadCloud, X, FileText, ArrowRight, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingFile } from "@/lib/file-transfer";

interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  type: 'pdf' | 'image';
}

export default function MergePdfTool() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
          type: pending.type.includes('image') ? 'image' : 'pdf'
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
      type: file.type.includes('image') ? 'image' : 'pdf' as 'pdf' | 'image'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setSuccessUrl(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
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

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();

        if (item.type === 'pdf') {
          const pdfDoc = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        } else if (item.type === 'image') {
          let image;
          if (item.file.type === 'image/jpeg') {
            image = await mergedPdf.embedJpg(fileBuffer);
          } else if (item.file.type === 'image/png') {
            image = await mergedPdf.embedPng(fileBuffer);
          }

          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
          }
        }
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSuccessUrl(url);

    } catch (err: any) {
      setError(err.message || "An error occurred while merging files.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {!successUrl ? (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'}`}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <UploadCloud className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {isDragActive ? 'Drop files here' : 'Select PDF & Image files'}
            </h3>
            <p className="text-muted-foreground mb-6">
              Drag & drop files here, or click to browse. Max privacy—files are processed locally.
            </p>
            <div className="flex justify-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="bg-background px-3 py-1 rounded-full border shadow-sm">PDF</span>
              <span className="bg-background px-3 py-1 rounded-full border shadow-sm">JPG</span>
              <span className="bg-background px-3 py-1 rounded-full border shadow-sm">PNG</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm">
              <h4 className="font-semibold text-lg border-b pb-2">Selected Files ({files.length})</h4>
              <p className="text-xs text-muted-foreground mb-4">Drag items to rearrange the order in the final PDF.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files.map((item, index) => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    className="group relative bg-muted/50 rounded-lg p-2 border hover:border-primary/50 transition-colors cursor-move flex flex-col items-center gap-2"
                  >
                    <div className="absolute top-1 left-1 opacity-50 group-hover:opacity-100">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <button 
                      onClick={() => removeFile(item.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <div className="w-full aspect-[3/4] bg-background rounded border flex items-center justify-center overflow-hidden relative">
                      {item.type === 'image' ? (
                        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary/80">
                          <FileText className="w-10 h-10 mb-2" />
                          <span className="text-[10px] font-bold text-muted-foreground mt-1">PDF</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs truncate w-full text-center text-muted-foreground" title={item.file.name}>
                      {item.file.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleMerge} 
                  disabled={isProcessing || files.length === 0}
                  className="w-full sm:w-auto text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      Merge {files.length} Files
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border p-12 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <FileDown className="h-12 w-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Merge Complete!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your files have been successfully merged into a single PDF document.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={successUrl} 
              download="merged_document.pdf"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download Merged PDF
            </a>
            <Button variant="outline" size="lg" onClick={() => {
              setSuccessUrl(null);
              setFiles([]);
            }}>
              Merge More Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
