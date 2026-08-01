import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ConverterForAll",
  description: "Learn how ConverterForAll collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden py-16 md:py-24 bg-muted/30 border-b">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 capitalize bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn how ConverterForAll collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-a:text-primary">
          <p><strong>Last Updated: August 1, 2026</strong></p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to ConverterForAll. We understand that your privacy is critically important. This Privacy Policy outlines the types of information we collect, how we use it, how we protect it, and the choices you have regarding your data when you visit and use our website.
        </p>
        <p>
          ConverterForAll was built by Kuldeep Bahl, a Professional Software Engineer with over 14 years of experience, to provide reliable, fast, and free online calculators, file converters, measurement tools, and educational resources. Because many of our tools are designed to handle files—which may contain sensitive personal or business information—we have designed our architecture to minimize data collection. Whenever possible, our tools utilize client-side processing, meaning the conversion happens directly within your web browser and your files are never transmitted to our servers.
        </p>
        <p>
          By accessing or using ConverterForAll, you agree to the terms of this Privacy Policy. If you do not agree with our practices, please do not use our website.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We believe in data minimization. We only collect the information that is absolutely necessary to provide, maintain, and improve our services, as well as to ensure the security of our platform and display relevant advertisements that keep the site free for everyone.
        </p>

        <h3>2.1 Information You Provide to Us</h3>
        <p>
          In most cases, you can use ConverterForAll without providing any personally identifiable information. You do not need to create an account, register, or provide an email address to use our standard conversion tools.
        </p>
        <p>
          The primary way you might directly provide information to us is by using our Contact Form. If you choose to reach out to us with a question, a feature request, or to report a bug, we will collect the information you voluntarily submit. This typically includes your name, your email address, and the contents of your message. We use this information solely to respond to your inquiry and provide customer support. We do not add your email address to marketing lists or sell it to third parties.
        </p>

        <h3>2.2 Automatically Collected Information</h3>
        <p>
          When you visit ConverterForAll, our servers and third-party service providers automatically collect certain technical information about your device and how you interact with our website. This information helps us understand our user base, optimize performance, and troubleshoot technical issues.
        </p>
        <p>
          The automatically collected data may include:
        </p>
        <ul>
          <li><strong>Device Information:</strong> We collect data about the device you are using to access the site, including your hardware model, operating system version, and unique device identifiers.</li>
          <li><strong>Browser Information:</strong> We log your browser type, language preference, and the date and time of your request. This helps us ensure compatibility and deliver the correct language version of the site.</li>
          <li><strong>Log Data:</strong> Like most websites, our hosting provider (Vercel) automatically records certain log data when you interact with our services. This may include your IP address, the referring website that led you to us, the pages you view on our site, and the search queries you enter into our search functionality.</li>
          <li><strong>Usage Data:</strong> We monitor how users interact with specific tools, such as which converters are used most frequently, how long users spend on a page, and where they click. This helps us prioritize the development of new features.</li>
        </ul>

        <h2>3. How We Process Files</h2>
        <p>
          Because we operate a file conversion platform, how we handle your uploaded files is a primary privacy concern. 
        </p>
        <p>
          <strong>Client-Side Processing:</strong> We have heavily invested in modern web technologies (such as WebAssembly) that allow many of our converters to run directly inside your web browser. When you use a client-side tool (such as our Word to PDF converter or background removal tool), your file is loaded into your device's memory. The conversion logic runs on your local CPU or GPU. In these instances, <strong>your file is never uploaded to our servers, never transmitted across the internet, and never seen by us.</strong> It remains entirely on your device.
        </p>
        <p>
          <strong>Server-Side Processing:</strong> For certain complex conversions that cannot yet be efficiently processed in a browser, your file is securely transmitted via HTTPS encryption to our processing servers. Once received, the file is temporarily held in a volatile memory environment (RAM) just long enough to perform the conversion. Immediately after the conversion is complete and you have downloaded the result, the original file and the converted file are automatically and permanently deleted from our systems. We do not maintain backups of user files, we do not inspect their contents, and we do not use them to train machine learning models.
        </p>

        <h2>4. Cookies and Local Storage</h2>
        <p>
          ConverterForAll utilizes cookies and local storage technologies to enhance your user experience and facilitate advertising.
        </p>
        <p>
          <strong>Local Storage:</strong> We use your browser's local storage to save your user interface preferences. For example, if you toggle the website into "Dark Mode," we store a small piece of data locally on your device so that the site remembers your preference the next time you visit. This data never leaves your device.
        </p>
        <p>
          <strong>Cookies:</strong> Cookies are small text files placed on your device by your browser. We use cookies to analyze site traffic, remember your consent preferences, and serve targeted advertisements. For a comprehensive breakdown of exactly which cookies we use, who provides them, and how you can manage them, please review our dedicated Cookie Policy.
        </p>

        <h2>5. Analytics and Performance Tracking</h2>
        <p>
          To understand how our website is performing and how we can improve our user experience, we utilize third-party analytics services.
        </p>
        <p>
          <strong>Google Analytics 4 (GA4):</strong> We use GA4 to track aggregated, anonymized data about our website traffic. GA4 helps us understand which geographical regions our users are coming from, which tools are the most popular, and how users navigate between pages. GA4 uses cookies to identify unique (but anonymous) users across browsing sessions. We have configured GA4 to respect user privacy and do not pass any personally identifiable information (PII) to Google.
        </p>
        <p>
          <strong>Google Search Console:</strong> We use this tool to monitor our website's presence in Google Search results, identify indexing issues, and see which search queries bring users to our site. This data is aggregated and does not identify individual users.
        </p>
        <p>
          <strong>Microsoft Clarity:</strong> We use Microsoft Clarity to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay. This helps us identify usability issues, such as buttons that are difficult to click on mobile devices or confusing navigation paths. Website usage data is captured using first and third-party cookies and other tracking technologies. Microsoft Clarity is configured to mask sensitive user input (such as text entered into forms) so that your private information is not recorded in session replays.
        </p>

        <h2>6. Advertising and Google AdSense</h2>
        <p>
          ConverterForAll is completely free to use. To support the ongoing maintenance, server costs, and development of this platform, we display advertisements provided by Google AdSense.
        </p>
        <p>
          Google, as a third-party vendor, uses cookies (specifically the DoubleClick cookie) to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their prior visits to ConverterForAll and/or other sites on the Internet. This is known as personalized advertising.
        </p>
        <p>
          These advertising networks automatically receive your IP address when serving ads. They may also use other technologies (such as cookies, JavaScript, or Web Beacons) to measure the effectiveness of their advertisements and to personalize the advertising content that you see. ConverterForAll has no access to or control over these cookies that are used by third-party advertisers.
        </p>
        <p>
          You can opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain the personal information we collect only for as long as is necessary for the purpose for which it was collected. 
        </p>
        <ul>
          <li><strong>Files:</strong> As stated, files processed on our servers are deleted immediately after the conversion process completes.</li>
          <li><strong>Contact Form Inquiries:</strong> If you email us, we will retain your email and our response for a period of up to two years to provide context for future communications and to improve our customer support processes. After this period, the correspondence is securely deleted.</li>
          <li><strong>Analytics Data:</strong> Anonymized analytics data is retained in accordance with the default retention policies of our analytics providers (e.g., 14 months for GA4 data).</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          ConverterForAll is a general audience website designed for users who are 13 years of age or older. We do not knowingly collect, request, or maintain personally identifiable information from children under the age of 13. If we become aware that we have inadvertently collected personal information from a child under 13, we will take immediate steps to delete that information from our records. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
        </p>

        <h2>9. International Users and Data Transfers</h2>
        <p>
          ConverterForAll is hosted in the cloud via Vercel, which utilizes a globally distributed Edge Network. Depending on your location, your requests may be routed through servers located in the United States, Europe, or other regions.
        </p>
        <p>
          If you are accessing our website from the European Union, the United Kingdom, or other regions with laws governing data collection and use that may differ from United States law, please note that you are transferring your personal data to our servers and third-party service providers located globally. By using ConverterForAll, you consent to the transfer, processing, and storage of your information in these global locations. We take steps to ensure that our service providers offer adequate levels of data protection in compliance with applicable laws, such as the General Data Protection Regulation (GDPR).
        </p>

        <h2>10. Your Data Privacy Rights</h2>
        <p>
          Depending on your location and applicable laws (such as the GDPR in Europe or the CCPA/CPRA in California), you may have certain rights regarding your personal information:
        </p>
        <ul>
          <li><strong>Right to Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> You have the right to request that we correct any inaccurate or incomplete personal data.</li>
          <li><strong>Right to Erasure (Right to be Forgotten):</strong> You have the right to request that we delete your personal data, subject to certain exceptions.</li>
          <li><strong>Right to Restrict Processing:</strong> You have the right to request that we limit the processing of your personal data.</li>
          <li><strong>Right to Data Portability:</strong> You have the right to receive your personal data in a structured, commonly used, and machine-readable format.</li>
          <li><strong>Right to Object:</strong> You have the right to object to our processing of your personal data, particularly for direct marketing purposes.</li>
        </ul>
        <p>
          Because we collect minimal personal data and do not maintain user accounts, verifying requests can be challenging. However, if you wish to exercise any of these rights regarding information submitted via our contact form, please email us using the contact information below.
        </p>

        <h2>11. Data Security</h2>
        <p>
          We take the security of your data seriously. ConverterForAll implements a variety of industry-standard security measures to maintain the safety of your information:
        </p>
        <ul>
          <li><strong>HTTPS Encryption:</strong> All traffic between your browser and our servers is encrypted using standard SSL/TLS protocols. This prevents malicious actors from intercepting your files or searches while they are in transit.</li>
          <li><strong>Ephemeral Storage:</strong> By avoiding persistent storage of user files, we eliminate the primary vector for data breaches. You cannot steal what is not stored.</li>
          <li><strong>Modern Frameworks:</strong> We utilize the Next.js framework, which provides built-in protections against common web vulnerabilities such as Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).</li>
          <li><strong>Security Headers:</strong> We enforce strict HTTP security headers to protect our users from clickjacking and other malicious framing attacks.</li>
        </ul>
        <p>
          While we strive to use commercially acceptable means to protect your personal information and files, we cannot guarantee absolute security. No method of transmission over the Internet, or method of electronic storage, is 100% secure.
        </p>

        <h2>12. Links to Other Websites</h2>
        <p>
          Our website, particularly our educational blog posts and tutorials, may contain links to third-party websites or services that are not owned or controlled by ConverterForAll. We provide these links for your convenience and informational purposes only.
        </p>
        <p>
          We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You acknowledge and agree that ConverterForAll shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services. We strongly advise you to read the privacy policies of every site you visit.
        </p>

        <h2>13. Changes to this Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes, we will revise the "Last Updated" date at the top of this policy.
        </p>
        <p>
          For significant changes that materially affect your rights, we may provide a more prominent notice on our website homepage. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of ConverterForAll after any modifications indicates your acceptance of the updated policy.
        </p>

        <h2>14. Contact Information</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out. We are dedicated to transparency and will do our best to address your inquiries promptly.
        </p>
        <p>
          <strong>Email:</strong> officialdeepbahl@gmail.com
        </p>
        <p>
          <em>This Privacy Policy was written to provide clear, actionable information about your data privacy rights while using ConverterForAll.</em>
        </p>
      </div>
    </div>
    </div>
  );
}
