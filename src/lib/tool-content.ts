import { imageToolsContent } from "./content/image-tools";
import { pdfOrganizeContent } from "./content/pdf-organize";
import { pdfOptimizeContent } from "./content/pdf-optimize";
import { pdfConvertContent } from "./content/pdf-convert";
import { videoToolsContent } from "./content/video-tools";
import { utilitiesToolsContent } from "./content/utilities-tools";
import { fontToolsContent } from "./content/font-tools";
import { audioToolsContent } from "./content/audio-tools";
import { lengthToolsContent } from "./content/length-tools";
import { automotiveToolsContent } from "./content/automotive-tools";
import { devTextToolsContent } from "./content/dev-text-tools";
import { devSerializationToolsContent } from "./content/dev-serialization-tools";
import { examToolsContent } from "./content/exam-tools";


export const toolContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  ...imageToolsContent,
  ...pdfOrganizeContent,
  ...pdfOptimizeContent,
  ...pdfConvertContent,
  ...videoToolsContent,
  ...utilitiesToolsContent,
  ...fontToolsContent,
  ...audioToolsContent,
  ...lengthToolsContent,
  ...automotiveToolsContent,
  ...devTextToolsContent,
  ...devSerializationToolsContent,
  ...examToolsContent,
  "remove-background": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the AI Background Remover Does",
        content: "<p>Upload one JPG/JPEG, PNG or WEBP image and let the browser-side background-removal engine create a PNG with an alpha channel. The uploader also offers camera capture on supported devices. The tool makes an automatic foreground mask; it does not guarantee that every subject, strand of hair, transparent object or edge will be separated perfectly.</p>"
      },
      {
        title: "How the AI Processing Pipeline Works",
        content: "<p>The tool runs a Web Worker that first attempts the BRIA RMBG-1.4 image-segmentation model through Transformers.js using WebGPU. If that step fails, the worker falls back to IMG.LY's background-removal library with an ISNet model. If the worker itself fails, the page has a main-thread IMG.LY fallback. The resulting alpha mask is also adjusted by a small browser-side refinement pass.</p><p>The Fast, Balanced and ISNet options shown above select which ISNet model is used in the fallback path. They do not replace the initial BRIA attempt. The selected image is processed in the browser and this component does not upload the photo to a background-removal API.</p>"
      },
      {
        title: "Model Downloads and Privacy",
        content: "<p>The image-processing inference runs locally in your browser, but the model and runtime files are not all bundled with the page. The BRIA model is loaded through Hugging Face Transformers.js, and the fallback library may fetch its model and runtime assets from its configured external host. The first run can therefore require an internet connection and can take longer while those assets download. The browser may cache some assets for later use.</p><p>In practical terms: your selected image is processed on your device rather than uploaded to a background-removal API, but the feature is not network-free because model/runtime assets may be downloaded.</p>"
      },
      {
        title: "Quality Limits and Touch-Up Controls",
        content: "<p>Automatic segmentation can leave background fragments or remove fine parts of the subject. Similar foreground and background colours, low contrast, motion blur, fine hair, transparent materials, overlapping objects and complex edges can affect the mask. Results also depend on the device's available memory and whether WebGPU is supported; when BRIA cannot run, the tool uses the ISNet fallback.</p><p>After processing, the interface offers a Touch Up / Restore editor. It includes brush-based restore and erase tools, undo, zoom and pan so you can correct parts of the generated mask before saving the PNG. This is a manual refinement aid, not a guarantee of perfect edge recovery.</p>"
      },
      {
        title: "Output Format and Image Dimensions",
        content: "<p>The background-removal pipeline exports PNG so the transparent alpha channel can be retained. JPG does not support transparency. The processing code does not deliberately resize the image as part of background removal, but the result still depends on the source image, model output and browser capabilities. There is no target KB compressor in this tool; the output file size depends on image dimensions and transparent image content.</p>"
      },
      {
        title: "How to Remove an Image Background",
        content: "<ol><li><strong>Choose the fallback setting:</strong> Select Fast, Balanced or ISNet (Standard). These options apply only if the initial BRIA model attempt fails.</li><li><strong>Upload one image:</strong> Choose a JPG/JPEG, PNG or WEBP file, or use camera capture if your browser supports it.</li><li><strong>Wait for processing:</strong> The browser may need to download model/runtime files the first time. Keep the tab open while it runs.</li><li><strong>Review the cutout:</strong> Compare the original and transparent result. Check hair, clothing edges, small objects and similar-colour areas.</li><li><strong>Touch up if needed:</strong> Use Touch Up / Restore to erase remaining background or restore missed subject areas, then save and download the PNG.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my selected photo uploaded to a server?</strong><br>A: The image is processed in the browser and this component does not send it to a background-removal API. Model and runtime files may be downloaded from external hosts.</p>
          <p><strong>Q: Does the feature work without an internet connection?</strong><br>A: Not reliably on a first run. The BRIA model and the fallback library may need to download model/runtime assets. Cached assets may help on later visits, but the tool is not designed as a guaranteed offline feature.</p>
          <p><strong>Q: What do Fast, Balanced and ISNet (Standard) control?</strong><br>A: They choose the ISNet fallback model. The worker attempts BRIA RMBG-1.4 first regardless of this setting; the selected ISNet option is used if BRIA fails.</p>
          <p><strong>Q: Which image formats can I upload and download?</strong><br>A: The tool accepts JPG/JPEG, PNG and WEBP inputs. The background-removed result is exported as PNG to support transparency.</p>
          <p><strong>Q: Will the background always be removed perfectly?</strong><br>A: No. Segmentation can struggle with fine hair, low contrast, similar colours, transparent materials and overlapping subjects. Review and touch up the result.</p>
          <p><strong>Q: Can I manually correct the result?</strong><br>A: Yes. The Touch Up / Restore editor provides brush-based erase and restore tools, undo, zoom and pan before saving the revised PNG.</p>
          <p><strong>Q: Does it compress the PNG to a specific KB limit?</strong><br>A: No. This tool removes the background and exports PNG; it does not provide a target file-size control.</p>
          <p><strong>Q: Does it guarantee support for pets, products, vehicles or every type of subject?</strong><br>A: No universal subject-coverage guarantee is made. The result depends on the model, image content, lighting, contrast and device.</p>
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
  'Nautical miles': 1852,
  'Nanometers': 0.000000001,
  'Micrometers': 0.000001,
  'Leagues': 4828.032,
  'Light years': 9460730472580800,
  'Parsecs': 30856775814913670
};


// Fallback generator for tools that haven't been manually written yet
export function getToolContent(toolSlug: string, toolTitle: string, _toolDescription: string) {
  // Return authored page content exactly as maintained in the tool-specific registry.
  // Do not append shared tips or FAQs: they can describe features, privacy behaviour,
  // output quality or file-size guarantees that do not apply to this individual tool.
  if (toolContent[toolSlug]) {
    return toolContent[toolSlug].sections;
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
        <h3 class="text-base font-bold mt-0 mb-2">Conversion Formula (displayed to up to six significant digits)</h3>
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

    let introText = `<p>Converting between ${fromUnit} and ${toUnit} is an everyday task in home improvement, carpentry, architectural drafting, 3D printing, travel planning, and school projects. Because different countries and industries alternate between Imperial and Metric standards, keeping track of precise decimal conversion factors in your head can easily lead to rounding errors.</p>`;
    let situationsHtml = `<ul>
            <li><strong>DIY and Home Renovations:</strong> Measuring furniture dimensions, lumber sizes, curtains, or flooring spaces where product packaging lists measurements in ${fromUnit} while your tape measure uses ${toUnit}.</li>
            <li><strong>Online Shopping and Sizing:</strong> Checking clothing size charts, shoe lengths, or tech accessories sold by international retailers.</li>
            <li><strong>Architecture and Blueprints:</strong> Reviewing building plans, engineering schematics, or CAD files formatted in alternative measurement units.</li>
            <li><strong>Science and Education:</strong> Solving physics, geometry, or geography homework problems requiring precise metric or customary conversions.</li>
          </ul>`;

    if (toolSlug === "nanometers-to-micrometers" || toolSlug === "micrometers-to-nanometers") {
      introText = `<p>Nanometers (nm) and micrometers (µm) are microscopic units of length primarily used in scientific research, semiconductor manufacturing, optics, and microbiology. Because these units represent distances far smaller than what the human eye can see, they are essential for describing wavelengths of light, cellular structures, and microchip transistors.</p>`;
      situationsHtml = `<ul>
            <li><strong>Scientific Research:</strong> Measuring cellular structures, bacteria, and microscopic organisms in biology.</li>
            <li><strong>Semiconductor Engineering:</strong> Calculating the scale of transistors and microchip fabrication processes.</li>
            <li><strong>Optics and Photonics:</strong> Describing the wavelengths of the visible light spectrum and other electromagnetic waves.</li>
            <li><strong>Materials Science:</strong> Working with nanotechnology and molecular-scale structures.</li>
          </ul>`;
    } else if (toolSlug === "nautical-miles-to-miles" || toolSlug === "miles-to-nautical-miles") {
      introText = `<p>Nautical miles and standard statute miles are distinct units of distance commonly encountered in aviation and marine navigation. While a standard mile is based on historical land measurements, a nautical mile is based on the Earth's circumference and is equal to one minute of latitude. This makes nautical miles the international standard for sea and air travel.</p>`;
      situationsHtml = `<ul>
            <li><strong>Marine Navigation:</strong> Calculating distances for shipping routes, sailing, and maritime operations using nautical charts.</li>
            <li><strong>Aviation:</strong> Flight planning and determining distances between airports using standard aviation metrics.</li>
            <li><strong>Geography and Mapping:</strong> Converting international maritime borders and territorial waters to familiar land measurements.</li>
          </ul>`;
    } else if (toolSlug === "light-years-to-parsecs" || toolSlug === "parsecs-to-light-years") {
      introText = `<p>Light years and parsecs are astronomical units of distance used to measure the vast expanses of the universe. While a light year is the distance light travels in one Julian year, a parsec (parallax of one arcsecond) is based on the geometry of Earth's orbit and is the standard unit favored by professional astronomers and astrophysicists.</p>`;
      situationsHtml = `<ul>
            <li><strong>Astronomy and Astrophysics:</strong> Measuring distances to stars, galaxies, and galaxy clusters.</li>
            <li><strong>Space Exploration:</strong> Calculating theoretical travel times for interstellar missions.</li>
            <li><strong>Science Fiction and Literature:</strong> Understanding the scale of cosmic events and distances in popular media.</li>
          </ul>`;
    } else if (toolSlug === "leagues-to-miles" || toolSlug === "miles-to-leagues") {
      introText = `<p>The league is an ancient unit of length, originally defined as the distance a person could walk in an hour. While it is rarely used in modern formal contexts, it frequently appears in historical texts, literature, and geography. Converting leagues to miles helps contextualize these classical measurements in modern terms.</p>`;
      situationsHtml = `<ul>
            <li><strong>Literature and History:</strong> Understanding distances in classic novels like "Twenty Thousand Leagues Under the Sea".</li>
            <li><strong>Historical Geography:</strong> Interpreting ancient maps and historical travel logs.</li>
            <li><strong>Tabletop RPGs and Fantasy:</strong> Calculating travel times in fantasy world-building and games.</li>
          </ul>`;
    }

    return [
      {
        title: `How to convert ${fromUnit} to ${toUnit}`,
        content: `
          ${introText}
          <p>This calculator handles the mathematical conversion directly in your browser. As you type a number into the input field above, the converted value updates instantly without requiring a page refresh or submitting data to a remote server.</p>
          ${formulaHtml}
        `
      },
      {
        title: "Everyday situations where this conversion matters",
        content: `
          ${situationsHtml}
        `
      },
      {
        title: "Step-by-step conversion instructions",
        content: `
          <ol>
            <li><strong>Enter your number:</strong> Type the value in ${fromUnit} you want to convert into the input box above.</li>
            <li><strong>Instant Calculation:</strong> The calculator multiplies the value by the standard conversion factor on your device.</li>
            <li><strong>Copy or Note:</strong> Use the one-click copy button to copy the displayed converted value.</li>
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


  // Cautious fallback for tools without a verified page-specific guide.
  // Tool-specific input, processing, limits and compatibility claims must be verified
  // from the actual UI and implementation before they are published.
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const safeToolTitle = toolTitle.replace(/[&<>"']/g, character => htmlEntities[character] ?? character);

  return [
    {
      title: `About ${safeToolTitle}`,
      content: "<p>Use the controls on this page to provide the input and choose from the options the tool makes available. The accepted inputs, settings and output are determined by the controls shown above.</p><p>This guide does not make a general promise about processing location, supported third-party applications, exact output quality, file-size targets or acceptance by another website. Review the result before relying on it.</p>"
    },
    {
      title: `How to use ${safeToolTitle}`,
      content: "<ol><li><strong>Read the input control:</strong> Check the accepted file types, size limits or value format shown above.</li><li><strong>Provide your input:</strong> Select a supported file or enter the requested value.</li><li><strong>Choose available options:</strong> Use only the settings displayed by this tool.</li><li><strong>Run the tool:</strong> Start the action using the button provided.</li><li><strong>Review the result:</strong> Check the output and verify any separate requirements imposed by the application or service where you plan to use it.</li></ol>"
    },
    {
      title: "Frequently Asked Questions",
      content: "<p><strong>Q: Which inputs does this page accept?</strong><br>A: Check the accepted file types or input format shown in the control above the page's action button.</p><p><strong>Q: Does the output guarantee acceptance by another website or application?</strong><br>A: No. The receiving service may apply its own file, content or compatibility requirements. Check those requirements separately.</p><p><strong>Q: Where is processing performed?</strong><br>A: Processing methods differ across ConverterForAll tools. Do not assume that every tool uses the same local or cloud processing path; consult the privacy information for this specific tool.</p>"
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

