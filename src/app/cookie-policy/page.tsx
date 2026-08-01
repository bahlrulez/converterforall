import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for ConverterForAll.",
};

export default function cookiepolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Cookie Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>This Cookie Policy explains how ConverterForAll uses cookies and similar technologies to recognize you when you visit our website.</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information.</p>
      <h2>How we use cookies</h2>
      <ul>
        <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website.</li>
        <li><strong>Performance and Functionality Cookies:</strong> These are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
        <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used in aggregate form to help us understand how our website is being used.</li>
        <li><strong>Advertising Cookies:</strong> These cookies are used to make advertising messages more relevant to you. We partner with Google AdSense, which uses cookies to serve ads based on your prior visits to our website or other websites.</li>
      </ul>
      <h2>Managing Cookies</h2>
      <p>You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.</p>
    ` }} />
    </div>
  );
}
