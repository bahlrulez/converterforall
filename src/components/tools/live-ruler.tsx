"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function LiveRuler() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [ppi, setPpi] = useState<number>(96); // Default 96 PPI
  const rulerRef = useRef<HTMLDivElement>(null);
  
  // Calibration states
  const [calibrationMode, setCalibrationMode] = useState<"credit-card" | "manual" | "none">("none");
  const [calibrationScale, setCalibrationScale] = useState<number>(1);

  // A credit card is 85.60 mm (3.37 inches) wide
  const CREDIT_CARD_WIDTH_INCHES = 3.37;
  // Calculate expected pixels for a credit card at standard 96 PPI
  const standardCardPixels = CREDIT_CARD_WIDTH_INCHES * 96;

  // Measurement overlay
  const [measureBoxLength, setMeasureBoxLength] = useState<number>(200);

  // The visual ruler generation
  // 1 cm = 0.3937 inches
  // 1 inch = 96 pixels (assuming 96 ppi standard, adjusted by calibrationScale)
  const actualPpi = ppi * calibrationScale;
  const pixelsPerCm = actualPpi * 0.3937;
  const pixelsPerInch = actualPpi;

  // Let's render markings up to roughly 30 cm or 12 inches
  const cmMarks = Array.from({ length: 31 }, (_, i) => i);
  const inMarks = Array.from({ length: 13 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto relative print:m-0 print:p-0">
      
      {/* Controls (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card border rounded-2xl p-4 shadow-sm print:hidden">
        <div className="flex gap-2">
          <Button variant={unit === "cm" ? "default" : "outline"} onClick={() => setUnit("cm")}>Centimeters</Button>
          <Button variant={unit === "in" ? "default" : "outline"} onClick={() => setUnit("in")}>Inches</Button>
        </div>
        <div className="flex gap-2">
          <Button variant={orientation === "horizontal" ? "default" : "outline"} onClick={() => setOrientation("horizontal")}>Horizontal</Button>
          <Button variant={orientation === "vertical" ? "default" : "outline"} onClick={() => setOrientation("vertical")}>Vertical</Button>
        </div>
        <div className="flex gap-2">
          <Button variant={calibrationMode !== "none" ? "default" : "outline"} onClick={() => setCalibrationMode(calibrationMode === "none" ? "credit-card" : "none")}>
            <Maximize2 className="w-4 h-4 mr-2" /> Calibrate
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      {calibrationMode !== "none" && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm print:hidden flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Screen Calibration</h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
            Place a standard credit card on your screen and adjust the slider until the blue box perfectly matches its size.
          </p>
          
          <div className="flex items-center gap-4 w-full max-w-sm mb-8">
            <ZoomOut className="w-5 h-5 text-muted-foreground" />
            <Slider 
              value={[calibrationScale]} 
              onValueChange={(val) => setCalibrationScale(Array.isArray(val) ? val[0] : val)} 
              min={0.5} 
              max={2} 
              step={0.01} 
              className="flex-1"
            />
            <ZoomIn className="w-5 h-5 text-muted-foreground" />
          </div>

          <div 
            className="bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center backdrop-blur-sm"
            style={{ 
              width: `${standardCardPixels * calibrationScale}px`, 
              height: `${(standardCardPixels * 0.63) * calibrationScale}px` 
            }}
          >
            <span className="font-semibold text-blue-700 dark:text-blue-300">Credit Card Size</span>
          </div>

          <Button className="mt-8" onClick={() => setCalibrationMode("none")}>Done Calibrating</Button>
        </div>
      )}

      {/* Ruler Display */}
      <div 
        className={`bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg shadow-sm relative overflow-auto print:border-none print:shadow-none print:overflow-visible ${
          orientation === "horizontal" ? "w-full overflow-x-auto min-h-[150px]" : "h-[80vh] min-h-[500px] overflow-y-auto w-[150px] mx-auto"
        }`}
        ref={rulerRef}
      >
        <div 
          className="relative print:absolute print:top-0 print:left-0"
          style={{ 
            width: orientation === "horizontal" ? "max-content" : "100%", 
            height: orientation === "vertical" ? "max-content" : "100%" 
          }}
        >
          {unit === "cm" ? (
            <div className={`relative flex ${orientation === "vertical" ? "flex-col" : "flex-row"} pt-8 print:pt-0`}>
              {cmMarks.map((cm) => (
                <div 
                  key={cm} 
                  className={`relative ${orientation === "horizontal" ? "border-l-2" : "border-t-2"} border-slate-800 dark:border-slate-200`}
                  style={{ 
                    [orientation === "horizontal" ? "width" : "height"]: `${pixelsPerCm}px`,
                    [orientation === "horizontal" ? "height" : "width"]: cm % 5 === 0 ? "30px" : cm % 1 === 0 ? "20px" : "10px"
                  }}
                >
                  <span className={`absolute text-xs font-semibold ${orientation === "horizontal" ? "-top-6 -left-1" : "-left-6 -top-2"}`}>
                    {cm}
                  </span>
                  {/* Render mm marks inside the cm block */}
                  {cm < 30 && Array.from({ length: 9 }, (_, i) => i + 1).map(mm => (
                    <div 
                      key={mm} 
                      className={`absolute ${orientation === "horizontal" ? "border-l" : "border-t"} border-slate-500`}
                      style={{
                        [orientation === "horizontal" ? "left" : "top"]: `${(pixelsPerCm / 10) * mm}px`,
                        [orientation === "horizontal" ? "height" : "width"]: mm === 5 ? "15px" : "10px",
                        [orientation === "horizontal" ? "bottom" : "right"]: 0
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className={`relative flex ${orientation === "vertical" ? "flex-col" : "flex-row"} pt-8 print:pt-0`}>
              {inMarks.map((inch) => (
                <div 
                  key={inch} 
                  className={`relative ${orientation === "horizontal" ? "border-l-2" : "border-t-2"} border-slate-800 dark:border-slate-200`}
                  style={{ 
                    [orientation === "horizontal" ? "width" : "height"]: `${pixelsPerInch}px`,
                    [orientation === "horizontal" ? "height" : "width"]: "40px"
                  }}
                >
                  <span className={`absolute text-sm font-bold ${orientation === "horizontal" ? "-top-7 -left-1" : "-left-6 -top-2"}`}>
                    {inch}
                  </span>
                  {/* 1/16th marks */}
                  {inch < 12 && Array.from({ length: 15 }, (_, i) => i + 1).map(frac => (
                    <div 
                      key={frac} 
                      className={`absolute ${orientation === "horizontal" ? "border-l" : "border-t"} ${frac === 8 ? "border-slate-700 dark:border-slate-300" : "border-slate-500"}`}
                      style={{
                        [orientation === "horizontal" ? "left" : "top"]: `${(pixelsPerInch / 16) * frac}px`,
                        [orientation === "horizontal" ? "height" : "width"]: frac === 8 ? "25px" : (frac % 4 === 0 ? "18px" : (frac % 2 === 0 ? "12px" : "8px")),
                        [orientation === "horizontal" ? "bottom" : "right"]: 0
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Informational Tooltip */}
      <div className="text-center text-sm text-muted-foreground print:hidden">
        <p>Tip: Place your object directly on the screen to measure. Use the Calibration tool for perfect accuracy.</p>
      </div>

    </div>
  );
}
