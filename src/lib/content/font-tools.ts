import { generatedPunjabiProfiles } from "./punjabi-font-profiles";

export const fontToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  ...generatedPunjabiProfiles,

  // UNICODE TO RAAVI (GURMUKHI OPEN-TYPE FONT GUIDE)
  "unicode-to-raavi": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Understanding Raavi Font and Unicode Gurmukhi",
        content: "<p><strong>Raavi</strong> is the standard OpenType font developed by Microsoft for displaying Punjabi Gurmukhi on Windows. Unlike older legacy fonts (such as Asees, Satluj, or Joy) which mapped Gurmukhi characters onto English ASCII keystrokes, Raavi natively follows the international Unicode standard. This means that if your Punjabi text is already in Unicode, <strong>no file or text conversion is needed to use Raavi font</strong>.</p>"
      },
      {
        title: "How to Display and Format Unicode Text in Raavi Font",
        content: "<ol><li><strong>Copy Unicode Text:</strong> Copy your Punjabi text from any website, email, or modern document.</li><li><strong>Paste into Word or Docs:</strong> Paste the text into your document editor.</li><li><strong>Select Font:</strong> Highlight the text and choose <strong>'Raavi'</strong> (or 'Nirmala UI') from your font dropdown menu. The text will display in the selected typeface when that font supports Gurmukhi Unicode.</li></ol>"
      },
      {
        title: "Converting Legacy Font Text to Unicode",
        content: "<p>If copied text from a legacy-font document appears as Latin or extended characters because its original font is missing, first use the matching legacy-font-to-Unicode converter below. After conversion, the resulting Unicode text can be displayed with Raavi or another installed Gurmukhi-compatible font:</p><ul><li><a href=\"/asees-to-unicode\" class=\"text-blue-600 dark:text-blue-400 hover:underline\"><strong>Asees to Unicode Converter</strong></a> – For copied Asees passages and older typed text.</li><li><a href=\"/satluj-to-unicode\" class=\"text-blue-600 dark:text-blue-400 hover:underline\"><strong>Satluj to Unicode Converter</strong></a> – For copied text from newspaper archives and PageMaker layouts.</li><li><a href=\"/joy-to-unicode\" class=\"text-blue-600 dark:text-blue-400 hover:underline\"><strong>Joy to Unicode Converter</strong></a> – For copied text encoded in Joy font.</li><li><a href=\"/anmollipi-to-unicode\" class=\"text-blue-600 dark:text-blue-400 hover:underline\"><strong>AnmolLipi to Unicode Converter</strong></a> – For copied text from books and notes using AnmolLipi.</li><li><a href=\"/gurbani-akhar-to-unicode\" class=\"text-blue-600 dark:text-blue-400 hover:underline\"><strong>Gurbani Akhar to Unicode Converter</strong></a> – For copied Gurbani passages using the GurbaniLipi/AnmolLipi profile.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do I need to convert Unicode text to use Raavi font?</strong><br>A: No. Raavi is an OpenType Unicode font, not an older ASCII font. Unicode Punjabi text already displays directly in Raavi font without requiring any conversion.</p>
          <p><strong>Q: Why does my Punjabi text show as English letters in Microsoft Word?</strong><br>A: If your text appears as random English characters, it was typed in a legacy non-Unicode font like Asees or Satluj. Converting that text to Unicode using our font converters will allow it to display properly in Raavi font.</p>
          <p><strong>Q: Is Raavi required for every Punjab government typing test?</strong><br>A: Requirements can differ by recruitment and test. Check the current official notification for the required script, input method, keyboard layout and font. This guide explains how to display Unicode Gurmukhi in Raavi; it does not certify the requirements of a particular examination.</p>
        `
      }
    ]
  },

  // KRUTI DEV TO UNICODE / MANGAL CONVERTER
  "krutidev-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Kruti Dev to Unicode & Mangal Font Converter",
        content: "<p>Convert legacy <strong>Kruti Dev (010, 011, 016, 020, 021) and DevLys</strong> text into universal <strong>Unicode Hindi (Mangal font)</strong> directly in your browser. Whether you are preparing for typing practice, drafting documents, or sharing Hindi text on WhatsApp and websites, this tool maps legacy key codes to standard Devanagari Unicode characters.</p>"
      },
      {
        title: "What is Mangal Font and Why is it Useful?",
        content: "<p><strong>Mangal</strong> is the standard Unicode Devanagari font developed for Indian languages. Unlike legacy fonts like Kruti Dev (which require specific <code>.ttf</code> font files to be installed on each computer), <strong>Unicode text works across smartphones, computers, tablets, and web browsers</strong>.</p><ul><li><strong>Universal Readability:</strong> Converted Unicode text can be pasted into WhatsApp, email, Google Docs, and web portals without missing glyphs.</li><li><strong>In-Browser Processing:</strong> Character mapping runs directly inside your web browser using local conversion tables rather than uploading documents to a backend queue.</li><li><strong>Supports Old Archive Files:</strong> Useful when copying Hindi paragraphs out of older PageMaker files, government forms, or typing exam sheets.</li></ul>"
      },
      {
        title: "How to Convert Kruti Dev to Unicode",
        content: "<ol><li><strong>Paste Kruti Dev Text:</strong> Paste your Kruti Dev or DevLys text into the left box.</li><li><strong>Automatic Conversion:</strong> The tool translates your text into readable Unicode on the right.</li><li><strong>Copy Output:</strong> Click 'Copy' to copy the converted text to your clipboard for use in modern documents and apps.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ) – Mangal & Kruti Dev",
        content: `
          <p><strong>Q: Is Unicode Hindi the same as Mangal font?</strong><br>A: Yes. Mangal is the default font used by Windows to display standard Devanagari Unicode. Any Unicode text generated by this converter will display in Mangal or another system Devanagari font without extra installs.</p>
          <p><strong>Q: Why does my Kruti Dev text show as English letters like 'd', 'j', 'k' on WhatsApp?</strong><br>A: Kruti Dev mapped English ASCII keyboard keys to Hindi glyph shapes. Without the Kruti Dev font installed, devices display the underlying English letters. Converting to Unicode replaces those ASCII codes with standard Devanagari characters.</p>
          <p><strong>Q: What if my text includes mixed English words or numbers?</strong><br>A: Legacy ASCII encoding shares keys with English letters, so English words pasted inside a Kruti Dev block may also get mapped as Hindi keys. Keep purely English sentences separate before converting, then paste them back afterward.</p>
        `
      }
    ]
  },

  // UNICODE (MANGAL) TO KRUTI DEV CONVERTER
  "unicode-to-krutidev": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode (Mangal) to Kruti Dev 010 Converter",
        content: "<p>Convert modern <strong>Unicode Hindi text (Mangal font)</strong> into legacy <strong>Kruti Dev 010</strong> font encoding directly inside your browser. Built for desktop publishing (DTP) operators, print media presses, PageMaker and CorelDRAW designers, and exam typists who need standard Unicode Devanagari mapped back to Remington Kruti Dev keystrokes.</p>"
      },
      {
        title: "Why Convert Mangal / Unicode Back to Kruti Dev?",
        content: "<p>Although websites, smartphones, and modern Windows applications use Devanagari Unicode by default, many Indian print shops, government typing tests, and legacy layout workflows still depend on <code>Kruti Dev 010</code>.</p><ul><li><strong>PageMaker, CorelDRAW & Photoshop Print Layouts:</strong> Older desktop publishing templates built around Kruti Dev break or show boxes when modern Unicode Hindi is pasted directly. Converting back to Kruti Dev preserves existing print typography.</li><li><strong>Traditional Typists & Court Work:</strong> Offline printing presses and court typists who work inside Kruti Dev templates can prepare text online in Unicode and convert it cleanly for desktop layout files.</li><li><strong>Client-Side Character Mapping:</strong> The converter reverses Unicode matras, half-letters (halant conjuncts), and special glyphs (such as reph र् and short i ि placement) using in-browser mapping rules.</li></ul>"
      },
      {
        title: "How to Convert Unicode Hindi to Kruti Dev",
        content: "<ol><li><strong>Paste Unicode Text:</strong> Copy your Hindi text from WhatsApp, Google Docs, an AI assistant, or a Hindi news site and paste it into the Unicode input box.</li><li><strong>Generate Kruti Dev Encoding:</strong> The tool translates Devanagari Unicode characters and vowel signs into matching Kruti Dev 010 ASCII codes.</li><li><strong>Copy the Raw Output:</strong> Click Copy to place the encoded characters on your clipboard (they will briefly look like English symbols until the font is applied).</li><li><strong>Apply the Kruti Dev Font:</strong> Paste the output into MS Word, PageMaker, or CorelDRAW and set the font family to <strong>Kruti Dev 010</strong>.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ) – Unicode to Kruti Dev",
        content: `
          <p><strong>Q: Why does the converted Kruti Dev output look like scrambled English letters?</strong><br>A: That is expected. Kruti Dev is a legacy ASCII-mapped font, meaning Hindi shapes are stored at English key positions. Once you paste the output into MS Word, PageMaker, or CorelDRAW and switch the font to <strong>Kruti Dev 010</strong>, the Hindi text renders properly.</p>
          <p><strong>Q: Does this tool handle tricky Unicode combinations like 'र्' (Reph) and 'ि' (Chhoti Ee ki Matra)?</strong><br>A: Yes. Unicode stores vowel signs after consonants, whereas Kruti Dev stores 'ि' before the consonant and 'र्' differently. The mapping engine reorders those visual clusters during conversion.</p>
          <p><strong>Q: Do I need to install Kruti Dev 010 to convert text here?</strong><br>A: No font install is required inside your browser to run the conversion itself, though your computer or target print system will need the Kruti Dev 010 <code>.ttf</code> font installed to display the final pasted layout.</p>
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
          <div class="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm font-medium">
            <strong>Notice:</strong> This converter is being verified. Please check the output before relying on it.
          </div>
          <p>Convert legacy Walkman-Chanakya Hindi text into universal Unicode (Mangal font) directly in your browser. All conversions run locally on your device using client-side JavaScript.</p>
          <ol>
            <li>Paste your Chanakya text into the input box.</li>
            <li>The tool translates characters into standard Devanagari Unicode.</li>
            <li>Copy the converted text to use in modern applications.</li>
          </ol>
        `
      }
    ]
  },

  "unicode-to-chanakya": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to Chanakya Converter",
        content: `
          <div class="p-4 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm font-medium">
            <strong>Notice:</strong> This converter is being verified. Please check the output before relying on it.
          </div>
          <p>Convert modern Unicode Hindi text into legacy Walkman-Chanakya font encoding directly in your browser. All conversions run locally on your device.</p>
          <ol>
            <li>Paste your Unicode Hindi text into the input box.</li>
            <li>The tool translates characters into Chanakya font encoding.</li>
            <li>Copy the output and apply the Walkman-Chanakya font in your desktop software.</li>
          </ol>
        `
      }
    ]
  },

  "font-detector": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Free Font Detector – Identify Legacy Hindi & Punjabi Fonts",
        content: "<p>If you copied text from an old PDF, PageMaker file, or government form and it shows up as scrambled English letters instead of readable Hindi or Punjabi script, this detector inspects character frequency patterns to identify whether the snippet uses <strong>Kruti Dev 010</strong>, <strong>Walkman-Chanakya</strong>, <strong>Asees</strong>, <strong>AnmolLipi</strong>, or modern <strong>Unicode Devanagari / Gurmukhi</strong>, then links you to the right converter.</p>"
      },
      {
        title: "Why Copied Text Turns Into Random English Letters",
        content: "<p>Before Unicode became standard across phones and web browsers, desktop typists relied on ASCII-mapped legacy fonts that stored regional glyphs on English keyboard keys. When you copy that text onto a device without the matching <code>.ttf</code> font installed, your screen shows the underlying English letters and punctuation symbols instead of readable Hindi or Punjabi words. Guessing the wrong mapping produces garbled output, so checking the encoding first saves trial and error.</p>"
      },
      {
        title: "What This Detector Can Identify",
        content: "<ul><li><strong>Hindi Legacy Encodings:</strong> Distinguishes between Kruti Dev 010 and Walkman-Chanakya patterns using characteristic vowel and consonant clusters.</li><li><strong>Punjabi Legacy Encodings:</strong> Separates Asees and AnmolLipi strings from uppercase/lowercase keystroke signatures.</li><li><strong>Unicode Script Check:</strong> Confirms whether pasted text is already standard Unicode Devanagari or Unicode Gurmukhi so you do not convert readable Unicode by mistake.</li><li><strong>Client-Side Pattern Analysis:</strong> Heuristic scoring runs directly in your browser without sending pasted snippets to a server.</li></ul>"
      },
      {
        title: "How to Use the Font Identifier",
        content: "<ol><li><strong>Paste a Sample Snippet:</strong> Paste at least two or three full words (a full sentence improves accuracy) into the detection box above.</li><li><strong>Review the Match & Confidence Score:</strong> Inspect the detected font name, script language, and match percentage shown in the result card.</li><li><strong>Open the Matching Tool:</strong> Follow the suggested link to <a href='/krutidev-to-unicode'>Kruti Dev to Unicode</a>, <a href='/chanakya-to-unicode'>Chanakya to Unicode</a>, or <a href='/font-text-fixer'>Font Text Fixer</a> (which also supports DevLys and Joy manual selection).</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Does this tool convert text directly or only detect the font?</strong><br>A: It is a font identification tool rather than a standalone converter. Once it identifies whether your snippet is Kruti Dev 010, Walkman-Chanakya, Asees, AnmolLipi, or already Unicode, you can open the matching converter or use our <a href="/font-text-fixer">Font Text Fixer</a> to decode it.</p>
          <p><strong>Q: What if my sample shows 'Unknown' or matches the wrong font?</strong><br>A: Short one-word snippets sometimes lack unique glyph combinations. Try pasting a longer paragraph, or open the Font Text Fixer and pick a manual encoding option such as Kruti Dev 010, Walkman-Chanakya, DevLys, Asees, Joy, or AnmolLipi.</p>
          <p><strong>Q: Are fonts like Preeti (Nepali) or Bijoy (Bengali) supported here?</strong><br>A: No. Automatic detection currently checks Kruti Dev 010, Walkman-Chanakya, Asees, AnmolLipi, Unicode Devanagari, and Unicode Gurmukhi.</p>
        `
      }
    ]
  },

  "font-text-fixer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Font Text Fixer – Auto-Detect & Repair Garbled Text",
        content: "<p>Have you ever copied text from an old PDF or Word document only to see unreadable ASCII characters like <code>çÝæÌðÕ</code> or <code>dÃkrh</code>? Our <strong>Font Text Fixer</strong> uses heuristic pattern scoring to identify common legacy Hindi and Punjabi encodings (such as <strong>Kruti Dev 010</strong>, <strong>Walkman-Chanakya</strong>, <strong>Asees</strong>, and <strong>AnmolLipi</strong>) and repair them into readable modern <strong>Unicode</strong> text, with manual override support for <strong>DevLys</strong> and <strong>Joy</strong> as well.</p>"
      },
      {
        title: "How to Identify & Repair Corrupted Hindi and Punjabi Fonts",
        content: "<ol><li><strong>Copy the Garbled Text:</strong> Copy the unreadable text from your PDF, Word document, or website.</li><li><strong>Paste into the Fixer:</strong> Paste the text into the left box of our tool.</li><li><strong>Auto-Detection & Repair:</strong> Our engine analyzes character clusters, scores likely Hindi or Punjabi legacy encodings, and outputs clean Unicode text on the right (or lets you pick one of the 6 manual overrides: Kruti Dev 010, Walkman-Chanakya, DevLys, Asees, Joy, or AnmolLipi).</li><li><strong>Download or Copy:</strong> You can edit the fixed text if needed, then copy it to your clipboard or download it as a <code>.txt</code> file.</li></ol>"
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
                  <td class="px-4 py-3 font-mono text-xs">siq sRI Akwl</td>
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
          <p><strong>Q: Why does my text look like random English letters?</strong><br>A: Before Unicode became standard, typists used legacy ASCII fonts that mapped regional characters directly onto English keyboard keys. When you view that text without the specific font installed, your device shows the underlying English letters.</p>
          <p><strong>Q: What if automatic detection guesses the wrong font?</strong><br>A: Short snippets of text sometimes lack enough distinctive character clusters to auto-detect reliably. Use the <strong>Manual Override</strong> dropdown menu above the text box to force one of the supported converters: <strong>Kruti Dev 010</strong>, <strong>Walkman-Chanakya</strong>, <strong>DevLys</strong>, <strong>Asees</strong>, <strong>Joy</strong>, or <strong>AnmolLipi</strong>.</p>
          <p><strong>Q: Is pasted text sent to a backend server?</strong><br>A: No. Heuristic scoring and character replacement run directly inside your web browser using local font conversion tables rather than uploading your text to a cloud queue.</p>
        `
      }
    ]
  },

  // NEPALI PREETI CONVERTER
  "preeti-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Preeti to Unicode Converter – Nepali Font Converter",
        content: "<p>Convert traditional Nepali <strong>Preeti font</strong> text into universal <strong>Nepali Unicode</strong> directly inside your web browser. Ideal for government notices, news articles, and study materials that need to display clearly across smartphones, web browsers, and modern office documents.</p>"
      },
      {
        title: "Why Convert Preeti to Unicode?",
        content: "<ul><li><strong>Mobile Compatibility:</strong> Unicode Nepali renders natively on Android, iOS, Mac, and Windows without installing separate Preeti <code>.ttf</code> font files.</li><li><strong>Web &amp; Search Support:</strong> Unicode Devanagari text indexes properly on web portals and shares cleanly in WhatsApp, Google Docs, and email.</li><li><strong>Browser Processing:</strong> Character mapping runs directly inside your browser without uploading passages to a conversion server.</li></ul><p>When migrating legacy reports, exam notices, or municipal circulars from desktop files into WordPress, Google Docs, or portals, switching to Unicode ensures search engines and mobile readers render vowel signs and half-letters consistently across devices without requiring users to download Preeti fonts.</p>"
      },
      {
        title: "How to Convert Preeti to Unicode",
        content: "<ol><li><strong>Paste Preeti text:</strong> Paste your legacy Preeti text into the left input editor.</li><li><strong>Review Unicode conversion:</strong> The browser maps ASCII keys, vowel signs, and Devanagari conjuncts into Unicode on the right.</li><li><strong>Copy or save:</strong> Copy the clean Unicode text or download it as a <code>.txt</code> or <code>.docx</code> file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Does this converter handle complex Nepali conjuncts and reph?</strong><br>A: It maps common Nepali conjunct combinations (such as त्र, ज्ञ, द्ध, द्व, ष्ट, ष्ठ, and reph र्). Always proofread official legal or government drafts carefully before publishing.</p>
          <p><strong>Q: Can I edit the converted Nepali Unicode right inside my phone or Google Docs?</strong><br>A: Yes. Once converted, Unicode text can be copied, searched, edited, and styled in any modern mobile app or web editor.</p>
          <p><strong>Q: Are my Nepali documents uploaded to a server?</strong><br>A: No. Character mapping runs inside browser memory without sending pasted text to an external backend.</p>
        `
      }
    ]
  },
  "unicode-to-preeti": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to Preeti Converter – Convert Nepali Unicode to Preeti Font",
        content: "<p>Convert modern standard <strong>Nepali Unicode</strong> back into traditional <strong>Preeti font</strong> ASCII codes inside your browser. Built for print houses, newspaper compositors, and desktop publishing operators working inside legacy Preeti templates.</p>"
      },
      {
        title: "Why Desktop Presses Still Need Preeti",
        content: "<p>Older PageMaker, CorelDRAW, and press templates fail or show boxes when standard Devanagari Unicode is pasted in directly. Reversing Unicode back into Preeti keystrokes keeps existing layout typography intact once the <strong>Preeti</strong> font family is selected in your desktop software.</p><p>Publishing houses, flex printers, and government typists often maintain multi-column PageMaker, InDesign, or QuarkXPress master templates locked to legacy TrueType font metrics. Converting standard Devanagari Unicode text into Preeti keystrokes lets operators drop email or web copy straight into print layouts without retyping entire columns manually.</p>"
      },
      {
        title: "How to Convert Unicode Nepali to Preeti",
        content: "<ol><li><strong>Paste Unicode text:</strong> Paste your readable Devanagari Nepali text into the input box above.</li><li><strong>Generate Preeti output:</strong> The converter reorders Devanagari vowel signs and conjuncts into legacy Preeti ASCII characters.</li><li><strong>Copy and apply the Preeti font:</strong> Paste the output into Word or PageMaker and select <em>Preeti</em> as your document font.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does the converted Preeti text show as English characters here?</strong><br>A: Preeti maps Nepali glyph shapes onto English ASCII keys; switching the font menu inside MS Word or PageMaker to <strong>Preeti</strong> renders the proper Devanagari text.</p>
          <p><strong>Q: Do numbers and punctuation convert properly to Preeti?</strong><br>A: Standard Devanagari digits and punctuation map to matching Preeti codes, though formatted tables or English URLs inside mixed passages should be pasted separately.</p>
          <p><strong>Q: Is typed text transmitted to an external server?</strong><br>A: No. Conversion runs inside browser JavaScript without sending pasted text across the network.</p>
        `
      }
    ]
  },

  // BENGALI BIJOY (SUTONNYMJ) CONVERTER
  "bijoy-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Bijoy to Unicode Converter – SutonnyMJ to Bangla Unicode",
        content: "<p>Convert legacy <strong>Bijoy (SutonnyMJ)</strong> Bengali ASCII text into standard <strong>Bangla Unicode</strong> directly in your browser. Useful for journalists, publishers, and students migrating older Print/Word documents onto websites and smartphones.</p>"
      },
      {
        title: "Why Convert Bijoy (SutonnyMJ) to Bangla Unicode?",
        content: "<ul><li><strong>Conjunct &amp; Folā Mapping:</strong> Translates Bengali conjunct clusters, reph, jo-fola, and ro-fola sequences into standard Unicode order.</li><li><strong>Universal Device Display:</strong> Converted Bangla Unicode opens properly on phones, websites, and Google Docs without installing SutonnyMJ fonts.</li><li><strong>Browser Processing:</strong> Character conversion runs inside browser memory without sending documents to a conversion server.</li></ul><p>Bangla newspapers, blogs, school question archives, and web portals use Unicode encoding because mobile browsers cannot read ASCII-mapped SutonnyMJ documents without font embedding. Converting Bijoy text into Unicode restores searchability, copy-paste sharing, and responsive rendering across smartphones and desktops.</p>"
      },
      {
        title: "How to Convert Bijoy to Unicode",
        content: "<ol><li><strong>Paste SutonnyMJ / Bijoy text:</strong> Copy your legacy Bengali text into the left editor.</li><li><strong>Convert automatically:</strong> Review the reconstructed Bangla Unicode output on the right.</li><li><strong>Copy or export:</strong> Click Copy to paste into WhatsApp, CMS editors, or Word.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: What is the difference between SutonnyMJ and Bangla Unicode?</strong><br>A: SutonnyMJ stores Bengali glyphs on ASCII key positions and requires the font file on every computer, whereas Bangla Unicode is an international script encoding built into modern OSes and phones.</p>
          <p><strong>Q: Can I convert long multi-paragraph Bijoy articles cleanly?</strong><br>A: Yes. Paste articles paragraph by paragraph or in batches; conjunct clusters (যুক্তাক্ষর) and split vowels reorder directly in browser memory.</p>
          <p><strong>Q: Does this work for SutonnyMJ files from older print shops?</strong><br>A: Yes. Bijoy classic layout documents typically use SutonnyMJ encoding supported by this converter.</p>
        `
      }
    ]
  },
  "unicode-to-bijoy": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to Bijoy Converter – Convert Bangla Unicode to SutonnyMJ",
        content: "<p>Convert modern <strong>Bangla Unicode</strong> text into legacy <strong>Bijoy (SutonnyMJ)</strong> ASCII encoding directly in your browser for traditional offset print presses, CorelDRAW, and PageMaker templates.</p>"
      },
      {
        title: "Why Older Print Layouts Require SutonnyMJ",
        content: "<p>Print shops and older Adobe PageMaker or Illustrator pipelines built around Bijoy keyboards break when modern Unicode text is pasted directly. Translating Unicode back into Bijoy ASCII codes restores layout compatibility once you set the target font to <strong>SutonnyMJ</strong>.</p><p>Bangla newsrooms, invitation card studios, and book typesetters working with historical CorelDRAW, Illustrator, or PageMaker templates continue to rely on Bijoy Classic glyphs because older desktop engines mishandle complex OpenType shaping. Reversing Unicode Bengali text back into Bijoy ASCII encoding keeps line breaks and print spacing predictable.</p>"
      },
      {
        title: "How to Convert Bangla Unicode to Bijoy",
        content: "<ol><li><strong>Paste Bangla Unicode:</strong> Enter readable Unicode Bengali text in the box above.</li><li><strong>Generate Bijoy codes:</strong> The browser maps pre-vowel signs (কার) and conjuncts into legacy Bijoy order.</li><li><strong>Apply SutonnyMJ font:</strong> Copy the encoded string into your DTP software and switch the document font to <strong>SutonnyMJ</strong>.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does Unicode Bangla break inside older design applications?</strong><br>A: Pre-OpenType layout engines struggle with dynamic Unicode Bangla glyph shaping and expect ASCII-mapped Bijoy / SutonnyMJ codes instead.</p>
          <p><strong>Q: Will English words inside my Bengali paragraph stay readable?</strong><br>A: Any embedded English text should be styled with an English font such as Times New Roman or Arial after applying SutonnyMJ to the Bengali spans.</p>
          <p><strong>Q: Is my text sent to a remote server?</strong><br>A: No. Character mapping runs inside browser memory without transmitting your drafts remotely.</p>
        `
      }
    ]
  },
  "sutonnymj-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "SutonnyMJ to Unicode Converter – Convert SutonnyMJ Bengali Font Online",
        content: "<p>Convert legacy Bengali text encoded with <strong>SutonnyMJ</strong> (Bijoy layout) into standard <strong>Bangla Unicode</strong> inside your browser. Restores readability on websites, WhatsApp, Android, and iPhone without font installs.</p>"
      },
      {
        title: "How to Convert SutonnyMJ to Unicode",
        content: "<ol><li><strong>Paste SutonnyMJ text:</strong> Paste your copied Bengali document text into the input panel.</li><li><strong>Review Bangla Unicode:</strong> The tool transforms legacy glyphs and vowel order into readable Unicode.</li><li><strong>Copy or export:</strong> Copy the clean Unicode text for modern documents and web publishing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is SutonnyMJ the same encoding as Bijoy Classic?</strong><br>A: Yes. SutonnyMJ is the primary legacy ANSI font bundled with Bijoy publishing workflows.</p>
          <p><strong>Q: Are pasted Bangla texts uploaded externally?</strong><br>A: No. Mapping executes in browser memory without sending your text to a backend API.</p>
        `
      }
    ]
  },
  "unicode-to-sutonnymj": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to SutonnyMJ Converter – Convert Bangla Unicode to SutonnyMJ",
        content: "<p>Convert modern <strong>Bangla Unicode</strong> back into <strong>SutonnyMJ</strong> (Bijoy) encoding directly inside your browser so Bengali text opens cleanly in older print design software.</p>"
      },
      {
        title: "How to Convert Unicode to SutonnyMJ",
        content: "<ol><li><strong>Paste Bangla Unicode:</strong> Paste modern Bengali text typed on phone or web.</li><li><strong>Convert encoding:</strong> Generate legacy SutonnyMJ character codes in browser memory.</li><li><strong>Paste &amp; apply SutonnyMJ:</strong> Paste into PageMaker or Word and pick <strong>SutonnyMJ</strong> from the font list.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do I need SutonnyMJ installed in my desktop app after converting?</strong><br>A: Yes. The browser converts the character codes cleanly without needing fonts installed online, while your target Word/DTP app needs SutonnyMJ applied to display glyphs visually.</p>
          <p><strong>Q: Are pasted texts stored remotely?</strong><br>A: No. Conversion executes in browser JavaScript without sending drafts to a server.</p>
        `
      }
    ]
  },

  // URDU INPAGE CONVERTER
  "inpage-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "InPage to Unicode Converter – Urdu Font Converter",
        content: "<p>Convert legacy <strong>InPage Urdu</strong> text into modern <strong>Urdu Unicode</strong> inside your browser. Ideal for sharing articles, poetry, and books from InPage desktop software onto websites, WhatsApp, and social media.</p><p>Classic desktop Urdu publishing workflows in InPage save characters with proprietary encoding tables rather than modern UTF-8 Unicode, which causes copied passages to scramble in mobile apps and CMS editors until converted.</p>"
      },
      {
        title: "InPage Phonetic Compatibility &amp; Nastaliq Mapping",
        content: "<ul><li><strong>Nastaliq Character Mapping:</strong> Maps Urdu letters including ٹ, ڈ, ڑ, ں, ے, ھ, چ, پ, ژ, گ, ء, ئ, and ؤ into standard Unicode code points cleanly.</li><li><strong>Diacritics &amp; Punctuation:</strong> Handles common Urdu aerab marks along with Urdu khatma (۔) and comma (،) punctuation using InPage Phonetic alignment.</li><li><strong>Browser Processing:</strong> Character mapping executes inside your browser without uploading passages to a conversion server.</li></ul>"
      },
      {
        title: "How to Convert InPage to Urdu Unicode",
        content: "<ol><li><strong>Paste copied InPage text:</strong> Copy text from your InPage frame and paste it into the input box.</li><li><strong>Inspect Unicode output:</strong> Verify RTL Urdu Nastaliq rendering in the converted output box.</li><li><strong>Copy &amp; share:</strong> Copy the clean Unicode Urdu for websites, MS Word, or phones.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Why can't I copy InPage text directly to WhatsApp or Facebook?</strong><br>A: Classic InPage encodes Urdu glyphs with custom single-byte codes inside InPage only; converting translates those codes to universal Urdu Unicode.</p>
          <p><strong>Q: Will right-to-left Urdu reading order stay intact after converting?</strong><br>A: Yes. Standard Unicode Urdu automatically activates browser bidirectional (RTL) display across Android, iOS, Windows, and macOS editors.</p>
          <p><strong>Q: Are my pasted Urdu drafts uploaded to servers?</strong><br>A: No. Mapping runs inside browser memory without sending pasted text to an external backend.</p>
        `
      }
    ]
  },
  "unicode-to-inpage": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to InPage Converter – Urdu Unicode to InPage",
        content: "<p>Convert modern <strong>Urdu Unicode</strong> text into legacy <strong>InPage Phonetic</strong> character encoding inside your browser for book publishers, newspapers, and desktop composition in InPage desktop software.</p>"
      },
      {
        title: "Why Convert Unicode Urdu to InPage Format?",
        content: "<p>Smartphones, WhatsApp, and modern websites compose Urdu in Unicode, whereas print presses and InPage 2.40 / 3.x desktop typography templates rely on InPage's custom single-byte character map for Noori Nastaliq composition. Pasting raw Unicode straight into older InPage boxes yields question marks; this tool generates keystroke-accurate InPage Phonetic codes in browser memory.</p>"
      },
      {
        title: "How to Use Converted Text in InPage",
        content: "<ol><li><strong>Paste your Urdu Unicode text:</strong> Paste or type Unicode Urdu into the input editor above.</li><li><strong>Convert to InPage Phonetic codes:</strong> The browser maps Urdu letters, hamza, aerab, and Urdu punctuation while preserving numbers and web links cleanly.</li><li><strong>Copy and paste into InPage:</strong> Copy the output and paste straight into an InPage text frame.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does Unicode Urdu show as question marks in older InPage?</strong><br>A: Older InPage releases use proprietary single-byte encoding tables rather than UTF-8 Unicode; converting bridges the code points cleanly.</p>
          <p><strong>Q: Does this converter support Nastaliq characters and Urdu Phonetic layout?</strong><br>A: Yes. It aligns with the built-in InPage Phonetic keyboard layout and maps Urdu letters (ٹ, ڈ, ڑ, ں, ے, ھ, چ, پ, ژ, گ), hamza, aerab marks, and Urdu punctuation (۔, ،, ؟) while protecting URLs and numbers.</p>
          <p><strong>Q: Is my typed Urdu text sent to a remote server?</strong><br>A: No. Character conversion executes inside browser JavaScript without sending drafts to external servers.</p>
        `
      }
    ]
  },

  // BURMESE ZAWGYI CONVERTER
  "zawgyi-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Zawgyi to Unicode Converter (Rule-Based)",
        content: "<p>Convert basic <strong>Myanmar Zawgyi font</strong> text patterns toward <strong>Myanmar Unicode</strong> inside your browser. Modern Android, iOS, and Windows devices natively expect Myanmar Unicode, so older Zawgyi strings often appear scrambled until mapped into standard Unicode order.</p>"
      },
      {
        title: "Current Mapping Scope &amp; Review Advice",
        content: "<ul><li><strong>Vowel &amp; Medial Reordering:</strong> Applies rule-based mapping for common Zawgyi medial Ya/Ra/Wa/Ha code points, vowels, tone marks, and pre-posed ေ (E-vowel) reordering.</li><li><strong>Limitations:</strong> Complex stacked consonant clusters (pat-sint), Kinzi sequences, and stylized glyphs are not fully covered by the current rule set—always proofread converted Burmese text against the original source before publishing.</li><li><strong>Browser Processing:</strong> Conversion rules execute inside browser memory without sending pasted text remotely.</li></ul>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste Zawgyi text:</strong> Paste the Burmese Zawgyi text into the input panel above.</li><li><strong>Inspect Myanmar Unicode output:</strong> Check stacked letters, medials, and vowels in the right-hand output box against your source passage.</li><li><strong>Copy &amp; share:</strong> Copy cleanly once verified for WhatsApp, Facebook, CMS editors, or Word.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this handle every Zawgyi ligature and pat-sint stacked consonant?</strong><br>A: No. The current browser mapper applies core Zawgyi vowel and medial substitutions plus vowel ေ reordering; inspect stacked consonants and Kinzi words manually before relying on the result.</p>
          <p><strong>Q: Why does legacy Zawgyi text look broken on newer Android phones or Windows PCs?</strong><br>A: Zawgyi placed Burmese glyphs at non-standard code points; modern phones ship Unicode Myanmar fonts by default and misrender raw Zawgyi text.</p>
          <p><strong>Q: Are my Myanmar texts transmitted to a server?</strong><br>A: No. Mapping executes in browser JavaScript without uploading pasted text remotely.</p>
        `
      }
    ]
  },
  "unicode-to-zawgyi": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unicode to Zawgyi Converter (Experimental Helper)",
        content: "<p>Reorders pre-posed vowel <code>ေ</code> characters in standard <strong>Myanmar Unicode</strong> text toward legacy <strong>Zawgyi</strong> display order inside your browser when older Myanmar desktop software or legacy PageMaker templates expect pre-posed vowel ordering.</p>"
      },
      {
        title: "Current Mapping Scope &amp; Limitations",
        content: "<ul><li><strong>Scope notice:</strong> The current browser implementation reorders Myanmar vowel sign <code>ေ</code> before its consonant rather than performing full Rabbit-style glyph substitution for medials (ျ/ြ), Kinzi, pat-sint stacked consonants, or alternate Zawgyi glyphs.</li><li><strong>Always verify output:</strong> Review converted Burmese passages carefully before placing them into legacy print layouts.</li><li><strong>Browser Execution:</strong> Character conversion runs in browser JavaScript without server transmission.</li></ul>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste Myanmar Unicode text:</strong> Enter readable Unicode Burmese text into the editor above.</li><li><strong>Review reordered output:</strong> Check how vowel signs render and manually verify medial/stacked clusters.</li><li><strong>Apply Zawgyi font:</strong> Paste into your target legacy app and select the Zawgyi font family so characters display on that system.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this reverse full Myanmar Unicode medials and stacked consonants into Zawgyi code points?</strong><br>A: Not currently—this helper reorders vowel ေ before consonants only. Check complex syllables manually when moving into legacy Zawgyi templates.</p>
          <p><strong>Q: Why does converted Zawgyi text look odd on my Unicode browser before pasting?</strong><br>A: Without Zawgyi installed locally, modern systems use Unicode fonts—once pasted into an app using the Zawgyi font, vowel ordering aligns.</p>
          <p><strong>Q: Are typed drafts sent to any server?</strong><br>A: No. Mapping executes in browser memory without sending pasted text remotely.</p>
        `
      }
    ]
  },

  // WEB FONT CONVERTER
  "web-font-converter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Web Font Converter (TTF/OTF/WOFF/WOFF2 to TTF, WOFF, or WOFF2)",
        content: "<p>Convert desktop and web font binaries inside your browser using <code>fonteditor-core</code> WebAssembly (<code>/assets/woff2.wasm</code>). Drop <strong>TTF, OTF, WOFF, or WOFF2</strong> fonts and export standard <strong>TTF, WOFF, or WOFF2</strong> files without uploading commercial typefaces to a remote server.</p>"
      },
      {
        title: "Font Format Scope &amp; Why Use WOFF2",
        content: "<p><strong>Input &amp; output formats:</strong> Accepts <code>.ttf</code>, <code>.otf</code>, <code>.woff</code>, and <code>.woff2</code> inputs and exports <code>.ttf</code>, <code>.woff</code>, or <code>.woff2</code> (OTF inputs are converted internally into TrueType outlines when exported to TTF/WOFF/WOFF2). WOFF2 applies Brotli compression for roughly 30%–50% smaller web payloads compared to uncompressed desktop TTF fonts.</p>"
      },
      {
        title: "How to Convert Font Files in Browser",
        content: "<ol><li><strong>Drop your font file:</strong> Upload a <code>.ttf</code>, <code>.otf</code>, <code>.woff</code>, or <code>.woff2</code> font once the WASM module finishes initializing.</li><li><strong>Pick target format:</strong> Choose <strong>WOFF2</strong>, <strong>WOFF</strong>, or <strong>TTF</strong> output (defaults to TTF when dropping WOFF2, and WOFF2 otherwise).</li><li><strong>Convert &amp; download:</strong> Click Convert Font to save your converted file directly from browser memory.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Are commercial font files uploaded to a backend server?</strong><br>A: No. Font parsing and WOFF2 WebAssembly compression run inside browser memory without sending font binaries to a remote conversion API.</p>
          <p><strong>Q: What is the difference between TTF and WOFF2?</strong><br>A: TTF is meant for desktop OS installation and CSS fallbacks, while WOFF2 is compressed for fast website delivery via <code>@font-face</code> rules with <code>font-display: swap;</code>.</p>
          <p><strong>Q: Can I install WOFF2 directly on Windows or macOS?</strong><br>A: Desktop operating systems typically require TTF or OTF for system installation; switch the target output to TTF to decompress WOFF2 back for Word or Figma.</p>
        `
      }
    ]
  },
  "ttf-to-woff2": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert TTF to WOFF2 Web Font",
        content: "<p>Compress desktop TrueType Fonts (<code>.ttf</code>) into compact web-ready <strong>WOFF2</strong> (<code>.woff2</code>) binaries right inside your browser using <code>fonteditor-core</code> and <code>/assets/woff2.wasm</code>, reducing stylesheet web font payloads by roughly 30%–50% with built-in Brotli compression for faster Core Web Vitals.</p>"
      },
      {
        title: "Why Self-Host WOFF2 Instead of Shipping Raw TTF",
        content: "<p>Uncompressed desktop TTF files slow down Largest Contentful Paint on mobile connections and trigger invisible text flashes (FOIT). Converting TrueType fonts to WOFF2 shrinks file size while remaining supported natively across Chrome, Safari, Edge, and Firefox without needing third-party font CDNs.</p><p>Reducing webfont transfer weights also helps keep layout shifts minimal when paired with <code>font-display: swap;</code> and matching fallback font metrics across desktop and mobile viewports.</p>"
      },
      {
        title: "How to Convert TTF to WOFF2",
        content: "<ol><li><strong>Drop your TTF font:</strong> Wait for WASM readiness and upload your <code>.ttf</code> binary into the Web Font Converter above.</li><li><strong>Confirm WOFF2 target:</strong> Leave <strong>WOFF2</strong> selected (or pick WOFF/TTF if exporting fallback assets).</li><li><strong>Download &amp; embed via CSS:</strong> Save your <code>.woff2</code> file and declare it in CSS using <code>@font-face</code> and <code>font-display: swap;</code>.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does compressing TTF to WOFF2 alter font licensing or upload files to a server?</strong><br>A: Font parsing and WOFF2 compression run inside browser memory rather than sending binaries to a conversion server, though you should always verify your foundry's web-embedding license terms.</p>
          <p><strong>Q: Can I convert TrueType fonts back from WOFF2 later?</strong><br>A: Yes. Use our WOFF2 to TTF option inside the Web Font Converter anytime you need desktop installation files.</p>
          <p><strong>Q: How do I load WOFF2 inside website CSS?</strong><br>A: Add <code>@font-face { font-family: 'MyFont'; src: url('/fonts/font.woff2') format('woff2'); font-display: swap; }</code> in your stylesheet.</p>
        `
      }
    ]
  },
  "otf-to-woff2": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert OTF to WOFF2 Web Font",
        content: "<p>Convert OpenType desktop fonts (<code>.otf</code>) into compact web-ready <strong>WOFF2</strong> (<code>.woff2</code>) binaries inside your browser using <code>fonteditor-core</code> WebAssembly (<code>/assets/woff2.wasm</code>). Internally, OpenType glyph tables convert into TrueType-compatible outlines and pack via Brotli WOFF2 compression for faster page rendering.</p>"
      },
      {
        title: "Browser Support &amp; CSS Webfont Usage",
        content: "<p>All modern browsers support WOFF2 natively via CSS <code>@font-face</code> rules. Converting bulky OTF desktop purchases into compressed WOFF2 webfonts reduces mobile bandwidth consumption without sending licensed type files to external cloud converters.</p><p>Web performance audits routinely flag raw <code>.otf</code> and <code>.ttf</code> stylesheet assets as render-blocking overhead. Switching to Brotli-compressed <code>.woff2</code> files lowers network payload for custom display headings and UI typography across responsive pages.</p>"
      },
      {
        title: "How to Convert OTF to WOFF2",
        content: "<ol><li><strong>Select your OTF file:</strong> Drag and drop a desktop <code>.otf</code> font into the uploader above.</li><li><strong>Keep WOFF2 target selected:</strong> Confirm WOFF2 output (or choose WOFF or TTF if needed for fallback targets).</li><li><strong>Convert &amp; download:</strong> Export the compressed <code>.woff2</code> web font directly from browser memory.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why convert OTF into WOFF2 before hosting on a website?</strong><br>A: Uncompressed desktop OTF files carry heavy payloads for mobile visitors, whereas WOFF2 shrinks file sizes cleanly with broad Chrome, Edge, Safari, and Firefox support.</p>
          <p><strong>Q: Does OTF to WOFF2 keep standard character sets and spacing?</strong><br>A: Basic glyph mappings and outline data transfer into the exported webfont container; inspect specialized OpenType ligatures inside a live browser test page afterward.</p>
          <p><strong>Q: Are my OpenType fonts uploaded to a cloud server?</strong><br>A: No. Parsing and WOFF2 packing execute inside browser WebAssembly memory without sending typography assets remotely.</p>
        `
      }
    ]
  },
  "woff2-to-ttf": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Extract WOFF2 to TTF Desktop Font",
        content: "<p>Decompress web-only <code>.woff2</code> font files back into installable desktop TrueType (<code>.ttf</code>) format inside your browser using <code>fonteditor-core</code> WebAssembly (<code>/assets/woff2.wasm</code>) so you can preview or install licensed typography in desktop software like Figma, Photoshop, Illustrator, and MS Word.</p>"
      },
      {
        title: "Why Desktop Software Cannot Install Raw WOFF2",
        content: "<p>WOFF2 is a Brotli-compressed web packaging wrapper designed for CSS <code>@font-face</code> delivery inside browsers rather than OS font folders on Windows or macOS. Unpacking WOFF2 back to <code>.ttf</code> restores a standard TrueType desktop font container locally.</p><p>Graphic designers, brand teams, and students often receive a website's <code>.woff2</code> font asset when migrating layouts into presentation slides or print artwork. Converting back to <code>.ttf</code> unlocks local operating system font previews cleanly.</p>"
      },
      {
        title: "How to Convert WOFF2 to TTF",
        content: "<ol><li><strong>Drop your WOFF2 font:</strong> Select a <code>.woff2</code> file in the Web Font Converter above (target switches to <strong>TTF</strong> automatically).</li><li><strong>Run WebAssembly unpacking:</strong> Click convert to unpack TrueType outline tables in browser memory.</li><li><strong>Download &amp; install TTF:</strong> Save the resulting <code>.ttf</code> font and double-click on Windows or macOS to install locally.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does unpacking WOFF2 to TTF keep original glyph outlines intact?</strong><br>A: Yes. For TrueType-outline WOFF2 webfonts, decompressing restores the outline tables back into standard <code>.ttf</code> format.</p>
          <p><strong>Q: Can the unpacked TTF file be opened inside Figma or Office apps?</strong><br>A: Yes. Once installed onto Windows or macOS, standard desktop applications list the unpacked TrueType font inside their system font menus.</p>
          <p><strong>Q: Are my font files sent to an external server?</strong><br>A: No. Decompression runs inside your browser via <code>/assets/woff2.wasm</code> without uploading fonts to a backend server.</p>
        `
      }
    ]
  }
};
