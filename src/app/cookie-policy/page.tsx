import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ConverterForAll",
  description: "Learn how and why ConverterForAll uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Cookie Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <p><strong>Last Updated: August 1, 2026</strong></p>
        
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how ConverterForAll ("we," "us," or "our") uses cookies, local storage, and similar tracking technologies when you visit our website. This policy is designed to be fully transparent about what data is stored on your device, why it is stored, and how you can control your preferences.
        </p>
        <p>
          ConverterForAll is owned and operated by Kuldeep Bahl, a Professional Software Engineer. As a developer with over 14 years of experience, Kuldeep understands the importance of digital privacy. We strive to use cookies responsibly, balancing the need to provide a smooth, customized user experience and the necessity of keeping the service free via advertising, while respecting your privacy rights.
        </p>

        <h2>2. What Are Cookies and Local Storage?</h2>
        <p>
          <strong>Cookies</strong> are small text files that a website saves on your computer or mobile device when you visit the site. They are widely used to make websites work more efficiently, provide a customized experience, and supply analytical information to the owners of the site. Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
        </p>
        <p>
          <strong>Local Storage</strong> (also known as Web Storage) is an industry-standard technology that allows a website or application to store information locally on your computer or mobile device. Unlike cookies, local storage data is not automatically transmitted to the server with every HTTP request. This makes it an ideal, privacy-friendly way to store user interface preferences (such as Dark Mode settings) because the data never leaves your device unless specifically requested by a script.
        </p>
        <p>
          <strong>Web Beacons</strong> (or pixel tags) are small blocks of code on webpages that allow websites to do things like read and place cookies. They are often used in combination with cookies to track activity on a website, such as whether a particular page was visited or an advertisement was clicked.
        </p>

        <h2>3. How We Use Cookies</h2>
        <p>
          We use cookies and similar technologies for several distinct purposes, which generally fall into the following categories:
        </p>
        
        <h3>3.1 Essential and Functional Cookies</h3>
        <p>
          These are cookies and local storage items that are strictly necessary to provide you with services available through our website and to use some of its features. Because our platform relies heavily on modern Next.js client-side architecture, we use local storage to maintain the state of your web application experience.
        </p>
        <ul>
          <li><strong>Theme Preferences:</strong> We store a small flag in your browser's local storage to remember if you prefer the "Light" or "Dark" visual theme. This prevents the website from flashing the wrong colors when you navigate between pages.</li>
          <li><strong>Tool Configuration:</strong> For tools like the Word to PDF converter or Image Background Remover, we may temporarily store your preferred settings (e.g., "Compression Level" or "AI Model Quality") so you do not have to re-select them every time you upload a new file.</li>
          <li><strong>Security:</strong> We use essential cookies to help identify and prevent potential security risks, such as Cross-Site Request Forgery (CSRF).</li>
        </ul>
        <p>Because these cookies are essential to deliver the core functionality of ConverterForAll, you cannot refuse them without severely impacting how our website functions.</p>

        <h3>3.2 Analytics and Performance Cookies</h3>
        <p>
          We use performance cookies to understand how visitors interact with our website. This data helps us optimize the user interface, improve server response times, and prioritize the development of new file conversion utilities.
        </p>
        <ul>
          <li><strong>Google Analytics 4 (GA4):</strong> We use GA4 to collect information about how users use our site. GA4 collects data such as your IP address, browser type, pages visited, and time spent on the site. We use this information to compile reports and help us improve the website. The cookies collect information in an anonymous form. Google Analytics uses its own set of cookies (typically starting with `_ga`) to track these metrics.</li>
          <li><strong>Microsoft Clarity:</strong> We utilize Microsoft Clarity to capture behavioral metrics. This tool helps us understand how you navigate our site through session replays and heatmaps. Clarity uses first-party cookies (such as `_clck` and `_clsk`) to track your session uniquely but anonymously. We use this data strictly for UI/UX improvements to make our converters easier to use.</li>
        </ul>

        <h3>3.3 Advertising Cookies (Google AdSense)</h3>
        <p>
          ConverterForAll is completely free to use. To offset the costs of server infrastructure, cloud hosting on Vercel, and continuous development, we display advertisements provided by Google AdSense.
        </p>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve personalized ads to our users based on their prior visits to our site and/or other sites on the Internet.
        </p>
        <ul>
          <li><strong>The DoubleClick Cookie:</strong> Google uses the DoubleClick cookie on AdSense partner sites. When you visit a website and view or click on an ad, a cookie may be dropped on your browser. The data gathered from these cookies is used to help AdSense publishers better serve and manage the ads on their site(s) and across the web.</li>
          <li><strong>Personalization:</strong> If you have not opted out of personalized advertising, Google may use your browsing history to show you advertisements that are more relevant to your interests.</li>
        </ul>
        <p>
          We do not have access to or control over the cookies placed by Google or its advertising partners.
        </p>

        <h2>4. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party plug-ins that may set cookies on your device. These third parties include analytics providers and advertising networks as described above. Please note that this Cookie Policy does not cover the use of cookies by any third parties. We encourage you to read the privacy and cookie policies of these third-party providers to understand how they process your data.
        </p>

        <h2>5. How to Manage Your Cookie Preferences</h2>
        <p>
          You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie preferences by modifying the settings in your web browser. 
        </p>
        
        <h3>5.1 Browser Settings</h3>
        <p>
          Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
        </p>
        <p>
          Here is how to manage cookies in the most popular browsers:
        </p>
        <ul>
          <li><strong>Google Chrome:</strong> Go to Settings &gt; Privacy and security &gt; Cookies and other site data.</li>
          <li><strong>Mozilla Firefox:</strong> Go to Options &gt; Privacy & Security &gt; Cookies and Site Data.</li>
          <li><strong>Safari (macOS/iOS):</strong> Go to Preferences &gt; Privacy &gt; Block all cookies.</li>
          <li><strong>Microsoft Edge:</strong> Go to Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data.</li>
        </ul>

        <h3>5.2 Opting Out of Advertising Cookies</h3>
        <p>
          If you wish to opt out of personalized advertising from Google, you can do so by visiting the <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> page.
        </p>
        <p>
          Additionally, you can opt out of many third-party vendors' use of cookies for personalized advertising by visiting the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance (DAA) Consumer Choice Page</a> or the <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative (NAI) Opt-Out Page</a>.
        </p>

        <h2>6. Changes to this Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> officialdeepbahl@gmail.com
        </p>
      </div>
    </div>
  );
}
