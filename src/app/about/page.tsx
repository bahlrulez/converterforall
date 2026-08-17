import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";
import { ShieldCheck, Zap, Sparkles, Cpu, Lock, Globe, Heart, CheckCircle2, ArrowRight, Layers, FileText, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ConverterForAll | Simple, Free & Privacy-First File Tools",
  description: "Why we started ConverterForAll: Making essential file conversion and editing tools accessible to everyone for free, with 100% on-device privacy.",
  alternates: {
    canonical: "https://converterforall.com/about",
  },
  openGraph: {
    title: "About ConverterForAll - Why We Started",
    description: "ConverterForAll started with a simple thought: why should basic digital work be so difficult and expensive? Learn our story and mission.",
    type: "website",
    url: "https://converterforall.com/about",
  }
};

export default function AboutPage() {
  const stats = [
    { label: "Essential File Tools", value: "150+", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Data Sent to Cloud", value: "0 Bytes", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "On-Device Processing", value: "100%", icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Free for Everyone", value: "Free", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const targetAudiences = [
    "A student who needs to convert a document.",
    "Someone completing government or online paperwork.",
    "A small business owner preparing files for a customer.",
    "A teacher working with PDFs and images.",
    "A professional who needs to quickly compress or convert a file.",
    "Or simply someone who wants to perform a small file-related task without paying for another subscription."
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About ConverterForAll",
    "url": "https://converterforall.com/about",
    "description": metadata.description,
    "mainEntity": {
      "@type": "Organization",
      "name": "ConverterForAll",
      "url": "https://converterforall.com",
      "logo": "https://converterforall.com/icon.png",
      "description": "Provider of 150+ free, client-side, privacy-focused file conversion and editing tools.",
      "foundingDate": "2026",
      "knowsAbout": ["File Conversion", "WebAssembly In-Browser Processing", "PDF Utilities", "Font Conversion", "Image Optimization"]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#060b19] transition-colors duration-300 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="relative pt-16 pb-20 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
              ConverterForAll
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            ConverterForAll started with a simple thought: <strong>why should basic digital work be so difficult and expensive?</strong>
          </p>

          {/* Key Metric Bento Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white dark:bg-[#0a1128]/90 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.color} mb-3 shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Narrative & Manifesto Sections */}
      <div className="container mx-auto px-4 py-20 max-w-4xl relative z-10 space-y-12">
        
        {/* Section 1: Why We Started ConverterForAll */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">
            <span>The Beginning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Why We Started ConverterForAll
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              ConverterForAll started with a simple thought: <strong>why should basic digital work be so difficult and expensive?</strong>
            </p>
            <p>
              Today, almost everything is connected to computers and the internet. Whether it is government work, documentation, office work, studies, applications, business, or providing a service, we often need to create, edit, compress, convert, or share files.
            </p>
            <p>
              But when we started looking for simple tools to do these everyday tasks, we found the same problem again and again.
            </p>
            <p>
              Many websites offer only a few free conversions. If you want to use the tools regularly or need unlimited access, you are often asked to buy a subscription. Some services also require you to upload your files to their servers before they can process them.
            </p>
            <p>
              We faced the same problem ourselves.
            </p>
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-[#080e22] border-l-4 border-blue-600 my-6">
              <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
                &ldquo;We thought, if so much of our daily life has moved online, why can&apos;t basic and necessary tools be available to everyone for free?&rdquo;
              </p>
            </div>
            <p>
              That simple question became the reason behind ConverterForAll.
            </p>
          </div>
        </div>

        {/* Section 2: Our Idea Was Simple */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4">
            <span>Our Approach</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Our Idea Was Simple
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              We wanted to create a place where people could find the file tools they need for their everyday work without worrying about expensive subscriptions.
            </p>
            <p>
              Instead of building a system that depends heavily on servers and cloud processing, we decided to take a different approach:
            </p>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#080e22] border border-slate-200 dark:border-slate-700/60 font-bold text-slate-900 dark:text-white">
              Process the files directly on the user&apos;s own device whenever possible.
            </div>
            <p>
              This means your computer or phone does the work instead of sending your files to a remote server.
            </p>
            <p>
              At first, this idea was mainly about reducing our own server and infrastructure costs so that we could keep the tools free for everyone.
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              But something even better came from this approach.
            </p>
          </div>
        </div>

        {/* Section 3: Your Files Stay With You & Privacy Comes First */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Cloud Uploads</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Your Files Stay With You
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              When files are processed locally, they don&apos;t need to be uploaded to the cloud for processing.
            </p>
            <p>
              That means your personal documents, images, PDFs, and other files can stay on your own device.
            </p>
            <p>
              For us, this is extremely important.
            </p>
            <p>
              Today, we see many services collecting large amounts of user data. We believe that <strong>privacy should never be treated as a luxury or an extra feature.</strong>
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Your files are your files.
            </p>
            <p>
              We don&apos;t think you should have to give up your privacy just to perform a simple task like converting a PDF, compressing an image, or extracting audio from a video.
            </p>

            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Privacy Comes First
              </h3>
              <p>
                We have built ConverterForAll with a strong focus on <strong>privacy, speed, and simplicity</strong>.
              </p>
              <p>
                We use complex engineering behind the scenes to make the tools work efficiently on your device, while keeping the experience as simple as possible for you.
              </p>
              <p>
                You don&apos;t need to understand how everything works.
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                Just select a tool, add your file, choose what you need, and let the application do the work.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Built for Everyday Needs */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>For Everyone</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Built for Everyday Needs
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            ConverterForAll is not meant to be a complicated professional platform. <strong>It is for everyone.</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {targetAudiences.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#080e22] border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            These small tasks are part of our everyday digital life, and we wanted to make them easier.
          </p>
        </div>

        {/* Section 5: Free for Everyone & A Small Effort With a Big Goal */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                Free for Everyone
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Our goal is simple: <strong>make useful digital tools accessible to everyone.</strong>
              </p>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mt-2">
                We know that running a website and developing new tools takes time and resources. But we are working to keep as many essential tools as possible free to use.
              </p>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mt-2">
                We started ConverterForAll with this idea, and we want to continue building it in the same way. More tools, more useful features, better performance, and simpler solutions are coming.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">
                A Small Effort With a Big Goal
              </h3>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                ConverterForAll is a small effort from our side to make everyday digital work a little easier.
              </p>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed mt-2">
                We believe technology should save your time, not create another problem. And basic tools that people need every day shouldn&apos;t always come with a subscription or a complicated process.
              </p>
              
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 my-5 text-center sm:text-left">
                <p className="text-lg font-extrabold text-white">
                  ConverterForAll is for everyone.
                </p>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">
                  We will continue working hard to bring more useful services and tools to people around the world—while keeping our focus on what matters most:
                </p>
                <p className="text-sm font-black text-amber-300 mt-2 tracking-wide">
                  Simple tools. Free access. Fast processing. And privacy first.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/#featured-tools"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-md transition-transform active:scale-95"
                >
                  <span>Start Converting Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial & Author Profile */}
        <div className="pt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">About the Author</h3>
          </div>
          <AuthorProfile />
        </div>

      </div>
    </div>
  );
}
