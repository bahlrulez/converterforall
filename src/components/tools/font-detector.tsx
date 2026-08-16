"use client";

import React, { useState } from "react";
import { ArrowRight, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectFont } from "@/lib/fonts/font-detector-logic";
import Link from "next/link";

export function FontDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ font: string; isUnicode: boolean; language?: string } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    if (val.trim() === "") {
      setResult(null);
    } else {
      setResult(detectFont(val));
    }
  };

  const getRecommendedConverterUrl = () => {
    if (!result || result.font === "Unknown") return null;
    
    if (result.isUnicode) {
      if (result.language === 'Punjabi') return '/unicode-to-anmollipi';
      return '/unicode-to-krutidev';
    }

    const fontName = result.font.toLowerCase();
    if (fontName.includes("kruti")) return '/krutidev-to-unicode';
    if (fontName.includes("anmol")) return '/anmollipi-to-unicode';
    if (fontName.includes("devlys")) return '/devlys-to-unicode';
    if (fontName.includes("chanakya")) return '/chanakya-to-unicode';
    if (fontName.includes("shusha")) return '/shusha-to-unicode';
    if (fontName.includes("aps")) return '/aps-to-unicode';
    if (fontName.includes("shree")) return '/shreelipi-to-unicode';
    if (fontName.includes("asees")) return '/asees-to-unicode';
    if (fontName.includes("joy")) return '/joy-to-unicode';
    if (fontName.includes("satluj")) return '/satluj-to-unicode';
    if (fontName.includes("gurbani")) return '/gurbani-akhar-to-unicode';
    if (fontName.includes("raavi")) return '/raavi-to-unicode';

    const fontSlug = result.font.toLowerCase().replace(/[^a-z0-9]+/g, '');
    return `/${fontSlug}-to-unicode`;
  };

  const handleConvertClick = () => {
    if (text.trim()) {
      try {
        sessionStorage.setItem("font_input_text", text);
      } catch {}
    }
  };

  const recommendedUrl = getRecommendedConverterUrl();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-lg">
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Paste your text below to detect the font
          </label>
          <textarea 
            value={text}
            onChange={handleTextChange}
            className="w-full bg-muted/50 rounded-2xl p-4 border border-border/50 focus:border-primary/50 transition-colors text-lg resize-none outline-none min-h-[150px]"
            placeholder="Paste Hindi or Punjabi text here..."
          />
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
          {!text ? (
            <div className="text-muted-foreground flex flex-col items-center gap-3">
              <Search className="w-8 h-8 opacity-50" />
              <p>Waiting for text input...</p>
            </div>
          ) : result?.font === "Unknown" ? (
            <div className="text-muted-foreground flex flex-col items-center gap-3">
              <Search className="w-8 h-8 opacity-50" />
              <h3 className="text-xl font-semibold">Unknown Font</h3>
              <p className="max-w-md text-sm">We couldn't confidently identify this font. It might be standard English, mixed text, or an unsupported legacy font.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium tracking-wide uppercase">
                {result?.language} Detected
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {result?.font} {result?.isUnicode ? "(Unicode)" : "(Legacy)"}
              </h3>
              
              {recommendedUrl && (
                <div className="mt-4 p-4 bg-background rounded-xl border w-full max-w-sm">
                  <p className="text-sm text-muted-foreground mb-3">Recommended Converter</p>
                  <Link href={recommendedUrl} onClick={handleConvertClick}>
                    <Button className="w-full gap-2 group">
                      Convert to {result?.isUnicode ? "Legacy" : "Unicode"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
