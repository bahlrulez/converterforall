import { FileUploader } from "@/components/upload/file-uploader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toolsDatabase } from "@/lib/tools-db";

export default async function ToolPage(props: { params: Promise<{ category: string, slug: string }> }) {
  const params = await props.params;
  const categoryStr = params.category as keyof typeof toolsDatabase;
  const category = toolsDatabase[categoryStr];
  
  if (!category) {
    notFound();
  }

  const toolStr = params.slug as keyof typeof category;
  const tool = category[toolStr] as any;

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all tools
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          {tool.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <div className="bg-muted/30 rounded-3xl p-6 sm:p-12 border border-border shadow-sm">
        <FileUploader 
          acceptedTypes={tool.acceptedTypes}
          targetFormat={tool.outputFormat}
        />
      </div>

      <div className="mt-24 prose prose-slate dark:prose-invert max-w-none">
        <h2>How to convert {tool.inputFormat.toUpperCase()} to {tool.outputFormat.toUpperCase()}</h2>
        <ol>
          <li>Upload your {tool.inputFormat.toUpperCase()} file by dragging it into the box above, or clicking to browse.</li>
          <li>Click the "Convert to {tool.outputFormat.toUpperCase()}" button.</li>
          <li>Your file will instantly be converted and download automatically.</li>
        </ol>
        
        <h3>Is it secure?</h3>
        <p>
          Yes. All conversions happen securely. Your files are automatically deleted after processing and are never shared with third parties.
        </p>
      </div>
    </div>
  );
}
