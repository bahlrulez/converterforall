import { toolsDatabase } from "@/lib/tools-db";
import { ArrowLeft, ArrowRight, FileType, Layout, Image as ImageIcon, Settings, Combine, Scissors, Trash, FileOutput, Scan, Minimize, Wrench, FileText, Code2, KeyRound, Clock, Table, Database } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// A simple icon mapper based on the tool slug, relying on parent color class
const getIconForTool = (slug: string) => {
  switch (slug) {
    case "merge-pdf": return <Combine className="h-6 w-6" />;
    case "split-pdf": return <Scissors className="h-6 w-6" />;
    case "remove-pages": return <Trash className="h-6 w-6" />;
    case "extract-pages": return <FileOutput className="h-6 w-6" />;
    case "organize-pdf": return <Layout className="h-6 w-6" />;
    case "scan-to-pdf": return <Scan className="h-6 w-6" />;
    
    case "compress-pdf": return <Minimize className="h-6 w-6" />;
    case "repair-pdf": return <Wrench className="h-6 w-6" />;
    case "ocr-pdf": return <FileText className="h-6 w-6" />;
    case "edit-pdf": return <FileText className="h-6 w-6" />;
    
    case "jpg-to-pdf": return <ImageIcon className="h-6 w-6" />;
    case "word-to-pdf": return <FileText className="h-6 w-6" />;
    case "powerpoint-to-pdf": return <Layout className="h-6 w-6" />;
    case "excel-to-pdf": return <FileType className="h-6 w-6" />;
    case "html-to-pdf": return <FileType className="h-6 w-6" />;

    // Developer / Data & Code Tools
    case "jwt-decoder": return <KeyRound className="h-6 w-6" />;
    case "json-formatter": return <Code2 className="h-6 w-6" />;
    case "json-to-csv": return <Table className="h-6 w-6" />;
    case "csv-to-json": return <Database className="h-6 w-6" />;
    case "base64-encoder-decoder": return <Code2 className="h-6 w-6" />;
    case "unix-timestamp-converter": return <Clock className="h-6 w-6" />;
    case "uuid-generator": return <KeyRound className="h-6 w-6" />;
    
    default: return <Settings className="h-6 w-6" />;
  }
};

const getIconColorClass = (categorySlug: string) => {
  if (categorySlug === 'image') return 'bg-emerald-500/10 text-emerald-500';
  if (categorySlug === 'document') return 'bg-blue-500/10 text-blue-500';
  if (categorySlug === 'developer' || categorySlug === 'data-code') return 'bg-cyan-500/10 text-cyan-500';
  return 'bg-primary/10 text-primary';
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let categorySlug = resolvedParams.slug;

  if (categorySlug === "data-code" || categorySlug === "data-tools") {
    categorySlug = "developer";
  }

  const categoryData = (toolsDatabase as any)[categorySlug];
  
  if (!categoryData) {
    return { title: "Category Not Found" };
  }

  const displayTitle = categorySlug === "developer" ? "Data & Code Tools" : `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Tools`;
  const displaySubtitle = categorySlug === "developer"
    ? "Essential, privacy-first developer utilities processed 100% in your browser. Zero cloud transmission."
    : `Everything you need to manage and transform your ${categorySlug} files in one secure, powerful platform.`;

  return {
    title: `${displayTitle} - Free Online Utilities | ConverterForAll`,
    description: displaySubtitle,
    openGraph: {
      title: `${displayTitle} - Free Online Utilities`,
      description: displaySubtitle,
      type: "website",
      url: `https://converterforall.com/category/${resolvedParams.slug}`,
    },
    alternates: {
      canonical: `https://converterforall.com/category/${resolvedParams.slug}`,
    }
  };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  let categorySlug = params.slug;

  if (categorySlug === "data-code" || categorySlug === "data-tools") {
    categorySlug = "developer";
  }

  // Typecast to any to allow dynamic indexing
  const categoryData = (toolsDatabase as any)[categorySlug];

  if (!categoryData) {
    notFound();
  }

  // Group tools by subCategory
  const groupedTools: Record<string, Array<{slug: string, title: string, description: string}>> = {};
  
  Object.entries(categoryData).forEach(([slug, tool]: [string, any]) => {
    const groupName = tool.subCategory || "Other Tools";
    if (!groupedTools[groupName]) {
      groupedTools[groupName] = [];
    }
    groupedTools[groupName].push({
      slug,
      title: tool.title,
      description: tool.description,
    });
  });

  const groups = Object.keys(groupedTools);
  const iconColorClass = getIconColorClass(categorySlug);

  const displayTitle = categorySlug === "developer" ? "Data & Code Tools" : `${categorySlug} Tools`;
  const displaySubtitle = categorySlug === "developer"
    ? "Essential, privacy-first developer utilities processed 100% in your browser. Zero cloud transmission."
    : `Everything you need to manage and transform your ${categorySlug} files in one secure, powerful platform.`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden py-10 md:py-16 bg-gradient-to-b from-blue-50/50 to-slate-50 dark:from-[#080e22] dark:to-background border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center flex flex-col items-center">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors bg-white/80 dark:bg-[#0c1630]/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 capitalize text-slate-900 dark:text-white">
            {displayTitle}
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="container mx-auto px-4 max-w-5xl mt-12 md:mt-16">
        <div className="space-y-16">
          {groups.map((groupName) => (
            <div key={groupName}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">{groupName}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {groupedTools[groupName].map((tool) => (
                  <Link 
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group rounded-[20px] bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-slate-800/80 p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#0f1b3b] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 flex flex-col relative overflow-hidden hover:-translate-y-1"
                  >
                    {/* Subtle Gradient Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 dark:from-blue-500/10 via-transparent to-transparent pointer-events-none" />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className={`rounded-xl p-3 transition-colors ${iconColorClass}`}>
                        {getIconForTool(tool.slug)}
                      </div>
                      <h3 className="font-semibold text-[17px] text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {(() => {
                          let clean = tool.title.replace(/^Convert /i, "");
                          if (clean.includes(" – ")) clean = clean.split(" – ")[0];
                          else if (clean.includes(" - ")) clean = clean.split(" - ")[0];
                          else if (clean.includes(" — ")) clean = clean.split(" — ")[0];
                          clean = clean.replace(/^Free Online /i, "");
                          return clean.trim();
                        })()}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10 flex-grow">{tool.description}</p>
                    <div className="mt-auto flex items-center text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 relative z-10 transition-colors">
                      Open Tool <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
