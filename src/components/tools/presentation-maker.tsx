"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, LayoutTemplate, Download, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// No longer importing Input and Textarea from ui components

// We import PptxGenJS dynamically or typically just default import.
// Using default import because the tool is already client-side.
import pptxgen from "pptxgenjs";

type SlideLayout = "title" | "content" | "image";

interface SlideData {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string;
  image?: string; // base64 or URL
}

const THEMES = {
  modern: {
    name: "Modern Minimalist",
    bg: "FFFFFF",
    color: "555555",
    titleColor: "111111",
    accent: "3B82F6", // Blue
    fontFace: "Arial",
  },
  corporate: {
    name: "Corporate Blue",
    bg: "F4F7F6",
    color: "444444",
    titleColor: "1A365D",
    accent: "F97316", // Orange
    fontFace: "Helvetica",
  },
  dark: {
    name: "Dark Gradient",
    bg: "1F2937",
    color: "D1D5DB",
    titleColor: "FFFFFF",
    accent: "8B5CF6", // Purple
    fontFace: "Segoe UI",
  }
};

type ThemeKey = keyof typeof THEMES;

export function PresentationMaker() {
  const [slides, setSlides] = useState<SlideData[]>([
    { id: "1", layout: "title", title: "My Presentation", subtitle: "A stunning presentation generated directly in your browser." }
  ]);
  const [activeSlideId, setActiveSlideId] = useState<string>("1");
  const [theme, setTheme] = useState<ThemeKey>("modern");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex];

  const addSlide = (layout: SlideLayout) => {
    const newSlide: SlideData = {
      id: Math.random().toString(36).substr(2, 9),
      layout,
      title: layout === "title" ? "New Title Slide" : layout === "content" ? "New Content Slide" : "New Image Slide",
      subtitle: layout === "title" ? "Add subtitle here" : "",
      content: layout === "content" ? "Add your bullet points here\\n- Point 1\\n- Point 2" : "",
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const removeSlide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length === 1) return; // Prevent removing last slide
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const updateActiveSlide = (updates: Partial<SlideData>) => {
    setSlides(slides.map(s => s.id === activeSlideId ? { ...s, ...updates } : s));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateActiveSlide({ image: base64 });
    };
    reader.readAsDataURL(file);
  };

  const generatePresentation = async () => {
    try {
      setIsGenerating(true);
      const pres = new pptxgen();
      const selectedTheme = THEMES[theme];

      // Set Presentation Metadata
      pres.author = "ConverterForAll";
      pres.company = "ConverterForAll.com";
      pres.title = slides[0]?.title || "Presentation";
      pres.layout = "LAYOUT_16x9";

      // Define Masters
      pres.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: selectedTheme.bg },
        objects: [
          // Elegant Header Bar (Native Rectangle)
          { rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: selectedTheme.accent } } },
          // Footer Text
          { text: { text: "Generated instantly by ConverterForAll.com", options: { x: 0, y: 5.3, w: "100%", h: 0.3, align: "center", color: selectedTheme.color, fontSize: 10 } } }
        ],
        slideNumber: { x: "95%", y: "95%", color: selectedTheme.color, fontSize: 10 }
      });

      pres.defineSlideMaster({
        title: "TITLE_SLIDE",
        background: { color: selectedTheme.bg },
        objects: [
          // Bold Left Accent Block
          { rect: { x: 0, y: 0, w: "4%", h: "100%", fill: { color: selectedTheme.accent } } },
          // Modern Top Right Decorative Block
          { rect: { x: "85%", y: 0, w: "15%", h: "20%", fill: { color: selectedTheme.titleColor } } },
          // Modern Bottom Right Decorative Block
          { rect: { x: "92%", y: "80%", w: "8%", h: "20%", fill: { color: selectedTheme.accent } } },
          // Footer Text
          { text: { text: "Generated instantly by ConverterForAll.com", options: { x: 0, y: 5.3, w: "100%", h: 0.3, align: "center", color: selectedTheme.color, fontSize: 10 } } }
        ],
        slideNumber: { x: "95%", y: "95%", color: selectedTheme.color, fontSize: 10 }
      });

      // Build Slides
      slides.forEach((slideData) => {
        const isTitle = slideData.layout === "title";
        const slide = pres.addSlide({ masterName: isTitle ? "TITLE_SLIDE" : "MASTER_SLIDE" });

        if (isTitle) {
          slide.addText(slideData.title, { 
            x: "10%", y: "35%", w: "80%", h: 1.5, 
            fontSize: 54, color: selectedTheme.titleColor, 
            bold: true, align: "left", fontFace: selectedTheme.fontFace,
            shadow: { type: 'outer', color: "000000", opacity: 0.2, blur: 4, offset: 2 }
          });
          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, { 
              x: "10%", y: "50%", w: "80%", h: 1, 
              fontSize: 28, color: selectedTheme.accent, 
              align: "left", fontFace: selectedTheme.fontFace, bold: true 
            });
          }
        } 
        else if (slideData.layout === "content") {
          slide.addText(slideData.title, { 
            x: "5%", y: "5%", w: "90%", h: 1, 
            fontSize: 36, color: selectedTheme.titleColor, 
            bold: true, fontFace: selectedTheme.fontFace 
          });
          
          if (slideData.content) {
            const lines = slideData.content.split("\n").filter(Boolean);
            const bullets = lines.map(line => ({ 
              text: line.replace(/^- /, ''), 
              options: { bullet: true, color: selectedTheme.color, fontSize: 20, fontFace: selectedTheme.fontFace, margin: [10, 10, 10, 10] } 
            }));
            
            slide.addText(bullets as any, { 
              x: "5%", y: "20%", w: "90%", h: "70%", 
              valign: "top" 
            });
          }
        }
        else if (slideData.layout === "image") {
          slide.addText(slideData.title, { 
            x: "5%", y: "5%", w: "90%", h: 1, 
            fontSize: 36, color: selectedTheme.titleColor, 
            bold: true, fontFace: selectedTheme.fontFace 
          });

          if (slideData.image) {
            // Add image centered
            slide.addImage({ data: slideData.image, x: "10%", y: "20%", w: "80%", h: "70%", sizing: { type: "contain", w: "80%", h: "70%" } });
          } else {
            slide.addText("No Image Uploaded", { 
              x: "10%", y: "20%", w: "80%", h: "70%", 
              color: selectedTheme.color, align: "center", valign: "middle", 
              fill: { color: "E5E7EB" }, fontFace: selectedTheme.fontFace
            });
          }
        }
      });

      // Download
      await pres.writeFile({ fileName: `Presentation_${new Date().getTime()}.pptx` });
      
    } catch (error) {
      console.error("Error generating presentation:", error);
      alert("Failed to generate presentation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto min-h-[600px] rounded-2xl overflow-hidden border bg-background/50 backdrop-blur-sm shadow-xl p-4 mt-8">
      
      {/* Left Sidebar - Slides Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-4 border-r pr-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Slides</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => addSlide("title")} title="Add Title Slide">
              <LayoutTemplate className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => addSlide("content")} title="Add Content Slide">
              <FileText className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => addSlide("image")} title="Add Image Slide">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-1">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id}
              onClick={() => setActiveSlideId(slide.id)}
              className={`relative group p-3 rounded-lg border-2 cursor-pointer transition-all ${activeSlideId === slide.id ? 'border-primary bg-primary/5' : 'border-transparent bg-muted hover:bg-muted/80'}`}
            >
              <div className="text-xs font-bold text-muted-foreground mb-1">Slide {idx + 1}</div>
              <div className="text-sm font-medium truncate">{slide.title || "Untitled"}</div>
              {slides.length > 1 && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => removeSlide(slide.id, e)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Theme:</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${theme === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                >
                  {THEMES[t].name}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generatePresentation} disabled={isGenerating} size="lg" className="shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Download PPTX"}
          </Button>
        </div>

        {/* Slide Editor */}
        <div className="flex-1 bg-muted/30 rounded-xl border p-6 flex flex-col gap-6 max-w-2xl w-full mx-auto shadow-inner">
          <div className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary w-max">
            {activeSlide?.layout} Layout
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Slide Title</label>
            <input 
              value={activeSlide?.title || ""} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateActiveSlide({ title: e.target.value })}
              className="text-lg font-semibold flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter slide title..."
            />
          </div>

          {activeSlide?.layout === "title" && (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Subtitle</label>
              <input 
                value={activeSlide?.subtitle || ""} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateActiveSlide({ subtitle: e.target.value })}
                placeholder="Enter subtitle..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}

          {activeSlide?.layout === "content" && (
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Content (Bulleted List)</label>
              <textarea 
                value={activeSlide?.content || ""} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateActiveSlide({ content: e.target.value })}
                placeholder="Enter content here... Use new lines for bullets"
                className="flex-1 min-h-[200px] resize-none flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Each new line will be rendered as a bullet point.</p>
            </div>
          )}

          {activeSlide?.layout === "image" && (
            <div className="flex flex-col gap-4 flex-1">
              <label className="text-sm font-medium">Slide Image</label>
              <div className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden flex-1 min-h-[200px]">
                {activeSlide?.image ? (
                  <>
                    <img src={activeSlide.image} alt="Slide Preview" className="w-full h-full object-contain z-10 relative" />
                    <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 z-20 shadow-md">
                      Change Image
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </Button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="font-medium text-muted-foreground mb-2">Click or drag image here</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
