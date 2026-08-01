import { Metadata } from "next";
import { AuthorProfile } from "@/components/shared/author-profile";

export const metadata: Metadata = {
  title: "Editorial Policy | ConverterForAll",
  description: "Learn about our commitment to accuracy, quality, and independent content creation.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Editorial Policy</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <p><strong>Last Updated: August 1, 2026</strong></p>
        
        <h2>1. Our Mission and Editorial Vision</h2>
        <p>
          At ConverterForAll, our primary mission is to empower individuals, students, and professionals by providing high-quality, completely free digital tools and clear, actionable educational content. We believe that tasks like converting a document, resizing an image, or calculating a complex metric should be straightforward, private, and accessible to everyone regardless of technical expertise.
        </p>
        <p>
          This Editorial Policy outlines our unwavering commitment to accuracy, integrity, and transparency in everything we publish. Whether you are reading a deep-dive tutorial on optimizing PDFs for the web, learning about image compression algorithms, or simply looking up the formula for a unit conversion, you deserve information that is well-researched, clearly written, and technically sound.
        </p>

        <h2>2. Content Authorship and Expertise</h2>
        <p>
          The internet is flooded with generic, mass-produced content. We take a different approach. All educational articles, tool documentation, and technical guides published on ConverterForAll are authored, reviewed, and maintained by real technology professionals.
        </p>
        <p>
          The website is proudly owned and operated by Kuldeep Bahl, a Professional Software Engineer with a B.Tech (Honours) in Computer Science & Engineering. With over 14 years of experience working in the corporate technology industry, Kuldeep brings a wealth of practical, real-world knowledge to the platform. 
        </p>
        <p>
          <strong>The "Experience, Expertise, Authoritativeness, and Trustworthiness" (EEAT) Standard:</strong> 
          Every piece of technical writing on this site is held to a high standard of expertise. We do not hire generalist freelance writers to explain complex software engineering concepts. When you read a guide on how our WebAssembly-based background remover processes images locally in your browser, that guide was written and reviewed by the engineer who built the integration.
        </p>

        <h2>3. Our Rigorous Editorial Process</h2>
        <p>
          To ensure that ConverterForAll remains a trusted resource, every educational article and major tool update undergoes a strict editorial process before it is published to the live website.
        </p>

        <h3>3.1 Topic Selection and Research</h3>
        <p>
          Topics for our blog and educational guides are selected based on actual user needs, search trends, and common points of confusion regarding file formats and digital productivity. Once a topic is selected, we rely strictly on primary sources for our research. This includes reading official documentation (such as Adobe's PDF specifications, W3C web standards, or MDN Web Docs), consulting academic papers for algorithmic explanations, and conducting hands-on testing with the software in question.
        </p>

        <h3>3.2 Writing for Clarity and Accessibility</h3>
        <p>
          Technical writing often suffers from excessive jargon. Our editorial mandate is to explain complex subjects in plain, accessible English without "dumbing down" the technical accuracy. We utilize formatting tools—such as bold text for key terms, bulleted lists for steps, and clear headings—to make our content scannable and easy to digest on both desktop and mobile devices.
        </p>

        <h3>3.3 Technical Review and Verification</h3>
        <p>
          Before any content is published, it undergoes a technical review by Kuldeep Bahl. This step is critical. The review ensures that:
        </p>
        <ul>
          <li>All mathematical formulas presented in our calculators and their accompanying text are correct.</li>
          <li>The step-by-step instructions for utilizing our converters accurately reflect the current user interface.</li>
          <li>Any code snippets provided in our developer-focused tutorials are syntactically correct, secure, and follow modern best practices (such as Next.js App Router conventions or strict TypeScript typing).</li>
        </ul>

        <h2>4. Commitment to Independent Content (No AI Hallucinations)</h2>
        <p>
          While we heavily utilize modern technologies (including on-device AI for image processing), we maintain strict human oversight over our written educational content. We do not rely on Generative AI to mass-produce articles, as this often leads to "hallucinations"—plausible-sounding but factually incorrect technical statements. 
        </p>
        <p>
          If AI tools are ever used during the drafting process (e.g., for outlining or grammar checking), the final output is rigorously fact-checked, heavily edited, and ultimately approved by a human engineer. Our content reflects genuine human experience and technical problem-solving.
        </p>

        <h2>5. Continuous Updates and Maintenance</h2>
        <p>
          Technology moves fast. A tutorial that is perfectly accurate today may become obsolete in a year due to software updates, changing web standards, or the deprecation of APIs. 
        </p>
        <p>
          We are committed to the long-term maintenance of our content catalog. We routinely audit our highest-traffic pages and core tool documentation to ensure they remain accurate. When we significantly update an article to reflect new information, we will typically indicate this by updating the "Last Updated" date on the page. If a tool undergoes a major architectural shift (such as moving from server-side processing to client-side processing), we proactively update the accompanying documentation to reflect how user data is now handled.
        </p>

        <h2>6. Corrections and User Feedback</h2>
        <p>
          Despite our best efforts and rigorous review processes, errors can occasionally slip through. We view user feedback as an essential component of our editorial integrity.
        </p>
        <p>
          If you discover a factual inaccuracy, a broken link, a typo, or a tool that is not functioning as described in its documentation, we actively encourage you to reach out to us via our Contact form. When a correction request is received:
        </p>
        <ol>
          <li>We will acknowledge receipt of your message.</li>
          <li>Our editorial team will investigate the claim against primary sources.</li>
          <li>If an error is confirmed, we will correct the content promptly and republish the page.</li>
        </ol>
        <p>
          We value the expertise of our community and appreciate those who take the time to help us improve ConverterForAll.
        </p>

        <h2>7. Advertising, Affiliates, and Editorial Independence</h2>
        <p>
          ConverterForAll is a free platform. To keep the servers running, we rely on automated advertising provided by the Google AdSense network. It is crucial for our users to understand the relationship between our revenue streams and our content.
        </p>
        <p>
          <strong>Strict Editorial Independence:</strong> Our editorial content is strictly separated from our advertising. We do not write articles, create tools, or alter our technical recommendations in exchange for compensation from advertisers. Advertisers have no influence over our topic selection, our writing process, or our technical reviews.
        </p>
        <p>
          <strong>No Sponsored Content:</strong> We currently do not publish "sponsored posts" or accept paid guest articles. If we ever decide to feature a product or service in exchange for compensation (such as an affiliate link), that relationship will be explicitly and conspicuously disclosed at the very beginning of the article in accordance with FTC guidelines and general ethical standards.
        </p>
        <p>
          Our priority is, and always will be, providing the most accurate and useful information to our users, regardless of financial incentives.
        </p>

        <h2>8. Contact the Editor</h2>
        <p>
          For any questions regarding this Editorial Policy, or to submit feedback regarding our content, please contact the site owner directly:
        </p>
        <p>
          <strong>Email:</strong> [UPDATE BEFORE PUBLISHING]
        </p>
        
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-bold mb-6">About the Editor</h3>
          <AuthorProfile />
        </div>
      </div>
    </div>
  );
}
