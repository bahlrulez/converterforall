import { Shield, Zap, Infinity, Sparkles, CheckCircle2, XCircle, Lock, ArrowRight, Layers, ShieldCheck } from "lucide-react";

export function Features() {
  const comparisonItems = [
    {
      problem: "Uploads private files to unknown cloud servers",
      solution: "100% In-Browser: Files never leave your device",
    },
    {
      problem: "Slow upload progress bars & queue delays",
      solution: "Instant execution using your native CPU/GPU hardware",
    },
    {
      problem: "Restricted file sizes & aggressive paywalls",
      solution: "Unlimited conversions with no daily or size limits",
    },
    {
      problem: "Watermarks & compulsory account logins",
      solution: "Clean, watermark-free files with zero sign-ups needed",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure & Private",
      badge: "Zero Server Logs",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accentBorder: "group-hover:border-emerald-500/50",
      glowBg: "from-emerald-500/10 via-teal-500/5 to-transparent",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      description: "Unlike traditional converters that store files on remote servers, our WebAssembly engine operates entirely inside your browser. Your confidential PDFs, passport photos, and bank documents remain strictly private.",
    },
    {
      icon: Zap,
      title: "Instant Hardware Speed",
      badge: "0ms Upload Delay",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accentBorder: "group-hover:border-amber-500/50",
      glowBg: "from-amber-500/10 via-orange-500/5 to-transparent",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      description: "No waiting for uploads or server processing queues. By utilizing your device's native multi-core processors, file conversions execute instantly the moment you select your format.",
    },
    {
      icon: Infinity,
      title: "No File Size Restrictions",
      badge: "Unlimited Usage",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accentBorder: "group-hover:border-purple-500/50",
      glowBg: "from-purple-500/10 via-pink-500/5 to-transparent",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      description: "Stop hitting artificial paywalls when converting large videos or high-resolution photo batches. Because we don't burden external servers with storage, you get truly unrestricted free conversions.",
    },
    {
      icon: Layers,
      title: "150+ All-in-One Tools",
      badge: "Universal Suite",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accentBorder: "group-hover:border-blue-500/50",
      glowBg: "from-blue-500/10 via-indigo-500/5 to-transparent",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      description: "Merge PDFs, remove backgrounds with AI, compress high-res images, extract audio from videos, make passport photos, and convert legacy Indic fonts from one unified, privacy-first hub.",
    },
  ];

  return (
    <section 
      id="why-choose-us"
      className="py-24 relative bg-slate-50/50 dark:bg-[#060b19] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Problem vs Solution Narrative */}
          <div className="lg:w-5/12 lg:sticky lg:top-28 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Next-Gen Client-Side Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              The Problem With Traditional Converters <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
                &amp; How We Solved It
              </span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Most online file converters force you to upload sensitive documents, ID cards, and personal photographs to unknown third-party cloud servers. This exposes your data to privacy risks, slow speeds, and artificial paywalls.
            </p>

            {/* Quick Comparison Box */}
            <div className="rounded-2xl bg-white dark:bg-[#0a1128]/95 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Traditional Converters vs. ConverterForAll
              </h3>
              <div className="space-y-3">
                {comparisonItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-xs border-b border-slate-100 dark:border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2 text-red-500/90 dark:text-red-400 line-through opacity-75">
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{item.problem}</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pl-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{item.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#featured-tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-transform active:scale-95"
              >
                <span>Try In-Browser Conversion Free</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Bento Cards */}
          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative flex flex-col justify-between bg-white dark:bg-[#0a1128]/95 hover:bg-slate-50/80 dark:hover:bg-[#0f1a3d] p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 ${feature.accentBorder} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}
                >
                  {/* Subtle Background Glow */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${feature.glowBg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                  <div className="relative z-10">
                    {/* Card Header: Icon + Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconBg} ${feature.iconColor} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2.5 tracking-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Card Micro Indicator */}
                  <div className="relative z-10 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/70 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Free &amp; Client-Side Protected</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
