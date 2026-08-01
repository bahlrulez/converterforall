import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions for ConverterForAll.",
};

export default function termsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Terms & Conditions</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>Last updated: August 2026</p>
      <p>By accessing and using ConverterForAll, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h2>1. Use of Service</h2>
      <p>Our service is provided "as is" and "as available". We do not guarantee that the site will be completely error-free or uninterrupted. You agree to use the service for lawful purposes only and not to upload malicious files, malware, or illegal content.</p>
      <h2>2. Intellectual Property</h2>
      <p>The original content, features, and functionality of this website are owned by ConverterForAll and are protected by international copyright and trademark laws. You retain all rights to the files you upload and convert.</p>
      <h2>3. Limitation of Liability</h2>
      <p>In no event shall ConverterForAll be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
      <h2>4. Changes to Terms</h2>
      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Your continued use of the service constitutes acceptance of those changes.</p>
    ` }} />
    </div>
  );
}
