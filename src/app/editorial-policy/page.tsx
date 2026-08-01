import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "Editorial Policy for ConverterForAll.",
};

export default function editorialpolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Editorial Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>At ConverterForAll, our editorial mission is to provide accurate, helpful, and transparent information regarding file conversions, digital tools, and technology.</p>
      <h2>Accuracy and Fact-Checking</h2>
      <p>All our guides, tutorials, and blog posts undergo a rigorous review process. We ensure that the technical explanations of how file formats work and how our converters operate are factually correct and up-to-date with current web standards.</p>
      <h2>Objectivity and Independence</h2>
      <p>Our content is created independently of advertising operations. While we host ads via Google AdSense, our editorial team does not alter content to favor specific advertisers. Any sponsored content will be clearly marked as such.</p>
      <h2>Content Updates</h2>
      <p>Technology evolves rapidly. We regularly audit and update our existing content to ensure it remains relevant, accurate, and useful for our users. If a tool's underlying technology changes, the corresponding documentation and guides will be updated accordingly.</p>
    ` }} />
    </div>
  );
}
