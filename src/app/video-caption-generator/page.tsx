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
  ArrowRight,
  Edit3,
  Video
} from "lucide-react";
import { CaptionStudio } from "@/components/tools/caption-studio/CaptionStudio";

export const metadata: Metadata = {
  title: "Free Video Caption Generator – AI Subtitles in Hindi, English & More",
  description: "Free AI video caption and subtitle generator. Upload a video, automatically generate Hindi, English and supported-language captions, edit the text, and export a captioned MP4 for Reels, TikTok, YouTube and Facebook.",
  openGraph: {
    title: "Free Video Caption Generator – AI Subtitles in Hindi, English & More | ConverterForAll",
    description: "Free AI video caption and subtitle generator. Upload a video, automatically generate Hindi, English and supported-language captions, edit the text, and export a captioned MP4 for Reels, TikTok, YouTube and Facebook.",
    type: "website",
    url: "https://www.converterforall.com/video-caption-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Video Caption Generator – AI Subtitles in Hindi, English & More | ConverterForAll",
    description: "Free AI video caption and subtitle generator. Upload a video, automatically generate Hindi, English and supported-language captions, edit the text, and export a captioned MP4 for Reels, TikTok, YouTube and Facebook.",
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
      "name": "Free Video Caption Generator",
      "item": "https://www.converterforall.com/video-caption-generator"
    }
  ]
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free AI Video Caption & Subtitle Generator",
  "operatingSystem": "All",
  "applicationCategory": "MultimediaApplication",
  "browserRequirements": "Requires JavaScript, HTML5, and a modern browser with WebGPU or WebAssembly support.",
  "description": "Upload your video for free, automatically generate timed captions and subtitles, edit the words, style them, and export a finished video for Instagram, TikTok, YouTube, Facebook and more.",
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

const qaList = [
  {
    question: "What is a free video caption generator?",
    answer: "A free video caption generator is a tool that analyzes the audio track of your video, transcribes spoken words into written text, and calculates synchronized timestamps for every phrase. Caption Studio runs directly in your browser, allowing you to edit the text, customize colors and fonts, and download an MP4 video with hardcoded captions without requiring paid subscriptions or accounts."
  },
  {
    question: "How can I add captions to a video for free?",
    answer: "Upload your video file (up to 60 seconds) into the studio area above. The speech recognition model generates timestamped subtitle segments automatically. Review the lines in the editor, tweak any words if needed, pick your preferred styling preset, and click 'Export MP4' to download your captioned video."
  },
  {
    question: "What is the difference between captions and subtitles?",
    answer: "Captions and subtitles are often used interchangeably in everyday searches. Technically, subtitles translate or transcribe spoken dialogue for viewers who understand the language or prefer reading along. Closed captions also include sound cues for deaf or hard-of-hearing viewers. Caption Studio generates visible, burned-in subtitles and captions that stay permanently on your exported video."
  },
  {
    question: "Can I generate Hindi subtitles automatically?",
    answer: "Yes. The current pipeline is tailored for Hindi speech recognition and Devanagari script output. It utilizes embedded Unicode fonts (such as Poppins, Noto Sans Devanagari, and Mukta) so that Hindi matras, conjuncts, and halant characters render cleanly without broken glyphs."
  },
  {
    question: "Can I generate English captions automatically?",
    answer: "Yes. The underlying Whisper speech model transcribes spoken English clearly, as well as code-mixed speech (Hinglish) commonly spoken in modern social videos. You can review and adjust any English or mixed-language words in the text editor before exporting."
  },
  {
    question: "Does the caption generator support other languages?",
    answer: "The underlying Whisper Large v3 Turbo engine is architected for multilingual speech recognition across multiple supported languages. Hindi and English are the primary verified languages in the current studio interface. For other spoken languages, review the transcribed text carefully in the editor to ensure proper wording before rendering."
  },
  {
    question: "Can I use this for Instagram Reels?",
    answer: "Yes. Caption Studio fully supports vertical 9:16 video clips. You can also turn on the 'Show Reels/TikTok Safe Zones' toggle on the preview screen to make sure your subtitles are positioned away from the right-hand action buttons and bottom account handles."
  },
  {
    question: "Can I use this for TikTok videos?",
    answer: "Yes. You can import your TikTok-ready clips, generate synchronized subtitle lines, and drag the text to a comfortable viewing height that remains visible without getting covered by TikTok's on-screen user interface."
  },
  {
    question: "Can I use this for YouTube Shorts?",
    answer: "Yes. Vertical shorts benefit heavily from animated, high-contrast captions because many users scroll with low or muted volume. You can pick presets like Reels Bold with active yellow highlights to keep viewers engaged."
  },
  {
    question: "Can I use this for Facebook videos?",
    answer: "Yes. The studio works with both widescreen 16:9 videos and vertical/square clips, making it suitable for Facebook video posts, feeds, and Facebook Reels."
  },
  {
    question: "Can I edit the captions if the AI gets a word wrong?",
    answer: "Yes, and this is an important feature. Automatic speech recognition can occasionally misinterpret proper nouns, slang, or fast speech. The sidebar allows you to click any line, edit the wording, split long lines into punchy segments, or merge short fragments."
  },
  {
    question: "Are the captions burned into the exported video?",
    answer: "Yes. When you export, the browser uses an internal canvas renderer to draw the styled captions directly onto each video frame. The resulting MP4 file contains 'burned-in' subtitles that display automatically on all devices without needing separate .srt subtitle files."
  },
  {
    question: "Do I need to upload my video to a server?",
    answer: "No. Caption processing is designed to run in your browser, so your video can be processed on your device instead of being uploaded to a remote video-rendering service. The video decoding and MP4 encoding run locally. The only network requests made are the initial one-time download of speech model files and web fonts from public CDNs."
  },
  {
    question: "Is the video caption generator really free?",
    answer: "Yes. The tool is free to use with no account sign-up, no monthly fees, and no watermark added to your exported videos."
  },
  {
    question: "How long can the uploaded video be?",
    answer: "Videos can be up to 60 seconds long. Because all audio decoding, neural speech inference, canvas rendering, and MP4 multiplexing run directly inside your browser tab, 60 seconds is the tested maximum duration to prevent browser tab memory limits from being exceeded."
  },
  {
    question: "Which video formats are supported?",
    answer: "You can load video files in MP4, WebM, and QuickTime MOV formats. The tool exports a standard, universally compatible H.264 MP4 video with synchronized AAC audio."
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
            <span>Free On-Device AI Caption &amp; Subtitle Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white leading-[1.15]">
            Free AI Video Caption &amp; Subtitle Generator
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Upload your video for free, automatically generate timed captions and subtitles, edit the words, style them, and export a finished video for Instagram, TikTok, YouTube, Facebook and more.
          </p>

          {/* Compact Verified Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Free to use</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI-powered captions</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>Hindi + English + more</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0a1128] border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>Browser-based processing</span>
            </span>
          </div>
        </div>

        {/* PRIMARY TOOL AREA: Kept Prominently Above the Fold */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[95%] max-w-5xl h-[85%] blur-[90px] opacity-25 dark:opacity-15 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 rounded-full" />
          </div>

          <div className="bg-white/90 dark:bg-[#080e22]/95 backdrop-blur-xl rounded-3xl p-4 sm:p-8 md:p-10 border border-slate-200/90 dark:border-slate-800 shadow-2xl relative z-10">
            <CaptionStudio />
          </div>
        </div>

        {/* Natural Search Intent Note: Caption vs Subtitle */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-[#0a1128]/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            &ldquo;Caption&rdquo; and &ldquo;subtitle&rdquo; are often used interchangeably when people search for tools like this. Caption Studio turns spoken audio into timed text and renders that text directly onto the exported video.
          </p>
        </div>

        {/* 1. FREE POSITIONING SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Free captions and subtitles for your videos
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Many online video tools advertise free subtitles only to lock your download behind an email sign-up, place a giant watermark across your footage, or demand a paid monthly plan once your video is ready.
              </p>
              <p>
                Caption Studio gives you a practical, free way to add captions to your videos:
              </p>
              <ul className="space-y-2.5 my-3 pl-2">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span><strong>Generate captions for free:</strong> Create subtitles without typing everything manually line by line.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span><strong>Edit the generated text before exporting:</strong> Fine-tune any misheard names, phrasing, or line breaks in the built-in editor.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span><strong>Export your captioned video:</strong> Download a clean, full-resolution MP4 with hardcoded captions and no watermarks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                  <span><strong>No account required:</strong> You do not need to register, log in, or provide payment details.</span>
                </li>
              </ul>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                To ensure dependable client-side performance across laptops and phones without crashing browser tab memory, videos are currently supported up to 60 seconds in standard MP4, WebM, or MOV formats.
              </p>
            </div>

            {/* Original Screenshots Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                  <Image 
                    src="/images/caption-studio/reels-caption-preview.jpg" 
                    alt="Free AI video caption generator showing Hindi captions in the editor for vertical 9:16 reels"
                    width={480}
                    height={270}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Free AI video caption generator showing Hindi captions in the editor
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                  <Image 
                    src="/images/caption-studio/highlight-caption-preview.jpg" 
                    alt="Video subtitle generator showing caption styling controls and karaoke-style active word highlighting"
                    width={480}
                    height={270}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Video subtitle generator showing caption styling controls
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SOCIAL PLATFORM INTENT SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Create captioned videos for Reels, TikTok, YouTube and Facebook
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              A large percentage of viewers watch social video feeds with audio muted while on the go. Adding hardcoded subtitles ensures your message gets across immediately. You can create a captioned MP4 ready to share on:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For Instagram Reels</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Vertical 9:16 format with high-contrast text positioned safely above profile tags and descriptions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For TikTok videos</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Fast-paced subtitle pacing with word highlighting that helps viewers keep up with spoken audio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For YouTube Shorts &amp; Videos</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Works for both 9:16 vertical shorts and traditional 16:9 widescreen videos, tutorials, and podcasts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">For Facebook videos</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Square 1:1, vertical, and landscape video formats suitable for Facebook feed posts and stories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. HINDI + ENGLISH + MULTILINGUAL SECTION */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 w-fit border border-blue-500/20">
              <Languages className="w-3.5 h-3.5" />
              <span>Language Support</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Hindi, English and more
            </h2>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Caption Studio is powered by the Whisper speech recognition architecture, giving you practical language flexibility for modern content:
              </p>

              <div className="space-y-3 my-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Hindi speech to Devanagari captions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Spoken Hindi is transcribed directly into Devanagari script. Embedded Google Devanagari fonts (such as Poppins, Noto Sans Devanagari, and Mukta) ensure complex conjuncts, vowels, and matras render correctly without broken character glitches.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    English speech transcription
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Transcribes spoken English and code-mixed conversational dialogue (Hinglish) with synchronized word-by-word timing for easy reading.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Additional supported languages
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The underlying Whisper Large v3 Turbo engine supports multiple languages across global speech datasets. Because automatic speech recognition can face challenges with heavy background noise or fast accents, you can always edit any words in the editor before final export.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. IMPORTANT USER BENEFIT: EDITING ADVANTAGE */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full mb-3 w-fit border border-purple-500/20">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Interactive Editing</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              AI gets a word wrong? Just edit it.
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Automatic speech transcription saves hours of tedious manual typing, but it is not magic. No AI tool gets every single word right 100% of the time. Background music, overlapping voices, strong accents, brand names, and regional slang can cause the model to misinterpret phrasing.
              </p>
              <p>
                That is why Caption Studio does not force you to accept raw AI output. The interactive editor sidebar lets you click any subtitle chunk to fix misheard words, add punctuation, split long sentences into punchy phrases, or merge short fragments together. You get the speed of automatic transcription combined with the accuracy of human review.
              </p>
            </div>
          </div>
        </section>

        {/* 5. HOW TO USE SECTION */}
        <section className="mb-16 bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              How to generate captions for a video
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A simple five-step workflow from raw clip to finished captioned video.
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
                Choose any MP4, WebM, or MOV video up to 60 seconds (or click &ldquo;Try with sample reel&rdquo;).
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-indigo-500/25">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Let AI transcribe speech
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The on-device speech engine analyzes the audio track and generates synchronized subtitle segments.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-sky-500/25">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Review and edit captions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click any line in the sidebar to correct names, adjust phrasing, or fine-tune start and end timestamps.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-purple-500/25">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Choose style &amp; position
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pick presets like Reels Bold or Minimal, customize colors, and drag subtitles to your preferred safe zone.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3 shadow-md shadow-emerald-500/25">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Export captioned MP4
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click Export MP4 to render hardcoded subtitles directly into your video and download the ready-to-share file.
              </p>
            </div>
          </div>
        </section>

        {/* 6. PRIVACY & LOCAL ARCHITECTURE */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mb-3 w-fit border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Browser-Based Privacy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Local video processing on your device
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Caption processing is designed to run in your browser, so your video can be processed on your device instead of being uploaded to a remote video-rendering service.
              </p>
              <p>
                The video and audio tracks are decoded directly inside your browser tab using WebCodecs and WebGPU. Subtitle frames are rendered on an internal canvas and re-encoded into H.264 MP4 locally using Mediabunny.
              </p>
              <p>
                The only external network requests occur during the initial one-time download of the AI speech model files and web fonts from public CDNs. Once downloaded, those weights remain cached in your browser storage for future captioning sessions.
              </p>
            </div>
          </div>
        </section>

        {/* 7. CONTEXTUAL INTERNAL LINKS: Related Video Tools */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0a1128]/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Related video tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Explore other helpful browser utilities to prepare, compress, or convert your media files:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link 
                href="/mp4-to-mp3" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Extract audio from an MP4</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Convert video soundtracks into clean MP3 audio files directly in your browser.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open MP4 to MP3 →</span>
              </Link>

              <Link 
                href="/video-compressor" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Compress a large video</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Reduce oversized video file sizes locally while keeping visual quality clear.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open Video Compressor →</span>
              </Link>

              <Link 
                href="/subtitle-converter" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Convert subtitle files</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Convert between SRT, VTT, and SBV subtitle formats without losing timing accuracy.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open Subtitle Converter →</span>
              </Link>

              <Link 
                href="/compress-mp4" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Compress MP4 files</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quickly shrink large MP4 clips to fit under social upload and email limits.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open MP4 Compressor →</span>
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
                    Convert modern Unicode Hindi script into legacy Krutidev font format.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">Open font converter →</span>
              </Link>

              <Link 
                href="/category/video" 
                className="group flex flex-col justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>Browse all video tools</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Explore our complete suite of browser-based video conversion utilities.
                  </p>
                </div>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">View all tools →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 8. EXPANDED Q&A SECTION: Questions about video captions and subtitles */}
        <section className="max-w-4xl mx-auto mb-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 border border-blue-500/20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Questions about video captions and subtitles
            </h2>
          </div>

          <div className="space-y-4">
            {qaList.map((item, index) => (
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
