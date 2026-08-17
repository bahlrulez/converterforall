"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Download, 
  FileText, 
  Sparkles, 
  Loader2, 
  Quote, 
  BarChart3, 
  Layers, 
  Copy, 
  ChevronUp, 
  ChevronDown,
  Palette,
  Briefcase,
  TrendingUp,
  GraduationCap,
  Rocket
} from "lucide-react";
import pptxgen from "pptxgenjs";
import { cn } from "@/lib/utils";
import { getAbstractSlideGraphic } from "@/lib/presentation-graphics";

export type SlideLayout = "title" | "content" | "split" | "quote" | "metrics";

export interface SlideData {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content?: string;
  quoteAuthor?: string;
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
  metric3Label?: string;
  metric3Value?: string;
  image?: string;
}

export const THEMES = {
  modern: {
    name: "Modern Sapphire & Glass",
    bg: "FFFFFF",
    cardBg: "F1F5F9",
    color: "334155",
    titleColor: "0F172A",
    accent: "2563EB", // Sapphire
    accentLight: "DBEAFE",
    fontFace: "Arial",
    dotColor: "bg-blue-600",
  },
  cyber: {
    name: "Cyber Obsidian & Neon",
    bg: "090D16",
    cardBg: "131D31",
    color: "94A3B8",
    titleColor: "F8FAFC",
    accent: "06B6D4", // Cyan
    accentLight: "083344",
    fontFace: "Segoe UI",
    dotColor: "bg-cyan-400",
  },
  corporate: {
    name: "Executive Royal & Amber",
    bg: "0A192F",
    cardBg: "172A45",
    color: "8892B0",
    titleColor: "F8FAFC",
    accent: "F59E0B", // Amber Gold
    accentLight: "451A03",
    fontFace: "Helvetica",
    dotColor: "bg-amber-500",
  },
  luxury: {
    name: "Midnight Onyx & Gold",
    bg: "121212",
    cardBg: "1F1F1F",
    color: "D4AF37",
    titleColor: "FFFFFF",
    accent: "E5C158", // Gold
    accentLight: "382D08",
    fontFace: "Georgia",
    dotColor: "bg-yellow-500",
  },
  sunset: {
    name: "Sunset Coral & Violet",
    bg: "150D2A",
    cardBg: "241744",
    color: "E2E8F0",
    titleColor: "FFA07A",
    accent: "FF4B72", // Coral
    accentLight: "4C0519",
    fontFace: "Calibri",
    dotColor: "bg-rose-500",
  },
  forest: {
    name: "Emerald Eco & Mint",
    bg: "081C15",
    cardBg: "1B4332",
    color: "D8F3DC",
    titleColor: "FFFFFF",
    accent: "10B981", // Emerald
    accentLight: "064E3B",
    fontFace: "Trebuchet MS",
    dotColor: "bg-emerald-500",
  },
  academic: {
    name: "Academic Oxford & Crimson",
    bg: "FFFFFF",
    cardBg: "F8FAFC",
    color: "475569",
    titleColor: "1E3A8A",
    accent: "DC2626", // Crimson
    accentLight: "FEE2E2",
    fontFace: "Times New Roman",
    dotColor: "bg-red-600",
  },
  venture: {
    name: "Venture Pitch Electric",
    bg: "070F2B",
    cardBg: "1B1A55",
    color: "E0E1DD",
    titleColor: "FFFFFF",
    accent: "3A86FF", // Electric Blue
    accentLight: "1E1B4B",
    fontFace: "Segoe UI",
    dotColor: "bg-indigo-500",
  }
};

export type ThemeKey = keyof typeof THEMES;

const TEMPLATE_DECKS = [
  {
    id: "pitch-deck",
    name: "Investor Pitch Deck",
    icon: Rocket,
    desc: "Problem, Solution, Market Size, Model & Ask",
    theme: "venture" as ThemeKey,
    slides: [
      { id: "p1", layout: "title" as SlideLayout, title: "NextGen AI Platform", subtitle: "Transforming Everyday Workflows with On-Device Intelligence" },
      { id: "p2", layout: "content" as SlideLayout, title: "The Problem", content: "- Cloud software is expensive and forces recurring subscriptions\n- Data privacy leaks and security risks during cloud processing\n- Slow upload queues and frustrating wait times" },
      { id: "p3", layout: "split" as SlideLayout, title: "Our Breakthrough Solution", content: "- 100% In-Browser Client-Side Processing Engine\n- Zero Server Uploads = Total Privacy Guarantee\n- Blazing fast execution using WebGPU hardware acceleration", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
      { id: "p4", layout: "metrics" as SlideLayout, title: "Market Opportunity & Traction", metric1Label: "Total Addressable Market", metric1Value: "$48 Billion", metric2Label: "Active Monthly Users", metric2Value: "2.4 Million", metric3Label: "MoM Growth Rate", metric3Value: "34%" },
      { id: "p5", layout: "quote" as SlideLayout, title: "Industry Vision", content: "Privacy is not a premium luxury—it is the fundamental requirement for the next generation of web software.", quoteAuthor: "Founding Team" },
      { id: "p6", layout: "content" as SlideLayout, title: "The Investment Ask", content: "- Raising $1.5M Seed Round for core engine expansion\n- 18 Months Runway: 50% Engineering, 30% Growth, 20% Operations\n- Target Milestone: 10M Global Active Users" }
    ]
  },
  {
    id: "qbr",
    name: "Quarterly Business Review",
    icon: TrendingUp,
    desc: "Executive Summary, Milestones & Roadmap",
    theme: "corporate" as ThemeKey,
    slides: [
      { id: "q1", layout: "title" as SlideLayout, title: "Q3 Business Performance Review", subtitle: "Executive Summary, Key Accomplishments & Q4 Strategic Outlook" },
      { id: "q2", layout: "metrics" as SlideLayout, title: "Quarterly Key Metrics", metric1Label: "Net Revenue", metric1Value: "$1.85M", metric2Label: "Customer Satisfaction", metric2Value: "98.4%", metric3Label: "Gross Margin", metric3Value: "82%" },
      { id: "q3", layout: "split" as SlideLayout, title: "Core Accomplishments This Quarter", content: "- Shipped 15 new high-precision file converters\n- Reduced mobile latency by 65% with WebGPU optimization\n- Reached #1 organic ranking for high-intent conversion terms", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
      { id: "q4", layout: "content" as SlideLayout, title: "Challenges & Mitigations", content: "- Increased mobile memory constraints resolved with WebWorker isolation\n- Scaled CDN edge caching for instant global asset delivery\n- Expanded multi-language font conversion support" },
      { id: "q5", layout: "content" as SlideLayout, title: "Q4 Strategic Roadmap", content: "- Launch automated batch processing suite\n- Introduce team collaboration workspace\n- Expand enterprise security audit compliance" }
    ]
  },
  {
    id: "product-launch",
    name: "Product Launch Deck",
    icon: Sparkles,
    desc: "Value Prop, Target Persona & GTM",
    theme: "cyber" as ThemeKey,
    slides: [
      { id: "pl1", layout: "title" as SlideLayout, title: "Product Launch 2026", subtitle: "Introducing the Ultimate Universal Conversion Suite" },
      { id: "pl2", layout: "content" as SlideLayout, title: "Why We Built This Product", content: "- Users waste hours juggling multiple single-purpose websites\n- Existing tools lock basic features behind aggressive paywalls\n- We unified 150+ essential tools into one seamless interface" },
      { id: "pl3", layout: "split" as SlideLayout, title: "Core Features & Capabilities", content: "- AI Background Removal with sub-second precision\n- Instant PDF compression, merging, and OCR extraction\n- Regional Indic font converters for government exam preparation", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
      { id: "pl4", layout: "metrics" as SlideLayout, title: "Launch Targets & Adoption", metric1Label: "Day 1 Target Signups", metric1Value: "50,000+", metric2Label: "Conversion Speedup", metric2Value: "10x", metric3Label: "User Rating", metric3Value: "4.9 / 5" },
      { id: "pl5", layout: "quote" as SlideLayout, title: "User Testimonial", content: "ConverterForAll has completely eliminated the need for multiple subscriptions. It's fast, private, and unbelievably reliable.", quoteAuthor: "Lead Product Designer" }
    ]
  },
  {
    id: "academic",
    name: "Academic Research Defense",
    icon: GraduationCap,
    desc: "Abstract, Methodology, Data & Findings",
    theme: "academic" as ThemeKey,
    slides: [
      { id: "a1", layout: "title" as SlideLayout, title: "Thesis Defense Presentation", subtitle: "A Comparative Analysis of In-Browser WebAssembly vs Cloud Architectures" },
      { id: "a2", layout: "content" as SlideLayout, title: "Abstract & Research Problem", content: "- Modern cloud architectures introduce significant network latency and privacy exposure\n- WebAssembly (WASM) and WebGPU enable near-native hardware execution in the browser sandbox\n- This study measures throughput, power efficiency, and data integrity" },
      { id: "a3", layout: "split" as SlideLayout, title: "Methodology & Experimental Setup", content: "- Tested across 1,000 document transformations (PDF, Images, Video)\n- Benchmarked on 5 distinct hardware tiers (Desktop, Laptop, Mobile)\n- Measured CPU thermal throttling, memory footprint, and I/O latency", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" },
      { id: "a4", layout: "metrics" as SlideLayout, title: "Key Empirical Findings", metric1Label: "Latency Reduction", metric1Value: "-78%", metric2Label: "Data Transfer Zero", metric2Value: "0 MB", metric3Label: "Energy Savings", metric3Value: "42%" },
      { id: "a5", layout: "content" as SlideLayout, title: "Conclusions & Future Work", content: "- Client-side WebAssembly matches or exceeds cloud processing for files under 500MB\n- Zero-trust data privacy is achievable without performance penalties\n- Future research will explore multi-node peer-to-peer browser compute" }
    ]
  }
];

export function PresentationMaker() {
  const [slides, setSlides] = useState<SlideData[]>([
    { 
      id: "1", 
      layout: "title", 
      title: "Renewable Energy Research", 
      subtitle: "Current Advances, Challenges, and Future Horizons" 
    }
  ]);
  const [activeSlideId, setActiveSlideId] = useState<string>("1");
  const [theme, setTheme] = useState<ThemeKey>("venture");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSlideCount, setAiSlideCount] = useState(6);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
  const activeSlide = slides[activeSlideIndex] || slides[0];

  const addSlide = (layout: SlideLayout) => {
    const newSlide: SlideData = {
      id: Math.random().toString(36).substring(2, 9),
      layout,
      title: layout === "title" ? "New Title Slide" : layout === "quote" ? "Key Vision Quote" : layout === "metrics" ? "Key Milestones & KPIs" : layout === "content" ? "Key Takeaways" : "Visual Breakdown",
      subtitle: layout === "title" ? "Add subtitle here..." : "",
      content: layout === "quote" ? "Add an inspiring statement or customer quote here..." : layout === "content" ? "- Key point 1\n- Key point 2\n- Key point 3" : "- Feature overview 1\n- Performance metric 2",
      quoteAuthor: layout === "quote" ? "Author Name, Role" : "",
      metric1Label: "Metric 1",
      metric1Value: "99.9%",
      metric2Label: "Metric 2",
      metric2Value: "10x",
      metric3Label: "Metric 3",
      metric3Value: "$1.2M",
      image: layout === "split" ? "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80" : undefined
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const removeSlide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length <= 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setSlides(newSlides);
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const duplicateSlide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourceSlide = slides.find(s => s.id === id);
    if (!sourceSlide) return;
    const newSlide = { ...sourceSlide, id: Math.random().toString(36).substring(2, 9), title: `${sourceSlide.title} (Copy)` };
    const idx = slides.findIndex(s => s.id === id);
    const newSlides = [...slides];
    newSlides.splice(idx + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideId(newSlide.id);
  };

  const moveSlide = (idx: number, dir: -1 | 1, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(idx, 1);
    newSlides.splice(targetIdx, 0, moved);
    setSlides(newSlides);
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

  const applyTemplateDeck = (deck: typeof TEMPLATE_DECKS[0]) => {
    setSlides(deck.slides.map(s => ({ ...s, id: Math.random().toString(36).substring(2, 9) })));
    setTheme(deck.theme);
    setActiveSlideId(deck.slides[0].id);
  };

  const cleanContentText = (rawText?: string) => {
    if (!rawText) return "";
    return rawText
      .replace(/\\n/g, "\n")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .join("\n");
  };

  // Helper to convert any image or fallback to guaranteed Base64 Data URL
  const toPptxImage = async (src: string | undefined, title: string, accent: string, cardBg: string): Promise<string> => {
    if (src && src.startsWith("data:")) {
      return src;
    }
    if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
      try {
        const res = await fetch(src);
        if (res.ok) {
          const blob = await res.blob();
          return await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }
      } catch {
        // Network fallback
      }
    }
    return getAbstractSlideGraphic(title, `#${accent}`, `#${cardBg}`);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setIsAiGenerating(true);
      const response = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, slideCount: aiSlideCount }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate presentation");
      }
      
      if (Array.isArray(data.slides) && data.slides.length > 0) {
        const parsedSlides: SlideData[] = data.slides.map((s: any) => ({
          id: Math.random().toString(36).substring(2, 9),
          layout: s.layout || "content",
          title: s.title || "Slide Title",
          subtitle: s.subtitle || "",
          content: cleanContentText(s.content),
          quoteAuthor: s.quoteAuthor || "",
          metric1Value: s.metric1Value || "$1.2M",
          metric1Label: s.metric1Label || "Metric 1",
          metric2Value: s.metric2Value || "98.5%",
          metric2Label: s.metric2Label || "Metric 2",
          metric3Value: s.metric3Value || "10x",
          metric3Label: s.metric3Label || "Metric 3",
          image: s.image || (s.layout === "split" ? getAbstractSlideGraphic(s.title || aiPrompt, "#2563EB", "#1E293B") : undefined),
        }));
        
        setSlides(parsedSlides);
        setActiveSlideId(parsedSlides[0].id);
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      alert(error.message || "Failed to generate AI slides. Please try a different prompt.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Modern Abstract PPTX Exporter (Zero Text Overlaps, Geometric Accents, Perfect Alignment)
  const generatePresentation = async () => {
    try {
      setIsGenerating(true);
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";

      const currentTheme = THEMES[theme];

      for (const slideData of slides) {
        const slide = pres.addSlide();
        slide.background = { color: currentTheme.bg };

        // 1. TITLE SLIDE (Abstract geometric layout with non-overlapping typography)
        if (slideData.layout === "title") {
          // Left vertical geometric accent bar
          slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: 0.25, h: "100%",
            fill: { color: currentTheme.accent }
          });

          // Top abstract category pill badge
          slide.addShape(pres.ShapeType.roundRect, {
            x: "7%", y: "15%", w: 2.2, h: 0.35,
            fill: { color: currentTheme.cardBg },
            line: { color: currentTheme.accent, width: 1.0 }
          });
          slide.addText("KEYNOTE PRESENTATION", {
            x: "7%", y: "15%", w: 2.2, h: 0.35,
            fontSize: 10, color: currentTheme.accent,
            bold: true, align: "center", fontFace: currentTheme.fontFace,
            valign: "middle"
          });

          // Title Text (Top-aligned, safe height and line spacing)
          slide.addText(slideData.title, { 
            x: "7%", y: "24%", w: "86%", h: 2.0, 
            fontSize: 38, color: currentTheme.titleColor, 
            bold: true, align: "left", fontFace: currentTheme.fontFace,
            valign: "top", lineSpacing: 44
          });

          // Subtitle Text (Positioned safely below title with clear spacing)
          if (slideData.subtitle) {
            slide.addText(slideData.subtitle, { 
              x: "7%", y: "58%", w: "86%", h: 1.2, 
              fontSize: 18, color: currentTheme.accent, 
              align: "left", fontFace: currentTheme.fontFace, bold: true,
              valign: "top", lineSpacing: 24
            });
          }

          // Subtle bottom design divider
          slide.addShape(pres.ShapeType.rect, {
            x: "7%", y: "82%", w: "86%", h: 0.02,
            fill: { color: currentTheme.cardBg }
          });
        } 

        // 2. CONTENT SLIDE (Modern clean card background with high-impact bullets)
        else if (slideData.layout === "content") {
          // Slide Title
          slide.addText(slideData.title, { 
            x: "6%", y: "8%", w: "88%", h: 0.8, 
            fontSize: 28, color: currentTheme.titleColor, 
            bold: true, fontFace: currentTheme.fontFace, valign: "top"
          });

          // Underline accent bar
          slide.addShape(pres.ShapeType.rect, {
            x: "6%", y: "17%", w: 1.2, h: 0.04,
            fill: { color: currentTheme.accent }
          });

          // Content Card Container
          slide.addShape(pres.ShapeType.roundRect, {
            x: "6%", y: "22%", w: "88%", h: "68%",
            fill: { color: currentTheme.cardBg },
            line: { color: currentTheme.accent, width: 0.5, transparency: 80 }
          });
          
          if (slideData.content) {
            const lines = cleanContentText(slideData.content).split("\n").filter(Boolean);
            const bullets = lines.map(line => ({ 
              text: line.replace(/^-\s*/, ''), 
              options: { 
                bullet: { type: 'bullet' }, 
                color: currentTheme.color, 
                fontSize: 18, 
                fontFace: currentTheme.fontFace, 
                breakLine: true,
                paraSpaceBefore: 12
              } 
            }));
            
            slide.addText(bullets as any, { 
              x: "8%", y: "25%", w: "84%", h: "62%", 
              valign: "top" 
            });
          }
        }

        // 3. SPLIT SLIDE (Side-by-side text + auto-attached high-res image)
        else if (slideData.layout === "split") {
          slide.addText(slideData.title, { 
            x: "6%", y: "8%", w: "88%", h: 0.8, 
            fontSize: 28, color: currentTheme.titleColor, 
            bold: true, fontFace: currentTheme.fontFace, valign: "top"
          });

          slide.addShape(pres.ShapeType.rect, {
            x: "6%", y: "17%", w: 1.2, h: 0.04,
            fill: { color: currentTheme.accent }
          });

          // Left Text Card Container
          slide.addShape(pres.ShapeType.roundRect, {
            x: "6%", y: "22%", w: "43%", h: "68%",
            fill: { color: currentTheme.cardBg },
            line: { color: currentTheme.accent, width: 0.5, transparency: 80 }
          });

          if (slideData.content) {
            const lines = cleanContentText(slideData.content).split("\n").filter(Boolean);
            const bullets = lines.map(line => ({ 
              text: line.replace(/^-\s*/, ''), 
              options: { 
                bullet: { type: 'bullet' }, 
                color: currentTheme.color, 
                fontSize: 16, 
                fontFace: currentTheme.fontFace, 
                breakLine: true,
                paraSpaceBefore: 10
              } 
            }));
            
            slide.addText(bullets as any, { 
              x: "8%", y: "25%", w: "39%", h: "62%", 
              valign: "top" 
            });
          }

          // Right Image Container (Guaranteed Safe Base64)
          try {
            const safeImgData = await toPptxImage(
              slideData.image, 
              slideData.title, 
              currentTheme.accent, 
              currentTheme.cardBg
            );
            
            slide.addImage({ 
              data: safeImgData,
              x: "52%", y: "22%", w: "42%", h: "68%", 
              sizing: { type: "cover", w: "42%", h: "68%" } 
            });
          } catch (err) {
            console.warn("Failed to render slide image, continuing without image:", err);
          }
        }

        // 4. QUOTE SLIDE (Bold centered quote card with attribution)
        else if (slideData.layout === "quote") {
          // Central Glassmorphic Card
          slide.addShape(pres.ShapeType.roundRect, {
            x: "10%", y: "18%", w: "80%", h: "64%",
            fill: { color: currentTheme.cardBg },
            line: { color: currentTheme.accent, width: 1.5 }
          });

          slide.addText(`“${slideData.content || slideData.title}”`, { 
            x: "14%", y: "26%", w: "72%", h: "35%", 
            fontSize: 26, color: currentTheme.titleColor, 
            bold: true, italic: true, align: "center", fontFace: currentTheme.fontFace,
            valign: "middle", lineSpacing: 34
          });

          if (slideData.quoteAuthor) {
            slide.addText(`— ${slideData.quoteAuthor}`, { 
              x: "14%", y: "62%", w: "72%", h: "12%", 
              fontSize: 18, color: currentTheme.accent, 
              align: "center", fontFace: currentTheme.fontFace, bold: true 
            });
          }
        }

        // 5. METRICS SLIDE (3-Column KPI stat milestone cards)
        else if (slideData.layout === "metrics") {
          slide.addText(slideData.title, { 
            x: "6%", y: "8%", w: "88%", h: 0.8, 
            fontSize: 28, color: currentTheme.titleColor, 
            bold: true, fontFace: currentTheme.fontFace, valign: "top"
          });

          slide.addShape(pres.ShapeType.rect, {
            x: "6%", y: "17%", w: 1.2, h: 0.04,
            fill: { color: currentTheme.accent }
          });

          const metrics = [
            { val: slideData.metric1Value || "$1.2M", lbl: slideData.metric1Label || "Total Metric", x: "6%" },
            { val: slideData.metric2Value || "98.5%", lbl: slideData.metric2Label || "Satisfaction", x: "37%" },
            { val: slideData.metric3Value || "10x", lbl: slideData.metric3Label || "Efficiency", x: "68%" },
          ];

          metrics.forEach(m => {
            slide.addShape(pres.ShapeType.roundRect, {
              x: m.x as any, y: "24%", w: "26%", h: "62%",
              fill: { color: currentTheme.cardBg },
              line: { color: currentTheme.accent, width: 1.5 }
            });

            slide.addText(m.val, {
              x: m.x as any, y: "36%", w: "26%", h: "20%",
              fontSize: 34, color: currentTheme.accent,
              bold: true, align: "center", fontFace: currentTheme.fontFace
            });

            slide.addText(m.lbl, {
              x: m.x as any, y: "56%", w: "26%", h: "18%",
              fontSize: 15, color: currentTheme.color,
              align: "center", fontFace: currentTheme.fontFace, bold: true
            });
          });
        }
      }

      await pres.writeFile({ fileName: `Presentation_${new Date().getTime()}.pptx` });
    } catch (error) {
      console.error("Error generating presentation:", error);
      alert("Failed to export PPTX. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTheme = THEMES[theme];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      {/* 1. AI Magic Prompt Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border border-purple-500/20 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
          <Sparkles className="w-4 h-4" />
          <span>AI Presentation Generator (Auto-Images &amp; Abstract Designs)</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full relative">
            <input 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Create an 8-slide presentation on renewable energy breakthroughs..."
              className="w-full pl-4 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-[#0a1128] text-sm text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") generateWithAI();
              }}
              disabled={isAiGenerating}
            />
          </div>

          <select
            value={aiSlideCount}
            onChange={(e) => setAiSlideCount(Number(e.target.value))}
            disabled={isAiGenerating}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-[#0a1128] text-sm text-slate-900 dark:text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {[3, 5, 6, 8, 10, 12].map((num) => (
              <option key={num} value={num}>{num} Slides</option>
            ))}
          </select>

          <Button 
            onClick={generateWithAI} 
            disabled={isAiGenerating || !aiPrompt.trim()}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20"
          >
            {isAiGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Designing Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Generate with AI</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">Quick Ideas:</span>
          {["Renewable Energy Research", "Startup Investor Pitch", "Q3 Marketing Strategy", "AI Healthcare Innovations"].map((idea) => (
            <button
              key={idea}
              onClick={() => {
                setAiPrompt(`Create a professional presentation on ${idea}`);
              }}
              className="px-2.5 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Ready-Made Designer Deck Templates */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          <Palette className="w-4 h-4" />
          <span>1-Click Designer Template Decks</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Instantly load a complete, pre-formatted deck with abstract layouts, images, and copy.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATE_DECKS.map((deck) => {
            const Icon = deck.icon;
            return (
              <button
                key={deck.id}
                onClick={() => applyTemplateDeck(deck)}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 hover:shadow-md text-left transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {deck.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {deck.desc}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Load Deck →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Studio Workspace & 16:9 Canvas Editor */}
      <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[650px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0a1128]/95 p-4 sm:p-6 shadow-xl">
        
        {/* Left Sidebar: Slides Navigation & Thumbnails */}
        <div className="w-full lg:w-72 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-4 lg:pb-0 lg:pr-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Slides ({slides.length})</span>
            </h3>
            
            {/* Quick Add Layout Dropdown Buttons */}
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => addSlide("title")} title="Add Title Slide" className="h-7 w-7">
                <LayoutTemplate className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => addSlide("content")} title="Add Bullets Slide" className="h-7 w-7">
                <FileText className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => addSlide("split")} title="Add Split Image Slide" className="h-7 w-7">
                <ImageIcon className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => addSlide("metrics")} title="Add Metrics Slide" className="h-7 w-7">
                <BarChart3 className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => addSlide("quote")} title="Add Quote Slide" className="h-7 w-7">
                <Quote className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Slide List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 max-h-[550px]">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={cn(
                  "relative group p-3 rounded-2xl border-2 cursor-pointer transition-all text-left",
                  activeSlideId === slide.id 
                    ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm" 
                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080e22] hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Slide {idx + 1} • {slide.layout}
                  </span>
                  
                  {/* Reorder & Duplicate Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => moveSlide(idx, -1, e)} 
                      disabled={idx === 0} 
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => moveSlide(idx, 1, e)} 
                      disabled={idx === slides.length - 1} 
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => duplicateSlide(slide.id, e)} 
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      title="Duplicate Slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {slides.length > 1 && (
                      <button 
                        onClick={(e) => removeSlide(slide.id, e)} 
                        className="p-1 text-rose-400 hover:text-rose-600"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {slide.title || "Untitled Slide"}
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addSlide("content")}
            className="w-full rounded-xl border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add New Slide
          </Button>
        </div>

        {/* Right Editor & Widescreen 16:9 Canvas */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Theme Palette Bar & Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme:</span>
              {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all",
                    theme === t 
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm" 
                      : "bg-slate-50 dark:bg-[#080e22] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", THEMES[t].dotColor)} />
                  <span>{THEMES[t].name}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={generatePresentation} 
              disabled={isGenerating} 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm h-10 px-5 rounded-xl shadow-lg shadow-blue-500/20 w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting PPTX...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PPTX
                </>
              )}
            </Button>
          </div>

          {/* Slide Editor Fields */}
          <div className="grid grid-cols-1 gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/90 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {activeSlide?.layout} Slide Editor
              </span>
              <span className="text-xs text-slate-400">Slide {activeSlideIndex + 1} of {slides.length}</span>
            </div>

            {/* Slide Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Title</label>
              <input 
                value={activeSlide?.title || ""} 
                onChange={(e) => updateActiveSlide({ title: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="Enter slide title..."
              />
            </div>

            {/* Title Layout Subtitle */}
            {activeSlide?.layout === "title" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtitle</label>
                <input 
                  value={activeSlide?.subtitle || ""} 
                  onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
                  placeholder="Enter presentation subtitle..."
                  className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
            )}

            {/* Content / Bullets */}
            {(activeSlide?.layout === "content" || activeSlide?.layout === "split") && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Content (Bullet Points)</label>
                <textarea 
                  value={cleanContentText(activeSlide?.content)} 
                  onChange={(e) => updateActiveSlide({ content: e.target.value })}
                  placeholder="- Point 1&#10;- Point 2&#10;- Point 3"
                  rows={6}
                  className="flex min-h-[140px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Each new line is formatted as a high-impact bullet in PowerPoint.</p>
              </div>
            )}

            {/* Split Image Upload */}
            {activeSlide?.layout === "split" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Side Image / Thematic Diagram</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white dark:bg-[#0a1128] flex flex-col items-center justify-center relative min-h-[160px]">
                  {activeSlide?.image ? (
                    <div className="relative w-full h-44 flex items-center justify-center bg-slate-900/50 rounded-xl overflow-hidden">
                      <img 
                        src={activeSlide.image} 
                        alt="Slide Preview" 
                        onError={(e) => {
                          e.currentTarget.src = getAbstractSlideGraphic(activeSlide.title, "#2563EB", "#1E293B");
                        }}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-md" 
                      />
                      <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 text-xs shadow-md">
                        Change Image
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload slide image</p>
                      <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP, or SVG</p>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quote Layout */}
            {activeSlide?.layout === "quote" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quote Statement</label>
                  <textarea 
                    value={activeSlide?.content || ""} 
                    onChange={(e) => updateActiveSlide({ content: e.target.value })}
                    placeholder="Enter bold quote or key statement..."
                    rows={3}
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 italic"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Author / Source</label>
                  <input 
                    value={activeSlide?.quoteAuthor || ""} 
                    onChange={(e) => updateActiveSlide({ quoteAuthor: e.target.value })}
                    placeholder="e.g. Steve Jobs, CEO"
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Metrics Layout (3 KPI Cards) */}
            {activeSlide?.layout === "metrics" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] space-y-2">
                  <label className="text-[11px] font-bold text-blue-500">Metric 1</label>
                  <input 
                    value={activeSlide?.metric1Value || ""} 
                    onChange={(e) => updateActiveSlide({ metric1Value: e.target.value })}
                    placeholder="$1.5M"
                    className="flex h-9 w-full rounded-lg border px-2 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input 
                    value={activeSlide?.metric1Label || ""} 
                    onChange={(e) => updateActiveSlide({ metric1Label: e.target.value })}
                    placeholder="Net ARR"
                    className="flex h-8 w-full rounded-lg border px-2 text-[11px] text-slate-600 dark:text-slate-400"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] space-y-2">
                  <label className="text-[11px] font-bold text-amber-500">Metric 2</label>
                  <input 
                    value={activeSlide?.metric2Value || ""} 
                    onChange={(e) => updateActiveSlide({ metric2Value: e.target.value })}
                    placeholder="99.4%"
                    className="flex h-9 w-full rounded-lg border px-2 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input 
                    value={activeSlide?.metric2Label || ""} 
                    onChange={(e) => updateActiveSlide({ metric2Label: e.target.value })}
                    placeholder="Retention"
                    className="flex h-8 w-full rounded-lg border px-2 text-[11px] text-slate-600 dark:text-slate-400"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a1128] space-y-2">
                  <label className="text-[11px] font-bold text-emerald-500">Metric 3</label>
                  <input 
                    value={activeSlide?.metric3Value || ""} 
                    onChange={(e) => updateActiveSlide({ metric3Value: e.target.value })}
                    placeholder="10x"
                    className="flex h-9 w-full rounded-lg border px-2 text-xs font-extrabold text-slate-900 dark:text-white"
                  />
                  <input 
                    value={activeSlide?.metric3Label || ""} 
                    onChange={(e) => updateActiveSlide({ metric3Label: e.target.value })}
                    placeholder="Speedup"
                    className="flex h-8 w-full rounded-lg border px-2 text-[11px] text-slate-600 dark:text-slate-400"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
