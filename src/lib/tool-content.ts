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
        content: "<p>When you select a Word document, our tool reads the document layout and text directly in your web browser. It extracts the headings, paragraphs, lists, and basic styling, then generates a standard PDF file directly on your computer or phone. For supported files, this means your document is processed locally without needing to wait for server uploads.</p>"
      },
      {
        title: "Examples",
        content: "<p>Consider a job applicant who formatted a resume in Word. If they email the raw .docx file, a recruiter opening it on a phone or older computer might see shifted margins and missing fonts. Converting the Word file to a PDF locks the layout in place so the recipient sees the exact same document on any screen.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Word document:</strong> Drag your .docx file into the box or click to browse your files.</li><li><strong>Automatic Conversion:</strong> The tool reads the layout and text directly.</li><li><strong>Download your PDF:</strong> Click the download button to save your new PDF file immediately.</li></ol>"
      },
      {
        title: "Common mistakes",
        content: "<p>When converting Word documents in the browser, keep these tips in mind: <strong>Custom Fonts:</strong> If your document uses an unusual custom font that isn't installed on your system, the browser will substitute a standard font. <strong>Macros:</strong> Interactive VBA macros are stripped out for safety. <strong>Complex Tables:</strong> Very intricate multi-column layouts with floating graphics might occasionally wrap slightly differently in the generated PDF.</p>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Resumes &amp; Portfolios:</strong> Sending applications that look clean and identical on any recruiter's screen.</li><li><strong>Invoices &amp; Contracts:</strong> Sharing finalized business documents that cannot be accidentally edited.</li><li><strong>Easy Printing:</strong> Creating print-ready files that commercial printers can reproduce without font errors.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are my confidential documents kept private?</strong><br>A: Yes. For supported browser tools, your file is processed in your device's local memory and is not uploaded to our servers.</p>
          <p><strong>Q: Does it support older .doc files?</strong><br>A: The tool is optimized for modern .docx files. For older .doc binary files, opening them in Word and saving as .docx first gives the best results.</p>
          <p><strong>Q: Will links in my Word document work in the PDF?</strong><br>A: Yes, standard web hyperlinks remain clickable in the final PDF.</p>
          <p><strong>Q: Will embedded images and charts convert?</strong><br>A: Yes, images, charts, and diagrams included in the Word document are rendered into the PDF.</p>
          <p><strong>Q: Do I need Microsoft Word installed on my computer?</strong><br>A: No. The converter runs directly in your web browser, so you don't need Microsoft Office or any paid software installed.</p>
          <p><strong>Q: Does this converter cost money?</strong><br>A: No, our Word to PDF converter is free with no watermarks or daily limits.</p>
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
        content: `<p>${fromFont === 'Unicode' ? toFont : fromFont} is a font commonly used for typing in Indic languages like Hindi or Punjabi. Older legacy fonts mapped characters to specific keyboard keys without a universal standard. Unicode gives every letter a unique, recognized code so your text displays properly on modern devices and websites.</p>`
      },
      {
        title: `How do I convert ${fromFont} to ${toFont}?`,
        content: `<p>Converting ${fromFont} to ${toFont} is straightforward. Just paste your text into the box above, and the tool converts it to ${toFont} right away. You can copy the result or download it as a document file.</p>`
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What is the difference between Unicode and Kruti Dev?</strong><br>A: Kruti Dev is an older Hindi font based on typewriter key layouts. If someone opens Kruti Dev text without the font installed, it looks like random English letters. Unicode is the modern standard that displays correctly as Hindi on any smartphone, tablet, or computer.</p>
          <p><strong>Q: How can I convert Kruti Dev to Unicode online?</strong><br>A: Paste your Kruti Dev text into the box above, and our tool converts it to readable Unicode Hindi directly in your browser.</p>
          <p><strong>Q: How do I convert AnmolLipi to Unicode?</strong><br>A: Paste your Punjabi text written in AnmolLipi into the tool. It automatically adjusts vowel positioning (matras) to output readable Unicode Punjabi (Gurmukhi) text.</p>
          <p><strong>Q: Which Hindi font is used for official work?</strong><br>A: While legacy fonts like Kruti Dev and DevLys were common in older offices, government portals and modern websites now use Unicode (like Mangal font) for compatibility across devices.</p>
          <p><strong>Q: How do I type Punjabi in Unicode?</strong><br>A: You can use an Indic keyboard (like Google Indic Keyboard or the Punjabi layout on Windows), or type using familiar fonts like AnmolLipi and use our converter to translate it into Unicode.</p>
          <p><strong>Q: Why is my Hindi text showing as English letters?</strong><br>A: If your Hindi looks like random English characters (such as 'fgunh Hkk"kk'), it was typed in a legacy font like Kruti Dev, but your computer is viewing it with a standard English font. Pasting it into our converter translates it to Unicode so it reads properly.</p>
          <p><strong>Q: How can I identify an unknown Hindi font?</strong><br>A: Try pasting the text into our converters (Kruti Dev, Chanakya, or DevLys) to see which one produces readable Hindi output.</p>
          <p><strong>Q: How does this Punjabi font converter handle complex characters?</strong><br>A: ConverterForAll properly shifts half-characters and vowel modifiers so your text converts cleanly to Unicode without uploading your text to a remote server.</p>
          <p><strong>Q: Can I convert fonts without installing software?</strong><br>A: Yes. The tool runs directly in your web browser, so you don't need to install any software or extensions.</p>
          <p><strong>Q: Which font works in Google Docs and Microsoft Word?</strong><br>A: Unicode works across Google Docs, Word, and mobile apps without needing special fonts installed.</p>
          <p><strong>Q: Is Unicode supported on Android and iPhone?</strong><br>A: Yes. All modern phones support Unicode out of the box for WhatsApp, email, and web browsing.</p>
          <p><strong>Q: Is my converted text private?</strong><br>A: Yes. Your text is converted in your browser's local memory and is not stored or saved on any servers.</p>
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
      content: `<p>${toolDescription} We built this tool to make everyday file tasks simple right in your web browser. No software to install and no complicated settings to figure out.</p>`
    },
    {
      title: "How it works",
      content: "<p>When you choose a file, supported tools process your document directly inside your browser using your device's memory. This means your files don't need to be uploaded to an external server just to be converted or compressed.</p>"
    },
    {
      title: "How to use it",
      content: "<ol><li><strong>Select your file:</strong> Drag and drop your file into the box above, or click to browse your device.</li><li><strong>Process:</strong> The tool runs the conversion or compression directly.</li><li><strong>Download:</strong> Click the download button to save your file.</li></ol>"
    },
    {
      title: "Common Questions",
      content: "<p><strong>Do I have to pay to use this?</strong><br>Nope! We keep this utility completely free. We just run a few non-annoying ads to keep the lights on.</p><p><strong>Do I need to sign up?</strong><br>No accounts, no emails, no passwords. Just drop your file and go.</p><p><strong>Are you saving my files?</strong><br>Never. Because the tool runs directly on your device using web technologies, we physically cannot see or save your files.</p>"
    }
  ];
}
