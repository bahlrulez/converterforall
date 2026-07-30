import { toolsDatabase } from "@/lib/tools-db";
import { ArrowLeft, FileType, Layout, Image as ImageIcon, Settings, Combine, Scissors, Trash, FileOutput, Scan, Minimize, Wrench, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// A simple icon mapper based on the tool slug
const getIconForTool = (slug: string) => {
  switch (slug) {
    case "merge-pdf": return <Combine className="h-5 w-5 text-red-500" />;
    case "split-pdf": return <Scissors className="h-5 w-5 text-orange-500" />;
    case "remove-pages": return <Trash className="h-5 w-5 text-red-400" />;
    case "extract-pages": return <FileOutput className="h-5 w-5 text-orange-400" />;
    case "organize-pdf": return <Layout className="h-5 w-5 text-red-400" />;
    case "scan-to-pdf": return <Scan className="h-5 w-5 text-orange-600" />;
    
    case "compress-pdf": return <Minimize className="h-5 w-5 text-green-500" />;
    case "repair-pdf": return <Wrench className="h-5 w-5 text-green-600" />;
    case "ocr-pdf": return <FileText className="h-5 w-5 text-green-400" />;
    
    case "jpg-to-pdf": return <ImageIcon className="h-5 w-5 text-yellow-500" />;
    case "word-to-pdf": return <FileText className="h-5 w-5 text-blue-500" />;
    case "powerpoint-to-pdf": return <Layout className="h-5 w-5 text-orange-500" />;
    case "excel-to-pdf": return <FileType className="h-5 w-5 text-green-600" />;
    case "html-to-pdf": return <FileType className="h-5 w-5 text-yellow-600" />;
    
    default: return <Settings className="h-5 w-5 text-primary" />;
  }
};

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const categorySlug = params.slug;

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

  // Get the group names and render columns
  const groups = Object.keys(groupedTools);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 capitalize">
          {categorySlug} Tools
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to manage your {categorySlug} files in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {groups.map((groupName) => (
          <div key={groupName} className="flex flex-col">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              {groupName}
            </h3>
            <ul className="space-y-2">
              {groupedTools[groupName].map((tool) => (
                <li key={tool.slug}>
                  <Link 
                    href={`/tools/${categorySlug}/${tool.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {getIconForTool(tool.slug)}
                    </div>
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">
                      {tool.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
