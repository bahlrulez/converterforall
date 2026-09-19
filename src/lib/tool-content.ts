import { imageToolsContent } from "./content/image-tools";
import { pdfOrganizeContent } from "./content/pdf-organize";
import { pdfOptimizeContent } from "./content/pdf-optimize";
import { pdfConvertContent } from "./content/pdf-convert";
import { videoToolsContent } from "./content/video-tools";
import { utilitiesToolsContent } from "./content/utilities-tools";
import { fontToolsContent } from "./content/font-tools";
import { audioToolsContent } from "./content/audio-tools";

export const toolContent: Record<string, { sections: { title: string, content: string }[] }> = {
  ...imageToolsContent,
  ...pdfOrganizeContent,
  ...pdfOptimizeContent,
  ...pdfConvertContent,
  ...videoToolsContent,
  ...utilitiesToolsContent,
  ...fontToolsContent,
  ...audioToolsContent,
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


function enrichContentIfShort(
  sections: { title: string; content: string }[],
  toolSlug: string,
  toolTitle: string
): { title: string; content: string }[] {
  const totalWords = sections
    .map((s) => (s.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);

  if (totalWords >= 300) {
    return sections;
  }

  const enriched = [...sections];

  if (totalWords < 200) {
    enriched.push({
      title: "Step-by-step usage guide",
      content: `
        <ol>
          <li><strong>Select or paste your input:</strong> Drag your file into the upload zone or paste your text into the editor above.</li>
          <li><strong>Instant client-side processing:</strong> The tool converts or compresses your data directly inside your browser memory with zero server wait times.</li>
          <li><strong>Download or copy result:</strong> Save your finalized file or copy the text output straight to your device with 1 click.</li>
        </ol>
      `
    });
  }

  let extraFaq = "";
  let tipsTitle = "Tips for best results";
  let tipsContent = "";

  if (toolSlug.includes("woff") || toolSlug.includes("ttf") || toolSlug.includes("otf")) {
    tipsTitle = "Web font optimization & @font-face tips";
    tipsContent = `
      <p>Converting desktop font files (TTF/OTF) into modern web fonts (WOFF2) is one of the most effective ways to speed up website load times:</p>
      <ul>
        <li><strong>Brotli compression:</strong> WOFF2 uses built-in Brotli compression algorithms to achieve 30% to 50% smaller file sizes than standard TrueType (TTF) or OpenType (OTF) fonts.</li>
        <li><strong>Browser compatibility:</strong> All modern browsers (Chrome, Edge, Safari, Firefox) natively support WOFF2. Keep a TTF fallback only if supporting legacy browsers.</li>
        <li><strong>CSS Implementation:</strong> Define your converted font using the standard <code>@font-face</code> CSS rule with <code>font-display: swap;</code> to prevent layout shifts.</li>
        <li><strong>Client-side security:</strong> Your font files are converted directly in your browser using WebAssembly. Proprietary brand fonts are never uploaded to third-party servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why is WOFF2 better for websites than TTF or OTF?</strong><br>A: WOFF2 files are significantly smaller, reducing page download times and preventing invisible text flashes (FOIT) on mobile networks.</p>
      <p><strong>Q: Can I convert commercial fonts safely?</strong><br>A: Yes. Because processing occurs entirely in your browser's local memory, your font files are never stored or shared.</p>
      <p><strong>Q: How do I load the converted WOFF2 file in CSS?</strong><br>A: Use <code>@font-face { font-family: 'MyFont'; src: url('myfont.woff2') format('woff2'); font-display: swap; }</code>.</p>
    `;
  } else if (toolSlug.includes("pdf") || toolSlug.includes("page") || toolSlug.includes("metadata") || toolSlug.includes("document") || toolSlug.includes("word") || toolSlug.includes("powerpoint") || toolSlug.includes("excel")) {
    tipsTitle = "Document best practices & privacy notes";
    tipsContent = `
      <p>When working with official documents, contracts, resumes, or financial filings, keeping layouts intact and files private is essential:</p>
      <ul>
        <li><strong>Keep backups:</strong> Always retain a copy of your original document before removing pages, scrubbing metadata, or compressing.</li>
        <li><strong>Page orientation:</strong> If any pages were scanned sideways, rotate them to standard portrait before emailing or submitting.</li>
        <li><strong>Font preservation:</strong> In-browser PDF processing preserves embedded vector fonts so headings and text stay crisp at any zoom level.</li>
        <li><strong>On-device privacy:</strong> Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will modifying or converting pages degrade document quality?</strong><br>A: No. Operations like extracting, removing, or reordering pages update the document index without re-compressing existing text layers or high-resolution images.</p>
      <p><strong>Q: Can I process large PDF files on my phone?</strong><br>A: Yes. Because processing occurs locally in your browser's memory, documents up to 50MB–100MB process smoothly on modern smartphones and laptops.</p>
      <p><strong>Q: Are my confidential files stored on remote servers?</strong><br>A: No. Operations execute in temporary local memory with zero permanent server storage.</p>
    `;
  } else if (toolSlug.includes("video") || toolSlug.includes("mp4") || toolSlug.includes("mov") || toolSlug.includes("mkv") || toolSlug.includes("avi") || toolSlug.includes("webm") || toolSlug.includes("flv") || toolSlug.includes("wmv")) {
    tipsTitle = "Video compression & playback tips";
    tipsContent = `
      <p>To achieve the best balance between smaller file size and clear playback:</p>
      <ul>
        <li><strong>Universal compatibility:</strong> MP4 format with H.264 video and AAC audio plays reliably across all iPhones, Android devices, PCs, smart TVs, and web browsers.</li>
        <li><strong>Target resolution:</strong> For messaging apps like WhatsApp or Discord, 720p or 1080p looks sharp while saving gigabytes of storage.</li>
        <li><strong>Local processing:</strong> Video conversion runs directly on your hardware without waiting in cloud queues.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Will my audio stay in sync after conversion or compression?</strong><br>A: Yes. The tool preserves original audio frame timestamps to ensure speech and video remain perfectly aligned.</p>
      <p><strong>Q: Does this tool add any watermark?</strong><br>A: No. All videos exported by ConverterForAll are completely clean and watermark-free.</p>
      <p><strong>Q: Are my personal videos uploaded to a cloud server?</strong><br>A: Most of our tools run directly inside your browser so your documents stay on your device.</p>
    `;
  } else if (toolSlug.includes("image") || toolSlug.includes("jpg") || toolSlug.includes("png") || toolSlug.includes("webp") || toolSlug.includes("svg") || toolSlug.includes("heic") || toolSlug.includes("avif") || toolSlug.includes("compress")) {
    tipsTitle = "Image quality & formatting recommendations";
    tipsContent = `
      <p>To ensure your images look sharp across websites, mobile apps, and official forms:</p>
      <ul>
        <li><strong>Transparency:</strong> If your design requires a transparent background, use PNG or SVG. Converting to JPG will replace transparency with solid white.</li>
        <li><strong>Meeting upload size limits:</strong> If an application or job portal requires an image under 100KB or 200KB, use our compression tools to hit the exact target file size without visible blurriness.</li>
        <li><strong>Private processing:</strong> Photos are decoded and rendered directly in your browser without cloud uploads.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Does compressing an image blur fine details?</strong><br>A: Our compression algorithms target redundant color data while keeping edges and text clear and sharp.</p>
      <p><strong>Q: Are my personal photos kept private?</strong><br>A: Yes. Most of our tools run directly inside your browser so your documents stay on your device.</p>
    `;
  } else if (toolSlug.includes("audio") || toolSlug.includes("voice") || toolSlug.includes("mp3") || toolSlug.includes("wav") || toolSlug.includes("ogg")) {
    tipsTitle = "Audio optimization & voice note playback tips";
    tipsContent = `
      <p>When sharing voice notes or converting audio tracks between formats:</p>
      <ul>
        <li><strong>Voice note compatibility:</strong> Messaging apps like WhatsApp record audio using Opus codecs inside .ogg or .opus containers, which often fail to play on older car stereos or video editing tools. Converting to MP3 ensures universal playback.</li>
        <li><strong>Bitrate vs Clarity:</strong> For spoken voice notes and podcasts, 128 kbps to 192 kbps offers crystal-clear vocal clarity while keeping file sizes lightweight.</li>
        <li><strong>Device privacy:</strong> Audio decoding and re-encoding run directly in your browser's local memory without uploading to cloud servers.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why won't my WhatsApp voice note play in my video editor or music player?</strong><br>A: WhatsApp voice notes use the Opus codec inside an OGG container, which many native media players do not support. Converting to MP3 resolves compatibility immediately.</p>
      <p><strong>Q: Are my voice recordings kept private?</strong><br>A: Yes. Your audio files are processed locally on your device and are never uploaded or saved on our servers.</p>
    `;
  } else if (toolSlug.includes("font") || toolSlug.includes("unicode") || toolSlug.includes("kruti") || toolSlug.includes("preeti") || toolSlug.includes("bijoy") || toolSlug.includes("zawgyi") || toolSlug.includes("inpage") || toolSlug.includes("anmol") || toolSlug.includes("asees")) {
    tipsTitle = "Typing & font conversion recommendations";
    tipsContent = `
      <p>Practical advice when working with regional Indian, Nepali, Bengali, and Burmese fonts:</p>
      <ul>
        <li><strong>Verify in Word:</strong> After converting legacy text (such as Kruti Dev, Preeti, Bijoy, or Zawgyi) to standard Unicode, paste it into MS Word or Google Docs to verify that all vowel matras and conjuncts display accurately.</li>
        <li><strong>Official Exams &amp; Portals:</strong> Modern government portals, court typist tests, and educational boards strictly mandate Unicode. Use this converter to standardize your typing.</li>
        <li><strong>WhatsApp &amp; Mobile:</strong> Unicode text displays correctly on all smartphones without installing custom font files.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Why does my converted text look different in older software?</strong><br>A: Software created before 2005 often lacks modern Unicode rendering engines. Modern browsers, smartphones, and word processors display Unicode accurately.</p>
      <p><strong>Q: Is my typed text uploaded or logged?</strong><br>A: No. All text conversions run in your browser's memory without any network transmission.</p>
    `;
  } else {
    tipsTitle = "Helpful tips for using this tool";
    tipsContent = `
      <p>To get the best results from this utility:</p>
      <ul>
        <li><strong>No software required:</strong> Runs directly inside any modern web browser on Windows, Mac, Linux, iOS, and Android.</li>
        <li><strong>Completely free:</strong> No subscriptions, credit cards, or hidden limits.</li>
        <li><strong>Private processing:</strong> Most of our tools run directly inside your browser so your documents stay on your device.</li>
      </ul>
    `;
    extraFaq = `
      <p><strong>Q: Do I need an account to use this utility?</strong><br>A: No. All tools on ConverterForAll are free with no sign-up or email required.</p>
      <p><strong>Q: Can I use this tool on a smartphone?</strong><br>A: Yes. The interface is fully responsive and works smoothly across mobile browsers.</p>
    `;
  }

  enriched.push({
    title: tipsTitle,
    content: tipsContent
  });

  const faqIndex = enriched.findIndex(s => s.title.toLowerCase().includes("faq") || s.title.toLowerCase().includes("question"));
  if (faqIndex !== -1) {
    enriched[faqIndex] = {
      ...enriched[faqIndex],
      content: enriched[faqIndex].content + extraFaq
    };
  } else {
    enriched.push({
      title: "Frequently Asked Questions",
      content: extraFaq
    });
  }

  return enriched;
}

// Fallback generator for tools that haven't been manually written yet
export function getToolContent(toolSlug: string, toolTitle: string, toolDescription: string) {
  // If manual content exists, enrich if short and return
  if (toolContent[toolSlug]) {
    return enrichContentIfShort(toolContent[toolSlug].sections, toolSlug, toolTitle);
  }

  // 1. Length & Measurement Unit Conversion Tools
  if (toolSlug.includes("-to-") && (toolSlug.includes("inches") || toolSlug.includes("meters") || toolSlug.includes("feet") || toolSlug.includes("miles") || toolSlug.includes("yards") || toolSlug.includes("millimeter") || toolSlug.includes("centimeter") || toolSlug.includes("kilometer") || toolSlug.includes("furlong") || toolSlug.includes("chain") || toolSlug.includes("rod") || toolSlug.includes("league") || toolSlug.includes("parsec"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromUnit = formatName(parts[0]);
    const toUnit = formatName(parts[1]);
    
    let tableHtml = "";
    let formulaHtml = "";
    if (lengthFactors[fromUnit] && lengthFactors[toUnit]) {
      const ratio = lengthFactors[fromUnit] / lengthFactors[toUnit];
      const formatNum = (num: number) => Number.isInteger(num) ? num.toString() : num.toPrecision(6).replace(/\.?0+$/, '');
      
      formulaHtml = `
      <div class="bg-muted p-4 rounded-xl my-4 border border-border">
        <h3 class="text-base font-bold mt-0 mb-2">The Exact Conversion Formula</h3>
        <p class="mb-2 text-sm text-muted-foreground">To convert ${fromUnit} to ${toUnit}, multiply your starting value by <strong>${formatNum(ratio)}</strong>:</p>
        <code class="block bg-background p-2.5 rounded-lg text-sm font-mono border border-border">${toUnit} = ${fromUnit} × ${formatNum(ratio)}</code>
      </div>`;

      tableHtml = `
      <h3 class="text-lg font-bold mt-6 mb-3">${fromUnit} to ${toUnit} Quick Reference Chart</h3>
      <div class="overflow-x-auto my-3">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-muted/60">
              <th class="border-b border-border py-2.5 px-4 font-semibold">${fromUnit}</th>
              <th class="border-b border-border py-2.5 px-4 font-semibold">${toUnit}</th>
            </tr>
          </thead>
          <tbody>
            ${[1, 2, 5, 10, 20, 50, 100, 250, 500, 1000].map(val => `
            <tr class="hover:bg-muted/40 transition-colors border-b border-border/60">
              <td class="py-2 px-4 font-medium">${val}</td>
              <td class="py-2 px-4">${formatNum(val * ratio)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
    }

    return [
      {
        title: `How to convert ${fromUnit} to ${toUnit}`,
        content: `
          <p>Converting between ${fromUnit} and ${toUnit} is an everyday task in home improvement, carpentry, architectural drafting, 3D printing, travel planning, and school projects. Because different countries and industries alternate between Imperial and Metric standards, keeping track of precise decimal conversion factors in your head can easily lead to rounding errors.</p>
          <p>This calculator handles the mathematical conversion directly in your browser. As you type a number into the input field above, the converted value updates instantly without requiring a page refresh or submitting data to a remote server.</p>
          ${formulaHtml}
        `
      },
      {
        title: "Everyday situations where this conversion matters",
        content: `
          <ul>
            <li><strong>DIY and Home Renovations:</strong> Measuring furniture dimensions, lumber sizes, curtains, or flooring spaces where product packaging lists measurements in ${fromUnit} while your tape measure uses ${toUnit}.</li>
            <li><strong>Online Shopping and Sizing:</strong> Checking clothing size charts, shoe lengths, or tech accessories sold by international retailers.</li>
            <li><strong>Architecture and Blueprints:</strong> Reviewing building plans, engineering schematics, or CAD files formatted in alternative measurement units.</li>
            <li><strong>Science and Education:</strong> Solving physics, geometry, or geography homework problems requiring precise metric or customary conversions.</li>
          </ul>
        `
      },
      {
        title: "Step-by-step conversion instructions",
        content: `
          <ol>
            <li><strong>Enter your number:</strong> Type the value in ${fromUnit} you want to convert into the input box above.</li>
            <li><strong>Instant Calculation:</strong> The calculator multiplies the value by the standard conversion factor on your device.</li>
            <li><strong>Copy or Note:</strong> Use the one-click copy button to copy the exact answer with full decimal precision.</li>
          </ol>
          ${tableHtml}
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is this ${fromUnit} to ${toUnit} calculation exact?</strong><br>A: Yes. The tool uses standard international measurement definitions (such as 1 inch = exactly 25.4 mm or 1 yard = 0.9144 m) without cutting corners on decimal precision.</p>
          <p><strong>Q: Does this converter run on my device or on a server?</strong><br>A: Most of our tools run directly inside your browser so your documents stay on your device. The mathematical calculation executes entirely within your browser's JavaScript engine.</p>
          <p><strong>Q: Can I convert decimal or fractional numbers?</strong><br>A: Yes. You can type any positive or negative decimal value (e.g., 3.75 or 0.125) into the input box for an immediate calculation.</p>
          <p><strong>Q: Why do different countries use different measurement systems?</strong><br>A: The United States, Liberia, and Myanmar primarily use customary units (inches, feet, miles), while the rest of the world relies on the metric International System of Units (millimeters, meters, kilometers) established for easier base-10 arithmetic.</p>
          <p><strong>Q: Does this tool store or log what I type?</strong><br>A: No. No search terms, numbers, or calculations are logged, stored, or sent across the network.</p>
        `
      }
    ];
  }

  // 2. Regional Indic & Asian Font Conversion Tools
  if (toolSlug.includes("-to-") && (toolSlug.includes("unicode") || toolSlug.includes("krutidev") || toolSlug.includes("chanakya") || toolSlug.includes("anmollipi") || toolSlug.includes("asees") || toolSlug.includes("devlys") || toolSlug.includes("shusha") || toolSlug.includes("aps") || toolSlug.includes("shreelipi") || toolSlug.includes("joy") || toolSlug.includes("gurbanilipi") || toolSlug.includes("preeti") || toolSlug.includes("bijoy") || toolSlug.includes("inpage") || toolSlug.includes("zawgyi"))) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromFont = formatName(parts[0]);
    const toFont = formatName(parts[1]);

    return [
      {
        title: `Why convert between ${fromFont} and ${toFont}?`,
        content: `
          <p>Before Unicode became the global standard for digital computing, Indian and South Asian languages were typed using legacy font mapping systems. In fonts like ${fromFont}, regional characters were mapped directly onto standard English QWERTY keyboard keystrokes. For example, typing a Hindi or Punjabi word in Microsoft Word required having the specific font file installed locally on that specific computer.</p>
          <p>When that same document is emailed, opened on a smartphone, or pasted into modern web browsers, WhatsApp, or government portals, the text often breaks into unreadable English letters or question marks. Converting from ${fromFont} to ${toFont} translates the underlying character codes into universal standards so your typing displays cleanly everywhere.</p>
        `
      },
      {
        title: "How legacy font conversion works",
        content: `
          <p>Converting between legacy fonts and modern Unicode is much more complex than simple letter replacement. In Indic scripts like Devanagari, Gurmukhi, and Bengali, vowel modifiers (matras) often appear to the left of the consonant in visual rendering, but must be stored after the consonant in standard Unicode memory order. Similarly, conjunct consonants (half letters) require specialized ligature substitution.</p>
          <p>Our converter applies dedicated lexical rules directly in your browser to accurately rearrange matras, half-characters, and conjuncts so your original spelling and grammar remain intact.</p>
        `
      },
      {
        title: "Step-by-step instructions for conversion",
        content: `
          <ol>
            <li><strong>Paste your text:</strong> Copy your text from Microsoft Word, PageMaker, InPage, or your document and paste it into the left input box above.</li>
            <li><strong>Automatic processing:</strong> The converter immediately parses the characters, reconstructs syllables and conjuncts, and generates the ${toFont} text.</li>
            <li><strong>Verify and Copy:</strong> Review the live preview in the output box and click the "Copy" button to paste it into your target application or government form.</li>
          </ol>
        `
      },
      {
        title: "Common issues and troubleshooting tips",
        content: `
          <ul>
            <li><strong>Text appears as English letters:</strong> If your text looks like random English characters (e.g., "fgunh Hkk"kk"), it was typed in a legacy font. Converting it to Unicode restores the proper regional script.</li>
            <li><strong>Question marks in Word:</strong> If your text displays as "???" in Word, the application is missing the underlying font. Use this converter to migrate the content to standard Unicode fonts like Mangal or Nirmala UI.</li>
            <li><strong>Official Government Exams:</strong> Portals for CPCT, SSC, High Court, and State Police typing tests strictly mandate Unicode Mangal font. Use our tools to prepare and convert your test practice typing.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my text uploaded to a remote server during conversion?</strong><br>A: Most of our tools run directly inside your browser so your documents stay on your device. Your typing is processed locally in temporary memory and is never transmitted or saved.</p>
          <p><strong>Q: Will formatting like bold, italics, or tables be preserved?</strong><br>A: Font conversion focuses on character codes. We recommend converting the plain text first and then applying your desired bold, italic, or heading styles in Word or Google Docs.</p>
          <p><strong>Q: Can I use the converted text on WhatsApp and mobile phones?</strong><br>A: Yes! Once converted to Unicode, the text will display correctly on all Android, iPhone, Mac, and Windows devices without needing any font installations.</p>
          <p><strong>Q: Is there any word limit or daily quota?</strong><br>A: No. You can convert short paragraphs or entire books with zero limits and no account required.</p>
          <p><strong>Q: Which font should I choose for official documentation?</strong><br>A: Modern government portals and publishing platforms recommend standard Unicode fonts like Mangal, Arial Unicode MS, or Nirmala UI.</p>
        `
      }
    ];
  }

  // 3. Video Conversion & Compression Tools
  if (toolSlug.includes("video") || toolSlug.includes("mp4") || toolSlug.includes("mov") || toolSlug.includes("avi") || toolSlug.includes("mkv") || toolSlug.includes("webm") || toolSlug.includes("flv") || toolSlug.includes("wmv")) {
    return [
      {
        title: `What is this video tool?`,
        content: `
          <p>${toolDescription} Digital video files come in dozens of containers and codec combinations. A video recorded on an iPhone (MOV) might not play on an older smart TV, while large camera recordings can be far too heavy to send over email, Discord, or WhatsApp.</p>
          <p>This tool solves playback and file size problems by converting or compressing video data directly in your browser. You get clean, universally playable videos without dealing with complicated command-line parameters or watermarks.</p>
        `
      },
      {
        title: "Understanding containers, codecs, and compression",
        content: `
          <p>A video file is like a digital box (the container, such as MP4 or MKV) holding video frames, audio tracks, and subtitles. The actual pictures inside are compressed using codecs like H.264, VP9, or AV1. When you need to share a clip on social media, using standard H.264 video with AAC audio inside an MP4 container guarantees playback across nearly every smartphone, browser, and media player.</p>
          <p>Our processing optimizes compression bitrates and resolutions so your video loses minimal visual fidelity while significantly reducing file size.</p>
        `
      },
      {
        title: "How to use this video utility",
        content: `
          <ol>
            <li><strong>Select your video:</strong> Drag and drop your video file into the box above, or click to browse files on your computer or phone.</li>
            <li><strong>Adjust settings (if desired):</strong> Choose your target format, resolution, or compression preset.</li>
            <li><strong>Process and Download:</strong> Start the processing and save your optimized video file directly to your storage.</li>
          </ol>
        `
      },
      {
        title: "Practical everyday use cases",
        content: `
          <ul>
            <li><strong>Messaging &amp; Chat Apps:</strong> Shrinking 4K phone clips down to under 25MB or 16MB for hassle-free sharing on WhatsApp, Discord, or Gmail.</li>
            <li><strong>Website Speed:</strong> Optimizing background website videos and product demos so web pages load quickly for visitors.</li>
            <li><strong>Device Storage:</strong> Freeing up gigabytes of storage on phones, laptops, and USB drives by compressing bulky screen captures and drone footage.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will compressing my video make it blurry?</strong><br>A: Our compression presets use adaptive rate control to preserve high visual clarity in important areas like faces and text while trimming redundant background data.</p>
          <p><strong>Q: Are my personal videos uploaded to a cloud server?</strong><br>A: Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.</p>
          <p><strong>Q: Is there any watermark added to my video?</strong><br>A: Never. All files produced by ConverterForAll are clean, watermark-free, and ready for school, work, or social media.</p>
          <p><strong>Q: Can I use this tool on a mobile browser?</strong><br>A: Yes, modern mobile browsers like Chrome on Android and Safari on iOS support these tools smoothly.</p>
        `
      }
    ];
  }

  // 4. Audio Tools (MP3, WAV, OGG, Audio Trimmer)
  if (toolSlug.includes("audio") || toolSlug.includes("mp3") || toolSlug.includes("wav") || toolSlug.includes("ogg") || toolSlug.includes("voice")) {
    return [
      {
        title: `Why convert or edit audio with this tool?`,
        content: `
          <p>${toolDescription} Audio recordings come from many sources—smartphones, voice memos, digital audio workstations, podcasts, and cameras. Uncompressed WAV files offer studio quality but can easily be hundreds of megabytes, making them difficult to share. Conversely, proprietary formats like WhatsApp voice notes or Apple M4A files sometimes fail to open in older car audio systems or video editors.</p>
          <p>This utility enables you to convert, trim, or re-encode your sound files with zero software installation and complete privacy.</p>
        `
      },
      {
        title: "Understanding audio bitrates and sample rates",
        content: `
          <p>Audio quality is determined by two main factors: bitrate (measured in kilobits per second) and sample rate (usually 44.1 kHz for music or 48 kHz for video audio). A standard 128 kbps or 192 kbps MP3 provides clear speech and music reproduction while keeping the file lightweight. Studio workflows requiring lossless preservation rely on uncompressed 16-bit or 24-bit WAV formats.</p>
        `
      },
      {
        title: "Step-by-step audio instructions",
        content: `
          <ol>
            <li><strong>Load your audio:</strong> Select your audio or video file from your device.</li>
            <li><strong>Configure output:</strong> Choose your preferred audio format or adjust trim boundaries if cutting a specific clip.</li>
            <li><strong>Export audio:</strong> Click download to receive your high-quality sound file immediately.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I extract audio from a video file?</strong><br>A: Yes! Tools like MP4 to MP3 read the audio stream directly from your video and save it as a standalone audio track.</p>
          <p><strong>Q: Are my voice memos and sound files kept private?</strong><br>A: Yes. Most of our tools run directly inside your browser so your documents stay on your device. Your sound files are processed locally on your hardware.</p>
          <p><strong>Q: What bitrate is used for converted MP3 files?</strong><br>A: We encode at standard 192 kbps to 320 kbps bitrates to ensure crisp, balanced sound without muffling highs or distorting bass.</p>
          <p><strong>Q: Do I need an account to download my converted audio?</strong><br>A: No account, email, or subscription is ever required.</p>
        `
      }
    ];
  }

  // 5. Image Tools (Compressors, Format Converters, Cropper, Resizer, SVG)
  if (toolSlug.includes("image") || toolSlug.includes("jpg") || toolSlug.includes("png") || toolSlug.includes("webp") || toolSlug.includes("heic") || toolSlug.includes("avif") || toolSlug.includes("gif") || toolSlug.includes("svg") || toolSlug.includes("compress")) {
    return [
      {
        title: `What does this image tool do?`,
        content: `
          <p>${toolDescription} High-resolution cameras, smartphones, and graphic software generate images in a wide range of formats—from modern space-saving WEBP and AVIF files to standard JPGs, transparent PNGs, and scalable SVGs. However, many job application portals, government upload forms, and email clients still enforce strict image format and file size limits (such as requiring JPGs under 200KB).</p>
          <p>This tool helps you adjust, convert, crop, or compress your images so they meet your exact requirements without sacrificing image sharpness.</p>
        `
      },
      {
        title: "How in-browser image processing works",
        content: `
          <p>Rather than sending your personal photos across the internet to an unknown server, our image tools utilize the HTML5 Canvas API and modern WebAssembly codecs directly in your browser. When you drop an image onto the page, your browser decodes the pixel grid into memory, performs the requested resizing, background removal, or format re-encoding, and produces the output file instantly.</p>
          <p>This ensures you never have to wait in an upload queue, and your private photos remain strictly on your own computer or phone.</p>
        `
      },
      {
        title: "Step-by-step image processing guide",
        content: `
          <ol>
            <li><strong>Select your picture:</strong> Drag your image into the drop zone or click to open your file picker.</li>
            <li><strong>Adjust options:</strong> Set your target dimensions, quality sliders, or cropping box if needed.</li>
            <li><strong>Save your image:</strong> Click the download button to save the converted, optimized image to your device.</li>
          </ol>
        `
      },
      {
        title: "Everyday situations where this tool helps",
        content: `
          <ul>
            <li><strong>Official Portals &amp; ID Photos:</strong> Fitting passport, visa, or exam admit card photos under strict upload size limits (e.g. 50KB or 100KB).</li>
            <li><strong>E-Commerce &amp; Product Listings:</strong> Preparing clean product photos for Shopify, Amazon, or Etsy with consistent dimensions.</li>
            <li><strong>Web Performance:</strong> Shrinking image file sizes so blog posts and portfolio pages load quickly for mobile visitors.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does compressing an image reduce its physical resolution?</strong><br>A: Not unless you choose to resize it. Visual compression works by trimming imperceptible color data while keeping pixel dimensions unchanged.</p>
          <p><strong>Q: Does PNG support transparent backgrounds?</strong><br>A: Yes. PNG supports an alpha channel for transparency. Converting to JPG will automatically replace transparent areas with a solid white background.</p>
          <p><strong>Q: Are my photos private and secure?</strong><br>A: Yes. Most of our tools run directly inside your browser so your documents stay on your device. We never store, copy, or transmit your images.</p>
          <p><strong>Q: Can I convert multiple images at once?</strong><br>A: Yes, batch processing is supported for our core image tools so you can process photos in bulk.</p>
        `
      }
    ];
  }

  // 6. PDF & Document Tools (Organize, Merge, Split, Rotate, Clean Metadata, Repair)
  if (toolSlug.includes("pdf") || toolSlug.includes("word") || toolSlug.includes("powerpoint") || toolSlug.includes("excel") || toolSlug.includes("pages") || toolSlug.includes("metadata")) {
    return [
      {
        title: `Why use this document tool?`,
        content: `
          <p>${toolDescription} PDF files are the global standard for contracts, academic papers, tax filings, and business proposals because they look identical across every computer and mobile operating system. However, editing, reorganizing, or cleaning PDFs often requires expensive subscription software.</p>
          <p>This utility gives you full control over your documents—allowing you to extract, rearrange, rotate, clean, or convert pages without costly licenses or complicated menus.</p>
        `
      },
      {
        title: "How document manipulation works safely in your browser",
        content: `
          <p>When working with confidential documents like signed agreements, bank statements, or medical records, privacy is non-negotiable. Our PDF tools leverage client-side PDF parsing engines directly in your browser. The tool inspects the document structure, modifies page trees, updates metadata dictionaries, and saves a brand-new PDF directly onto your storage drive.</p>
          <p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.</p>
        `
      },
      {
        title: "Step-by-step document guide",
        content: `
          <ol>
            <li><strong>Select your document:</strong> Drag and drop your PDF or document into the upload box.</li>
            <li><strong>Perform your changes:</strong> Select pages to remove, rotate upside-down scans, or configure output options.</li>
            <li><strong>Download the result:</strong> Save your newly organized or converted PDF file immediately.</li>
          </ol>
        `
      },
      {
        title: "Common practical uses",
        content: `
          <ul>
            <li><strong>Fixing Scanned Documents:</strong> Rotating pages that were scanned sideways or upside down before emailing them to clients.</li>
            <li><strong>Removing Confidential Pages:</strong> Stripping unnecessary appendices, private financial sheets, or blank pages before sharing.</li>
            <li><strong>Scrubbing Document Properties:</strong> Removing hidden metadata, author names, creation software history, and timestamps from public PDF files.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I process password-protected PDF files?</strong><br>A: If a PDF is protected with an owner password, enter the password when prompted to unlock it for organizing or conversion.</p>
          <p><strong>Q: Will hyperlinks and text remain selectable?</strong><br>A: Yes. Page manipulation operations preserve existing vector text, selectable paragraphs, and internal document bookmarks.</p>
          <p><strong>Q: Are my confidential contracts stored on any server?</strong><br>A: No. Your documents are processed in local browser memory and are never uploaded or retained.</p>
          <p><strong>Q: Are there any file size limits?</strong><br>A: Since processing runs in your browser, limits depend on your device's available memory. Most documents up to 100MB process smoothly.</p>
        `
      }
    ];
  }

  // 7. Developer, Data & Code Utilities (JWT, JSON, CSV, Base64, UUID, Timestamps)
  if (toolSlug.includes("jwt") || toolSlug.includes("json") || toolSlug.includes("csv") || toolSlug.includes("base64") || toolSlug.includes("uuid") || toolSlug.includes("timestamp")) {
    return [
      {
        title: `What is this developer utility?`,
        content: `
          <p>${toolDescription} In modern web development, data engineering, and system administration, engineers constantly handle encoded strings, serialization payloads, authentication tokens, and standardized timestamps. Pasting sensitive authentication tokens or database records into arbitrary online formatters exposes API secrets, user IDs, and proprietary data to third-party logs.</p>
          <p>This developer tool runs 100% locally in your web browser. No queries, tokens, or records are ever sent over the network.</p>
        `
      },
      {
        title: "Why client-side execution matters for security",
        content: `
          <p>When inspecting JSON Web Tokens (JWTs) or debugging Base64-encoded credentials, security best practices dictate that secrets must never leave your workstation. Because this tool executes entirely within your browser's sandboxed JavaScript runtime, you can safely parse tokens, format JSON data, and convert CSV datasets even while disconnected from the internet.</p>
        `
      },
      {
        title: "Step-by-step guide",
        content: `
          <ol>
            <li><strong>Paste your input:</strong> Paste your raw JSON, Base64 string, token, or timestamp into the editor.</li>
            <li><strong>Instant parsing:</strong> The tool formats, validates, or translates your data immediately with syntax highlighting.</li>
            <li><strong>Copy output:</strong> Click the copy button to copy the validated result straight to your clipboard.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool transmit my tokens or data to an external API?</strong><br>A: No. Zero network requests are made with your data. Processing happens exclusively in your browser.</p>
          <p><strong>Q: Can I use this tool offline?</strong><br>A: Yes! Once the page is loaded, the processing logic operates completely offline without internet connectivity.</p>
          <p><strong>Q: Does it validate syntax errors?</strong><br>A: Yes. If a payload contains malformed syntax, the tool highlights the exact error line and provides clear feedback.</p>
          <p><strong>Q: Is this tool free for commercial and enterprise developers?</strong><br>A: Yes. All utilities on ConverterForAll are free with no subscriptions or quotas.</p>
        `
      }
    ];
  }

  // 8. General & Utility Tools Fallback (Calculators, Generators, Cleaners)
  return [
    {
      title: `What is this tool?`,
      content: `
        <p>${toolDescription} We built this utility to solve everyday digital tasks directly inside your web browser. There is no software to install, no accounts to register, and no paywalls to navigate.</p>
        <p>Whether you need to compute values, clean up formatted text, or generate assets for a project, this utility provides reliable, instant results directly on your device.</p>
      `
    },
    {
      title: "How it works",
      content: `
        <p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download. This eliminates waiting in server queues and keeps your personal workflow private and efficient.</p>
      `
    },
    {
      title: "Step-by-step instructions",
      content: `
        <ol>
          <li><strong>Provide your input:</strong> Enter your values, text, or file into the tool above.</li>
          <li><strong>Immediate processing:</strong> The tool computes, formats, or converts your input automatically.</li>
          <li><strong>Copy or Download:</strong> Use the action button to copy the answer or download the output file to your device.</li>
        </ol>
      `
    },
    {
      title: "Frequently Asked Questions",
      content: `
        <p><strong>Q: Do I have to pay to use this tool?</strong><br>A: No. ConverterForAll utilities are completely free to use with no daily usage caps.</p>
        <p><strong>Q: Do I need to create an account?</strong><br>A: No. We believe basic everyday computer utilities should be open and accessible without forcing you to sign up, give away an email, or remember passwords.</p>
        <p><strong>Q: Are my inputs or files saved?</strong><br>A: Never. Most tools run locally on your device in your browser's memory, ensuring your data remains under your control.</p>
        <p><strong>Q: Does this tool work on mobile phones?</strong><br>A: Yes, all tools are responsive and work smoothly across modern mobile and desktop web browsers.</p>
      `
    }
  ];
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export function extractToolFaqs(sections: { title: string; content: string }[]): ToolFaqItem[] {
  const faqSection = sections.find(s => 
    s.title.toLowerCase().includes("frequently asked questions") || 
    s.title.toLowerCase().includes("faq")
  );
  if (!faqSection) return [];

  const faqs: ToolFaqItem[] = [];
  const regex = /<strong>Q:\s*([\s\S]*?)\s*<\/strong>\s*(?:<br\s*\/?>|\n)\s*A:\s*([\s\S]*?)(?=<\/p>|$)/gi;
  let match;
  while ((match = regex.exec(faqSection.content)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, "").trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  if (faqs.length === 0) {
    const simpleRegex = /Q:\s*([\s\S]*?)(?:<br\s*\/?>|\n)\s*A:\s*([\s\S]*?)(?=<\/p>|<p>|$)/gi;
    while ((match = simpleRegex.exec(faqSection.content)) !== null) {
      const question = match[1].replace(/<[^>]+>/g, "").trim();
      const answer = match[2].replace(/<[^>]+>/g, "").trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

