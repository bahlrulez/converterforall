import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement | ConverterForAll",
  description: "Our commitment to digital accessibility for all users.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Accessibility Statement</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <p><strong>Last Updated: August 1, 2026</strong></p>
        
        <h2>1. Our Commitment to Accessibility</h2>
        <p>
          At ConverterForAll, our mission is in our name: we build tools for <em>all</em>. We firmly believe that the internet should be available and accessible to anyone, regardless of their circumstances or physical abilities. We are strongly committed to ensuring our digital utilities, calculators, and educational content are accessible to the widest possible audience, including individuals with visual, auditory, motor, or cognitive disabilities.
        </p>
        <p>
          As an independent technology platform developed by Kuldeep Bahl, a Professional Software Engineer with over 14 years of experience, we understand that building an accessible website is not a one-time project, but a continuous journey of improvement, testing, and refinement. We are dedicated to integrating accessibility into our core development lifecycle.
        </p>

        <h2>2. Standards and Guidelines We Follow</h2>
        <p>
          To fulfill our commitment, we strive to adhere as closely as possible to the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level, published by the World Wide Web Consortium (W3C). These guidelines are the internationally recognized standard for digital accessibility.
        </p>
        <p>
          The WCAG guidelines explain how to make web content more accessible to people with a wide array of disabilities. Complying with these guidelines helps us ensure that the website is accessible to blind people, people with motor impairments, visual impairment, cognitive disabilities, and more. It also generally makes the website more user-friendly for everyone.
        </p>

        <h2>3. Key Accessibility Features</h2>
        <p>
          We have implemented several technical and design features to ensure ConverterForAll is accessible:
        </p>

        <h3>3.1 Semantic HTML and Structure</h3>
        <p>
          The foundation of web accessibility is properly structured markup. We utilize semantic HTML5 elements (such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;footer&gt;</code>) to ensure that screen readers and other assistive technologies can accurately parse and navigate the layout of our pages. Our educational articles use a logical heading hierarchy (H1 through H4) so users can easily skip to the sections they need.
        </p>

        <h3>3.2 Keyboard Navigation</h3>
        <p>
          We understand that many users rely entirely on a keyboard, switch controls, or other non-mouse inputs to navigate the web. We have designed our user interface to be fully operable via a keyboard.
        </p>
        <ul>
          <li><strong>Focus Indicators:</strong> All interactive elements (such as links, buttons, and file upload zones) feature clear, high-contrast focus indicators so users always know where they are on the page.</li>
          <li><strong>Tab Order:</strong> We ensure a logical and intuitive tab order that follows the visual flow of the page, preventing keyboard users from getting trapped or confused.</li>
          <li><strong>Skip to Content:</strong> We aim to provide mechanisms that allow keyboard users to bypass repetitive navigation links and jump directly to the primary tool or article on a given page.</li>
        </ul>

        <h3>3.3 Visual Design and Contrast</h3>
        <p>
          Good visual design is essential for users with low vision or color blindness.
        </p>
        <ul>
          <li><strong>Color Contrast:</strong> We carefully select our color palettes in both Light Mode and Dark Mode to meet or exceed the WCAG AA requirement for text contrast (a minimum ratio of 4.5:1 for normal text). This ensures that text remains legible against its background.</li>
          <li><strong>Not Relying on Color Alone:</strong> We do not rely exclusively on color to convey important information. For example, form validation errors are indicated by text messages and icons, not just by turning a border red.</li>
          <li><strong>Scalable Text:</strong> Our website is built with relative units (such as <code>rem</code> and <code>em</code>) rather than fixed pixels. This allows users to seamlessly scale the text up to 200% using their browser's built-in zoom functionality without breaking the layout or hiding critical controls.</li>
        </ul>

        <h3>3.4 Screen Reader Compatibility</h3>
        <p>
          To ensure that blind and visually impaired users can effectively use our conversion tools, we heavily utilize ARIA (Accessible Rich Internet Applications) attributes.
        </p>
        <ul>
          <li><strong>Alt Text:</strong> All meaningful images on our site are provided with descriptive <code>alt</code> text. Decorative images (such as abstract background patterns) are hidden from screen readers using empty alt attributes or CSS.</li>
          <li><strong>Form Labels:</strong> Every input field, including our file dropzones and calculator inputs, has a programmatically associated label. This ensures that screen readers clearly announce what information is expected from the user.</li>
          <li><strong>Dynamic Updates:</strong> When a file finishes converting, we use ARIA live regions to announce the status change to screen reader users, so they are immediately aware that their converted file is ready for download.</li>
        </ul>

        <h2>4. Ongoing Testing and Evaluation</h2>
        <p>
          Accessibility is not a static state. As we continue to add new calculators, image utilities, and document converters, we regularly evaluate our platform.
        </p>
        <p>
          We employ a combination of automated testing tools (such as Lighthouse and axe DevTools) and manual testing (including keyboard-only navigation and rudimentary screen reader testing) during our development process. While automated tools cannot catch every accessibility barrier, they provide a vital baseline for our ongoing efforts.
        </p>

        <h2>5. Known Limitations</h2>
        <p>
          Despite our best efforts to make all pages and content on ConverterForAll fully accessible, you may occasionally encounter some limitations. Because we occasionally integrate third-party libraries for complex document parsing (such as displaying previews of heavily formatted PDFs), there may be instances where these specific components do not yet meet our strict accessibility standards.
        </p>
        <p>
          Additionally, while we strive to ensure the interface of our tools is accessible, we cannot guarantee the accessibility of the <em>output files</em> themselves. For example, if you upload an inaccessible Word document to convert it to a PDF, the resulting PDF will likely retain those same accessibility issues.
        </p>

        <h2>6. We Welcome Your Feedback</h2>
        <p>
          We recognize that the true test of an accessible website is the experience of the people using it. If you have a disability and experience any difficulty accessing any part of ConverterForAll, or if you have suggestions on how we can improve the accessibility of our tools, we want to hear from you.
        </p>
        <p>
          Your feedback is invaluable to us. When reporting an accessibility issue, please try to include as much detail as possible, such as:
        </p>
        <ul>
          <li>The specific URL (web address) where the issue occurred.</li>
          <li>A description of the problem you experienced.</li>
          <li>The assistive technology (e.g., NVDA, JAWS, VoiceOver) and web browser you were using at the time.</li>
        </ul>
        <p>
          Please reach out to us via email, and we will make all reasonable efforts to address your concerns and provide the information or service you need in an alternative format if necessary.
        </p>
        <p>
          <strong>Email:</strong> officialdeepbahl@gmail.com
        </p>
      </div>
    </div>
  );
}
