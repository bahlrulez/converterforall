"use client";

import React, { useState } from "react";
import { Copy, Trash2, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnicodeToolsProps {
  toolType: 'normalizer' | 'cleaner' | 'hidden-chars' | 'fix-copy-paste';
}

export function UnicodeTools({ toolType }: UnicodeToolsProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const getToolDetails = () => {
    switch (toolType) {
      case 'normalizer':
        return {
          title: "Unicode Normalizer",
          desc: "Normalizes Unicode text to its standard composed form (NFC).",
          actionLabel: "Normalize Text",
        };
      case 'cleaner':
        return {
          title: "Unicode Text Cleaner",
          desc: "Removes extra whitespace, zero-width spaces, and unwanted formatting.",
          actionLabel: "Clean Text",
        };
      case 'hidden-chars':
        return {
          title: "Remove Hidden Characters",
          desc: "Strips out invisible Unicode characters like ZWJ, ZWNJ, and BOM.",
          actionLabel: "Remove Hidden",
        };
      case 'fix-copy-paste':
        return {
          title: "Fix Copy/Paste Text",
          desc: "Fixes broken line breaks and garbled characters from bad PDF copies.",
          actionLabel: "Fix Text",
        };
    }
  };

  const processText = () => {
    let result = input;
    
    switch (toolType) {
      case 'normalizer':
        result = input.normalize('NFC');
        break;
      case 'cleaner':
        result = input.replace(/\s+/g, ' ').trim();
        result = result.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero width
        break;
      case 'hidden-chars':
        // Match various invisible chars
        result = input.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '');
        break;
      case 'fix-copy-paste':
        // Fix broken newlines often found when copying from PDF
        result = input.replace(/([^\n])\n([^\n])/g, '$1 $2');
        result = result.replace(/\n{3,}/g, '\n\n');
        break;
    }
    
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const details = getToolDetails();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-card border rounded-3xl p-6 sm:p-10 shadow-lg">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-semibold mb-1">{details.title}</h2>
            <p className="text-sm text-muted-foreground">{details.desc}</p>
          </div>
          <Button onClick={processText} className="gap-2 shrink-0">
            <Wand2 className="w-4 h-4" />
            {details.actionLabel}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium text-foreground">
              Input
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => { setInput(""); setOutput(""); }}>
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-muted/50 rounded-2xl p-4 border border-border/50 focus:border-primary/50 transition-colors text-base resize-none outline-none min-h-[300px]"
              placeholder="Paste your text here..."
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium text-primary">
              Output
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2 text-primary hover:text-primary hover:bg-primary/10" onClick={handleCopy}>
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <textarea 
              value={output}
              readOnly
              className="w-full bg-primary/5 rounded-2xl p-4 border border-primary/20 text-base resize-none outline-none min-h-[300px] text-primary"
              placeholder="Result will appear here..."
            />
          </div>

        </div>

      </div>
    </div>
  );
}
