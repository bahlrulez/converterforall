import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for ConverterForAll.",
};

export default function disclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Disclaimer</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>The information and tools provided by ConverterForAll are for general informational and utility purposes only.</p>
      <h2>No Warranties</h2>
      <p>While we strive to provide accurate and high-quality conversions, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website. Any reliance you place on such information is therefore strictly at your own risk.</p>
      <h2>File Integrity</h2>
      <p>Users are responsible for verifying the integrity and accuracy of the converted files. We highly recommend keeping a backup of your original files before using any conversion tool.</p>
      <h2>External Links</h2>
      <p>Through this website, you may be able to link to other websites which are not under our control. We have no control over the nature, content, and availability of those sites.</p>
    ` }} />
    </div>
  );
}
