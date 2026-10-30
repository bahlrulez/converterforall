import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description: "Learn how ConverterForAll keeps your conversions private with in-browser processing and zero permanent data retention.",
  alternates: {
    canonical: "https://www.converterforall.com/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="relative overflow-hidden py-16 md:py-24 bg-muted/30 border-b">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 capitalize text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how ConverterForAll processes your files and protects your personal data.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-a:text-primary">
          <p><strong>Last Updated: October 30, 2026</strong></p>

          <h2>1. Introduction &amp; Operational Jurisdiction</h2>
          <p>
            Welcome to <strong>ConverterForAll</strong> (created and operated by Kuldeep Bahl). ConverterForAll is operated from <strong>India</strong>. Our mission is to provide free, high-performance file utilities, text converters, and calculators without forced account creation, paywalls, or intrusive data collection.
          </p>
          <p>
            This Privacy Policy explains how our website functions, what data is processed when you use our tools, and the technical protections in place.
          </p>

          <h2>2. In-Browser Default Processing Model</h2>
          <p>
            ConverterForAll is built on a <strong>client-side first architecture</strong>:
          </p>
          <ul>
            <li>
              <strong>Default In-Browser Tools (Zero Document Uploads):</strong> Over 95% of tools on ConverterForAll—including image compressors, PDF splitters/organizers, audio trimmers, video converters, calculators, regional Indic font converters, and the <strong>Merge PDF</strong> tool—run directly inside your web browser using HTML5 Canvas, WebAssembly, and modern browser APIs.
              <br />
              <em>Merge PDF Tool Note:</em> When merging PDFs with Word (.docx), PowerPoint (.pptx), or image files, all file conversion and merging operations run entirely in your local browser memory on-device. No document files are uploaded to our servers or third-party conversion APIs during the merge workflow.
            </li>
            <li>
              <strong>Word-to-PDF and PowerPoint-to-PDF (In-Browser Default + Optional Cloud Engine):</strong>
              <br />
              By default, both Word-to-PDF and PowerPoint-to-PDF convert documents directly on your device inside your browser with <strong>zero file uploads</strong>.
              <br />
              For complex documents requiring desktop-grade Microsoft Office layout accuracy, an optional <strong>Cloud Engine</strong> is available via an unchecked-by-default checkbox. When checked by the user, the file is transmitted over encrypted HTTPS to a third-party conversion service (<strong>Cloudmersive API</strong>). When the optional cloud engine is used, files are held in memory only and not written to storage by our code.
            </li>
            <li>
              <strong>AI Presentation Maker:</strong> When generating presentation outlines, the user-typed topic prompt and requested slide count are transmitted to <strong>Google Gemini API</strong>. Slide editing, theme styling, and PPTX file export run entirely on-device inside your browser. <strong>Do not enter personal or confidential information in the prompt.</strong>
            </li>
          </ul>

          <h2>3. Inventory of Processors &amp; Data Handled</h2>
          <p>
            Based strictly on our system's active code, here is the complete inventory of services and infrastructure processors:
          </p>

          <h3>A. Document Conversion Services</h3>
          <div className="overflow-x-auto not-prose my-6">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground font-semibold">
                <tr>
                  <th className="p-3 border">Processor</th>
                  <th className="p-3 border">Associated Tools</th>
                  <th className="p-3 border">Data Transmitted</th>
                  <th className="p-3 border">Processing &amp; Storage Details</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Cloudmersive API</td>
                  <td className="p-3 border">Word to PDF (<a href="/word-to-pdf" className="text-primary hover:underline">/word-to-pdf</a>), PowerPoint to PDF (<a href="/powerpoint-to-pdf" className="text-primary hover:underline">/powerpoint-to-pdf</a>) <em>(Only when user explicitly checks the Cloud Engine opt-in box)</em></td>
                  <td className="p-3 border">Uploaded .docx and .pptx binary documents</td>
                  <td className="p-3 border">Transmitted via encrypted HTTPS multipart/form-data to Cloudmersive conversion endpoints (api.cloudmersive.com). When the optional cloud engine is used, files are held in memory only and not written to storage by our code. Third-party servers operated by Cloudmersive may be located outside India. Processing is governed by the Cloudmersive Privacy Policy.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground italic">
            (If the user does not check the Cloud Engine opt-in box, conversion runs 100% locally in the browser with zero network transmission).
          </p>

          <h3>B. Artificial Intelligence &amp; Image Generation Services</h3>
          <div className="overflow-x-auto not-prose my-6">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground font-semibold">
                <tr>
                  <th className="p-3 border">Processor</th>
                  <th className="p-3 border">Associated Tools</th>
                  <th className="p-3 border">Data Transmitted</th>
                  <th className="p-3 border">Processing &amp; Storage Details</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Google Gemini API</td>
                  <td className="p-3 border">AI Presentation Maker (<a href="/presentation-maker" className="text-primary hover:underline">/presentation-maker</a>)</td>
                  <td className="p-3 border">User-typed topic prompt &amp; requested slide count</td>
                  <td className="p-3 border">Sent over encrypted HTTPS to Google Gemini (gemini-3.5-flash-lite) to produce a structured slide outline JSON. No user documents or personal files are sent. Google servers may be located outside India. Governed by Google's API Terms. Depending on the plan under which our API access operates, Google may use prompts to improve its services. Do not enter personal or confidential information in the prompt.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Wikimedia Commons API</td>
                  <td className="p-3 border">AI Presentation Maker (<a href="/presentation-maker" className="text-primary hover:underline">/presentation-maker</a>)</td>
                  <td className="p-3 border">Short 2-to-4 word slide topic keyword generated by the model (e.g. &quot;Solar Panel Rooftop&quot;)</td>
                  <td className="p-3 border">Queries public domain educational photography from Wikipedia / Wikimedia Commons. The user's raw prompt is never forwarded.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Pollinations.ai</td>
                  <td className="p-3 border">AI Presentation Maker (<a href="/presentation-maker" className="text-primary hover:underline">/presentation-maker</a>)</td>
                  <td className="p-3 border">Short topic keyword generated by the model</td>
                  <td className="p-3 border">Fallback AI image query used only when Wikimedia has no suitable photograph. The user's raw prompt is never forwarded.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>C. Analytics, Performance &amp; Infrastructure Telemetry</h3>
          <div className="overflow-x-auto not-prose my-6">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground font-semibold">
                <tr>
                  <th className="p-3 border">Processor</th>
                  <th className="p-3 border">Integration Details</th>
                  <th className="p-3 border">Data Collected</th>
                  <th className="p-3 border">Privacy &amp; Consent Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Google Analytics 4 (GA4)</td>
                  <td className="p-3 border">G-49NFK7K9W6 via Google tag (gtag.js) in root layout</td>
                  <td className="p-3 border">Page views, user-agent details, referring URL, coarse geographical location</td>
                  <td className="p-3 border">Google Consent Mode v2 Default: The gtag script loads for every visitor with consent denied by default (analytics_storage, ad_storage, ad_user_data, ad_personalization set to &apos;denied&apos;). Limited cookieless pings may be sent to Google before consent is given. Analytics cookies are only set after the user affirmatively accepts the analytics category in our Cookie Banner.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Vercel Web Analytics</td>
                  <td className="p-3 border">@vercel/analytics package</td>
                  <td className="p-3 border">Aggregated metrics: page views, referrers, country, device type, and browser</td>
                  <td className="p-3 border">Telemetry operates without cookies.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Hosting &amp; Server Access Logs (Vercel)</td>
                  <td className="p-3 border">Vercel Edge Network Infrastructure</td>
                  <td className="p-3 border">Visitor IP address, user-agent string, HTTP request path, and timestamp</td>
                  <td className="p-3 border">Our website is hosted on Vercel&apos;s global edge infrastructure. Vercel automatically records standard server access logs, which include visitor IP addresses, for security, DDoS protection, operational monitoring, and edge routing.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground italic">
            (Note: Microsoft Clarity has been completely removed from ConverterForAll; no screen recordings or session replays are captured on any page).
          </p>

          <h3>D. Advertising Networks</h3>
          <div className="overflow-x-auto not-prose my-6">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground font-semibold">
                <tr>
                  <th className="p-3 border">Network</th>
                  <th className="p-3 border">Script &amp; Trigger</th>
                  <th className="p-3 border">Data Collected</th>
                  <th className="p-3 border">Privacy &amp; Consent Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Google AdSense</td>
                  <td className="p-3 border">pagead2.googlesyndication.com</td>
                  <td className="p-3 border">Ad request telemetry, IP address, DoubleClick cookie</td>
                  <td className="p-3 border">Loaded strictly when the user grants advertising consent via our Cookie Preferences dialog. Users can manage or opt out of personalized ads via <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>E. Database Infrastructure (Tool Reviews &amp; User Feedback)</h3>
          <div className="overflow-x-auto not-prose my-6">
            <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground font-semibold">
                <tr>
                  <th className="p-3 border">Processor</th>
                  <th className="p-3 border">Associated Feature</th>
                  <th className="p-3 border">Data Stored</th>
                  <th className="p-3 border">Processing &amp; Storage Details</th>
                </tr>
              </thead>
              <tbody className="divide-y text-muted-foreground">
                <tr>
                  <td className="p-3 font-semibold text-foreground border">Prisma Postgres (Prisma Data Platform)</td>
                  <td className="p-3 border">Tool rating &amp; feedback form (/api/reviews)</td>
                  <td className="p-3 border">Star rating (1–5), category tag, review text, user alias, optional user email, and client browser/OS string</td>
                  <td className="p-3 border">Hosted on Prisma Data Platform&apos;s managed serverless PostgreSQL infrastructure (operated by Prisma Inc.). Connections are encrypted via SSL/TLS. Servers may be located outside India. Visitor IP addresses are neither collected nor stored in this database.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>4. Tool Feedback, Reviews &amp; Diagnostic Data</h2>
          <p>
            When you submit a star rating, issue report, or feedback on any tool page:
          </p>
          <ul>
            <li>
              <strong>Automatic Diagnostics:</strong> The feedback form automatically detects and includes your general browser and operating system version (<code>deviceInfo</code>, e.g., &quot;Chrome on Windows&quot;, &quot;Safari on iOS&quot;). This is used solely to troubleshoot tool-specific layout or conversion errors.
            </li>
            <li>
              <strong>User-Provided Information:</strong> Star rating (1–5), feedback category tag (e.g., Bug Report, Feature Request), feedback comment, and optional name alias. You may optionally provide an email address if you request a personal reply.
            </li>
            <li>
              <strong>Spam Prevention &amp; Moderation Queue:</strong> To protect community feedback from automated abuse, submissions undergo client-side interaction timing checks and honeypot validation. HTML code and hyperlinks are automatically stripped from comments. Newly submitted reviews enter a moderation queue (<code>status: pending</code>) and are reviewed before being approved for public display.
            </li>
            <li>
              <strong>IP Address Verification:</strong> The reviews API and database do <strong>not</strong> log or store visitor IP addresses or IP hashes.
            </li>
            <li>
              <strong>Retention &amp; Public Display:</strong> Once approved, rating scores, feedback comments, category tags, and name aliases are stored in our database and displayed publicly on the tool page to assist other users. Email addresses remain private and are never published or sold.
            </li>
            <li>
              <strong>Review Deletion &amp; Correction Requests:</strong> You can request the modification or permanent deletion of your submitted review or feedback at any time by emailing <strong>officialdeepbahl@gmail.com</strong> with the tool name and approximate date of submission. Requests are processed within a reasonable time.
            </li>
          </ul>

          <h2>5. Server Storage &amp; Logging Practices</h2>
          <ul>
            <li>
              <strong>File Storage:</strong> ConverterForAll does not store, archive, or retain any user documents, images, audio, or video files. Files never touch permanent hard drives, databases, or S3/cloud storage buckets on our servers. When the optional cloud engine is used, files are held in memory only and not written to storage by our code.
            </li>
            <li>
              <strong>Serverless Execution Logs:</strong> When using the optional Cloud Engine for Word or PowerPoint conversion, our serverless routes log only the incoming file size in bytes to runtime console logs (e.g., <code>Converting via Cloudmersive API (45210 bytes)...</code>). Filenames, text contents, and personal data are never logged.
            </li>
            <li>
              <strong>AI Prompts:</strong> We do not save or log your presentation prompts or API request bodies to any database or server log files. Do not enter personal or confidential information in the prompt.
            </li>
          </ul>

          <h2>6. Cookies &amp; Local Storage</h2>
          <ul>
            <li>
              <strong>Local Storage:</strong> Used solely to persist your client-side UI preferences (such as Dark Mode theme) and your cookie consent settings. This data never leaves your device.
            </li>
            <li>
              <strong>Cookies:</strong> Analytics cookies such as <code>_ga</code> are set only after the user accepts analytics; advertising cookies only after they accept advertising. Third-party advertising scripts remain completely blocked and are not loaded until you explicitly grant consent in our Cookie Banner or Cookie Preferences dialog.
            </li>
          </ul>

          <h2>7. Cross-Border Data Transfers</h2>
          <p>
            ConverterForAll is hosted on Vercel&apos;s global edge network. While most operations remain entirely on your local computer, third-party processors utilized for optional features (specifically Cloudmersive API for optional cloud document conversion, Google Gemini for AI presentation generation, and Prisma Data Platform for database hosting) operate servers that may be located outside India. By choosing to use these optional features, you acknowledge that data handled by these services is processed internationally under their applicable privacy terms.
          </p>

          <h2>8. Grievance Redressal &amp; Contact Information</h2>
          <p>
            ConverterForAll is operated from India. In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
          </p>

          <h3>Grievance Officer</h3>
          <ul>
            <li><strong>Designation / Name:</strong> Kuldeep Bahl</li>
            <li><strong>Operational Address:</strong> India</li>
            <li><strong>Email for Privacy Inquiries &amp; Grievances:</strong> officialdeepbahl@gmail.com</li>
            <li><strong>Response Turnaround:</strong> All privacy questions, data deletion requests, or grievances will be acknowledged and addressed within a reasonable time.</li>
          </ul>

          <h2>9. Updates to This Policy</h2>
          <p>
            This Privacy Policy will be updated whenever our operational, technical, or data processing practices change. Any revisions will be posted directly on this page with an updated &quot;Last Updated&quot; date at the top of the policy.
          </p>
        </div>
      </div>
    </div>
  );
}
