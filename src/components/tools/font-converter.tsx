"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeftRight, Copy, ClipboardPaste, Trash2, Download, Printer, Share2, Undo2, Redo2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertHindi } from "@/lib/fonts/hindi-mappings";
import { convertPunjabi } from "@/lib/fonts/punjabi-mappings";

interface FontConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
  category?: 'hindi' | 'punjabi';
}

export function FontConverter({ defaultFrom = "unicode", defaultTo = "krutidev", category = 'hindi' }: FontConverterProps) {
  const [fromUnit, setFromUnit] = useState(defaultFrom);
  const [toUnit, setToUnit] = useState(defaultTo);
  
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");

  const [copied, setCopied] = useState(false);

  // Undo/Redo History
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipHistoryRecord = useRef(false);

  // Focus ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const convertText = useCallback((text: string, from: string, to: string) => {
    let result = text;
    if (from === 'unicode' && to !== 'unicode') {
      result = category === 'hindi' 
        ? convertHindi(text, to, 'fromUnicode')
        : convertPunjabi(text, to, 'fromUnicode');
    } else if (from !== 'unicode' && to === 'unicode') {
      result = category === 'hindi'
        ? convertHindi(text, from, 'toUnicode')
        : convertPunjabi(text, from, 'toUnicode');
    } else if (from !== 'unicode' && to !== 'unicode') {
      // Direct conversion (e.g. KrutiDev to Chanakya) - Go via Unicode
      const intermediateUnicode = category === 'hindi'
        ? convertHindi(text, from, 'toUnicode')
        : convertPunjabi(text, from, 'toUnicode');
      result = category === 'hindi'
        ? convertHindi(intermediateUnicode, to, 'fromUnicode')
        : convertPunjabi(intermediateUnicode, to, 'fromUnicode');
    }
    return result;
  }, [category]);

  const pushToHistory = useCallback((val: string) => {
    if (skipHistoryRecord.current) {
      skipHistoryRecord.current = false;
      return;
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(val);
      if (newHistory.length > 50) newHistory.shift(); // Keep last 50
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  useEffect(() => {
    // Initial history push
    pushToHistory("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFromChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFromValue(val);
    setToValue(convertText(val, fromUnit, toUnit));
    
    // Debounce history push slightly for better UX, but for simplicity we push directly on change
    // In a real robust implementation, you'd debounce this.
    pushToHistory(val);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    // Values swap too
    setFromValue(toValue);
    setToValue(fromValue);
    pushToHistory(toValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(toValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const newVal = fromValue + text;
      setFromValue(newVal);
      setToValue(convertText(newVal, fromUnit, toUnit));
      pushToHistory(newVal);
      textareaRef.current?.focus();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    setFromValue("");
    setToValue("");
    pushToHistory("");
    textareaRef.current?.focus();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevVal = history[newIndex];
      skipHistoryRecord.current = true;
      setFromValue(prevVal);
      setToValue(convertText(prevVal, fromUnit, toUnit));
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextVal = history[newIndex];
      skipHistoryRecord.current = true;
      setFromValue(nextVal);
      setToValue(convertText(nextVal, fromUnit, toUnit));
      setHistoryIndex(newIndex);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Converter</title>');
      printWindow.document.write('<style>body{font-family:sans-serif;padding:20px;white-space:pre-wrap;}</style>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(toValue);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Converted Text',
          text: toValue,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  // Stats
  const getWordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const getCharCount = (text: string) => text.length;

  // Derive title from unit (basic)
  const formatFontName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-muted/50 p-2 rounded-xl border border-border">
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" onClick={handlePaste}><ClipboardPaste className="w-4 h-4 mr-2" /> Paste</Button>
          <Button variant="ghost" size="sm" onClick={handleClear}><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          <div className="w-px h-6 bg-border mx-2 self-center hidden sm:block"></div>
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}><Undo2 className="w-4 h-4 mr-2" /> Undo</Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Redo2 className="w-4 h-4 mr-2" /> Redo</Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" onClick={() => downloadFile(toValue, 'converted.txt', 'text/plain')}><Download className="w-4 h-4 mr-2" /> TXT</Button>
          <Button variant="ghost" size="sm" onClick={() => downloadFile(toValue, 'converted.doc', 'application/msword')}><Download className="w-4 h-4 mr-2" /> DOC</Button>
          <Button variant="ghost" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          <Button variant="ghost" size="sm" onClick={handleShare}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
        </div>
      </div>

      <div className="bg-card border rounded-3xl p-4 sm:p-6 shadow-lg">
        
        <div className="flex flex-col lg:flex-row gap-4 relative">
          
          {/* FROM */}
          <div className="flex-1 w-full bg-muted/30 rounded-2xl p-4 border border-border/50 focus-within:border-primary/50 transition-colors flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-border/50">
               <div className="font-semibold text-lg text-foreground">{formatFontName(fromUnit)}</div>
               <div className="text-xs text-muted-foreground">Input</div>
            </div>
            <textarea 
              ref={textareaRef}
              value={fromValue}
              onChange={handleFromChange}
              className="w-full flex-1 bg-transparent text-lg resize-none outline-none text-foreground placeholder:text-muted-foreground/30"
              placeholder={`Type or paste ${formatFontName(fromUnit)} text here...`}
            />
            <div className="mt-2 text-xs text-muted-foreground flex justify-between">
              <span>{getCharCount(fromValue)} chars</span>
              <span>{getWordCount(fromValue)} words</span>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="z-10 lg:-mx-8 lg:my-auto my-0 mx-auto -my-8 p-2 bg-card rounded-full shadow-md border flex-shrink-0">
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={swapUnits}
            >
              <ArrowLeftRight className="h-6 w-6 lg:rotate-0 rotate-90" />
            </Button>
          </div>

          {/* TO */}
          <div className="flex-1 w-full bg-primary/5 rounded-2xl p-4 border border-primary/20 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-primary/10">
               <div className="font-semibold text-lg text-primary">{formatFontName(toUnit)}</div>
               <div className="text-xs text-primary/70">Output</div>
            </div>
            <textarea 
              value={toValue}
              readOnly
              className="w-full flex-1 bg-transparent text-lg resize-none outline-none text-primary"
              placeholder="Conversion will appear here..."
            />
            <div className="mt-2 text-xs text-primary/70 flex justify-between items-center">
              <div>
                <span className="mr-3">{getCharCount(toValue)} chars</span>
                <span>{getWordCount(toValue)} words</span>
              </div>
              <Button variant="secondary" size="sm" className="h-7 text-xs gap-1 bg-primary/10 hover:bg-primary/20 text-primary" onClick={handleCopy}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
