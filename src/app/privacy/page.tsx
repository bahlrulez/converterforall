import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for ConverterForAll.",
};

export default function privacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>Last updated: August 2026</p>
      <p>At ConverterForAll, your privacy is our top priority. This Privacy Policy outlines how we handle your data when you use our website.</p>
      <h2>1. File Processing</h2>
      <p>Many of our tools run entirely in your web browser (client-side processing). In these cases, your files never leave your device. For tools that require server-side processing, files are transmitted securely via HTTPS, processed in memory, and permanently deleted immediately after the conversion is complete. We do not store, view, or share your files.</p>
      <h2>2. Information We Collect</h2>
      <p>We may collect non-personally identifiable information such as browser type, device type, and usage statistics through tools like Google Analytics to help us improve our services.</p>
      <h2>3. Cookies</h2>
      <p>We use cookies to enhance your experience, serve personalized ads via Google AdSense, and analyze our traffic. You can manage your cookie preferences through your browser settings.</p>
      <h2>4. Third-Party Services</h2>
      <p>We use third-party services (such as Google AdSense and Analytics) which may collect information about your visits to this and other websites in order to provide targeted advertisements. These services operate under their own privacy policies.</p>
      <p>If you have any questions about this Privacy Policy, please contact us.</p>
    ` }} />
    </div>
  );
}
