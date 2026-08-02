import { imageToolsContent } from "./content/image-tools";
import { pdfOrganizeContent } from "./content/pdf-organize";
import { pdfOptimizeContent } from "./content/pdf-optimize";
import { pdfConvertContent } from "./content/pdf-convert";
import { videoToolsContent } from "./content/video-tools";

export const toolContent: Record<string, { sections: { title: string, content: string }[] }> = {
  ...imageToolsContent,
  ...pdfOrganizeContent,
  ...pdfOptimizeContent,
  ...pdfConvertContent,
  ...videoToolsContent,
  "remove-background": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>The Remove Background tool is an advanced, AI-powered utility designed to instantly isolate the main subject of any photograph by intelligently detecting and removing the background. Unlike traditional photo editing software that requires painstaking manual selection, this tool leverages state-of-the-art machine learning algorithms to automatically identify foreground elements—such as people, products, animals, or vehicles—and cleanly erase everything else. It operates entirely within your web browser, ensuring lightning-fast performance and total privacy.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>At its core, the background remover utilizes an in-browser neural network (specifically, the ISNet model optimized for edge devices) to perform semantic segmentation. When you upload an image, the model analyzes the pixels to distinguish between the primary subject and the background. It then generates a highly precise alpha mask. This mask is applied to your original image, effectively rendering the background pixels transparent. Because the entire computational process happens on your device using WebGL/WebGPU acceleration, your photos are never sent to a remote server, offering unprecedented privacy and speed.</p>"
      },
      {
        title: "Examples",
        content: "<p>Imagine you run an e-commerce store and need to standardize your product images. You can upload a photo of a sneaker taken on a cluttered desk, and our tool will return the sneaker on a perfectly transparent background, ready to be placed onto a solid white canvas or a promotional banner. Similarly, graphic designers can use this tool to quickly extract a model's portrait to composite into a new digital art piece, saving hours of manual lassoing and refining edges.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your image:</strong> Drag and drop your JPG, PNG, or WEBP file into the designated upload area, or click to browse your computer's files.</li><li><strong>Select Quality (Optional):</strong> If presented with quality options, choose 'Maximum Quality' for intricate details like hair, or 'Fast' for simple, well-defined shapes.</li><li><strong>Wait for processing:</strong> The AI will analyze the image. This typically takes 2-5 seconds depending on your device's processing power.</li><li><strong>Download:</strong> Once complete, a preview of your isolated subject will appear. Click the download button to save the result as a high-quality, transparent PNG file.</li></ol>"
      },
      {
        title: "Common mistakes",
        content: "<p>While our AI is highly advanced, certain conditions can yield sub-optimal results. <strong>Low Contrast:</strong> If the subject perfectly matches the color and lighting of the background, the AI may struggle to find the edge. <strong>Blurry Images:</strong> Out-of-focus subjects lack the sharp edge definitions needed for a clean cutout. <strong>Complex Crowds:</strong> Images with dozens of overlapping people or objects might confuse the AI as to what the 'primary' subject is. For best results, use well-lit images where the subject clearly stands out from its surroundings.</p>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>E-commerce:</strong> Creating uniform, professional product listings by removing messy backgrounds.</li><li><strong>Marketing & Design:</strong> Designing thumbnails, social media posts, and advertising banners with isolated elements.</li><li><strong>Presentations:</strong> Enhancing slide decks by overlaying clean cutouts of people or charts without ugly white box artifacts.</li><li><strong>Photography:</strong> Quickly creating transparent assets for digital compositing and scrapbooking.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Is my data safe?</strong><br>A: Absolutely. All processing happens locally in your web browser. Your images are never uploaded to our servers.</p><p><strong>Q: What is the maximum file size?</strong><br>A: Since processing is local, the file size is only limited by your device's available memory. However, we recommend images under 20MB for optimal performance.</p><p><strong>Q: Why is the output always a PNG?</strong><br>A: PNG is the standard web format that supports an alpha channel (transparency). If we outputted a JPG, the transparent areas would automatically be filled with white.</p><p><strong>Q: Does it work on mobile?</strong><br>A: Yes, our tool is fully responsive and uses optimized models that run smoothly on modern smartphones.</p>"
      }
    ]
  },
  "word-to-pdf": {
    sections: [
      {
        title: "What is this converter?",
        content: "<p>Our Word to PDF converter is a specialized document processing tool that transforms your Microsoft Word documents (.doc, .docx) into universally accessible Portable Document Format (PDF) files. PDFs are the global standard for document sharing because they preserve your exact layout, typography, and images regardless of the device or software the recipient is using. This tool ensures your resumes, reports, and invoices look exactly as intended when you send them.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Unlike traditional converters that require you to upload your sensitive documents to a third-party server, our state-of-the-art engine parses the intricate XML structure of your DOCX file directly within your web browser. It extracts the raw text, structural elements (like headings, paragraphs, and lists), and basic formatting. It then seamlessly pipes this reconstructed data into a client-side PDF rendering engine, generating a highly accurate PDF document entirely on your local machine. This guarantees absolute data privacy and zero upload wait times.</p>"
      },
      {
        title: "Examples",
        content: "<p>Consider a job applicant who has spent hours formatting the perfect resume in Microsoft Word. If they send the raw .docx file, a recruiter opening it on an older version of Word or a different operating system might see distorted margins and broken fonts. By using our Word to PDF tool, the applicant 'locks in' their design, ensuring the recruiter sees the exact same polished document, thus making a much stronger professional impression.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Upload your Word document:</strong> Drag your .docx file into the drop zone or click to open your file browser.</li><li><strong>Automatic Conversion:</strong> As soon as the file is loaded, the client-side parsing engine immediately begins extracting the layout and text.</li><li><strong>Preview and Download:</strong> Within seconds, your new PDF is generated in memory. Click the prominent download button to save the PDF directly to your device's storage.</li></ol>"
      },
      {
        title: "Common mistakes",
        content: "<p>When converting complex Word documents entirely in the browser, there are a few edge cases to be aware of. <strong>Custom Fonts:</strong> If your Word document relies on a highly obscure custom font that isn't embedded, the browser may fallback to a standard sans-serif font during PDF generation. <strong>Complex Macros:</strong> Our tool focuses on visual layout and text; interactive macros or embedded VBA scripts in your Word document will be stripped out for security and compatibility reasons. <strong>Intricate Pagination:</strong> Very complex multi-column layouts with floating images might occasionally wrap differently in the generated PDF.</p>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Professional Sharing:</strong> Sending contracts, invoices, and resumes that cannot be easily edited or accidentally altered by the recipient.</li><li><strong>Archiving:</strong> Saving final drafts of essays, manuscripts, or reports in a stable, long-term format that won't become obsolete if word processing software changes.</li><li><strong>Cross-Platform Compatibility:</strong> Ensuring a document looks identical whether it is opened on a Windows PC, a Mac, an iPhone, or an Android tablet.</li><li><strong>Printing:</strong> Generating print-ready files that commercial print shops can accurately reproduce without missing font errors.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my confidential documents secure?</strong><br>A: Yes. Because this tool utilizes client-side rendering architecture, your document is processed entirely in your device's memory. It is never transmitted across the internet to our servers.</p><p><strong>Q: Does it support older .doc files?</strong><br>A: Currently, our client-side engine is optimized for the modern .docx (Office Open XML) format. For legacy binary .doc files, you may need to open them in Word and save them as .docx first.</p><p><strong>Q: Will hyperlinks in my Word document work in the PDF?</strong><br>A: Yes, standard text hyperlinks are preserved and will be clickable in the resulting PDF document.</p>"
      }
    ]
  }
};

// Fallback generator for tools that haven't been manually written yet
export function getToolContent(slug: string, title: string, description: string) {
  if (toolContent[slug]) {
    return toolContent[slug].sections;
  }
  
  return [
    {
      title: "What is this converter?",
      content: `<p>${description} This tool provides a seamless, fast, and completely free way to process your files directly in your web browser. Built with modern web technologies, it ensures high-quality output while maintaining strict privacy standards.</p><p>Whether you are a professional needing reliable daily utilities or a casual user looking for a quick fix, this ${title} tool is designed to meet your needs without the bloat of traditional software.</p>`
    },
    {
      title: "How does it work?",
      content: "<p>Our platform leverages advanced client-side processing algorithms. When you upload a file, it is loaded directly into your browser's memory. The conversion logic—whether it involves manipulating pixels for an image, altering container formats for video, or restructuring document layouts—happens locally utilizing your device's CPU and GPU. This modern approach eliminates the need to upload files to a remote server, dramatically reducing wait times and completely eliminating the risk of your sensitive data being intercepted or stored.</p>"
    },
    {
      title: "Step-by-step guide",
      content: "<ol><li><strong>Select your file:</strong> Drag and drop your file directly into the conversion area, or click the upload box to browse your device.</li><li><strong>Initiate Conversion:</strong> The tool will automatically detect the file format. Click the primary action button to begin the process.</li><li><strong>Download:</strong> Because processing happens locally, your file will be ready almost instantly. Click download to save the converted file to your device.</li></ol>"
    },
    {
      title: "Practical uses",
      content: "<ul><li><strong>Workflow Optimization:</strong> Quickly adapt files to the specific format requirements of different software ecosystems or client requests.</li><li><strong>Storage Efficiency:</strong> Convert bulky, uncompressed files into modern, optimized formats to save hard drive space and bandwidth.</li><li><strong>Cross-Device Compatibility:</strong> Ensure your media and documents can be seamlessly opened and viewed on smartphones, tablets, and desktop computers alike.</li></ul>"
    },
    {
      title: "Frequently Asked Questions",
      content: "<p><strong>Q: Is this tool really free?</strong><br>A: Yes, ConverterForAll provides this utility completely free of charge. We are supported by unintrusive advertisements.</p><p><strong>Q: Do I need to create an account?</strong><br>A: No registration or account creation is required to use any of our tools.</p><p><strong>Q: What happens to my files after conversion?</strong><br>A: Since the processing is done in your browser, your files never leave your device. There is nothing for us to delete because we never receive your files in the first place.</p>"
    }
  ];
}
