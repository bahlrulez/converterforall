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
          <p><strong>Q: Does this converter support complex Nepali conjunct letters (युक्ताक्षर)?</strong><br>A: It maps common Nepali conjuncts including त्र, ज्ञ, द्ध, द्व, ष्ट, ष्ठ, and reph (र्). Please check output before relying on it for official documents.</p>
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
        title: "InPage to Unicode Converter – Urdu Font Converter",
        content: "<p>Convert traditional <strong>InPage Urdu text</strong> into standard <strong>Urdu Unicode</strong> text. Great for bloggers, writers, and students who need to share InPage content on websites, social media, and mobile apps.</p>"
      },
      {
        title: "Features",
        content: "<ul><li><strong>Nastaliq Character Mapping:</strong> Supports Urdu characters (ٹ, ڈ, ڑ, ں, ے, ھ, چ, پ, ژ, گ, ء, ئ, ؤ).</li><li><strong>Private &amp; In-Browser:</strong> Text is processed locally on your device.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: Why can't I directly copy InPage text to mobile apps?</strong><br>A: InPage uses custom encoding that only displays inside InPage software. Converting to standard Unicode lets the text be read on any modern phone or computer.</p>
        `
      }
    ]
  },
  "unicode-to-inpage": {
    sections: [
      {
        title: "Unicode to InPage Converter – Urdu Unicode to InPage",
        content: "<p>Convert modern <strong>Urdu Unicode</strong> text into <strong>InPage</strong> compatible format to format in InPage desktop software for newspaper and book layout.</p>"
      },
      {
        title: "Why convert Unicode Urdu to InPage format?",
        content: "<p>Modern Urdu text written on smartphones, social media, WhatsApp, or Microsoft Word uses international Unicode encoding. However, many printing presses, book publishing houses, and Urdu newspapers still compose layouts using InPage software for its precise Nastaliq typography. Pasting raw Unicode directly into legacy InPage software creates scrambled characters or question marks. This converter maps modern Urdu characters into the specific character encoding expected by InPage.</p>"
      },
      {
        title: "How to use converted text in InPage",
        content: "<ol><li><strong>Paste your Unicode text:</strong> Paste or type your Urdu text into the input box above.</li><li><strong>Convert:</strong> The tool maps the Urdu characters to InPage's character encoding directly in your browser.</li><li><strong>Copy and Paste:</strong> Copy the converted text, open InPage, create or select a text box, and paste it directly.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does Unicode Urdu show as question marks or English characters in InPage?</strong><br>A: Older versions of InPage do not support Unicode directly. They use a custom 1-byte character encoding table. Converting your text with this tool translates the character codes so InPage recognizes each Urdu letter properly.</p>
          <p><strong>Q: How do I import Unicode Urdu into InPage?</strong><br>A: Paste your Unicode text here, copy the converted output, and paste it into your InPage text boxes.</p>
          <p><strong>Q: Does this converter support Nastaliq characters and Urdu ligatures?</strong><br>A: Yes. It properly maps Urdu specific letters including ٹ, ڈ, ڑ, ں, ے, ھ, چ, پ, ژ, گ, as well as hamza and common Urdu aerab marks.</p>
          <p><strong>Q: Is my typed text private?</strong><br>A: Yes. All text conversion runs locally in your web browser. Nothing is sent to our servers or stored in any database.</p>
        `
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
