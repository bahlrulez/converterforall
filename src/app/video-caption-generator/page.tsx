import { Metadata } from "next";
import { CaptionStudio } from "@/components/tools/caption-studio/CaptionStudio";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "AI Video Caption Generator - Add Subtitles to Video Free",
  description: "Automatically generate Devanagari Hindi captions with AI. Add subtitles to your videos natively in your browser.",
};

export default function VideoCaptionGeneratorPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Caption Studio</h1>
          <p className="text-muted-foreground">
            Generate and add captions to your videos instantly using client-side AI. Your videos stay on your device.
          </p>
        </div>
        
        <CaptionStudio />
      </div>
    </main>
  );
}
