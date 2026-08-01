import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Us for ConverterForAll.",
};

export default function contactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Contact Us</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: `
      <p>We'd love to hear from you! Whether you have a question about a specific converter, need technical support, or want to suggest a new feature, our team is ready to help.</p>
      <h2>Get in Touch</h2>
      <p><strong>Email:</strong> support@converterforall.com</p>
      <p><strong>Address:</strong> 123 Tech Avenue, Suite 400, San Francisco, CA 94105</p>
      <h2>Business Inquiries</h2>
      <p>For partnership or advertising inquiries, please contact us at partnerships@converterforall.com.</p>
      <p>We aim to respond to all inquiries within 24-48 business hours.</p>
    ` }} />
    </div>
  );
}
