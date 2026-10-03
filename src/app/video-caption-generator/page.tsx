import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  HelpCircle,
  FileVideo,
  Check,
  Languages,
  Sliders,
  Move,
  Film,
  ArrowRight
} from "lucide-react";
import { CaptionStudio } from "@/components/tools/caption-studio/CaptionStudio";

export const metadata: Metadata = {
  title: "AI Video Caption Generator – Add Captions to Videos Free",
  description: "Automatically turn spoken words into timed captions, edit the text, style it, and export a captioned MP4 directly from your browser.",
  openGraph: {
    title: "AI Video Caption Generator – Add Captions to Videos Free | ConverterForAll",
    description: "Automatically turn spoken words into timed captions, edit the text, style it, and export a captioned MP4 directly from your browser.",
    type: "website",
    url: "https://www.converterforall.com/video-caption-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Caption Generator – Add Captions to Videos Free | ConverterForAll",
    description: "Automatically turn spoken words into timed captions, edit the text, style it, and export a captioned MP4 directly from your browser.",
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
  "name": "Free AI Video Caption Generator",
  "operatingSystem": "All",
  "applicationCategory": "MultimediaApplication",
  "browserRequirements": "Requires JavaScript, HTML5, and a modern browser with WebGPU or WebAssembly support.",
  "description": "Automatically turn spoken words into timed captions, edit the text, style it, and export a captioned MP4 directly from your browser.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
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

const qaItems = [
  {
    question: "What is a video caption generator?",
    answer: "A video caption generator is a tool that analyzes the audio track of your video, converts spoken dialogue into written text, and calculates precise timestamps for when each phrase should appear and disappear on screen. Caption Studio takes this process a step further by letting you edit the text, choose font and color presets, and burn the resulting subtitles directly into an exported MP4 video."
  },
  {
    question: "How do I add captions to a video?",
    answer: "Choose any video file up to 60 seconds (or click 'Try with sample reel' above). The tool automatically transcribes the audio into timed subtitle blocks. You can then review the text, click any segment to adjust phrasing or timing, pick a styling preset like Reels Bold, and click 'Export MP4 Video' to save your captioned clip."
  },
  {
    question: "Can I add Hindi captions to a video?",
    answer: "Yes. The current verified workflow is tailored for Hindi speech recognition and Devanagari script output. It uses embedded Unicode fonts (including Poppins and Noto Sans Devanagari) so Hindi vowels and compound letters display with correct grammatical shaping."
  },
  {
    question: "Can I edit captions after they are generated?",
    answer: "Yes. Automatic speech recognition can occasionally misinterpret words, especially with background music, accents, or fast speech. The interactive editor sidebar lets you click any caption, edit the text, split long lines across multiple timestamps, or merge short fragments together before rendering."
  },
  {
    question: "Can I change the caption style?",
    answer: "Yes. You can switch between built-in styling presets—including high-energy Reels Bold with yellow active word highlights, clean minimal subtitles, karaoke-style color highlighters, and classic cinematic typography. You can also customize font size, colors, borders, and drag the text on the preview screen to position it safely within vertical safe zones."
  },
  {
    question: "Are the captions burned into the video?",
    answer: "Yes. When you click Export MP4, the browser uses an internal canvas renderer and WebCodecs pipeline to draw the styled captions directly onto each video frame. The resulting MP4 has permanent 'burned-in' subtitles that display automatically on any device, social platform, or media player without requiring viewers to turn on closed captions."
  },
  {
    question: "Does the video need to be uploaded to a server?",
    answer: "No. Caption Studio is designed for browser-based processing. Your video is processed locally in the browser rather than being sent to a remote video-rendering backend. Video decoding, speech recognition, and MP4 multiplexing happen on your device. The only network requests made are the initial one-time download of the AI model weights and web fonts from public CDNs."
  },
  {
    question: "Is the AI caption generator free?",
    answer: "Yes. There is no account registration, no subscription fee, no daily usage caps, and no watermark added to your finished video."
  },
  {
    question: "Does it work for Reels and Shorts?",
    answer: "Yes. The studio supports vertical 9:16 formats used for Instagram Reels, YouTube Shorts, and TikTok, as well as landscape 16:9 and square 1:1 videos. You can also turn on the 'Show Reels/TikTok Safe Zones' overlay in the preview to make sure your subtitles don't get covered by on-screen icons or captions."
  },
  {
    question: "Why can AI captions contain mistakes?",
    answer: "Speech recognition systems convert sound waves into text by predicting the most likely words based on acoustic patterns. Background noise, fast speech, overlapping voices, strong accents, uncommon names, and colloquial slang can lead to misheard words. Because of this, Caption Studio provides an easy-to-use editor so you can quickly review and correct any words before final export."
  }
];

export default function VideoCaptionGeneratorPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden py-10">
      {/* Top Ambient Atmosphere Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Structured Data: SoftwareApplication & BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />

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
            Free AI Video Caption Generator
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Automatically turn spoken words into timed captions, edit the text, style it, and export a captioned MP4 directly from your browser.
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

        {/* PRIMARY TOOL AREA: Remains Above the Fold */}
        <div className="relative mb-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[95%] max-w-5xl h-[85%] blur-[90px] opacity-25 dark:opacity-15 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 rounded-full" />
          </div>

          <div className="bg-white/90 dark:bg-[#080e22]/95 backdrop-blur-xl rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xl relative z-10">
            <CaptionStudio />
          </div>
        </div>

        {/* 1. FIRST SEO CONTENT SECTION: Add captions without typing every line */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Add captions to your video without typing every line
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Typing out subtitles line by line while constantly pausing playback and checking timestamps is one of the most tedious parts of video editing. If you create short clips for social media or explainers, spending twenty minutes syncing subtitles for a thirty-second clip is frustrating.
              </p>
              <p>
                This auto caption generator changes that workflow. When you load your video, the browser extracts the audio track and runs on-device speech recognition to produce synchronized caption segments automatically. Instead of starting from a blank page, you start with a fully populated timeline.
              </p>
              <p>
                From there, you can review the generated text in the sidebar, edit any phrasing that needs adjustment, select a visual style that matches your video, and export an MP4 with burned-in subtitles. Everything happens directly on your device, with no server wait times or third-party watermarks.
              </p>
            </div>

            {/* Original UI Screenshots Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                  <Image 
                    src="/images/caption-studio/reels-caption-preview.jpg" 
                    alt="9:16 vertical video preview showing burned-in Devanagari Hindi captions in Reels Bold style"
                    width={480}
                    height={270}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  9:16 vertical video preview with burned-in Devanagari Hindi captions
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                  <Image 
                    src="/images/caption-studio/highlight-caption-preview.jpg" 
                    alt="16:9 video frame showing active word highlighting for karaoke-style subtitle pacing"
                    width={480}
                    height={270}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Active word-by-word subtitle pacing with customizable highlight styles
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS: 5 Simple Steps */}
        <section className="mb-16 bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              How to add captions to a video
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A straightforward five-step process to generate, polish, and export captioned videos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-blue-500/25">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Upload your video
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Drop your MP4, WebM, or MOV video (up to 60 seconds) into the upload area or select it from your device.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-indigo-500/25">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Generate captions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The on-device speech engine analyzes the audio and generates timestamped subtitle lines automatically.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-sky-500/25">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Edit the text
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review lines in the editor. Fix proper nouns or slang, split long sentences, and adjust start/end timestamps.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-purple-500/25">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Style and position
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose a style preset like Reels Bold or Minimal, adjust font size, and drag subtitles to your preferred safe zone.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-emerald-500/25">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Export the MP4
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click Export MP4. Your browser renders burned-in captions and downloads your finished video with audio intact.
              </p>
            </div>
          </div>
        </section>

        {/* 3. HINDI VIDEO CAPTIONS SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 w-fit border border-blue-500/20">
              <Languages className="w-3.5 h-3.5" />
              <span>Hindi &amp; Devanagari Support</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Hindi video captions without manual typing
            </h2>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Creating Hindi subtitles manually is often harder than working in English. Typing Devanagari script on standard desktop keyboards requires specialized input tools, and many standard video editors do not handle Devanagari complex script rendering properly—resulting in broken conjuncts, misplaced matras, and disjointed halant characters.
              </p>
              <p>
                The verified workflow in Caption Studio recognizes spoken Hindi and transcribes it directly into properly formatted Devanagari Unicode text. It includes embedded Google Devanagari fonts (such as Poppins, Noto Sans Devanagari, and Mukta) so that conjuncts and vowels render accurately when burned into video frames.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Helpful Tip for Accurate Subtitles:</strong> Automatic speech recognition is a major time-saver, but it is not infallible. We recommend reviewing generated Hindi text specifically for proper names, uncommon terminology, colloquial slang, and sections with loud background music. You can quickly edit any word in the sidebar before exporting.
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRIVACY / LOCAL PROCESSING SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-3 w-fit border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Architecture &amp; Privacy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Built for browser-based privacy and local processing
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Caption Studio is designed for browser-based processing. Your video is processed locally in the browser rather than being sent to a remote video-rendering backend.
              </p>
              <p>
                Traditional online captioning tools require uploading your entire video file to their remote servers, which takes time on slower connections and raises privacy concerns for personal or unreleased media. Here, audio extraction, speech-to-text inference, canvas subtitle drawing, and MP4 re-encoding all happen inside your browser tab using WebGPU and WebAssembly.
              </p>
              <p>
                The only network requests made by this tool are the initial on-demand downloads of the AI speech model files and web font assets from public CDNs. Once downloaded, those model weights remain cached locally in your browser storage so subsequent captioning sessions begin immediately without re-downloading.
              </p>
            </div>
          </div>
        </section>

        {/* 5. REAL FEATURES SECTION */}
        <section className="mb-16 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Real features built into Caption Studio
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every feature listed below is fully implemented and ready to use in your browser today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Automatic Speech-to-Caption
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transcribes spoken dialogue directly from your audio track into structured subtitle blocks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Timed Caption Lines
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Each subtitle chunk carries precise start and end timestamps synchronized with video playback.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <FileVideo className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Editable Caption Text
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click any line to correct spelling, adjust phrasing, split long sentences, or merge fragments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Hindi &amp; Devanagari Rendering
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Embedded Unicode fonts preserve proper letter shaping, conjuncts, and vowel placement.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Caption Styling Presets
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select from Reels Bold, Minimal Clean, Highlighter, Cinematic, and Box Contrast presets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                <Move className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Interactive Positioning
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Drag subtitle text directly on the preview to position it above bottom buttons and platform overlays.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Browser-Based Processing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All video and audio decoding runs locally on your computer with WebGPU acceleration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Burned-In MP4 Export
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Produces a ready-to-share MP4 video with hardcoded subtitles and preserved audio quality.
              </p>
            </div>
          </div>
        </section>

        {/* 6. SOCIAL VIDEO USE CASES SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Useful for short-form social video formats
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Many social media users watch videos with the sound off or in noisy environments. Adding visible subtitles makes spoken content easier to follow across a variety of common formats:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instagram Reels &amp; Stories</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">9:16 vertical videos with clear, high-contrast captions placed in the middle safe area.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">YouTube Shorts &amp; TikTok</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fast-paced short-form clips where active word highlights help viewers keep up with speech.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Talking-Head Videos &amp; Explainers</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Educational clips where clear text reinforces complex points and terminology.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interviews &amp; Hindi Quote Videos</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Podcast excerpts, interview soundbites, and inspirational quote clips formatted in Devanagari.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CONTEXTUAL INTERNAL LINKS SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Related tools for video and audio workflows
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Explore other helpful browser utilities on ConverterForAll to prepare or convert your media files:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link 
                href="/mp4-to-mp3" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>MP4 to MP3</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Extract clean audio from your MP4 video clips before transcription.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open converter →</span>
              </Link>

              <Link 
                href="/video-compressor" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Video Compressor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reduce oversized video file sizes locally while keeping resolution crisp.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open compressor →</span>
              </Link>

              <Link 
                href="/subtitle-converter" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Subtitle Converter</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Convert between SRT, VTT, and SBV subtitle formats without losing timing.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open converter →</span>
              </Link>

              <Link 
                href="/compress-mp4" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Compress MP4</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quickly compress large MP4 files to fit within upload size limits.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open compressor →</span>
              </Link>

              <Link 
                href="/unicode-to-krutidev" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Unicode to Krutidev</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Convert modern Unicode Hindi text into legacy Krutidev font format.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open converter →</span>
              </Link>

              <Link 
                href="/category/video" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>All Video Tools</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Browse our full suite of free video format conversion and editing tools.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Browse catalog →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Q&A SECTION: Questions about video captions */}
        <section className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 border border-blue-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Questions about video captions
            </h2>
          </div>

          <div className="space-y-4">
            {qaItems.map((item, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 shrink-0">Q:</span>
                  <span>{item.question}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
