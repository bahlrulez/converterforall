import { toolsDatabase } from "@/lib/tools-db";
import { ArrowLeft, ArrowRight, FileType, Layout, Image as ImageIcon, Settings, Combine, Scissors, Trash, FileOutput, Scan, Minimize, Wrench, FileText, Code2, KeyRound, Clock, Table, Database } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden py-16 md:py-24 bg-muted/30 border-b">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors bg-background/80 backdrop-blur-sm border px-4 py-2 rounded-full shadow-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 capitalize text-foreground">
            {displayTitle}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="container mx-auto px-4 max-w-5xl mt-16">
        <div className="space-y-20">
          {groups.map((groupName) => (
            <div key={groupName}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight uppercase tracking-wider text-muted-foreground">{groupName}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedTools[groupName].map((tool) => (
                  <Link 
                    key={tool.slug}
                    href={`/${tool.slug}`}
                    className="group rounded-2xl border bg-card p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 flex flex-col relative overflow-hidden"
                  >
                    {/* Subtle Gradient Hover Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className={`rounded-xl p-3 transition-colors ${iconColorClass}`}>
                        {getIconForTool(tool.slug)}
                      </div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors leading-snug">
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
                    <p className="text-sm text-muted-foreground mb-6 relative z-10 flex-grow">{tool.description}</p>
                    <div className="mt-auto flex items-center text-sm font-medium text-primary relative z-10">
                      Open Tool <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
