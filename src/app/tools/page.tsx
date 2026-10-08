import { toolsDatabase, Tool } from "@/lib/tools-db";
import { ArrowLeft, ArrowRight, FileType, Layout, Image as ImageIcon, Settings, Combine, Scissors, Trash, FileOutput, Scan, Minimize, Wrench, FileText, Code2, KeyRound, Clock, Table, Database, Images, FileImage, PictureInPicture, Wand2, Eraser, Camera, Presentation } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

function getIconComponent(iconName: string, className: string = "h-6 w-6") {
  switch(iconName) {
    case "Code2": return <Code2 className={className} />;
    case "Eraser": return <Eraser className={className} />;
    case "Camera": return <Camera className={className} />;
    case "FileStack": return <Combine className={className} />;
    case "Scissors": return <Scissors className={className} />;
    case "Zap": return <Layout className={className} />;
    case "Lock": return <KeyRound className={className} />;
    case "Unlock": return <KeyRound className={className} />;
    case "Image": return <ImageIcon className={className} />;
    case "FileText": return <FileText className={className} />;
    case "Presentation": return <Presentation className={className} />;
    case "FileSpreadsheet": return <FileType className={className} />;
    case "FileCode": return <Code2 className={className} />;
    case "Video": return <Layout className={className} />;
    case "Music": return <Layout className={className} />;
    case "Type": return <FileType className={className} />;
    case "Wrench": default: return <Wrench className={className} />;
  }
}

function getThemeStyles(theme?: string) {
  switch(theme) {
    case "cyan": return "from-cyan-500 to-blue-500 text-cyan-50 bg-cyan-500/10 ring-cyan-500/30";
    case "purple": return "from-purple-500 to-pink-500 text-purple-50 bg-purple-500/10 ring-purple-500/30";
    case "amber": return "from-amber-400 to-orange-500 text-amber-50 bg-amber-500/10 ring-amber-500/30";
    case "orange": return "from-orange-400 to-red-500 text-orange-50 bg-orange-500/10 ring-orange-500/30";
    case "pink": return "from-pink-400 to-rose-500 text-pink-50 bg-pink-500/10 ring-pink-500/30";
    case "teal": return "from-teal-400 to-emerald-500 text-teal-50 bg-teal-500/10 ring-teal-500/30";
    case "yellow": return "from-yellow-400 to-amber-500 text-yellow-50 bg-yellow-500/10 ring-yellow-500/30";
    case "blue": return "from-blue-500 to-indigo-500 text-blue-50 bg-blue-500/10 ring-blue-500/30";
    case "red": return "from-red-500 to-rose-500 text-red-50 bg-red-500/10 ring-red-500/30";
    case "emerald": return "from-emerald-400 to-teal-500 text-emerald-50 bg-emerald-500/10 ring-emerald-500/30";
    case "sky": return "from-sky-400 to-blue-500 text-sky-50 bg-sky-500/10 ring-sky-500/30";
    case "slate": default: return "from-slate-500 to-slate-600 text-slate-50 bg-slate-500/10 ring-slate-500/30";
  }
}

export const metadata: Metadata = {
  title: "All Tools - ConverterForAll",
  description: "Browse our complete directory of free online tools for PDFs, Images, Developers, Data, and more. 100% free, runs locally in your browser.",
  openGraph: {
    title: "All Tools - ConverterForAll",
    description: "Browse our complete directory of free online tools for PDFs, Images, Developers, Data, and more. 100% free, runs locally in your browser.",
    type: "website",
    url: "https://www.converterforall.com/tools",
  },
  alternates: {
    canonical: "https://www.converterforall.com/tools",
  }
};

export default function AllToolsPage() {
  const categories = Object.keys(toolsDatabase);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-b from-indigo-50/50 to-slate-50 dark:from-[#080e22] dark:to-background border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center flex flex-col items-center">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors bg-white/80 dark:bg-[#0c1630]/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 capitalize text-slate-900 dark:text-white">
            All Tools Directory
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our complete collection of fast, private, browser-based utilities.
          </p>
        </div>
      </div>

      {/* Tools Directory */}
      <div className="container mx-auto px-4 max-w-5xl mt-10 md:mt-12">
        <div className="space-y-16">
          {categories.map((categorySlug) => {
            const categoryData = toolsDatabase[categorySlug];
            const displayCategoryName = categorySlug === "developer" ? "Data & Code Tools" : categorySlug === "exam" ? "Exam & Document Tools" : `${categorySlug} Tools`;
            
            return (
              <div key={categorySlug}>
                <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-xl md:text-2xl font-bold capitalize text-slate-800 dark:text-slate-200">{displayCategoryName}</h2>
                  <Link href={`/category/${categorySlug}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    View all {categorySlug} &rarr;
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {Object.entries(categoryData).map(([slug, tool]) => {
                    const colorConfig = getThemeStyles(tool.theme);
                    const [gradientFrom, gradientTo, textCol, bgCol, ringCol] = colorConfig.split(' ');
                    
                    return (
                      <Link 
                        key={slug}
                        href={`/${slug}`}
                        className="group flex flex-col items-center text-center rounded-[24px] bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800/80 p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 relative overflow-hidden hover:-translate-y-1"
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradientFrom} ${gradientTo} pointer-events-none`} />
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] mb-4 flex items-center justify-center shadow-sm bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white ring-1 ring-white/20 dark:ring-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10`}>
                          {getIconComponent(tool.iconName || "Settings")}
                        </div>
                        <h3 className="font-bold text-[14px] md:text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight relative z-10 w-full line-clamp-2">
                          {(() => {
                            let clean = tool.title.replace(/^Convert /i, "");
                            if (clean.includes(" – ")) clean = clean.split(" – ")[0];
                            else if (clean.includes(" - ")) clean = clean.split(" - ")[0];
                            else if (clean.includes(" — ")) clean = clean.split(" — ")[0];
                            clean = clean.replace(/^Free Online /i, "");
                            return clean.trim();
                          })()}
                        </h3>
                        <p className="hidden md:block text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 relative z-10">
                          {tool.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
