const fs = require('fs');
const path = require('path');

const pages = [
  {
    slug: 'about',
    title: 'About Us',
    content: `
      <p>Welcome to <strong>ConverterForAll</strong>, your ultimate destination for free, fast, and secure online file conversions.</p>
      <p>Our mission is simple: to provide a universal toolkit that empowers users to seamlessly transform documents, images, audio, and video files without the hassle of downloading software or compromising their privacy.</p>
      <h2>Our Core Values</h2>
      <ul>
        <li><strong>Privacy First:</strong> We believe your data belongs to you. That's why we utilize on-device processing where possible, and automatically delete uploaded files from our servers immediately after conversion.</li>
        <li><strong>Accessibility:</strong> High-quality tools should be available to everyone. ConverterForAll is completely free to use.</li>
        <li><strong>Speed & Quality:</strong> We leverage the latest web technologies to ensure your files are converted instantly without losing quality.</li>
      </ul>
      <p>Whether you're a student, a professional, or just someone trying to convert a quick photo, we are here to make your digital life easier.</p>
    `
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    content: `
      <p>We'd love to hear from you! Whether you have a question about a specific converter, need technical support, or want to suggest a new feature, our team is ready to help.</p>
      <h2>Get in Touch</h2>
      <p><strong>Email:</strong> support@converterforall.com</p>
      <p><strong>Address:</strong> 123 Tech Avenue, Suite 400, San Francisco, CA 94105</p>
      <h2>Business Inquiries</h2>
      <p>For partnership or advertising inquiries, please contact us at partnerships@converterforall.com.</p>
      <p>We aim to respond to all inquiries within 24-48 business hours.</p>
    `
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: `
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
    `
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    content: `
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
    `
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    content: `
      <p>The information and tools provided by ConverterForAll are for general informational and utility purposes only.</p>
      <h2>No Warranties</h2>
      <p>While we strive to provide accurate and high-quality conversions, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website. Any reliance you place on such information is therefore strictly at your own risk.</p>
      <h2>File Integrity</h2>
      <p>Users are responsible for verifying the integrity and accuracy of the converted files. We highly recommend keeping a backup of your original files before using any conversion tool.</p>
      <h2>External Links</h2>
      <p>Through this website, you may be able to link to other websites which are not under our control. We have no control over the nature, content, and availability of those sites.</p>
    `
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    content: `
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
    `
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    content: `
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
    `
  },
  {
    slug: 'editorial-policy',
    title: 'Editorial Policy',
    content: `
      <p>At ConverterForAll, our editorial mission is to provide accurate, helpful, and transparent information regarding file conversions, digital tools, and technology.</p>
      <h2>Accuracy and Fact-Checking</h2>
      <p>All our guides, tutorials, and blog posts undergo a rigorous review process. We ensure that the technical explanations of how file formats work and how our converters operate are factually correct and up-to-date with current web standards.</p>
      <h2>Objectivity and Independence</h2>
      <p>Our content is created independently of advertising operations. While we host ads via Google AdSense, our editorial team does not alter content to favor specific advertisers. Any sponsored content will be clearly marked as such.</p>
      <h2>Content Updates</h2>
      <p>Technology evolves rapidly. We regularly audit and update our existing content to ensure it remains relevant, accurate, and useful for our users. If a tool's underlying technology changes, the corresponding documentation and guides will be updated accordingly.</p>
    `
  }
];

const basePath = path.join(__dirname, '..', 'src', 'app');

pages.forEach(page => {
  const dir = path.join(basePath, page.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const code = `import { Metadata } from "next";

export const metadata: Metadata = {
  title: "${page.title}",
  description: "${page.title} for ConverterForAll.",
};

export default function ${page.slug.replace(/-/g, '')}Page() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">${page.title}</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: \`${page.content}\` }} />
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), code);
  console.log(`Created ${page.slug}`);
});
