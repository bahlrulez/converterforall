"use client";

import React, { useState, useCallback } from "react";
import { UploadCloud, Download, ShieldCheck, Info, Eraser, FileText, Loader2, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from 'pdf-lib';

interface PdfMetadata {
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modDate: Date | undefined;
}

export default function PdfMetadataCleanerComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScrubbed, setIsScrubbed] = useState(false);
  const [scrubbedBytes, setScrubbedBytes] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractMetadata = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      
      setMetadata({
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor(),
        subject: pdfDoc.getSubject(),
        creator: pdfDoc.getCreator(),
        producer: pdfDoc.getProducer(),
        creationDate: pdfDoc.getCreationDate(),
        modDate: pdfDoc.getModificationDate()
      });
      setIsScrubbed(false);
      setScrubbedBytes(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF. It might be encrypted or corrupted.");
      setFile(null);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      extractMetadata(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
  });

  const handleScrub = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Anonymize all metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      
      // Set dates to Unix Epoch (1970-01-01) for anonymity
      const epoch = new Date('1970-01-01T00:00:00Z');
      pdfDoc.setCreationDate(epoch);
      pdfDoc.setModificationDate(epoch);

      const pdfBytes = await pdfDoc.save();
      
      setScrubbedBytes(pdfBytes);
      setIsScrubbed(true);
    } catch (err) {
      console.error(err);
      setError("Failed to scrub the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!scrubbedBytes || !file) return;
    
    const blob = new Blob([scrubbedBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || "document";
    link.download = `${originalName}-scrubbed.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setFile(null);
    setMetadata(null);
    setIsScrubbed(false);
    setScrubbedBytes(null);
    setError(null);
  };

  const hasMetadata = metadata && (
    metadata.title || metadata.author || metadata.subject || 
    metadata.creator || metadata.producer || metadata.creationDate
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {!file ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px]
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Select PDF to Scrub
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              We will scan your PDF for hidden EXIF data, author names, and tracking properties. Everything runs securely in your browser—no files are uploaded.
            </p>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
              Choose PDF
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{file.name}</h3>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Analysed Locally</p>
              </div>
            </div>
            <button onClick={resetAll} className="text-sm text-slate-500 hover:text-red-500 transition-colors">
              Clear & Start Over
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Before Metadata */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Found Metadata
                    {!isScrubbed && hasMetadata && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Privacy Risk</span>
                    )}
                  </h4>
                </div>
                
                <div className={`rounded-xl border p-4 space-y-3 transition-colors ${!isScrubbed && hasMetadata ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                  {metadata ? (
                    <>
                      <MetadataRow label="Author" value={metadata.author} isScrubbed={isScrubbed} />
                      <MetadataRow label="Title" value={metadata.title} isScrubbed={isScrubbed} />
                      <MetadataRow label="Creator (Software)" value={metadata.creator} isScrubbed={isScrubbed} />
                      <MetadataRow label="Producer (Engine)" value={metadata.producer} isScrubbed={isScrubbed} />
                      <MetadataRow label="Subject" value={metadata.subject} isScrubbed={isScrubbed} />
                      <MetadataRow label="Creation Date" value={metadata.creationDate?.toLocaleString()} isScrubbed={isScrubbed} isDate={true} />
                      
                      {!hasMetadata && (
                        <div className="text-center py-4 text-slate-500 flex flex-col items-center gap-2">
                          <ShieldCheck className="w-8 h-8 text-green-500" />
                          <p>Good news! No sensitive metadata was found.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col items-center justify-center space-y-6 pt-4 lg:pt-12">
                {!isScrubbed ? (
                  <>
                    <div className="text-center space-y-2">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Scrub?</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                        We will overwrite all existing metadata with blank fields and reset timestamps to anonymize the document.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleScrub}
                      disabled={isProcessing}
                      className="w-full max-w-xs py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Scrubbing...</>
                      ) : (
                        <><Eraser className="w-5 h-5" /> Scrub Metadata Now</>
                      )}
                    </button>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      100% Client-Side. No servers used.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-xl font-bold text-green-600 dark:text-green-400">PDF Scrubbed Successfully</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                        All author, tracking, and property metadata has been erased from the document.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleDownload}
                      className="w-full max-w-xs py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> Download Private PDF
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetadataRow({ label, value, isScrubbed, isDate = false }: { label: string, value: string | undefined, isScrubbed: boolean, isDate?: boolean }) {
  if (!value && !isScrubbed) return null;
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 gap-1">
      <span className="text-sm font-medium text-slate-500">{label}:</span>
      
      {!isScrubbed ? (
        <span className="text-sm font-mono text-slate-900 dark:text-white break-all bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{value}</span>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-400 line-through decoration-red-500/50 break-all">{value}</span>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-sm font-mono text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded font-bold">
            {isDate ? '1970-01-01' : '[REMOVED]'}
          </span>
        </div>
      )}
    </div>
  );
}
