export const fontToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  // PUNJABI SATLUJ CONVERTER
  "unicode-to-satluj": {
    sections: [
      {
        title: "What is Satluj Font?",
        content: "<p>Satluj is one of the most widely used legacy Gurmukhi (Punjabi) fonts in newspaper publishing, desktop publishing (DTP), and official printing in Punjab.</p>"
      },
      {
        title: "How do I convert Unicode to Satluj?",
        content: "<p>Converting Unicode to Satluj is straightforward. Just paste your modern Punjabi text into the box above, and the tool converts it to Satluj right away. You can copy the result or download it as a document file.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between Unicode (Raavi) and Satluj font?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unicode (commonly using the Raavi font layout) is the international standard for typing Punjabi across mobile devices, websites, and modern word processors. Satluj is an older non-Unicode legacy font mapped to standard English keyboard layouts (ASCII/ANSI), heavily used in older desktop publishing tools like Adobe PageMaker, InDesign, and CorelDraw."
                }
              },
              {
                "@type": "Question",
                "name": "Why does Satluj font show English characters when pasted online?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Legacy fonts like Satluj do not use standard Unicode character encoding. When you copy Satluj text into modern web browsers, WhatsApp, or Google Docs, it renders as standard Latin/English letters (e.g., s turns into ਸ). Converting it to Unicode fixes this immediately."
                }
              },
              {
                "@type": "Question",
                "name": "How do I use converted Satluj text in Adobe PageMaker or CorelDraw?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "1. Copy the converted Satluj output from our tool. 2. Open Adobe PageMaker, Photoshop, or CorelDraw. 3. Select the text tool, paste your text, and set the font name to Satluj (or Satluj Bold)."
                }
              }
            ]
          }
          </script>
          <p><strong>Q: What is the difference between Unicode (Raavi) and Satluj font?</strong><br>A: Unicode (commonly using the Raavi font layout) is the international standard for typing Punjabi across mobile devices, websites, and modern word processors. Satluj is an older non-Unicode legacy font mapped to standard English keyboard layouts (ASCII/ANSI), heavily used in older desktop publishing tools like Adobe PageMaker, InDesign, and CorelDraw.</p>
          <p><strong>Q: Why does Satluj font show English characters when pasted online?</strong><br>A: Legacy fonts like Satluj do not use standard Unicode character encoding. When you copy Satluj text into modern web browsers, WhatsApp, or Google Docs, it renders as standard Latin/English letters (e.g., s turns into ਸ). Converting it to Unicode fixes this immediately.</p>
          <p><strong>Q: How do I use converted Satluj text in Adobe PageMaker or CorelDraw?</strong><br>A: 1. Copy the converted Satluj output from our tool.<br>2. Open Adobe PageMaker, Photoshop, or CorelDraw.<br>3. Select the text tool, paste your text, and set the font name to Satluj (or Satluj Bold).</p>
        `
      },
      {
        title: "Related Punjabi Font Converters",
        content: `
          <ul class="flex flex-col gap-2 list-disc pl-5">
            <li><a href="/satluj-to-unicode" class="text-blue-600 dark:text-blue-400 hover:underline">Satluj to Unicode</a></li>
            <li><a href="/unicode-to-asees" class="text-blue-600 dark:text-blue-400 hover:underline">Unicode to Asees</a></li>
            <li><a href="/unicode-to-anmollipi" class="text-blue-600 dark:text-blue-400 hover:underline">Unicode to AnmolLipi</a></li>
            <li><a href="/unicode-to-raavi" class="text-blue-600 dark:text-blue-400 hover:underline">Unicode to Raavi</a></li>
          </ul>
        `
      }
    ]
  },

  // KRUTI DEV TO UNICODE / MANGAL CONVERTER
  "krutidev-to-unicode": {
    sections: [
      {
        title: "Kruti Dev to Unicode & Mangal Font Converter",
        content: "<p>Convert legacy <strong>Kruti Dev (010, 011, 016, 020, 021) and DevLys</strong> text into universal <strong>Unicode Hindi (Mangal font)</strong> directly in your browser. Whether you are preparing for government typing exams (CPCT, SSC, High Court, UP Police), drafting legal documents, or sharing Hindi text on WhatsApp and websites, this tool provides clean character mapping without broken matras.</p>"
      },
      {
        title: "What is Mangal Font and Why is it Useful?",
        content: "<p><strong>Mangal</strong> is the standard Unicode Devanagari font developed for Indian languages. Unlike legacy fonts like Kruti Dev (which require specific .ttf font files to be installed on each computer), <strong>Unicode text works across all smartphones, computers, tablets, and web browsers</strong>.</p><ul><li><strong>Government Typing Tests (CPCT, High Court, SSC):</strong> Government exams commonly use Mangal font layouts.</li><li><strong>Universal Readability:</strong> Converted Unicode text can be pasted into WhatsApp, email, Google Docs, and web portals.</li><li><strong>In-Browser Processing:</strong> Text conversion runs locally inside your web browser.</li></ul>"
      },
      {
        title: "How to Convert Kruti Dev to Unicode",
        content: "<ol><li><strong>Paste Kruti Dev Text:</strong> Paste your Kruti Dev or DevLys text into the left box.</li><li><strong>Automatic Conversion:</strong> The tool translates your text into clean, readable Unicode on the right.</li><li><strong>Copy or Download:</strong> Click 'Copy' to copy to your clipboard, or download as a Word document.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ) – Mangal & Kruti Dev",
        content: `
          <p><strong>Q: Is Unicode Hindi the same as Mangal font?</strong><br>A: Yes. Mangal is the default font used by Windows to display standard Devanagari Unicode. Any Unicode text generated by this converter will display in Mangal font on Windows systems.</p>
          <p><strong>Q: Why does my Kruti Dev text show as English letters like 'd', 'j', 'k' on WhatsApp?</strong><br>A: Kruti Dev mapped English keyboard keys to Hindi glyphs. Without the Kruti Dev font installed, devices display raw English letters. Converting to Unicode fixes this so text displays properly on any screen.</p>
          <p><strong>Q: Does this converter handle half-letters (आधे अक्षर) and Reph (र्)?</strong><br>A: Yes, the mapping algorithm handles complex Hindi conjuncts, half-letters (क्, च्, त्, म्, ध्), and reph (र्क, र्म, र्ध).</p>
        `
      }
    ]
  },

  // UNICODE (MANGAL) TO KRUTI DEV CONVERTER
  "unicode-to-krutidev": {
    sections: [
      {
        title: "Unicode (Mangal) to Kruti Dev Converter",
        content: "<p>Convert modern <strong>Unicode Hindi text (Mangal font)</strong> into legacy <strong>Kruti Dev 010 font</strong> format online. Built for DTP operators, print media presses, PageMaker designers, and typists who need Kruti Dev typewriter encoding.</p>"
      },
      {
        title: "Why Convert Mangal / Unicode to Kruti Dev?",
        content: "<ul><li><strong>PageMaker & Photoshop Printing:</strong> Older versions of desktop publishing software require non-Unicode fonts. Converting to Kruti Dev ensures consistent layouts for print presses.</li><li><strong>Traditional Typists:</strong> Offline printing presses and court typists using Kruti Dev key layouts can convert online Unicode articles into their preferred font.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: How do I use the converted Kruti Dev text in MS Word or PageMaker?</strong><br>A: Copy the output, paste it into your document, and select <strong>'Kruti Dev 010'</strong> as your font family.</p>
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
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How do I import Unicode Urdu into InPage?</strong><br>A: Paste your Unicode text here, copy the converted output, and paste it into your InPage text boxes.</p>
        `
      }
    ]
  },

  // BURMESE ZAWGYI CONVERTER
  "zawgyi-to-unicode": {
    sections: [
      {
        title: "Zawgyi to Unicode Converter – Myanmar Font Converter",
        content: "<p>Convert legacy <strong>Myanmar Zawgyi font</strong> text to standard <strong>Myanmar Unicode</strong> format to read older documents, posts, and archives on modern devices.</p>"
      },
      {
        title: "Why Convert Zawgyi to Unicode?",
        content: "<ul><li><strong>Standard Support:</strong> Unicode is supported natively by Android, iOS, Windows, and web search engines.</li><li><strong>Searchable Content:</strong> Unicode text is fully indexable and searchable online.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        content: `
          <p><strong>Q: What is the difference between Zawgyi and Myanmar Unicode?</strong><br>A: Zawgyi was an older encoding used before Myanmar script was fully standardized in Unicode. Myanmar Unicode is the official standard recognized across modern platforms.</p>
        `
      }
    ]
  },
  "unicode-to-zawgyi": {
    sections: [
      {
        title: "Unicode to Zawgyi Converter – Myanmar Unicode to Zawgyi",
        content: "<p>Convert standard <strong>Myanmar Unicode</strong> text into legacy <strong>Zawgyi font</strong> format for older devices and systems.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why convert Unicode back to Zawgyi?</strong><br>A: Helpful for viewing text on older phones or legacy computers that only have Zawgyi installed.</p>
        `
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
      }
    ]
  }
};
