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

  // 2. Punjabi Gurmukhi Font Converters (Clean, strictly isolated Punjabi branch)
  const PUNJABI_FONT_SLUGS = new Set([
    "unicode-to-anmollipi",
    "anmollipi-to-unicode",
    "unicode-to-asees",
    "asees-to-unicode",
    "unicode-to-joy",
    "joy-to-unicode",
    "unicode-to-satluj",
    "satluj-to-unicode",
    "gurbani-akhar-to-unicode",
    "gurmukhi-to-shahmukhi",
    "shahmukhi-to-gurmukhi"
  ]);

  if (toolSlug.includes("-to-") && PUNJABI_FONT_SLUGS.has(toolSlug)) {
    const parts = toolSlug.split("-to-");
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    const fromFont = formatName(parts[0]);
    const toFont = formatName(parts[1]);

    return [
      {
        title: `Why convert between ${fromFont} and ${toFont}?`,
        content: `
          <p>Before Unicode became the universal standard for digital computing, Punjabi and Gurmukhi documents were composed using legacy font encodings. Fonts like ${fromFont} mapped Gurmukhi characters onto standard ASCII keystrokes. While documents looked correct on computers with that specific font installed, copying or emailing the text to another device often results in meaningless English letters.</p>
          <p>Converting between ${fromFont} and ${toFont} bridges the gap between older desktop publishing workflows and modern computing, ensuring your Punjabi text is readable across all devices, websites, and government portals.</p>
        `
      },
      {
        title: "How Punjabi font conversion works",
        content: `
          <p>Gurmukhi typography requires careful character sequencing. In legacy fonts, vowel modifiers like Sihari (ਿ) were typed before the consonant to match visual printing order. In Unicode, Sihari is stored logically after the consonant. Similarly, conjunct consonants like Pairi Rara, Pairi Haha, and Pairi Vava, as well as Bindi, Tippi, and Addak, require precise reordering.</p>
          <p>Our converter applies dedicated Gurmukhi mapping rules directly in your browser to reconstruct proper syllable order and preserve phonetic accuracy.</p>
        `
      },
      {
        title: "Step-by-step instructions for conversion",
        content: `
          <ol>
            <li><strong>Paste your text:</strong> Copy your Punjabi text from Microsoft Word, PageMaker, or your document and paste it into the input box above.</li>
            <li><strong>Instant conversion:</strong> The tool automatically processes the characters and generates the converted text on your device.</li>
            <li><strong>Copy and use:</strong> Click the "Copy" button to copy the result to your clipboard, ready for your documents, messages, or publishing software.</li>
          </ol>
        `
      },
      {
        title: "Compatibility & tips for Punjabi typists",
        content: `
          <ul>
            <li><strong>Text displays as English letters:</strong> If your document appears as random English characters, it was typed in a legacy font without Unicode encoding. Converting to Unicode restores the proper Gurmukhi script.</li>
            <li><strong>Punjab Government Exams (PSSSB):</strong> State exams and typing tests in Punjab require standard Unicode Gurmukhi (typically displayed in Raavi font). Converting legacy practice text to Unicode ensures compatibility with official test portals.</li>
            <li><strong>Desktop Publishing (PageMaker &amp; CorelDraw):</strong> When converting from Unicode to a legacy font for print layout, remember to select the target font name from your software's font menu to view the characters correctly.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my Punjabi text uploaded to a remote server?</strong><br>A: Most of our tools run directly inside your browser so your documents stay on your device. All font conversions are performed locally in your browser memory and are never transmitted over the internet.</p>
          <p><strong>Q: Will formatting like bold or tables be preserved?</strong><br>A: Font conversion processes raw character encoding. We recommend converting the plain text first and then applying bold, sizing, or headings in your document editor.</p>
          <p><strong>Q: Can I use the converted Unicode text on mobile phones?</strong><br>A: Yes. Converted Unicode text works seamlessly on Android, iOS, Windows, and Mac devices without requiring any extra font downloads.</p>
          <p><strong>Q: Which font should I use in Microsoft Word for Gurmukhi Unicode?</strong><br>A: On Windows, Raavi or Nirmala UI is the standard font for displaying Gurmukhi Unicode. On Mac, Gurmukhi MN or Gurmukhi Sangam MN is used automatically.</p>
        `
      }
    ];
  }

  // 3. Regional Indic & Asian Font Conversion Tools (Hindi, Nepali, Bengali, etc.)
  if (toolSlug.includes("-to-") && (toolSlug.includes("krutidev") || toolSlug.includes("chanakya") || toolSlug.includes("devlys") || toolSlug.includes("preeti") || toolSlug.includes("bijoy") || toolSlug.includes("inpage") || toolSlug.includes("shusha") || toolSlug.includes("aps") || toolSlug.includes("shreelipi"))) {
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
          <p>Our converter applies dedicated lexical rules directly in your browser to rearrange matras, half-characters, and conjuncts directly on your device.</p>
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
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "video";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "optimized format";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `Why convert ${fromFormat} to ${toFormat}?` : `What does ${toolTitle} do?`,
        content: `
          <p>${toolDescription} Digital video files come in dozens of containers and codec combinations. A video recorded on a phone (${fromFormat === 'video' ? 'like MOV or WebM' : fromFormat}) might not play on an older smart TV, while large camera recordings can be far too heavy to send over email, Discord, or WhatsApp.</p>
          <p>This tool solves playback and file size problems by converting or compressing video data directly in your browser. ${isConversion ? `By converting to ${toFormat}, you get a clean, universally playable video` : 'You get clean, universally playable videos'} without dealing with complicated command-line parameters or watermarks.</p>
        `
      },
      {
        title: "Understanding containers, codecs, and compression",
        content: `
          <p>A video file is like a digital box (the container, such as ${isConversion && toFormat !== 'optimized format' ? toFormat : 'MP4 or MKV'}) holding video frames, audio tracks, and subtitles. The actual pictures inside are compressed using codecs like H.264, VP9, or AV1. When you need to share a clip on social media, using standard H.264 video with AAC audio inside an MP4 container guarantees playback across nearly every smartphone, browser, and media player.</p>
          <p>Our processing optimizes compression bitrates and resolutions so your video loses minimal visual fidelity while significantly reducing file size.</p>
        `
      },
      {
        title: "How to use this video utility",
        content: `
          <ol>
            <li><strong>Select your video:</strong> Drag and drop your ${fromFormat !== 'video' ? fromFormat : 'video'} file into the box above, or click to browse files on your computer or phone.</li>
            <li><strong>Adjust settings (if desired):</strong> Choose your target resolution or compression preset for the ${toFormat} output.</li>
            <li><strong>Process and Download:</strong> Start the processing and save your optimized video file directly to your storage.</li>
          </ol>
        `
      },
      {
        title: `Everyday use cases for ${toolTitle}`,
        content: `
          <ul>
            <li><strong>Messaging &amp; Chat Apps:</strong> Shrinking 4K ${fromFormat !== 'video' ? fromFormat : 'phone'} clips down to under 25MB or 16MB for hassle-free sharing on WhatsApp, Discord, or Gmail.</li>
            <li><strong>Website Speed:</strong> Optimizing background website videos and product demos so web pages load quickly for visitors.</li>
            <li><strong>Device Storage:</strong> Freeing up gigabytes of storage on phones, laptops, and USB drives by compressing bulky screen captures and drone footage.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Will compressing my ${fromFormat !== 'video' ? fromFormat : 'video'} make it blurry?</strong><br>A: Our compression presets use adaptive rate control to preserve high visual clarity in important areas like faces and text while trimming redundant background data.</p>
          <p><strong>Q: Are my personal videos uploaded to a cloud server?</strong><br>A: Most of our tools run directly inside your browser so your files stay on your device. For complex conversions that need temporary cloud processing, files are handled in temporary memory without permanent server storage.</p>
          <p><strong>Q: Is there any watermark added to my ${toFormat !== 'optimized format' ? toFormat : 'video'}?</strong><br>A: Never. All files produced by ConverterForAll are clean, watermark-free, and ready for school, work, or social media.</p>
          <p><strong>Q: Can I use ${toolTitle} on a mobile browser?</strong><br>A: Yes, modern mobile browsers like Chrome on Android and Safari on iOS support these tools smoothly.</p>
        `
      }
    ];
  }

  // 4. Audio Tools (MP3, WAV, OGG, Audio Trimmer)
  if (toolSlug.includes("audio") || toolSlug.includes("mp3") || toolSlug.includes("wav") || toolSlug.includes("ogg") || toolSlug.includes("voice")) {
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "audio";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "audio";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `Why convert ${fromFormat} to ${toFormat}?` : `Why use ${toolTitle}?`,
        content: `
          <p>${toolDescription} Audio recordings come from many sources—smartphones, voice memos, digital audio workstations, podcasts, and cameras. Uncompressed WAV files offer studio quality but can easily be hundreds of megabytes, making them difficult to share. Conversely, proprietary formats like WhatsApp voice notes or Apple M4A files sometimes fail to open in older car audio systems or video editors.</p>
          <p>This utility enables you to ${isConversion ? `convert your ${fromFormat} into ${toFormat}` : 'trim, edit, or re-encode your sound files'} with zero software installation and complete privacy.</p>
        `
      },
      {
        title: "Understanding audio bitrates and sample rates",
        content: `
          <p>Audio quality is determined by two main factors: bitrate (measured in kilobits per second) and sample rate (usually 44.1 kHz for music or 48 kHz for video audio). A standard 128 kbps or 192 kbps ${toFormat !== 'audio' ? toFormat : 'MP3'} provides clear speech and music reproduction while keeping the file lightweight. Studio workflows requiring lossless preservation rely on uncompressed 16-bit or 24-bit WAV formats.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} instructions`,
        content: `
          <ol>
            <li><strong>Load your audio:</strong> Select your ${fromFormat !== 'audio' ? fromFormat : 'sound'} or video file from your device.</li>
            <li><strong>Configure output:</strong> ${isConversion ? `Confirm ${toFormat} as your output` : 'Adjust trim boundaries or settings'} if cutting a specific clip.</li>
            <li><strong>Export audio:</strong> Click download to receive your high-quality ${toFormat !== 'audio' ? toFormat : 'sound'} file immediately.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I extract ${toFormat !== 'audio' ? toFormat : 'audio'} from a video file?</strong><br>A: Yes! Tools like MP4 to MP3 read the audio stream directly from your video and save it as a standalone audio track.</p>
          <p><strong>Q: Are my ${fromFormat !== 'audio' ? fromFormat : 'voice'} memos and sound files kept private?</strong><br>A: Yes. Most of our tools run directly inside your browser so your documents stay on your device. Your sound files are processed locally on your hardware.</p>
          <p><strong>Q: What bitrate is used for converted ${toFormat !== 'audio' ? toFormat : 'MP3'} files?</strong><br>A: We encode at standard 192 kbps to 320 kbps bitrates to ensure crisp, balanced sound without muffling highs or distorting bass.</p>
          <p><strong>Q: Do I need an account to download my ${toFormat !== 'audio' ? toFormat : 'converted'} audio?</strong><br>A: No account, email, or subscription is ever required.</p>
        `
      }
    ];
  }

  // 5. Image Tools (Compressors, Format Converters, Cropper, Resizer, SVG)
  if (toolSlug.includes("image") || toolSlug.includes("jpg") || toolSlug.includes("png") || toolSlug.includes("webp") || toolSlug.includes("heic") || toolSlug.includes("avif") || toolSlug.includes("gif") || toolSlug.includes("svg") || toolSlug.includes("compress") || toolSlug.includes("passport")) {
    const parts = toolSlug.split("-to-");
    const fromFormat = parts.length === 2 ? parts[0].toUpperCase() : "image";
    const toFormat = parts.length === 2 ? parts[1].toUpperCase() : "image";
    const isConversion = parts.length === 2;

    return [
      {
        title: isConversion ? `How to convert ${fromFormat} to ${toFormat} online` : `What does ${toolTitle} do?`,
        content: `
          <p>${toolDescription} High-resolution cameras, smartphones, and graphic software generate images in a wide range of formats—from modern space-saving WEBP and AVIF files to standard JPGs, transparent PNGs, and scalable SVGs. However, many job application portals, government upload forms, and email clients still enforce strict image format and file size limits.</p>
          <p>This tool helps you ${isConversion ? `quickly convert your ${fromFormat} images into the ${toFormat} format` : 'adjust, crop, or compress your images'} so they meet your exact requirements without sacrificing image sharpness.</p>
        `
      },
      {
        title: "How in-browser image processing works",
        content: `
          <p>Rather than sending your personal photos across the internet to an unknown server, our ${toFormat !== 'image' ? toFormat : 'image'} tools utilize the HTML5 Canvas API and modern WebAssembly codecs directly in your browser. When you drop an image onto the page, your browser decodes the pixel grid into memory, performs the requested ${isConversion ? 'format re-encoding' : 'resizing or compression'}, and produces the output file instantly.</p>
          <p>This ensures you never have to wait in an upload queue, and your private photos remain strictly on your own computer or phone.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Select your picture:</strong> Drag your ${fromFormat !== 'image' ? fromFormat : 'image'} into the drop zone or click to open your file picker.</li>
            <li><strong>Adjust options:</strong> ${isConversion ? `Confirm ${toFormat} output settings` : 'Set your target dimensions, quality sliders, or cropping box if needed.'}</li>
            <li><strong>Save your image:</strong> Click the download button to save the ${toFormat !== 'image' ? toFormat : 'optimized'} image to your device.</li>
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
          <p><strong>Q: Does compressing a ${fromFormat !== 'image' ? fromFormat : 'photo'} reduce its physical resolution?</strong><br>A: Not unless you choose to resize it. Visual compression works by trimming imperceptible color data while keeping pixel dimensions unchanged.</p>
          <p><strong>Q: Does ${toFormat === 'PNG' ? 'PNG' : 'this format'} support transparent backgrounds?</strong><br>A: ${toFormat === 'PNG' || fromFormat === 'PNG' ? 'Yes. PNG supports an alpha channel for transparency. Converting to JPG will automatically replace transparent areas with a solid white background.' : 'JPG does not support transparency. If you need a transparent background, convert to PNG instead.'}</p>
          <p><strong>Q: Are my ${fromFormat !== 'image' ? fromFormat : 'personal'} photos private and secure?</strong><br>A: Yes. Most of our tools run directly inside your browser so your documents stay on your device. We never store, copy, or transmit your images.</p>
          <p><strong>Q: Can I convert multiple images at once?</strong><br>A: Yes, batch processing is supported for our core image tools so you can process photos in bulk.</p>
        `
      }
    ];
  }

  // 6. PDF & Document Tools (Organize, Merge, Split, Rotate, Clean Metadata, Repair)
  if (toolSlug.includes("pdf") || toolSlug.includes("word") || toolSlug.includes("powerpoint") || toolSlug.includes("excel") || toolSlug.includes("pages") || toolSlug.includes("metadata")) {
    const isPdfTool = toolSlug.includes("pdf");

    return [
      {
        title: `Why use ${toolTitle}?`,
        content: `
          <p>${toolDescription} ${isPdfTool ? 'PDF files are the global standard for contracts, academic papers, tax filings, and business proposals because they look identical across every computer and mobile operating system.' : 'Documents often need to be converted to ensure they look identical across every computer and mobile operating system.'} However, editing, reorganizing, or converting these documents often requires expensive subscription software.</p>
          <p>This utility gives you full control over your documents—allowing you to extract, rearrange, rotate, clean, or convert pages without costly licenses or complicated menus.</p>
        `
      },
      {
        title: "How document manipulation works safely in your browser",
        content: `
          <p>When working with confidential documents like signed agreements, bank statements, or medical records, privacy is non-negotiable. Our ${isPdfTool ? 'PDF' : 'document'} tools leverage client-side parsing engines directly in your browser. The tool inspects the document structure, modifies page trees, updates metadata dictionaries, and saves a brand-new file directly onto your storage drive.</p>
          <p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in temporary memory without permanent server storage.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Select your document:</strong> Drag and drop your ${isPdfTool ? 'PDF' : 'document'} into the upload box.</li>
            <li><strong>Perform your changes:</strong> Select pages to remove, reorganize content, or configure output options.</li>
            <li><strong>Download the result:</strong> Save your newly organized or converted file immediately.</li>
          </ol>
        `
      },
      {
        title: "Common practical uses",
        content: `
          <ul>
            <li><strong>Fixing Scanned Documents:</strong> Rotating pages that were scanned sideways or upside down before emailing them to clients.</li>
            <li><strong>Removing Confidential Pages:</strong> Stripping unnecessary appendices, private financial sheets, or blank pages before sharing.</li>
            <li><strong>Scrubbing Document Properties:</strong> Removing hidden metadata, author names, creation software history, and timestamps from public files.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I process password-protected ${isPdfTool ? 'PDF' : 'document'} files?</strong><br>A: If a file is protected with an owner password, enter the password when prompted to unlock it for organizing or conversion.</p>
          <p><strong>Q: Will hyperlinks and text remain selectable?</strong><br>A: Yes. Page manipulation operations preserve existing vector text, selectable paragraphs, and internal document bookmarks.</p>
          <p><strong>Q: Are my confidential contracts stored on any server?</strong><br>A: No. Your documents are processed in local browser memory and are never uploaded or retained.</p>
          <p><strong>Q: Are there any file size limits?</strong><br>A: Since processing runs in your browser, limits depend on your device's available memory. Most documents up to 100MB process smoothly.</p>
        `
      }
    ];
  }

  // 7. Developer, Data & Code Utilities (JWT, JSON, CSV, Base64, UUID, Timestamps)
  if (toolSlug.includes("jwt") || toolSlug.includes("json") || toolSlug.includes("csv") || toolSlug.includes("base64") || toolSlug.includes("uuid") || toolSlug.includes("timestamp")) {
    const parts = toolSlug.split("-to-");
    const isConversion = parts.length === 2;
    const fromType = isConversion ? parts[0].toUpperCase() : toolTitle.split(" ")[0];

    return [
      {
        title: `What is ${toolTitle}?`,
        content: `
          <p>${toolDescription} In modern web development, data engineering, and system administration, engineers constantly handle encoded strings, serialization payloads, authentication tokens, and standardized timestamps. Pasting sensitive ${fromType} payloads into arbitrary online formatters exposes API secrets, user IDs, and proprietary data to third-party logs.</p>
          <p>This developer tool runs 100% locally in your web browser. No queries, tokens, or records are ever sent over the network.</p>
        `
      },
      {
        title: "Why client-side execution matters for security",
        content: `
          <p>When inspecting JSON Web Tokens (JWTs) or debugging ${fromType}-encoded credentials, security best practices dictate that secrets must never leave your workstation. Because this tool executes entirely within your browser's sandboxed JavaScript runtime, you can safely parse tokens, format data, and convert datasets even while disconnected from the internet.</p>
        `
      },
      {
        title: `Step-by-step ${toolTitle} guide`,
        content: `
          <ol>
            <li><strong>Paste your input:</strong> Paste your raw ${fromType} string, token, or timestamp into the editor.</li>
            <li><strong>Instant parsing:</strong> The tool formats, validates, or translates your data immediately with syntax highlighting.</li>
            <li><strong>Copy output:</strong> Click the copy button to copy the validated result straight to your clipboard.</li>
          </ol>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does ${toolTitle} transmit my tokens or data to an external API?</strong><br>A: No. Zero network requests are made with your data. Processing happens exclusively in your browser.</p>
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
      title: `What is ${toolTitle}?`,
      content: `
        <p>${toolDescription} We built ${toolTitle} to solve everyday digital tasks directly inside your web browser. There is no software to install, no accounts to register, and no paywalls to navigate.</p>
        <p>Whether you need to compute values, clean up formatted text, or generate assets for a project, this utility provides reliable, instant results directly on your device.</p>
      `
    },
    {
      title: `How ${toolTitle} works`,
      content: `
        <p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in temporary memory without permanent server storage. This eliminates waiting in server queues and keeps your personal workflow private and efficient.</p>
      `
    },
    {
      title: `Step-by-step instructions for ${toolTitle}`,
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
        <p><strong>Q: Do I have to pay to use ${toolTitle}?</strong><br>A: No. ConverterForAll utilities are completely free to use with no daily usage caps.</p>
        <p><strong>Q: Do I need to create an account?</strong><br>A: No. We believe basic everyday computer utilities should be open and accessible without forcing you to sign up, give away an email, or remember passwords.</p>
        <p><strong>Q: Are my inputs or files saved?</strong><br>A: Never. Most tools run locally on your device in your browser's memory, ensuring your data remains under your control.</p>
        <p><strong>Q: Does ${toolTitle} work on mobile phones?</strong><br>A: Yes, all tools are responsive and work smoothly across modern mobile and desktop web browsers.</p>
      `
    }
  ];
}

  // A cautious fallback for tools that do not yet have a verified page-specific guide.
  // Do not infer accepted formats, processing location, limits, quality or third-party acceptance
  // from the tool name alone. Those details must be documented only after checking the tool UI/code.
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

