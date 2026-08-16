import { imageToolsContent } from "./content/image-tools";
import { pdfOrganizeContent } from "./content/pdf-organize";
import { pdfOptimizeContent } from "./content/pdf-optimize";
import { pdfConvertContent } from "./content/pdf-convert";
import { videoToolsContent } from "./content/video-tools";
import { utilitiesToolsContent } from "./content/utilities-tools";
import { fontToolsContent } from "./content/font-tools";

export const toolContent: Record<string, { sections: { title: string, content: string }[] }> = {
  ...imageToolsContent,
  ...pdfOrganizeContent,
  ...pdfOptimizeContent,
  ...pdfConvertContent,
  ...videoToolsContent,
  ...utilitiesToolsContent,
  ...fontToolsContent,
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
        content: `
          <p><strong>Q: Is my data safe when using this background remover?</strong><br>A: Absolutely. All processing happens locally in your web browser. Your images are never uploaded to our servers.</p>
          <p><strong>Q: What is the maximum file size I can upload?</strong><br>A: Since processing is local, the file size is only limited by your device's available memory. However, we recommend images under 20MB for optimal performance.</p>
          <p><strong>Q: Why is the output always a PNG?</strong><br>A: PNG is the standard web format that supports an alpha channel (transparency). If we outputted a JPG, the transparent areas would automatically be filled with white.</p>
          <p><strong>Q: Does this tool work on mobile devices?</strong><br>A: Yes, our tool is fully responsive and uses optimized models that run smoothly on modern smartphones.</p>
          <p><strong>Q: Will this tool work on non-human subjects like cars or pets?</strong><br>A: Yes! Our advanced AI model is trained to recognize a wide variety of foreground subjects, including animals, products, vehicles, and furniture.</p>
          <p><strong>Q: Does it cost money to use this AI?</strong><br>A: No, our background removal tool is 100% free with no hidden fees or daily limits.</p>
          <p><strong>Q: Do I need to manually draw lines around the subject?</strong><br>A: Not at all. The AI automatically detects the subject and creates the mask without any manual intervention.</p>
          <p><strong>Q: What if the AI misses a spot?</strong><br>A: Our AI is highly accurate, but it can occasionally miss complex areas (like thin strands of hair against a matching background). Currently, the tool offers a fully automatic mode, so you may need a manual editor for minor touch-ups.</p>
          <p><strong>Q: Will the tool decrease the resolution of my photo?</strong><br>A: The tool aims to preserve your original resolution. However, extremely high-resolution images (like 4K RAW photos) may be slightly downscaled internally to prevent your browser from crashing during the AI processing.</p>
          <p><strong>Q: Can I use the generated images for commercial purposes?</strong><br>A: Yes, you retain full rights to the images you process, meaning you can freely use them for commercial e-commerce stores or client designs.</p>
        `
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
        content: `
          <p><strong>Q: Are my confidential documents secure?</strong><br>A: Yes. Because this tool utilizes client-side rendering architecture, your document is processed entirely in your device's memory. It is never transmitted across the internet to our servers.</p>
          <p><strong>Q: Does it support older .doc files?</strong><br>A: Currently, our client-side engine is optimized for the modern .docx (Office Open XML) format. For legacy binary .doc files, you may need to open them in Word and save them as .docx first.</p>
          <p><strong>Q: Will hyperlinks in my Word document work in the PDF?</strong><br>A: Yes, standard text hyperlinks are preserved and will be clickable in the resulting PDF document.</p>
          <p><strong>Q: Will this convert my images embedded in the Word document?</strong><br>A: Yes, any images, charts, and logos placed within your Word document will be accurately rendered into the PDF.</p>
          <p><strong>Q: Does this tool require Microsoft Word to be installed?</strong><br>A: No, it works entirely independently of Microsoft Office, making it perfect for Chrome OS or mobile devices.</p>
          <p><strong>Q: Why does the PDF formatting look slightly different than my Word screen?</strong><br>A: The client-side parser rebuilds the document layout from scratch. Highly complex layouts (like nested tables or layered floating images) might shift slightly compared to Microsoft's proprietary rendering engine.</p>
          <p><strong>Q: Is there a page limit for the Word document?</strong><br>A: There is no hard limit, but extremely large documents (500+ pages) might cause the browser to slow down or run out of memory during conversion.</p>
          <p><strong>Q: Can I edit the PDF after it's converted?</strong><br>A: PDFs are 'flat' documents designed for viewing and printing. To edit the text again, you would need to use the original Word file or specialized PDF editing software.</p>
          <p><strong>Q: Does this converter cost money?</strong><br>A: No, our Word to PDF tool is completely free with no daily limits or watermarks.</p>
          <p><strong>Q: Will headers and footers be preserved?</strong><br>A: Yes, standard headers, footers, and page numbers will be carried over into the final PDF.</p>
        `
      }
    ]
  }
};

// Fallback generator for tools that haven't been manually written yet
export function getToolContent(toolSlug: string, toolTitle: string, toolDescription: string) {
  // Helper for length conversion factors to base (meters) to generate accurate tables
  const lengthFactors: Record<string, number> = {
    'Inches': 0.0254,
    'Feet': 0.3048,
    'Yards': 0.9144,
    'Miles': 1609.344,
    'Millimeters': 0.001,
    'Centimeters': 0.01,
    'Meters': 1,
    'Kilometers': 1000,
    'Nautical-miles': 1852
  };

  // Check if it's a specific length conversion tool
  if (toolSlug.includes("-to-") && (toolSlug.includes("inches") || toolSlug.includes("meters") || toolSlug.includes("feet") || toolSlug.includes("miles") || toolSlug.includes("yards") || toolSlug.includes("millimeter") || toolSlug.includes("centimeter") || toolSlug.includes("kilometer"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
    const fromUnit = formatName(parts[0]);
    const toUnit = formatName(parts[1]);
    
    // Attempt to generate a reference table if we know the conversion factor
    let tableHtml = "";
    let formulaHtml = "";
    if (lengthFactors[fromUnit] && lengthFactors[toUnit]) {
      const ratio = lengthFactors[fromUnit] / lengthFactors[toUnit];
      // Format number to avoid crazy decimals for simple things
      const formatNum = (num: number) => Number.isInteger(num) ? num.toString() : num.toPrecision(6).replace(/\.?0+$/, '');
      
      formulaHtml = `
      <div class="bg-muted p-4 rounded-lg my-4 border border-border">
        <h3 class="text-lg font-semibold mt-0 mb-2">The Formula</h3>
        <p class="mb-0">To convert ${fromUnit} to ${toUnit}, you multiply the value by <strong>${formatNum(ratio)}</strong>.</p>
        <code class="block mt-2 bg-background p-2 rounded">${toUnit} = ${fromUnit} × ${formatNum(ratio)}</code>
      </div>`;

      tableHtml = `
      <h3 class="mt-8 mb-4">${fromUnit} to ${toUnit} Conversion Chart</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr>
              <th class="border-b border-border py-2 px-4 font-semibold">${fromUnit}</th>
              <th class="border-b border-border py-2 px-4 font-semibold">${toUnit}</th>
            </tr>
          </thead>
          <tbody>
            ${[1, 2, 3, 4, 5, 10, 20, 50, 100].map(val => `
            <tr class="hover:bg-muted/50 transition-colors">
              <td class="border-b border-border py-2 px-4">${val}</td>
              <td class="border-b border-border py-2 px-4">${formatNum(val * ratio)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
    }

    return [
      {
        title: `How to convert ${fromUnit} to ${toUnit}`,
        content: `<p>Converting ${fromUnit} to ${toUnit} doesn't have to be a headache. Just type the number of ${fromUnit} into the box above, and you'll instantly see the exact equivalent in ${toUnit}. There's no submit button to press—the math happens right as you type.</p>
        ${formulaHtml}`
      },
      {
        title: "Quick Reference",
        content: `<p>If you don't want to use the calculator every time, here are the most common conversions for you to quickly reference or copy.</p>
        ${tableHtml}`
      },
      {
        title: "Why use this tool?",
        content: `<ul>
          <li><strong>It's incredibly fast:</strong> The calculation happens on your own device the millisecond you press a key.</li>
          <li><strong>It's completely free:</strong> No paywalls, no limits, and no hidden fees.</li>
          <li><strong>Total privacy:</strong> Since everything runs in your web browser, nothing you type is ever sent to a server.</li>
          <li><strong>Highly accurate:</strong> We handle the heavy decimal math behind the scenes to give you precision you can trust.</li>
        </ul>`
      }
    ];
  }

  
  // Check if it's a font conversion tool
  if (toolSlug.includes("-to-") && (toolSlug.includes("unicode") || toolSlug.includes("krutidev") || toolSlug.includes("chanakya") || toolSlug.includes("anmollipi") || toolSlug.includes("asees") || toolSlug.includes("devlys") || toolSlug.includes("shusha") || toolSlug.includes("aps") || toolSlug.includes("shreelipi") || toolSlug.includes("joy") || toolSlug.includes("gurbanilipi"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
    const fromFont = formatName(parts[0]);
    const toFont = formatName(parts[1]);
    
    return [
      {
        title: `What is ${fromFont === 'Unicode' ? toFont : fromFont}?`,
        content: `<p>${fromFont === 'Unicode' ? toFont : fromFont} is a widely used font for typing in Indic scripts (like Hindi or Punjabi). While older legacy fonts map characters to specific keyboard keys without a standard encoding, Unicode is the modern global standard where every character has a unique, universally recognized code. This converter helps you bridge the gap between legacy systems and modern Unicode-compliant software.</p>`
      },
      {
        title: `How do I convert ${fromFont} to ${toFont}?`,
        content: `<p>Converting ${fromFont} to ${toFont} is fast and seamless. Simply paste your text into the input box on this page, and our advanced client-side script will instantly convert it to ${toFont} without requiring you to click any buttons. You can then copy the result, or download it as a text or document file.</p>`
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What is the difference between Unicode and Kruti Dev?</strong><br>A: Kruti Dev is a legacy Hindi font that uses custom key mappings based on the Remington typewriter layout. When you type in Kruti Dev without the font installed, it looks like random English gibberish. Unicode, on the other hand, is a universal standard. Unicode text will render perfectly as Hindi on any modern device (phones, tablets, PCs) without needing to install specific fonts.</p>
          <p><strong>Q: How can I convert Kruti Dev to Unicode online?</strong><br>A: You can easily convert it using ConverterForAll. Just paste your Kruti Dev text into the input box, and our real-time, highly accurate engine will instantly translate it into perfect Unicode Hindi text directly in your browser.</p>
          <p><strong>Q: How do I convert AnmolLipi to Unicode?</strong><br>A: Navigate to our AnmolLipi to Unicode tool, paste your Punjabi text written in AnmolLipi, and the tool will automatically handle all the complex matra (vowel) positioning to output flawless Unicode Gurmukhi text.</p>
          <p><strong>Q: Which Hindi font is best for government work?</strong><br>A: While legacy fonts like Kruti Dev and DevLys are still heavily used in older Indian government offices for typing tests and documents, the official mandate is shifting towards Unicode (like Mangal font) due to its universal compatibility across the internet and modern databases.</p>
          <p><strong>Q: How do I type Punjabi in Unicode?</strong><br>A: You can type Punjabi in Unicode by installing an Indic keyboard on your device (like Google Indic Keyboard or Raavi layout on Windows), or you can type using familiar legacy fonts like AnmolLipi and use our converter to seamlessly translate it into Unicode.</p>
          <p><strong>Q: Why is my Hindi text showing strange characters?</strong><br>A: If your Hindi text looks like random English letters or strange symbols (e.g., 'fgunh Hkk"kk'), it is likely typed in a legacy font like Kruti Dev or Chanakya, but your device is displaying it with a standard English font. Using our converter will instantly fix this by translating it to Unicode.</p>
          <p><strong>Q: How can I identify an unknown Hindi font?</strong><br>A: You can try pasting the text into our various converters (Kruti Dev, Chanakya, DevLys) to see which one produces readable Hindi output. Since many legacy fonts share similar layouts (like Kruti Dev and DevLys), they often convert interchangeably.</p>
          <p><strong>Q: What is the best Punjabi font converter online?</strong><br>A: ConverterForAll is widely considered the best because it utilizes a highly sophisticated parsing engine that correctly shifts half-characters and vowel modifiers, ensuring 100% accurate conversion for AnmolLipi, Asees, Joy, and GurbaniLipi without any server uploads.</p>
          <p><strong>Q: Can I convert legacy fonts without installing software?</strong><br>A: Yes! Our tools run completely in your web browser. You do not need to download or install any third-party software, plugins, or extensions.</p>
          <p><strong>Q: Which font is compatible with Microsoft Word and Google Docs?</strong><br>A: Unicode is the ultimate standard for modern word processors like Google Docs, Microsoft Word, and Apple Pages. While you can install legacy fonts on desktop Word, Google Docs strictly requires Unicode for proper rendering across devices.</p>
          <p><strong>Q: Is Unicode supported on Android and iPhone?</strong><br>A: Yes, absolutely. Unicode is built into the operating system of all modern Android and iOS devices. You can read, write, and share Unicode Hindi and Punjabi text seamlessly on WhatsApp, Facebook, and standard messaging apps.</p>
          <p><strong>Q: How do I convert old DTP files to Unicode?</strong><br>A: Simply open your old DTP (Desktop Publishing) files in their original software (like PageMaker or older CorelDraw), copy the text, paste it into our respective font converter, and copy the resulting Unicode text into your new modern software.</p>
          <p><strong>Q: Why is Unicode better than legacy fonts?</strong><br>A: Unicode is universally compatible. Legacy fonts require the reader to have the exact same font installed on their computer to read the document. Unicode text looks correct everywhere—on the web, in emails, and on mobile phones.</p>
          <p><strong>Q: Can I convert fonts offline?</strong><br>A: Yes! Our font converters utilize client-side JavaScript. Once you load the webpage, you can disconnect your internet and continue converting text securely and instantly offline.</p>
          <p><strong>Q: Is my converted text safe and private?</strong><br>A: 100% safe. Your text is processed strictly within your own browser's memory. We do not transmit, save, or store any of your typed or pasted text on our servers.</p>
        `
      }
    ];
  }


  if (toolContent[toolSlug]) {
    return toolContent[toolSlug].sections;
  }
  
  return [
    {
      title: "What is this tool?",
      content: `<p>${toolDescription} We built this tool to be the easiest, fastest way to get your file processed right in your web browser. There's no confusing software to download or tricky settings to figure out.</p><p>Whether you're fixing a file for work or just trying to get a quick task done, this ${toolTitle} tool gives you exactly what you need without the usual hassle.</p>`
    },
    {
      title: "How it works",
      content: "<p>Most websites make you upload your private files to their remote servers, make you wait in a queue, and then force you to download the result. We do things differently.</p><p>When you drop a file onto this page, all the hard work happens entirely inside your own browser using your device's processing power. This means it's usually instant, and more importantly, it means <strong>your files never leave your computer</strong>. Nobody else can see them, and they are never stored anywhere on the internet.</p>"
    },
    {
      title: "How to use it",
      content: "<ol><li><strong>Pick your file:</strong> Drag and drop your file into the box above, or click to browse your computer or phone.</li><li><strong>Let it run:</strong> The tool will figure out the format and start processing immediately.</li><li><strong>Save it:</strong> Since everything happened locally, your new file is ready to go. Just hit the download button to save it!</li></ol>"
    },
    {
      title: "Common Questions",
      content: "<p><strong>Do I have to pay to use this?</strong><br>Nope! We keep this utility completely free. We just run a few non-annoying ads to keep the lights on.</p><p><strong>Do I need to sign up?</strong><br>No accounts, no emails, no passwords. Just drop your file and go.</p><p><strong>Are you saving my files?</strong><br>Never. Because the tool runs directly on your device using web technologies, we physically cannot see or save your files.</p>"
    }
  ];
}
