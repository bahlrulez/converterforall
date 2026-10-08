"use client";

import React, { useState, useCallback, useRef } from "react";
import { Copy, Download, UploadCloud, RefreshCw, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectFont, FontDetectionResult } from "@/lib/fonts/font-detector-logic";
import { convertHindi } from "@/lib/fonts/hindi-mappings";
import { convertPunjabi } from "@/lib/fonts/punjabi-mappings";

type OverrideType = "auto" | "krutidev" | "chanakya" | "shusha" | "devlys" | "asees" | "joy" | "anmollipi";

export function FontTextFixer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [override, setOverride] = useState<OverrideType>("auto");
  const [detection, setDetection] = useState<FontDetectionResult | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Debounce timeout ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const convertText = useCallback((text: string, fontToUse: string, language: string) => {
    if (!text.trim()) return "";
    
    // Default to Hindi if unknown
    const lang = language === "Punjabi" ? "punjabi" : "hindi";
    
    if (lang === "punjabi") {
      return convertPunjabi(text, fontToUse, "toUnicode");
    } else {
      // Map display names to internal identifiers if necessary
      let internalFont = fontToUse.toLowerCase();
      if (internalFont.includes("kruti")) internalFont = "krutidev";
      if (internalFont.includes("chanakya")) internalFont = "chanakya";
      if (internalFont.includes("shusha")) internalFont = "shusha";
      if (internalFont.includes("devlys")) internalFont = "devlys";
      if (internalFont.includes("asees")) internalFont = "asees";
      if (internalFont.includes("joy")) internalFont = "joy";
      if (internalFont.includes("anmol")) internalFont = "anmollipi";
      
      return convertHindi(text, internalFont, "toUnicode");
    }
  }, []);

  const processText = useCallback((text: string, currentOverride: OverrideType) => {
    if (!text.trim()) {
      setDetection(null);
      setOutputText("");
      return;
    }

    let detected: FontDetectionResult | null = null;
    
    if (currentOverride === "auto") {
      detected = detectFont(text);
      setDetection(detected);
    } else {
      setDetection(null); // Clear detection if manually overridden
    }

    const fontToUse = currentOverride === "auto" ? (detected?.font || "krutidev") : currentOverride;
    let language = "Hindi";
    
    // Infer language from manual override
    if (["asees", "joy", "anmollipi"].includes(fontToUse)) {
      language = "Punjabi";
    } else if (currentOverride === "auto" && detected) {
      language = detected.language || "Hindi";
    }

    // Only convert if it's not already unicode, or if we force it
    if (currentOverride === "auto" && detected?.isUnicode) {
      setOutputText(text); // Already unicode, no conversion needed
    } else if (fontToUse !== "Unknown") {
      setOutputText(convertText(text, fontToUse, language));
    } else {
      // Fallback if unknown
      setOutputText(text);
    }
  }, [convertText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      processText(val, override);
    }, 300); // 300ms debounce
  };

  const handleOverrideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as OverrideType;
    setOverride(val);
    processText(inputText, val);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      processText(text, override);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fixed-unicode-text-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Left Column: Input */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary" />
              Source Text (Garbled)
            </h3>
            {detection && override === "auto" && detection.font !== "Unknown" && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md flex items-center gap-1 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-3 h-3" />
                Detected: {detection.font} ({detection.score}%)
              </span>
            )}
            {detection && override === "auto" && detection.font === "Unknown" && inputText.trim().length > 0 && (
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-md flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-3 h-3" />
                Unknown Font
              </span>
            )}
          </div>
          
          <select 
            value={override} 
            onChange={handleOverrideChange}
            className="text-sm border border-input bg-background rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="auto">Auto-Detect (Recommended)</option>
            <optgroup label="Hindi Fonts">
              <option value="krutidev">Force Kruti Dev 010</option>
              <option value="chanakya">Force Walkman-Chanakya</option>
              <option value="shusha">Force Shusha</option>
              <option value="devlys">Force DevLys</option>
            </optgroup>
            <optgroup label="Punjabi Fonts">
              <option value="asees">Force Asees</option>
              <option value="joy">Force Joy</option>
              <option value="anmollipi">Force AnmolLipi</option>
            </optgroup>
          </select>
        </div>
        
        <div className="relative group flex-1 flex flex-col min-h-[300px]">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Paste your unreadable Hindi or Punjabi text here...&#10;&#10;Example: çÝæÌðÕ or dÃkrh"
            className="flex-1 w-full p-4 rounded-xl border border-border bg-card shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2 font-medium bg-background/80 px-2 py-1 rounded backdrop-blur-sm border">
              {inputText.length} chars
            </span>
            <Button size="sm" variant="secondary" onClick={handlePaste} className="shadow-sm">
              <FileText className="w-4 h-4 mr-2" />
              Paste
            </Button>
          </div>
        </div>
      </div>

      {/* Center Icon (Desktop only) */}
      <div className="hidden lg:flex flex-col items-center justify-center text-muted-foreground">
        <div className="p-3 bg-muted rounded-full">
          <RefreshCw className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Fixed Unicode Text
          </h3>
          
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <input 
              type="checkbox" 
              checked={isEditable}
              onChange={(e) => setIsEditable(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            Enable Editing
          </label>
        </div>

        <div className="relative group flex-1 flex flex-col min-h-[300px]">
          <textarea
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
            readOnly={!isEditable}
            placeholder="Converted readable text will appear here..."
            className={`flex-1 w-full p-4 rounded-xl border border-border bg-card shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg ${!isEditable ? 'bg-muted/30' : ''}`}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={!outputText} className="shadow-sm bg-background/80 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              .TXT
            </Button>
            <Button size="sm" onClick={handleCopy} disabled={!outputText} className="shadow-sm">
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
