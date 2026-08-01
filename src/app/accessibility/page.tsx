import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Accessibility Statement for ConverterForAll.",
};

export default function accessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Accessibility Statement</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>ConverterForAll is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
      <h2>Conformance Status</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to be fully conformant with WCAG 2.1 level AA.</p>
      <h2>Features</h2>
      <ul>
        <li>Keyboard navigation support for all core conversion tools.</li>
        <li>Appropriate ARIA labels and roles for screen reader compatibility.</li>
        <li>High contrast text modes and color-blind friendly design elements.</li>
      </ul>
      <h2>Feedback</h2>
      <p>We welcome your feedback on the accessibility of ConverterForAll. Please let us know if you encounter accessibility barriers by contacting us at accessibility@converterforall.com.</p>
    ` }} />
    </div>
  );
}
