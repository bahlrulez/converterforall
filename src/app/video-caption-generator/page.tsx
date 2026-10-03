import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Smartphone, 
  Cpu, 
  Palette, 
  Download, 
  Clock, 
  Layers, 
  HelpCircle 
} from "lucide-react";
import { CaptionStudio } from "@/components/tools/caption-studio/CaptionStudio";

export const metadata: Metadata = {
  title: "AI Video Caption Generator - Add Subtitles to Video Free",
  description: "Automatically transcribe and burn Devanagari Hindi captions directly onto your videos. Runs entirely in your browser using on-device WebGPU AI with zero upload lag.",
  openGraph: {
    title: "AI Video Caption Generator - Add Subtitles to Video Free | ConverterForAll",
    description: "Automatically generate Devanagari Hindi captions and burn animated subtitles to your reels and shorts. Runs on-device with WebGPU.",
    type: "website",
    url: "https://www.converterforall.com/video-caption-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Caption Generator - Add Subtitles to Video Free | ConverterForAll",
    description: "Automatically generate Devanagari Hindi captions and burn animated subtitles to your reels and shorts.",
  },
  alternates: {
    canonical: "https://www.converterforall.com/video-caption-generator",
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.converterforall.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "AI Video Caption Generator",
      "item": "https://www.converterforall.com/video-caption-generator"
    }
  ]
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Video Caption Generator",
  "operatingSystem": "All",
  "applicationCategory": "MultimediaApplication",
  "browserRequirements": "Requires JavaScript, HTML5, and a modern browser with WebGPU or WebAssembly support.",
  "description": "Generate Devanagari Hindi captions and subtitles directly on your device. Burn styled captions onto 9:16 and 16:9 videos with in-browser WebGPU processing.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const faqs = [
  {
    question: "Do my video files get uploaded to your servers to generate captions?",
    answer: "No. The speech recognition model runs directly inside your browser using WebGPU. Your video file stays on your computer the entire time and is not sent to any cloud server."
  },
  {
    question: "Why does the speech recognition engine take a moment on the first visit?",
    answer: "On your first use, your browser downloads the Whisper speech recognition weights and compiles them into your graphics card (WebGPU) memory. After this one-time initial download, the model is cached locally in your browser storage so subsequent runs start much faster."
  },
  {
    question: "How do I make sure Devanagari Hindi text renders without broken characters?",
    answer: "Standard desktop editors frequently misrender Devanagari conjuncts (matras and halant characters) when burned into video frames. Our Caption Studio includes embedded Google Devanagari fonts (such as Poppins, Noto Sans Devanagari, and Rozha One) with native UTF-8 shaping so all Hindi vowels and compound letters display correctly."
  },
  {
    question: "Can I adjust caption timing or fix misspelled words before exporting?",
    answer: "Yes. Every caption segment has an interactive text editor and timestamp controls. You can edit any word, click on a caption to jump video playback to that exact moment, split long sentences into shorter phrases, or merge short fragments."
  },
  {
    question: "Why is there a 60-second limit on videos?",
    answer: "Because video decoding, audio speech recognition, canvas rendering, and MP4 re-encoding all happen directly in your browser tab, 60 seconds is the optimal duration to prevent browser tab memory exhaustion on phones and laptops. For social reels, TikToks, and YouTube Shorts, 15 to 60 seconds is the standard duration."
  },
  {
    question: "Are there watermarks or hidden export fees?",
    answer: "No. All videos export in full resolution with your chosen caption styling, with zero watermarks, no account registration, and no daily export limits."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const stylePresets = [
  {
    name: "Reels Bold",
    tagline: "High-energy reels",
    font: "Poppins Bold",
    previewText: "नमस्ते दोस्तों, आज हम देखेंगे",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    cardBg: "bg-slate-900 text-white",
    sampleRender: (
      <div className="text-center font-black tracking-wide text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="text-amber-400">नमस्ते दोस्तों</span>, आज हम देखेंगे
      </div>
    )
  },
  {
    name: "Minimal Clean",
    tagline: "Crisp & subtle",
    font: "Inter / Sans",
    previewText: "रोज़मर्रा की आसान बातचीत",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    cardBg: "bg-slate-950 text-white",
    sampleRender: (
      <div className="text-center font-medium text-base sm:text-lg text-slate-100 tracking-normal drop-shadow-md">
        रोज़मर्रा की आसान बातचीत
      </div>
    )
  },
  {
    name: "Highlighter",
    tagline: "Active karaoke box",
    font: "Mukta SemiBold",
    previewText: "सीखें कुछ नया हर दिन",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    cardBg: "bg-slate-900 text-white",
    sampleRender: (
      <div className="text-center font-bold text-base sm:text-lg">
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md shadow-sm">सीखें कुछ</span> नया हर दिन
      </div>
    )
  },
  {
    name: "Cinematic",
    tagline: "Wide-screen movies",
    font: "Noto Serif",
    previewText: "कहानी जो दिलों को छू ले",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    cardBg: "bg-black text-amber-100",
    sampleRender: (
      <div className="text-center font-serif text-base sm:text-lg text-amber-200/90 tracking-wider">
        कहानी जो दिलों को छू ले
      </div>
    )
  },
  {
    name: "Box Contrast",
    tagline: "Max readability",
    font: "Teko Bold",
    previewText: "स्पष्ट आवाज़, साफ़ शब्द",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    cardBg: "bg-slate-900 text-white",
    sampleRender: (
      <div className="text-center">
        <span className="bg-black/90 text-white font-extrabold px-3 py-1 rounded text-lg uppercase tracking-wider border border-white/20">
          स्पष्ट आवाज़, साफ़ शब्द
        </span>
      </div>
    )
  }
];

export default function VideoCaptionGeneratorPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden py-10">
      {/* Top Ambient Atmosphere Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Structured Data Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Navigation & Header Section */}
        <div className="mb-10 print:hidden flex flex-col items-center text-center max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-all bg-white dark:bg-[#0a1128]/80 px-4 py-2 rounded-full shadow-sm border border-slate-200/90 dark:border-slate-800"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            <span>Back to All 150+ Tools</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free On-Device AI Caption Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-[1.15]">
            AI Video Caption Generator
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Automatically transcribe spoken Hindi into accurate Devanagari subtitles and burn animated, reel-ready captions directly onto your video using in-browser AI.
          </p>

          {/* Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% In-Browser Privacy</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>WebGPU Hardware Accelerated</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>No Watermark &amp; No Account</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>9:16 Reels &amp; 16:9 Ready</span>
            </span>
          </div>
        </div>

        {/* Flagship Interactive Tool Container */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[95%] max-w-5xl h-[85%] blur-[90px] opacity-25 dark:opacity-15 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 rounded-full" />
          </div>

          <div className="bg-white/90 dark:bg-[#080e22]/95 backdrop-blur-xl rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xl relative z-10">
            <CaptionStudio />
          </div>
        </div>

        {/* Style Presets Visual Showcase */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Popular Caption Styles Built-In
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Pick from tested visual presets or customize fonts, colors, borders, and position to fit your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stylePresets.map((preset) => (
              <div 
                key={preset.name}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0a1128]/90 border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{preset.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${preset.badgeClass}`}>
                      {preset.tagline}
                    </span>
                  </div>

                  <div className={`${preset.cardBg} rounded-xl p-4 mb-4 flex items-center justify-center min-h-[90px] border border-white/10`}>
                    {preset.sampleRender}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Font: {preset.font}</span>
                  <span className="text-blue-500 font-medium">Included</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Pillar Feature Bento */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Engineered for Speed, Privacy, and Control
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Everything happens locally inside your browser tab without server queues or upload limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                On-Device Speech Recognition
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Powered by Transformers.js and WebGPU. Speech is transcribed directly inside your browser so your personal video files never leave your device.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Word-by-Word Timing &amp; Editor
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fine-tune every subtitle chunk. Click any phrase to seek video playback instantly, adjust start and end times, or auto-split long sentences for fast-paced reels.
              </p>
            </div>

            <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Hardware-Rendered MP4 Export
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Burns styled captions into frames with native font shaping and re-encodes synchronized MP4 video right in your browser tab with no watermarks.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step How It Works Guide */}
        <div className="mb-16 bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              How to Add Captions in 3 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              No account required. Just drop your clip, tweak your captions, and download.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-lg shadow-blue-500/25">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Select or Drop Video
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose any MP4, WebM, or MOV video up to 60 seconds. You can also click &ldquo;Try with sample reel&rdquo; to test features immediately.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-lg shadow-indigo-500/25">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Review &amp; Style Captions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Check Devanagari Hindi text accuracy, select a preset like Reels Bold, and drag subtitles to your preferred vertical safe zone.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-lg shadow-emerald-500/25">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Export Clean MP4 Video
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Click Export MP4. Your browser renders burned-in captions with synchronized audio and downloads the captioned file automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Real Authentic FAQs Section */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 border border-blue-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Questions About Video Captioning
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 shrink-0">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
