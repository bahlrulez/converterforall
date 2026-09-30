"use client";

import { useState, useCallback } from "react";
import { FileUploader } from "@/components/upload/file-uploader";
import { SubtitleFile, SubtitleFormat, SubtitleValidation } from "@/lib/converters/subtitle/types";
import { parseSubtitle, compileSubtitle, detectSubtitleFormat, cleanupSubtitle, shiftTimestamps, validateSubtitle } from "@/lib/converters/subtitle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, FileText, CheckCircle2 } from "lucide-react";

type DetectionStatus = "idle" | "detecting" | "detected" | "failed";

export function SubtitleToolkit() {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>("idle");
  const [sourceFormat, setSourceFormat] = useState<SubtitleFormat | null>(null);
  const [targetFormat, setTargetFormat] = useState<SubtitleFormat | 'KEEP'>('KEEP');

  const [shiftMs, setShiftMs] = useState<number>(0);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [stripHtml, setStripHtml] = useState<boolean>(false);
  const [stripAss, setStripAss] = useState<boolean>(true); // True by default since ASS is lossy

  const [parsedFile, setParsedFile] = useState<SubtitleFile | null>(null);
  const [validation, setValidation] = useState<SubtitleValidation | null>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setDetectionStatus("idle");
      setParsedFile(null);
      setSourceFormat(null);
      setValidation(null);
      return;
    }

    setDetectionStatus("detecting");

    try {
      const text = await file.text();
      const detected = detectSubtitleFormat(text, file.name);

      if (detected) {
        setSourceFormat(detected);
        const parsed = parseSubtitle(text, detected);
        setParsedFile(parsed);
        setValidation(validateSubtitle(parsed));
        setDetectionStatus("detected");
      } else {
        setSourceFormat(null);
        setParsedFile(null);
        setValidation(null);
        setDetectionStatus("failed");
      }
    } catch (e) {
      console.error(e);
      setSourceFormat(null);
      setParsedFile(null);
      setValidation(null);
      setDetectionStatus("failed");
    }
  }, []);

  const processFile = async (file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob, filename: string }> => {
    if (onProgress) onProgress(10);

    const text = await file.text();
    // Use manually overridden source format if auto-detect failed (UI allowing override is below)
    const formatToParse = sourceFormat;

    if (!formatToParse) {
      throw new Error("Could not detect the subtitle format. Please select it manually.");
    }

    if (onProgress) onProgress(30);
    const parsed = parseSubtitle(text, formatToParse);

    if (onProgress) onProgress(50);
    // Cleanup
    let processed = cleanupSubtitle(parsed, removeEmpty, stripHtml, stripAss);

    // Shift
    if (shiftMs !== 0) {
      processed = shiftTimestamps(processed, shiftMs);
    }

    if (onProgress) onProgress(80);
    // Compile
    const finalFormat = targetFormat === 'KEEP' ? (formatToParse === 'ASS' ? 'SRT' : formatToParse) : targetFormat;
    const outputText = compileSubtitle(processed, finalFormat);

    if (onProgress) onProgress(100);

    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${originalName}.${finalFormat.toLowerCase()}`;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });

    return { blob, filename };
  };

  const optionsRenderer = (disabled: boolean) => {
    return (
      <div className="space-y-6 text-left">
        {parsedFile && validation && (
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2 font-medium text-primary">
              <FileText className="w-5 h-5" />
              <span>Detected Format: {sourceFormat}</span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <span>{parsedFile.cues.length} cues</span>
              {validation.isValid ? (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" /> No errors detected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="w-4 h-4" /> {validation.issues.length} warnings
                </span>
              )}
            </div>

            {sourceFormat === 'ASS' && (
              <div className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-xs mt-2 border border-yellow-200 dark:border-yellow-900/50">
                <strong>Notice:</strong> ASS/SSA styling and positioning are not preserved when converting to standard subtitle formats. Only dialogue text and timing are retained.
              </div>
            )}

            {/* Preview of first 3 cues */}
            <div className="mt-3 border rounded-lg bg-background overflow-hidden">
              <div className="bg-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                Preview (First 3 Cues)
              </div>
              <div className="divide-y max-h-48 overflow-y-auto">
                {parsedFile.cues.slice(0, 3).map((cue, i) => (
                  <div key={i} className="p-2 text-xs">
                    <div className="text-muted-foreground mb-1 font-mono">{cue.startMs}ms → {cue.endMs}ms</div>
                    <div className="whitespace-pre-wrap">{cue.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {detectionStatus === "failed" && (
          <div className="bg-destructive/5 text-destructive p-4 rounded-xl border border-destructive/20 flex items-start gap-3 text-sm">
             <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
             <div>
               <p className="font-semibold">Format detection failed</p>
               <p className="mt-1 opacity-90">We couldn't confidently detect the format of this file. Please select it manually below to proceed.</p>
               <div className="mt-3">
                 <label className="mb-2 block text-sm font-medium">Source Format</label>
                 <Select value={sourceFormat || ""} onValueChange={(v) => setSourceFormat(v as SubtitleFormat)} disabled={disabled}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SRT">SRT</SelectItem>
                      <SelectItem value="VTT">VTT</SelectItem>
                      <SelectItem value="SBV">SBV</SelectItem>
                      <SelectItem value="ASS">ASS</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-base font-medium">Target Format</label>
              <p className="text-sm text-muted-foreground mb-3 mt-1">Convert subtitle to a different format.</p>
              <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as SubtitleFormat | 'KEEP')} disabled={disabled || !sourceFormat}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KEEP">Keep Original (Cleanup Only)</SelectItem>
                  <SelectItem value="SRT">SRT (SubRip)</SelectItem>
                  <SelectItem value="VTT">WebVTT</SelectItem>
                  <SelectItem value="SBV">YouTube SBV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <label className="text-base font-medium">Shift Timing (ms)</label>
              <p className="text-sm text-muted-foreground mb-3 mt-1">Adjust sync globally. E.g., 500 delays by half a second. -500 makes it earlier.</p>
              <input
                type="number"
                value={shiftMs}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShiftMs(parseInt(e.target.value) || 0)}
                disabled={disabled}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <label className="text-base font-medium">Cleanup Options</label>
              <p className="text-sm text-muted-foreground mb-3 mt-1">Select optional cleanup operations.</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="removeEmpty" checked={removeEmpty} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemoveEmpty(e.target.checked)} disabled={disabled} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="removeEmpty" className="text-sm font-medium leading-none cursor-pointer">Remove empty and zero-duration cues</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="stripHtml" checked={stripHtml} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStripHtml(e.target.checked)} disabled={disabled} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="stripHtml" className="text-sm font-medium leading-none cursor-pointer">Remove HTML tags (e.g. &lt;b&gt;)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="stripAss" checked={stripAss} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStripAss(e.target.checked)} disabled={disabled} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="stripAss" className="text-sm font-medium leading-none cursor-pointer">Remove ASS override tags (e.g. &#123;\an8&#125;)</label>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  * Cue numbering is automatically corrected during processing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <FileUploader
        onProcessFile={processFile}
        onFileSelect={handleFileSelect}
        acceptedTypes={{
          "text/plain": [".srt", ".vtt", ".sbv", ".ass", ".ssa", ".txt"]
        }}
        configureBeforeUpload={true}
        optionsRenderer={optionsRenderer}
        privacyLevel="client-only"
        actionLabel="Process Subtitle"
      />
    </div>
  );
}
