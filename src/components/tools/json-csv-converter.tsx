"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Download, Copy, Check, Table, Upload, Lock, FileCode, FileSpreadsheet, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_JSON_ARRAY = `[
  { "id": 1, "name": "Sarah Connor", "role": "Engineer", "city": "Los Angeles", "active": true },
  { "id": 2, "name": "John Doe", "role": "Designer", "city": "New York", "active": false },
  { "id": 3, "name": "Alice Chen", "role": "Product Manager", "city": "San Francisco", "active": true }
]`;

const SAMPLE_CSV = `id,name,role,city,active
1,Sarah Connor,Engineer,Los Angeles,true
2,John Doe,Designer,New York,false
3,Alice Chen,Product Manager,San Francisco,true`;

export function JsonCsvConverter({ defaultDirection = "json-to-csv" }: { defaultDirection?: "json-to-csv" | "csv-to-json" }) {
  const [direction, setDirection] = useState<"json-to-csv" | "csv-to-json">(defaultDirection);
  const [inputText, setInputText] = useState<string>(defaultDirection === "json-to-csv" ? SAMPLE_JSON_ARRAY : SAMPLE_CSV);
  const [outputText, setOutputText] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<Array<Record<string, any>>>([]);
  const [delimiter, setDelimiter] = useState<string>(",");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Convert JSON to CSV
  const convertJsonToCsv = (jsonStr: string, delim: string = delimiter) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) {
        setOutputText("");
        setPreviewRows([]);
        return;
      }

      // Collect all unique headers
      const headers = Array.from(
        new Set(
          arr.flatMap((item) => (typeof item === "object" && item !== null ? Object.keys(item) : []))
        )
      );

      const rows: string[] = [];
      // Header line
      rows.push(headers.map((h) => (h.includes(delim) ? `"${h}"` : h)).join(delim));

      // Value lines
      arr.forEach((item) => {
        const row = headers.map((header) => {
          let val = item[header];
          if (val === undefined || val === null) return "";
          if (typeof val === "object") val = JSON.stringify(val);
          const str = String(val);
          return str.includes(delim) || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        });
        rows.push(row.join(delim));
      });

      const csvResult = rows.join("\n");
      setOutputText(csvResult);
      setPreviewRows(arr.slice(0, 10)); // preview first 10 rows
      setError(null);
    } catch (err: any) {
      setError(`Invalid JSON format: ${err.message}`);
      setOutputText("");
      setPreviewRows([]);
    }
  };

  // Convert CSV to JSON
  const convertCsvToJson = (csvStr: string, delim: string = delimiter) => {
    try {
      const lines = csvStr.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setOutputText("");
        setPreviewRows([]);
        return;
      }

      const splitCsvLine = (line: string) => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && line[i + 1] === '"') {
            current += '"';
            i++;
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === delim && !inQuotes) {
            result.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const headers = splitCsvLine(lines[0]);
      const jsonArray: Array<Record<string, any>> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = splitCsvLine(lines[i]);
        const obj: Record<string, any> = {};
        headers.forEach((h, idx) => {
          let val: any = values[idx] ?? "";
          // Auto cast numbers and booleans
          if (val === "true") val = true;
          else if (val === "false") val = false;
          else if (!isNaN(Number(val)) && val.trim() !== "") val = Number(val);
          obj[h] = val;
        });
        jsonArray.push(obj);
      }

      const jsonResult = JSON.stringify(jsonArray, null, 2);
      setOutputText(jsonResult);
      setPreviewRows(jsonArray.slice(0, 10));
      setError(null);
    } catch (err: any) {
      setError(`Failed to parse CSV: ${err.message}`);
      setOutputText("");
      setPreviewRows([]);
    }
  };

  const handleConvert = (text: string = inputText, dir: typeof direction = direction) => {
    if (!text.trim()) {
      setOutputText("");
      setPreviewRows([]);
      setError(null);
      return;
    }
    if (dir === "json-to-csv") {
      convertJsonToCsv(text);
    } else {
      convertCsvToJson(text);
    }
  };

  const toggleDirection = () => {
    const nextDir = direction === "json-to-csv" ? "csv-to-json" : "json-to-csv";
    setDirection(nextDir);
    // Swap input and output if valid
    if (outputText) {
      setInputText(outputText);
      handleConvert(outputText, nextDir);
    } else {
      const sample = nextDir === "json-to-csv" ? SAMPLE_JSON_ARRAY : SAMPLE_CSV;
      setInputText(sample);
      handleConvert(sample, nextDir);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      handleConvert(content, direction);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const isCsv = direction === "json-to-csv";
    const blob = new Blob([outputText], { type: isCsv ? "text/csv;charset=utf-8;" : "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = isCsv ? "converted_data.csv" : "converted_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    handleConvert(inputText, direction);
  }, [delimiter]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      
      {/* 🔒 100% Client-Side Privacy Header */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm">
        <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <span className="font-bold">100% In-Browser Execution:</span> Convert large JSON and CSV data entirely on your machine. Zero data uploaded to any server.
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#080e22] border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          
          {/* Direction Switcher Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleDirection}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 gap-2"
            >
              {direction === "json-to-csv" ? (
                <>
                  <FileCode className="w-4 h-4" />
                  <span>JSON to CSV</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>CSV to JSON</span>
                </>
              )}
              <ArrowLeftRight className="w-3.5 h-3.5 ml-1 opacity-80" />
            </Button>

            {/* Delimiter Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl text-xs">
              <span className="text-[11px] text-slate-500 font-semibold px-1">Delimiter:</span>
              <button
                onClick={() => setDelimiter(",")}
                className={cn("px-2 py-0.5 rounded-lg font-bold", delimiter === "," ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Comma (,)
              </button>
              <button
                onClick={() => setDelimiter(";")}
                className={cn("px-2 py-0.5 rounded-lg font-bold", delimiter === ";" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Semicolon (;)
              </button>
              <button
                onClick={() => setDelimiter("\t")}
                className={cn("px-2 py-0.5 rounded-lg font-bold", delimiter === "\t" ? "bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                Tab
              </button>
            </div>
          </div>

          {/* Right Action Options */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </div>
              <input
                type="file"
                accept={direction === "json-to-csv" ? ".json,application/json,text/plain" : ".csv,text/csv,text/plain"}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={!outputText}
              className="h-9 px-3 rounded-xl text-xs font-bold gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handleDownload}
              disabled={!outputText}
              className="h-9 px-3.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {direction === "json-to-csv" ? ".csv" : ".json"}</span>
            </Button>
          </div>

        </div>

        {/* Dual Input/Output Textareas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left / Input Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{direction === "json-to-csv" ? "Input JSON" : "Input CSV"}</span>
              <button
                onClick={() => setInputText("")}
                className="text-[11px] text-slate-400 hover:text-rose-500"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleConvert(e.target.value, direction);
              }}
              rows={12}
              placeholder={direction === "json-to-csv" ? "Paste JSON array here..." : "Paste CSV text here..."}
              className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
            />
          </div>

          {/* Right / Output Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{direction === "json-to-csv" ? "Output CSV" : "Output JSON"}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {outputText.length > 0 ? `${outputText.split("\n").length} lines` : ""}
              </span>
            </div>
            <textarea
              value={outputText}
              readOnly
              rows={12}
              placeholder="Converted result will appear here..."
              className="w-full p-3 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#040814] text-slate-800 dark:text-slate-200 focus:outline-none shadow-inner"
            />
          </div>

        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Data Preview Table */}
        {previewRows.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Table className="w-4 h-4 text-blue-500" />
              <span>Live Tabular Preview (First {previewRows.length} Rows)</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {Object.keys(previewRows[0] || {}).map((header) => (
                      <th key={header} className="p-2.5">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#080e22]">
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          {typeof val === "boolean" ? (val ? "true" : "false") : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
