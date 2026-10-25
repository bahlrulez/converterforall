import { generatedPunjabiProfiles } from "./punjabi-font-profiles";
import { KRUTIDEV_SNAPSHOT_DATA, UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA } from "./font-tools-data";

export const fontToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  ...generatedPunjabiProfiles,

  // KRUTI DEV TO UNICODE / MANGAL CONVERTER
  "krutidev-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Kruti Dev to Unicode (Mangal Font) Converter",
        content: `
          <p>When Hindi text typed on older desktop computers or Remington typewriter layouts is copied into modern applications—such as WhatsApp, Gmail, Microsoft Word, or web forms—it often turns into unreadable strings of English letters and symbols. If this happens in your Word documents, see our troubleshooting guide on <a href="/blog/kruti-dev-font-showing-as-english-in-word" class="font-semibold text-blue-600 hover:underline">why Kruti Dev font shows as English in Word</a>.</p>
          <p>This happens because Kruti Dev 010 is a legacy non-Unicode font that reuses Latin keyboard character codes. It does not store actual Devanagari characters; instead, it replaces standard English alphabet keys on the keyboard with Hindi letter shapes. If a device does not have the specific <code>Kruti Dev 010.ttf</code> font file installed, it has no way of knowing those keys represent Hindi and displays raw Latin characters instead.</p>
          <p>Unicode (commonly displayed using the Mangal font) is the international standard for digital text. In Unicode, every Devanagari character has a permanent, universally recognized numeric code. Converting your legacy text to Unicode ensures your Hindi documents display accurately on any smartphone, tablet, computer, or website without requiring anyone to install extra font files.</p>
          <p>All conversions on this page run directly inside your web browser using client-side JavaScript. Your text stays entirely on your device and is never uploaded to any server.</p>
          <h3>How to convert Kruti Dev to Unicode:</h3>
          <ol>
            <li><strong>Paste or type:</strong> Paste your Kruti Dev 010 text into the input box on the left.</li>
            <li><strong>Automatic conversion:</strong> The tool converts each character into standard Devanagari Unicode (Mangal font) in your browser.</li>
            <li><strong>Copy or export:</strong> Click Copy to transfer the clean Hindi text into Microsoft Word, Google Docs, email, or messaging apps.</li>
          </ol>
        `
      },
      {
        title: "Before-and-After Conversion Example",
        content: `
          <p>The following example illustrates how legacy Kruti Dev 010 text is translated into standard Devanagari Unicode:</p>
          <div class="my-4 space-y-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Original Kruti Dev 010 Input:</span>
              <pre class="mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm font-mono overflow-x-auto border border-slate-200 dark:border-slate-800"><code>${KRUTIDEV_SNAPSHOT_DATA.htmlEscapedInput}</code></pre>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Unicode (Mangal Font) Output:</span>
              <pre class="mt-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-xs sm:text-sm font-mono text-emerald-900 dark:text-emerald-200 overflow-x-auto border border-emerald-200 dark:border-emerald-800"><code>${KRUTIDEV_SNAPSHOT_DATA.expectedUnicode}</code></pre>
            </div>
          </div>
          <p>Key character mapping highlights:</p>
          <ul>
            <li><strong>Half-letters and conjuncts:</strong> <code>è;ku</code> maps to half-letter ध followed by य (<code>ध्यान</code>).</li>
            <li><strong>Pre-consonant vowel signs:</strong> In Kruti Dev, the key <code>f</code> is typed before the consonant (<code>fooj.k</code>), which the engine automatically reorders after the consonant (<code>विवरण</code>).</li>
            <li><strong>Nukta and combined signs:</strong> <code>i&lt;+sa</code> correctly pairs the dotted character ढ़ with upper matra and anusvara (<code>पढ़ें</code>).</li>
          </ul>
        `
      },
      {
        title: "Converter Limitations & Formatting Notes",
        content: `
          <ul>
            <li><strong>Mixed English words:</strong> Because Kruti Dev maps English keyboard keys directly to Devanagari glyphs, genuine English words inside your text will be converted into Hindi characters (for example, typing <code>${KRUTIDEV_SNAPSHOT_DATA.helloInput}</code> converts to <code>${KRUTIDEV_SNAPSHOT_DATA.helloUnicode}</code>). If your document contains mixed English phrases or technical terms, convert the Hindi paragraphs separately or restore English terms after conversion.</li>
            <li><strong>Microsoft Word Smart Quotes:</strong> In Kruti Dev 010, the straight single quote key (<code>'</code>) represents the half-letter श (as in <code>ns'k</code> &rarr; <code>देश</code>). If text is pasted from Microsoft Word with auto-formatted curly quotes enabled, the curly apostrophe (<code>’</code>) will not be recognized as a valid keystroke, resulting in formatting errors like <code>${KRUTIDEV_SNAPSHOT_DATA.smartQuotesUnicode}</code>. Use standard straight quotes for accurate conversion.</li>
            <li><strong>Forward slashes in dates:</strong> In Kruti Dev typing, the forward slash key (<code>/</code>) is assigned to the Hindi character ध/halant. Converting date strings like <code>${KRUTIDEV_SNAPSHOT_DATA.dateInput}</code> will produce <code>${KRUTIDEV_SNAPSHOT_DATA.dateUnicode}</code>. Forward slashes in dates should be re-inserted after conversion.</li>
            <li><strong>DevLys 010 font:</strong> DevLys 010 uses a similar layout; try a short sample first to check compatibility.</li>
            <li><strong>Chanakya font incompatibility:</strong> Fonts from the Chanakya family use an entirely different character map. Passing Chanakya text into this tool will produce jumbled output; use the <a href="/chanakya-to-unicode" class="font-semibold text-blue-600 hover:underline">Chanakya to Unicode</a> converter instead. If you are unsure which font was used originally, our <a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a> can help identify it.</li>
          </ul>
        `
      },
      {
        title: "Typing Tests and Official Document Requirements",
        content: `
          <p>Candidates preparing typing test assignments, court pleadings, or official job applications frequently switch between typing styles.</p>
          <p>Typing test guidelines and format requirements differ across recruitment boards and departments. ConverterForAll does not maintain official exam specifications. Always check your specific official recruitment notification or exam syllabus for the required font and keyboard layout.</p>
        `
      },
      {
        title: "कृतिदेव से यूनिकोड कन्वर्टर (उपयोगी जानकारी एवं निर्देश)",
        content: `
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">कृतिदेव से यूनिकोड कन्वर्टर</h3>
          <p>पुराने कंप्यूटरों और पारंपरिक टाइपराइटर लेआउट पर टाइप की गई हिंदी सामग्री अक्सर कृतिदेव (कृति देव 010) में होती है। यह फॉन्ट केवल उसी सिस्टम पर सही दिखता है जहाँ कृतिदेव की फॉन्ट फाइल पहले से स्थापित हो। जब आप इस टेक्स्ट को ईमेल, गूगल डॉक्स, या मोबाइल फोन पर भेजते हैं, तो यह अंग्रेज़ी के बेतरतीब अक्षरों (जैसे <code>${KRUTIDEV_SNAPSHOT_DATA.shortHindiHtml}</code> या <code>fooj.k</code>) जैसा दिखाई देता है।</p>
          <p><strong>कृतिदेव से यूनिकोड कन्वर्टर</strong> की सहायता से आप अपने टेक्स्ट को एक क्लिक में आधुनिक यूनिकोड (मंगल) में बदल सकते हैं:</p>
          <ol>
            <li>अपने कृतिदेव टेक्स्ट को ऊपर दिए गए पहले बॉक्स में पेस्ट करें।</li>
            <li>टूल आपके टेक्स्ट को तुरंत शुद्ध देवनागरी यूनिकोड में बदल देगा।</li>
            <li>परिणामी टेक्स्ट को कॉपी करें और सीधे वर्ड, व्हाट्सएप, या किसी भी ऑनलाइन पोर्टल पर इस्तेमाल करें।</li>
          </ol>
          <p>यह पूरी प्रक्रिया आपके कंप्यूटर या मोबाइल के ब्राउज़र में ही संपन्न होती है। आपका कोई भी दस्तावेज़ या व्यक्तिगत डेटा हमारे सर्वर पर अपलोड नहीं होता है।</p>
        `
      },
      {
        title: "Contextual Related Tools & Guides",
        content: `
          <ul>
            <li><a href="/unicode-to-krutidev" class="font-semibold text-blue-600 hover:underline">Unicode to Kruti Dev</a>: Convert modern Mangal or web-based Hindi text back into legacy Kruti Dev 010 format for older desktop publishing programs like PageMaker.</li>
            <li><a href="/chanakya-to-unicode" class="font-semibold text-blue-600 hover:underline">Chanakya to Unicode</a>: Convert text formatted in Walkman-Chanakya or publication fonts used by traditional print publishers.</li>
            <li><a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a>: Unsure which legacy font was used to type your corrupted text? Auto-detect between Kruti Dev, Chanakya, and Asees.</li>
            <li><a href="/blog/how-to-fix-garbled-kruti-dev-chanakya-asees-font" class="font-semibold text-blue-600 hover:underline">How to Fix Garbled Kruti Dev, Chanakya &amp; Asees Fonts</a>: Step-by-step troubleshooting guide for fixing corrupted Hindi and Punjabi text in documents.</li>
            <li><a href="/blog/kruti-dev-font-showing-as-english-in-word" class="font-semibold text-blue-600 hover:underline">Why Kruti Dev Shows as English in Word</a>: Practical fix for when Hindi documents open as random English characters on a different PC.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is Unicode Hindi the same thing as Mangal font?</strong><br>A: Mangal is simply the default font typeface that Microsoft Windows uses to render Devanagari Unicode characters. When this tool converts Kruti Dev to Unicode, the resulting text displays in Mangal on Windows, and in the default Devanagari system font on Android, macOS, and iOS devices.</p>
          <p><strong>Q: Why do English letters like d, j, and k appear in my Kruti Dev text?</strong><br>A: Kruti Dev is a legacy non-Unicode font that reuses Latin keyboard character codes. On any device where Kruti Dev is not installed, the operating system reads the underlying Latin characters and displays regular English letters. Converting to Unicode gives each character its true Devanagari digital code point.</p>
          <p><strong>Q: Does this converter work for DevLys 010 font?</strong><br>A: DevLys 010 uses a similar layout; try a short sample first to check compatibility. If your sample converts cleanly, you can proceed with the rest of your text.</p>
          <p><strong>Q: Can I convert documents that have both English and Hindi text mixed together?</strong><br>A: Mixed documents require care. Because Kruti Dev maps English keyboard keys to Hindi letters, genuine English words inside the text will be converted into Hindi characters (for example, Hello World becomes भ्मससव ॅवतसक). We recommend converting the Hindi paragraphs separately or re-checking English terms after conversion.</p>
          <p><strong>Q: Why did my date like 01/01/2026 show Hindi letters instead of slashes?</strong><br>A: In Kruti Dev typing, the forward slash key is assigned to the Hindi character ध/halant, producing 01ध्01ध्2026. Forward slashes in dates should be re-inserted after conversion.</p>
          <p><strong>Q: Are my documents or text uploaded to your servers?</strong><br>A: No. The Kruti Dev conversion script executes entirely in your browser using client-side JavaScript. Your text never leaves your device.</p>
        `
      }
    ]
  },

  // UNICODE (MANGAL) TO KRUTI DEV CONVERTER
  "unicode-to-krutidev": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Convert Unicode Hindi (Mangal) to Kruti Dev 010?",
        content: `
          <p>Modern Hindi text created on smartphones, websites, Google Docs, or email is composed in Unicode (commonly displayed using Microsoft's Mangal or Nirmala UI fonts). When you copy this modern Unicode text and paste it into older desktop publishing software—such as Adobe PageMaker 7.0, CorelDRAW 11 or 12, or legacy offset printing templates—the text frequently turns into unreadable question marks (<code>????</code>), empty rectangular boxes, or garbled English symbols.</p>
          <p>This happens because legacy desktop publishing software was developed before universal Unicode support became standard in publishing workflows. Those older programs require legacy non-Unicode fonts like Kruti Dev 010, which reuse Latin keyboard character codes to display Devanagari letterforms. If your text was typed in Unicode Mangal or copied from the web, this tool converts each Devanagari character back into the corresponding Kruti Dev Remington keystrokes directly in your browser.</p>
          <p>All conversions run directly inside your web browser using client-side JavaScript. Your text stays entirely on your computer and is never sent to any server.</p>
          <h3>How to convert Unicode to Kruti Dev:</h3>
          <ol>
            <li><strong>Paste Unicode text:</strong> Paste your modern Unicode Hindi (Mangal font) text into the input box on the left.</li>
            <li><strong>Automatic conversion:</strong> The tool translates Devanagari code points into Kruti Dev 010 characters in your browser.</li>
            <li><strong>Copy and format:</strong> Copy the output, paste it into Microsoft Word, PageMaker, or CorelDRAW, and set the font family to <code>Kruti Dev 010</code>.</li>
          </ol>
        `
      },
      {
        title: "Before-and-After Conversion Example",
        content: `
          <p>The following example shows how standard Unicode Devanagari is converted into Kruti Dev 010 encoding:</p>
          <div class="my-4 space-y-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Original Unicode (Mangal Font) Input:</span>
              <pre class="mt-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm font-mono overflow-x-auto border border-slate-200 dark:border-slate-800"><code>${UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.unicodeInput}</code></pre>
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Kruti Dev 010 Output:</span>
              <pre class="mt-1 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-xs sm:text-sm font-mono text-cyan-900 dark:text-cyan-200 overflow-x-auto border border-cyan-200 dark:border-cyan-800"><code>${UNICODE_TO_KRUTIDEV_SNAPSHOT_DATA.htmlEscapedKruti}</code></pre>
            </div>
          </div>
          <p>Key character mapping highlights in this example:</p>
          <ul>
            <li><strong>The conjunct ligature कृ:</strong> In standard Unicode, <code>कृ</code> is stored as consonant क (U+0915) plus vowel sign ृ (U+0943). The engine converts this into the Kruti Dev pre-composed glyph code <code>—</code> (em dash).</li>
            <li><strong>Half-letter conjuncts:</strong> The conjunct <code>ध्य</code> in <code>ध्यान</code> is converted to half-letter <code>/</code> followed by <code>;</code> (य) and <code>k</code> (ा).</li>
            <li><strong>Pre-consonant Chhoti-ee matra:</strong> In <code>विवरण</code>, the engine automatically moves the vowel sign <code>ि</code> to the left of consonant <code>व</code>, producing <code>fooj.k</code>.</li>
            <li><strong>Dotted characters (Nukta):</strong> In <code>पढ़ें</code>, the dotted consonant <code>ढ़</code> is formed by pairing <code>&lt;</code> with nukta <code>+</code> (<code>&lt;+</code>).</li>
          </ul>
          <p>Note: On screen, the converted output looks like English letters and punctuation symbols. To view the text as Hindi, paste it into your word processor and select <strong>Kruti Dev 010</strong> as the font.</p>
        `
      },
      {
        title: "How to Use the Converted Text in Word, PageMaker, and InDesign",
        content: `
          <p>Follow these steps to format your converted text in popular desktop applications:</p>
          <h4>In Microsoft Word:</h4>
          <ol>
            <li>Copy the converted text from the right panel of this tool.</li>
            <li>Open your Word document and paste the text (<code>Ctrl + V</code>). It will initially look like random Latin characters (e.g. <code>—i;k ;g i=...</code>).</li>
            <li>Highlight the pasted text with your cursor.</li>
            <li>In the Font drop-down box on the Home tab, select <strong>Kruti Dev 010</strong>. The characters will immediately transform into readable Hindi.</li>
            <li><strong>Important Word Setting:</strong> Turn off Word's automatic curly quotes to prevent character corruption. Go to <em>File &rarr; Options &rarr; Proofing &rarr; AutoCorrect Options &rarr; AutoFormat As You Type</em>, and uncheck <strong>"Straight quotes" with “smart quotes”</strong>. In Kruti Dev, the straight single quote (<code>'</code>) represents the half-letter Sha (<code>श्</code>); if Word automatically curls it into (<code>’</code>), the character will display as an error.</li>
          </ol>
          <h4>In Adobe PageMaker 7.0:</h4>
          <ol>
            <li>Select the <strong>Type Tool (T)</strong> from the toolbox.</li>
            <li>Click inside your text block or layout column.</li>
            <li>Set the active font family to <strong>Kruti Dev 010</strong> in the Control Palette at the bottom of the screen.</li>
            <li>Paste your converted text. It will render in Hindi immediately.</li>
          </ol>
          <h4>In CorelDRAW:</h4>
          <ol>
            <li>Select the <strong>Text Tool (F8)</strong> and click on the canvas to create artistic or paragraph text.</li>
            <li>Paste your converted text and choose <strong>Kruti Dev 010</strong> from the font list.</li>
          </ol>
        `
      },
      {
        title: "Compatibility, Ligatures, and Known Limitations",
        content: `
          <ul>
            <li><strong>Font installation required:</strong> Converted Kruti Dev text cannot display as Hindi on any computer, tablet, phone, or printer where the <code>Kruti Dev 010.ttf</code> font file is missing. If you send the file to someone who does not have Kruti Dev installed, their system will display the underlying Latin characters.</li>
            <li><strong>English words inside Hindi text:</strong> If your Unicode text includes genuine English words (such as names, dates, or technical terms), applying Kruti Dev font to the entire paragraph will convert those English words into Hindi characters as well. Keep English words formatted with a standard Latin font like Arial, Calibri, or Times New Roman.</li>
            <li><strong>Numbers and Punctuation:</strong> Standard English numerals (0–9) and punctuation marks like forward slashes (<code>/</code>) in dates map to specific Hindi characters in Kruti Dev typing. Check date strings and numbers after pasting into your layout.</li>
            <li><strong>Vedic Accents &amp; Rare Sanskrit Symbols:</strong> Standard Kruti Dev 010 is designed for modern Hindi prose. Specialized Vedic accents, rare conjuncts, and archaic Sanskrit symbols are outside the 010 character set and may require specialized academic fonts.</li>
          </ul>
        `
      },
      {
        title: "Common Formatting Problems and Troubleshooting",
        content: `
          <p>If your converted text does not look right after pasting, check these common fixes:</p>
          <ul>
            <li><strong>Problem: Text shows as random English letters like '—i;k ;g' instead of Hindi.</strong><br>
            <em>Fix:</em> This means Kruti Dev font has not been applied to the text, or the font is not installed on your computer. Download and install <code>Kruti Dev 010.ttf</code> into your system fonts folder (<code>C:\\Windows\\Fonts</code>), restart your word processor, select the text, and choose Kruti Dev 010.</li>
            <li><strong>Problem: Half-letter Sha (श्) appears as a closing quote or broken symbol.</strong><br>
            <em>Fix:</em> Word's auto-correct replaced straight quotes (<code>'</code>) with curly smart quotes (<code>’</code>). Turn off Smart Quotes in Word Options, or use Find &amp; Replace (<code>Ctrl + H</code>) to replace curly quotes with standard straight quotes.</li>
            <li><strong>Problem: Text appears corrupted when sent over WhatsApp, Gmail, or social media.</strong><br>
            <em>Fix:</em> Smartphones and web browsers use Unicode and do not support legacy ASCII font remapping. Never send Kruti Dev text across web messaging platforms. Keep web and mobile communications in standard Unicode (Mangal font), and use Kruti Dev exclusively for local print publishing and desktop publishing software.</li>
            <li><strong>Problem: Text was typed in Walkman-Chanakya or Asees.</strong><br>
            <em>Fix:</em> Fonts from other families use different character maps. If your original text uses Chanakya, use our <a href="/chanakya-to-unicode" class="font-semibold text-blue-600 hover:underline">Chanakya to Unicode</a> converter. Unsure which font was used? The <a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a> can identify the font family.</li>
          </ul>
        `
      },
      {
        title: "Typing Tests and Official Document Requirements",
        content: `
          <p>Candidates preparing typing test assignments, court pleadings, or official job applications frequently switch between typing styles.</p>
          <p>Typing test guidelines and format requirements differ across recruitment boards and departments. ConverterForAll does not maintain official exam specifications. Always check your specific official recruitment notification or exam syllabus for the required font and keyboard layout.</p>
        `
      },
      {
        title: "यूनिकोड से कृतिदेव कन्वर्टर (उपयोगी जानकारी एवं निर्देश)",
        content: `
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">यूनिकोड से कृतिदेव कन्वर्टर</h3>
          <p>यह टूल आधुनिक यूनिकोड हिंदी (मंगल फॉन्ट) को पारंपरिक कृतिदेव (कृति देव 010) फॉन्ट में बदलने के लिए बनाया गया है। यदि आप पेजमेकर, कोरल ड्रॉ या पुराने प्रिंटिंग प्रेस सॉफ्टवेयर में काम कर रहे हैं, तो यह कनवर्टर आपके टेक्स्ट को तुरंत सही कृतिदेव कीस्ट्रोक्स में बदल देता है।</p>
          <ol>
            <li>अपना यूनिकोड हिंदी टेक्स्ट ऊपर दिए गए बॉक्स में पेस्ट करें।</li>
            <li>कन्वर्ट हुए टेक्स्ट को कॉपी करें।</li>
            <li>अपने सॉफ्टवेयर (जैसे MS Word या PageMaker) में पेस्ट करने के बाद फॉन्ट को <strong>Kruti Dev 010</strong> चुनें।</li>
          </ol>
          <p>यह पूरी प्रक्रिया आपके कंप्यूटर या मोबाइल के ब्राउज़र में ही संपन्न होती है। आपका कोई भी दस्तावेज़ या व्यक्तिगत डेटा हमारे सर्वर पर अपलोड नहीं होता है।</p>
        `
      },
      {
        title: "Contextual Related Tools & Guides",
        content: `
          <ul>
            <li><a href="/krutidev-to-unicode" class="font-semibold text-blue-600 hover:underline">Kruti Dev to Unicode</a>: Convert legacy Kruti Dev 010 text into modern, universal Unicode Devanagari.</li>
            <li><a href="/chanakya-to-unicode" class="font-semibold text-blue-600 hover:underline">Chanakya to Unicode</a>: Convert Walkman-Chanakya publication text into clean Unicode.</li>
            <li><a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a>: Automatically detect and repair corrupted regional font text.</li>
            <li><a href="/blog/how-to-fix-garbled-kruti-dev-chanakya-asees-font" class="font-semibold text-blue-600 hover:underline">How to Fix Garbled Kruti Dev, Chanakya &amp; Asees Fonts</a>: Practical steps to fix broken font display issues across computers.</li>
            <li><a href="/blog/kruti-dev-font-showing-as-english-in-word" class="font-semibold text-blue-600 hover:underline">Why Kruti Dev Shows as English in Word</a>: Explains how legacy non-Unicode fonts work and how to restore readable Hindi.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does my converted Kruti Dev text look like English letters on screen?</strong><br>A: Kruti Dev is a legacy non-Unicode font that reuses Latin keyboard character codes. It will only display as Hindi once you select the text in your word processor and set the font family to Kruti Dev 010.</p>
          <p><strong>Q: Do I need to install Kruti Dev font to use this converter?</strong><br>A: No. The converter runs inside your browser without any font installation. However, you will need the font installed on your computer to view the output in MS Word or PageMaker.</p>
          <p><strong>Q: Can I share converted Kruti Dev text directly on WhatsApp or email?</strong><br>A: No. Smartphones, email clients, and web platforms use Unicode Devanagari and do not have Kruti Dev installed. If you paste Kruti Dev text into WhatsApp, the recipient will see random English letters. Use standard Unicode (Mangal font) for sharing on phones and web platforms.</p>
          <p><strong>Q: What should I do if half-letter Sha (श्) appears as a quote or broken symbol in Word?</strong><br>A: In Kruti Dev 010, the straight apostrophe key (') represents half-letter Sha. Microsoft Word often automatically converts straight quotes to smart curly quotes (’), which breaks the character in Kruti Dev. Turn off Smart Quotes in Word Options or use Find &amp; Replace to replace curly apostrophes with standard straight quotes.</p>
          <p><strong>Q: Does this converter support DevLys 010?</strong><br>A: DevLys 010 uses a similar layout; try a short sample first to check compatibility with your specific software.</p>
          <p><strong>Q: How does this tool handle English words mixed inside Hindi text?</strong><br>A: Because Kruti Dev maps English keyboard keys directly to Hindi glyphs, genuine English words inside your text will also be converted as if they were Hindi typing. If your document has mixed language text, convert only the Hindi sections or format English words with Arial or Times New Roman after pasting.</p>
          <p><strong>Q: Are my files or text uploaded to any server?</strong><br>A: No. All conversion logic executes locally in your browser using client-side JavaScript. Your text never leaves your device.</p>
        `
      }
    ]
  },

  // CHANAKYA TO UNICODE CONVERTER
  "chanakya-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Chanakya to Unicode Converter",
        content: `
          <p>Convert legacy Walkman-Chanakya Hindi text into universal Unicode (Mangal font) directly in your browser. Built for journalists, authors, editors, and publishers who work with traditional PageMaker or InDesign publishing workflows and need clean text for websites, Word documents, or WhatsApp.</p>
          <p>Walkman-Chanakya is a legacy non-Unicode font that reuses Latin keyboard character codes. Without the specific font file installed, documents display as unreadable English characters. If you encounter corrupted characters in your files, see our guide on <a href="/blog/how-to-fix-garbled-kruti-dev-chanakya-asees-font" class="font-semibold text-blue-600 hover:underline">how to fix garbled regional fonts</a>.</p>
          <p>All conversions run directly on your device using client-side JavaScript. Your articles, drafts, and manuscripts remain on your computer and are never uploaded to any server.</p>
          <h3>How to convert Chanakya to Unicode:</h3>
          <ol>
            <li><strong>Paste or type:</strong> Paste your Chanakya text into the input box on the left.</li>
            <li><strong>Automatic conversion:</strong> The tool automatically translates Chanakya glyphs and repositioned matras into standard Devanagari Unicode.</li>
            <li><strong>Copy or export:</strong> Click Copy to use your converted Hindi text in Word, Google Docs, CMS platforms, or messaging apps.</li>
          </ol>
        `
      },
      {
        title: "Differences Between Chanakya and Kruti Dev",
        content: `
          <ul>
            <li><strong>Distinct character mappings:</strong> Chanakya and Kruti Dev 010 use different keyboard mapping tables. Text typed in Kruti Dev will not convert cleanly with this tool; use our dedicated <a href="/krutidev-to-unicode" class="font-semibold text-blue-600 hover:underline">Kruti Dev to Unicode</a> converter instead.</li>
            <li><strong>DevLys incompatibility:</strong> DevLys fonts follow Kruti Dev layout rules, not Chanakya. DevLys text should not be processed through this tool.</li>
            <li><strong>Font identification:</strong> If you received a document and do not know whether it was typed in Chanakya, Kruti Dev, or Asees, use our <a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a> to auto-detect the font family.</li>
          </ul>
        `
      },
      {
        title: "Publishing and Editorial Guidelines",
        content: `
          <p>Publishing houses and digital media organizations often convert archived print files to Unicode when migrating to web content management systems. Always review converted proofs for specialized ligatures or uncommon Sanskrit conjuncts before publishing final editorial material.</p>
        `
      },
      {
        title: "चाणक्य से यूनिकोड कन्वर्टर (उपयोगी जानकारी एवं निर्देश)",
        content: `
          <p>चाणक्य फॉन्ट का उपयोग मुख्य रूप से पत्र-पत्रिकाओं, समाचार पत्रों और किताबों की छपाई (DTP/PageMaker) में होता रहा है। यह फॉन्ट बिना विशेष फाइल के नए कंप्यूटरों और स्मार्टफोन्स पर सही नहीं दिखता।</p>
          <p>इस टूल की मदद से आप अपने चाणक्य टेक्स्ट को सीधे यूनिकोड (मंगल) में बदल सकते हैं ताकि उसे वेब, ईमेल और सोशल मीडिया पर आसानी से पढ़ा जा सके।</p>
          <ol>
            <li>अपना चाणक्य टेक्स्ट ऊपर दिए गए बॉक्स में पेस्ट करें।</li>
            <li>टूल आपके टेक्स्ट को तुरंत शुद्ध देवनागरी यूनिकोड में बदल देगा।</li>
            <li>परिणामी टेक्स्ट को कॉपी करें और सीधे उपयोग करें।</li>
          </ol>
        `
      },
      {
        title: "Contextual Related Tools & Guides",
        content: `
          <ul>
            <li><a href="/krutidev-to-unicode" class="font-semibold text-blue-600 hover:underline">Kruti Dev to Unicode</a>: Convert legacy Kruti Dev 010 text into universal Unicode Hindi.</li>
            <li><a href="/unicode-to-krutidev" class="font-semibold text-blue-600 hover:underline">Unicode to Kruti Dev</a>: Convert Unicode text back to Kruti Dev 010 for printing presses.</li>
            <li><a href="/font-text-fixer" class="font-semibold text-blue-600 hover:underline">Font Text Fixer</a>: Auto-detect whether garbled text is Kruti Dev, Chanakya, or Asees.</li>
            <li><a href="/blog/how-to-fix-garbled-kruti-dev-chanakya-asees-font" class="font-semibold text-blue-600 hover:underline">How to Fix Garbled Kruti Dev, Chanakya &amp; Asees Fonts</a>: Troubleshooting corrupted Hindi fonts in documents.</li>
            <li><a href="/blog/kruti-dev-font-showing-as-english-in-word" class="font-semibold text-blue-600 hover:underline">Why Kruti Dev Shows as English in Word</a>: Explains font encoding differences and how to fix broken text.</li>
          </ul>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does my Chanakya text appear as English letters in Word or online?</strong><br>A: Chanakya is a legacy non-Unicode font that reuses Latin keyboard character codes. Without the font installed on the reading device, the system displays the underlying English characters. Converting to Unicode gives each letter its universal Devanagari code.</p>
          <p><strong>Q: Does this converter fix Chhoti-ee (ि) matra placement?</strong><br>A: Yes. In Chanakya typing, the matra key is often typed before the consonant for visual rendering. The converter automatically shifts the matra to its logical Unicode position.</p>
          <p><strong>Q: Can I convert Kruti Dev text with this tool?</strong><br>A: No. Kruti Dev and Chanakya use completely different key mapping tables. Use our Kruti Dev to Unicode converter for Kruti Dev or DevLys text.</p>
          <p><strong>Q: Are my documents private?</strong><br>A: Yes. All conversion logic executes entirely inside your browser using client-side JavaScript. Your text is never sent to any server.</p>
        `
      }
    ]
  },

  // UNICODE TO CHANAKYA CONVERTER
  "unicode-to-chanakya": {
    sections: [
      {
        title: "Unicode to Chanakya Font Converter",
        content: "<p>Convert modern <strong>Unicode Hindi text (Mangal font)</strong> into the legacy <strong>Walkman-Chanakya font</strong> format online. This utility is designed specifically for DTP operators, book publishers, and newspaper designers who need to import modern web text back into Adobe PageMaker or InDesign templates that rely on traditional Chanakya typography.</p>"
      },
      {
        title: "How to Use Unicode Hindi in Adobe InDesign using Chanakya",
        content: "<ol><li><strong>Copy Unicode Text:</strong> Copy your modern Hindi text from MS Word, a website, or an email.</li><li><strong>Paste and Convert:</strong> Paste the text into the left panel of this tool. It will instantly convert to Chanakya encoding.</li><li><strong>Copy the Output:</strong> The output will look like random English symbols (e.g., <i>vkt dh rktk [kcj</i>) — this is normal! Copy this output.</li><li><strong>Paste into InDesign:</strong> Paste the symbols into your DTP software. Highlight the text and change the font family to <strong>'Walkman-Chanakya'</strong>. The text will instantly transform into perfect Hindi.</li></ol>"
      },
      {
        title: "Troubleshooting Common Errors",
        content: "<p>If you see broken characters in your design software after conversion, ensure you have the <strong>Walkman-Chanakya</strong> font file (.ttf) installed on your system. Unlike Unicode fonts, legacy fonts are not pre-installed on Windows or macOS. Additionally, ensure you haven't accidentally set your design software's dictionary to auto-correct the 'English' gibberish before applying the font.</p>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Why does the output look like English gibberish?</strong><br>A: Chanakya is a legacy font that works by 'hijacking' English characters and replacing their visual appearance with Hindi glyphs. The gibberish is the exact sequence of English keystrokes needed to generate the Hindi words.</p>
          <p><strong>Q: Does this converter reverse the visual order of matras correctly?</strong><br>A: Yes. Our conversion engine specifically reverses the Unicode logical order back into the visual-typing order required by legacy software, including repositioning the Chhoti-ee matra and Reph.</p>
        `
      }
    ]
  },

  "font-detector": {
    sections: [
      {
        title: "Free Font Detector – Identify Legacy Indian & Asian Fonts",
        content: "<p>If you have copied text from an old document or website and it appears as random English letters instead of Hindi, Nepali, or Punjabi script, this tool identifies which legacy font was used (such as Kruti Dev, DevLys, Chanakya, Preeti, Bijoy, InPage, Zawgyi, or AnmolLipi) and lets you convert it to clean Unicode with one click.</p>"
      },
      {
        title: "Why Does Copied Text Sometimes Turn Into Random English Letters?",
        content: "<p>Before Unicode became the global standard, regional typists used legacy fonts that mapped regional characters directly onto English keyboard keys. When that text is pasted onto a phone or modern computer that lacks those specific font files, the device simply displays the underlying English characters. This detector analyzes character patterns to identify the source font so you can convert it to readable Unicode.</p>"
      },
      {
        title: "Features of the Font Detector",
        content: "<ul><li><strong>Automatic Detection:</strong> Identifies common regional fonts like Kruti Dev, Preeti, Bijoy, InPage, Zawgyi, and AnmolLipi.</li><li><strong>1-Click Conversion:</strong> Once detected, you can jump directly to the correct converter.</li><li><strong>In-Browser Processing:</strong> All detection runs locally in your browser.</li></ul>"
      },
      {
        title: "Step-by-Step Guide",
        content: "<ol><li><strong>Paste Text:</strong> Paste your unreadable text into the detection box above.</li><li><strong>Auto-Detection:</strong> The tool identifies the most likely legacy font.</li><li><strong>Convert:</strong> Click 'Convert to Unicode' to translate the text into modern Unicode.</li><li><strong>Copy:</strong> Copy your readable text for use in Word, WhatsApp, or websites.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: What is the difference between legacy fonts and Unicode?</strong><br>A: Legacy fonts map regional letters onto standard English ASCII keyboard keys and require custom font files. Unicode is supported universally across all modern devices without installing extra fonts.</p>
          <p><strong>Q: Is my pasted text kept private?</strong><br>A: Yes. All font detection and conversion runs locally in your browser.</p>
        `
      }
    ]
  },

  "font-text-fixer": {
    sections: [
      {
        title: "Font Text Fixer – Auto-Detect & Repair Garbled Text",
        content: "<p>Have you ever copied text from an old PDF or Word document only to see random, unreadable characters like <code>çÝæÌðÕ</code> or <code>dÃkrh</code>? Our <strong>Font Text Fixer</strong> uses advanced heuristic detection to automatically identify the corrupted font (whether it's Hindi Kruti Dev, Walkman-Chanakya, or Punjabi Asees) and instantly repairs it into readable, modern <strong>Unicode</strong> text.</p>"
      },
      {
        title: "How to Identify & Repair Corrupted Hindi and Punjabi Fonts",
        content: "<ol><li><strong>Copy the Garbled Text:</strong> Copy the unreadable text from your PDF, Word document, or website.</li><li><strong>Paste into the Fixer:</strong> Paste the text into the left box of our tool.</li><li><strong>Auto-Detection & Repair:</strong> Our engine will analyze character clusters, detect the original font encoding, and instantly generate clean Unicode text on the right.</li><li><strong>Download or Copy:</strong> You can edit the fixed text if needed, then copy it to your clipboard or download it as a <code>.txt</code> file.</li></ol>"
      },
      {
        title: "Common Garbled Font Patterns",
        content: `
          <div class="overflow-x-auto my-4">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">If your text looks like this...</th>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">It's probably this font:</th>
                  <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Language</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-4 py-3 font-mono text-xs">vkt dh rktk [kcj, çÝæÌðÕ</td>
                  <td class="px-4 py-3 font-semibold">Kruti Dev / DevLys</td>
                  <td class="px-4 py-3">Hindi</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-mono text-xs">dÃkrh, Z, f, b, c</td>
                  <td class="px-4 py-3 font-semibold">Walkman-Chanakya</td>
                  <td class="px-4 py-3">Hindi</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/50">
                  <td class="px-4 py-3 font-mono text-xs">dÃk, ih, iB, ¿</td>
                  <td class="px-4 py-3 font-semibold">Asees / Joy</td>
                  <td class="px-4 py-3">Punjabi (Gurmukhi)</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-mono text-xs">Asdfghjkl</td>
                  <td class="px-4 py-3 font-semibold">AnmolLipi</td>
                  <td class="px-4 py-3">Punjabi (Gurmukhi)</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Why does my text look like random English letters?</strong><br>A: Before Unicode became standard, typists used "legacy fonts" that mapped regional characters directly onto English keyboard keys. When you view this text without the specific font installed, your device just shows the underlying English letters.</p>
          <p><strong>Q: What if the auto-detection gets it wrong?</strong><br>A: Sometimes short snippets of text don't contain enough unique characters to auto-detect perfectly. You can use the <strong>Manual Override</strong> dropdown menu above the text box to force the tool to use a specific font converter.</p>
          <p><strong>Q: Is my document data sent to a server?</strong><br>A: No. All heuristic detection and text conversion happens 100% locally in your web browser. Your text is never uploaded to any cloud server.</p>
        `
      }
    ]
  },

  // NEPALI PREETI CONVERTER
  "preeti-to-unicode": {
    sections: [
      {
        title: "Preeti to Unicode Converter – Nepali Font Converter",
        content: "<p>Convert traditional Nepali <strong>Preeti font</strong> text into universal <strong>Nepali Unicode</strong> directly in your browser. Perfect for government notices, news articles, and study materials that need to be read on mobile phones and modern websites.</p>"
      },
      {
        title: "Why Convert Preeti to Unicode?",
        content: "<ul><li><strong>Mobile Compatibility:</strong> Unicode Nepali displays properly on smartphones, tablets, and social media without special font installation.</li><li><strong>Web Publishing:</strong> Unicode text can be searched on Google and shared across WhatsApp, Facebook, and email.</li><li><strong>Local Processing:</strong> Conversion runs locally in your browser.</li></ul>"
      },
      {
        title: "How to Convert Preeti to Unicode",
        content: "<ol><li><strong>Paste Preeti Text:</strong> Paste your legacy Preeti text into the left box.</li><li><strong>Automatic Conversion:</strong> The tool generates clean Nepali Unicode on the right.</li><li><strong>Copy or Download:</strong> Copy your text or save it as a text file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Does this converter support complex Nepali conjunct letters (युक्ताक्षर)?</strong><br>A: Yes. It accurately handles common Nepali conjuncts including त्र, ज्ञ, द्ध, द्व, ष्ट, ष्ठ, and reph (र्).</p>
        `
      }
    ]
  },
  "unicode-to-preeti": {
    sections: [
      {
        title: "Unicode to Preeti Converter – Convert Nepali Unicode to Preeti Font",
        content: "<p>Convert modern standard <strong>Nepali Unicode</strong> into traditional <strong>Preeti font</strong> format for desktop publishers, print presses, and PageMaker templates.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why convert Unicode to Preeti?</strong><br>A: Traditional print houses and newspaper publishing templates often use Preeti font encoding.</p>
        `
      }
    ]
  },

  // BENGALI BIJOY (SUTONNYMJ) CONVERTER
  "bijoy-to-unicode": {
    sections: [
      {
        title: "Bijoy to Unicode Converter – SutonnyMJ to Bangla Unicode",
        content: "<p>Convert legacy <strong>Bijoy (SutonnyMJ)</strong> Bengali font text into standard <strong>Bangla Unicode</strong> online. Helpful for students, journalists, and publishers converting older documents into readable format for web and mobile.</p>"
      },
      {
        title: "Why Use This Converter?",
        content: "<ul><li><strong>Conjunct Support:</strong> Translates Bengali conjunct letters, ref, j-fola, and r-fola.</li><li><strong>Local Browser Processing:</strong> Fast conversion without sending documents across the network.</li><li><strong>Easy Export:</strong> 1-click Copy and download options.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: What is the difference between SutonnyMJ and Bangla Unicode?</strong><br>A: SutonnyMJ is an older ASCII-based font. Unicode is the international standard supported by all modern operating systems and mobile devices.</p>
        `
      }
    ]
  },
  "unicode-to-bijoy": {
    sections: [
      {
        title: "Unicode to Bijoy Converter – Convert Bangla Unicode to SutonnyMJ",
        content: "<p>Convert modern <strong>Bangla Unicode</strong> text into legacy <strong>Bijoy (SutonnyMJ)</strong> format for use in desktop publishing and graphic design software.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does Unicode text break in older design tools?</strong><br>A: Older versions of graphics software require ASCII fonts like SutonnyMJ. Converting your Unicode Bangla to Bijoy resolves broken characters in those applications.</p>
        `
      }
    ]
  },
  "sutonnymj-to-unicode": {
    sections: [
      {
        title: "SutonnyMJ to Unicode Converter – Convert SutonnyMJ Bengali Font Online",
        content: "<p>Convert text written in <strong>SutonnyMJ font</strong> to standard <strong>Bangla Unicode</strong> format in your browser.</p>"
      }
    ]
  },
  "unicode-to-sutonnymj": {
    sections: [
      {
        title: "Unicode to SutonnyMJ Converter – Convert Bangla Unicode to SutonnyMJ",
        content: "<p>Convert standard <strong>Bangla Unicode</strong> text to legacy <strong>SutonnyMJ</strong> font format for desktop publishing and printing.</p>"
      }
    ]
  },

  // URDU INPAGE CONVERTER
  "inpage-to-unicode": {
    sections: [
      {
        title: "Converting InPage Phonetic Text to Urdu Unicode",
        content: "<p>Convert <strong>InPage phonetic key sequences</strong> into standard universal <strong>Urdu Unicode</strong> text. If you have text written using standard InPage phonetic keystrokes, this tool turns it into standard Urdu script that you can read, copy, and share across smartphones, websites, and modern word processors.</p>"
      },
      {
        title: "How It Works",
        content: "<p>InPage's phonetic keyboard assigns Urdu letters to familiar English keys (such as <code>a</code> for Alif, <code>b</code> for Bay, and <code>c</code> for Che). This tool translates those key sequences back into universal Unicode characters. It runs directly inside your browser, so your text is converted locally on your device without being uploaded to any server.</p>"
      },
      {
        title: "Supported Layout Profile & Limitations",
        content: "<p>This converter implements the standard built-in <strong>InPage Classic Phonetic Keyboard</strong> layout (verified against InPage 2.40 and 3.05). Please note that it does not convert proprietary InPage binary document files (.inp) or 8-bit clipboard bytecodes. Third-party Windows layouts like CRULP/CLE or native Windows Urdu keyboards use different key assignments.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Can I upload an .inp file directly here?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">No. This tool converts phonetic text strings, not binary InPage (.inp) project files. To convert text from an InPage document, open the file in InPage, export or copy your text, and paste the characters here.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Why are English words converted to Urdu characters in this direction?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Because the converter treats Latin letters as phonetic typing keys. For example, typing \"cat\" translates into چ (c) + ا (a) + ت (t). URLs and email addresses are automatically detected and protected so they stay in English.</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Privacy & Processing",
        content: "<p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.</p>"
      }
    ]
  },
  "unicode-to-inpage": {
    sections: [
      {
        title: "Converting Urdu Unicode to InPage Phonetic Text",
        content: "<p>Convert modern <strong>Urdu Unicode</strong> text into standard <strong>InPage Classic Phonetic Keyboard</strong> key sequences. If you need a reference for how to type an Urdu article in InPage, or want to transcribe Unicode text into phonetic key sequences for typing tools, this converter handles the character mapping for you.</p>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste your Unicode text:</strong> Enter or paste standard Urdu text into the input box.</li><li><strong>Review the phonetic keys:</strong> The tool generates the corresponding key sequences based on InPage's classic phonetic layout.</li><li><strong>Copy and use:</strong> Copy the output to guide your typing or for editors that accept phonetic input.</li></ol>"
      },
      {
        title: "Important Note on InPage Clipboard Compatibility",
        content: "<p>Older desktop versions of InPage (such as InPage 2000, 2009, and 3.x) use a proprietary 8-bit internal encoding (CP1252 bytecodes) for direct pasting into text boxes. <strong>Pasting ASCII phonetic output directly via Ctrl+V into an InPage document inserts Latin letters, not Nastaliq Urdu text.</strong> This tool provides the exact key stream according to the official InPage phonetic keyboard layout, but does not generate proprietary clipboard bytecodes.</p>"
      },
      {
        title: "Supported Layout Profile & Narrowed Scope",
        content: "<p>This converter strictly targets the standard <strong>InPage Classic Built-in Phonetic Keyboard</strong> (verified against InPage 2.40 / 3.05). It does not support auxiliary Quranic Harakaat input modes from InPage 3.6x (which reassign consonant keys to Arabic grammatical abbreviations) or alternative layouts like CRULP/CLE.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Why doesn't Ctrl+V paste phonetic keys as Urdu in InPage?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">InPage desktop software expects proprietary 8-bit character codes on the Windows clipboard when pasting Nastaliq text. Plain phonetic key sequences (like \"ardw\") are standard Latin characters, so pasting them directly inserts English letters into InPage text frames.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">How do Shift keys map to Urdu letters and diacritics?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">In the InPage Classic Phonetic layout, capital letters represent Shift-key combinations. For example, Shift+C (C) types ث, Shift+S (S) types ص, Shift+W (W) types Tashdeed (ّ), Shift+Y (Y) types Zabar (َ), and Shift+P (P) types Pesh (ُ).</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Are website links and email addresses protected?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Yes. Web addresses (http://, https://, www) and email addresses are automatically isolated into protected segments so their Latin characters and punctuation are preserved without being converted.</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Privacy & Processing",
        content: "<p>Most of our tools run directly inside your browser so your documents stay on your device. For complex conversions that need temporary cloud processing, files are handled in memory and deleted immediately after download.</p>"
      }
    ]
  },

  // BURMESE ZAWGYI CONVERTER
  "zawgyi-to-unicode": {
    sections: [
      {
        title: "Zawgyi to Unicode Converter",
        content: "<p>Instantly convert legacy <strong>Myanmar Zawgyi font</strong> text to the international standard <strong>Myanmar Unicode</strong> format. Since Zawgyi uses a non-standard character encoding, copying and pasting Zawgyi text onto modern smartphones or operating systems often results in unreadable characters or broken text rendering. This tool translates the underlying characters so they display perfectly on any Unicode-compliant device.</p>"
      },
      {
        title: "Why Convert Zawgyi to Unicode?",
        content: "<ul><li><strong>Modern Device Support:</strong> Zawgyi is largely unsupported on modern Android, iOS, and Windows devices without custom font installations. Unicode is supported natively.</li><li><strong>Fix Broken Text:</strong> If you receive a message or download an old document where the Burmese text looks scrambled, converting it to Unicode restores readability.</li><li><strong>Search & Indexing:</strong> Search engines and modern databases require Unicode. Text stored in Zawgyi cannot be accurately searched online.</li></ul>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste your text:</strong> Paste the unreadable Zawgyi text into the input box.</li><li><strong>Auto-conversion:</strong> The tool instantly converts the text into standard Myanmar Unicode using your browser.</li><li><strong>Copy and Use:</strong> Copy the corrected text. You can now safely share it on WhatsApp, Facebook, or use it in Microsoft Word.</li></ol>"
      },
      {
        title: "Privacy & Processing",
        content: "<p>Your text privacy is fully protected. All Zawgyi to Unicode conversion happens locally in your web browser. No data is sent to our servers or stored in the cloud.</p>"
      }
    ]
  },
  "unicode-to-zawgyi": {
    sections: [
      {
        title: "Unicode to Zawgyi Converter",
        content: "<p>Instantly convert standard <strong>Myanmar Unicode</strong> text into the legacy <strong>Zawgyi font</strong> format. While Unicode is the modern global standard, many older smartphones, specialized applications, and legacy databases in Myanmar still rely on the Zawgyi encoding. This tool allows you to translate modern text backward so it renders correctly on older systems.</p>"
      },
      {
        title: "When Do You Need Zawgyi Conversion?",
        content: "<ul><li><strong>Legacy Hardware:</strong> Viewing text on older mobile phones or computers that were configured before Myanmar Unicode became the default standard.</li><li><strong>Old Documents:</strong> Inserting modern text into an older Word document, PDF, or design file (like older versions of Adobe PageMaker or Photoshop) that specifically requires the Zawgyi font.</li><li><strong>Specialized Databases:</strong> Updating legacy databases or websites that have not yet migrated to Unicode.</li></ul>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste your text:</strong> Paste the modern Myanmar Unicode text into the input box.</li><li><strong>Auto-conversion:</strong> The tool instantly converts the text into the Zawgyi encoding structure.</li><li><strong>Copy and Use:</strong> Copy the text and paste it into your legacy application. <em>Note: The text may look broken on your current screen unless you have the Zawgyi font installed, but it will work perfectly on the target legacy device.</em></li></ol>"
      },
      {
        title: "Privacy & Processing",
        content: "<p>Your text privacy is fully protected. All Unicode to Zawgyi conversion happens locally in your web browser. No data is sent to our servers or stored in the cloud.</p>"
      }
    ]
  },

  // WEB FONT CONVERTER
  "web-font-converter": {
    sections: [
      {
        title: "Web Font Converter (TTF, OTF, WOFF, WOFF2)",
        content: "<p>Instantly convert your desktop fonts into web-ready formats. Whether you need to compress a bulky TTF into a fast-loading WOFF2, or extract a TTF from a WOFF file, this tool handles it entirely within your browser.</p>"
      },
      {
        title: "100% Client-Side Privacy",
        content: "<p>Licensed fonts can be expensive. Uploading them to a remote conversion server risks piracy and violates many commercial font licenses. Our converter uses advanced WebAssembly to process the fonts directly on your computer's memory. <strong>Your font files never leave your device.</strong></p>"
      },
      {
        title: "Why use WOFF2?",
        content: "<p>WOFF2 (Web Open Font Format 2) is the modern standard for web typography. It offers a ~30% better compression rate than the original WOFF format, significantly speeding up your website's load time and improving your Core Web Vitals.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">What is the difference between TTF and WOFF2?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">TTF (TrueType Font) is a standard desktop font format meant for operating systems and design software. WOFF2 is a highly compressed font format specifically designed for fast loading on websites. You should always convert TTF to WOFF2 before using it in CSS.</p>
              </div>
            </div>
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="mt-4">
              <h3 itemprop="name">Can I install WOFF2 files on my Windows or Mac computer?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">No. Operating systems do not natively support WOFF2 for system-wide installation. If you have a WOFF2 file that you want to use in Microsoft Word, Photoshop, or Figma, you must convert the WOFF2 file back to TTF or OTF first.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  "ttf-to-woff2": {
    sections: [
      {
        title: "Convert TTF to WOFF2",
        content: "<p>Convert your TrueType Fonts (TTF) into the highly compressed WOFF2 format for the web. This tool runs 100% locally in your browser, keeping your premium fonts secure from unauthorized uploads.</p>"
      },
      {
        title: "Why convert TTF to WOFF2?",
        content: "<p>While TTF works on the web, it is not compressed. Converting a TTF file to WOFF2 can reduce its file size by up to 50%, resulting in faster page loads and better SEO rankings.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Is it better to self-host WOFF2 fonts or use Google Fonts?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">Self-hosting your own converted WOFF2 fonts is often faster and much more privacy-friendly than using Google Fonts, as it eliminates extra DNS lookups and prevents third-party tracking scripts from running on your site.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  },
  "otf-to-woff2": {
    sections: [
      {
        title: "Convert OTF to WOFF2",
        content: "<p>Quickly compress your OpenType Fonts (OTF) into WOFF2 web fonts. Our tool runs locally on your device, ensuring complete privacy for your licensed typography.</p>"
      }
    ]
  },
  "woff2-to-ttf": {
    sections: [
      {
        title: "Extract WOFF2 to TTF",
        content: "<p>Need to use a web font in your desktop design software like Photoshop or Illustrator? This tool perfectly decompresses WOFF2 files back into standard TTF format, entirely within your browser.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <div itemscope itemtype="https://schema.org/FAQPage">
            <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <h3 itemprop="name">Does converting WOFF2 to TTF lose quality?</h3>
              <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">No. WOFF2 is simply a compressed container for the original TTF or OTF font data. Converting it back to TTF restores the exact original font file perfectly with zero quality loss.</p>
              </div>
            </div>
          </div>
        `
      }
    ]
  }
};
