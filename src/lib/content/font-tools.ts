import { generatedPunjabiProfiles } from "./punjabi-font-profiles";

export const fontToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  ...generatedPunjabiProfiles,

  // UNICODE TO ANMOLLIPI — page-specific, implementation-verified guidance
  "unicode-to-anmollipi": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Unicode to AnmolLipi Converter Does",
        content: "<p>Paste Gurmukhi Unicode text into the input box. The converter maps supported characters and sequences to the legacy character codes in its built-in AnmolLipi table. The output is legacy-font text; it is not standard Unicode text and is not an AnmolLipi font file.</p>"
      },
      {
        title: "How to Display the AnmolLipi Output",
        content: "<p>Copy the converted text into the application where you need it and select an installed AnmolLipi font for that text. Without a matching font, the legacy codes may appear as Latin or unrelated glyphs. This tool does not install or embed the font and does not create or format a Word or PageMaker document.</p>"
      },
      {
        title: "Mapping Coverage and Limitations",
        content: "<p>The converter uses a finite AnmolLipi character table and shared Gurmukhi composition rules. Some possible characters and forms are not defined in the table. If a Unicode character has no corresponding mapping, it can remain unchanged in the output. Check the result in the target application with the matching AnmolLipi font, especially for vowel signs, subjoined forms, numerals, punctuation and uncommon symbols.</p>"
      },
      {
        title: "Text Input and Output",
        content: "<p>This is a text-to-text converter. It accepts typed or pasted text; it does not import Word, PDF or PageMaker files and does not preserve page layout, font styling, tables or images. You can copy the result or download plain text. The shared converter's DOC-labelled control saves plain text with a .doc filename, not a formatted Word document.</p>"
      },
      {
        title: "How to Convert Unicode to AnmolLipi",
        content: "<ol><li><strong>Paste Unicode text:</strong> Enter or paste Gurmukhi Unicode text in the input box.</li><li><strong>Review the output:</strong> The AnmolLipi-encoded result appears as you type.</li><li><strong>Copy or download:</strong> Use Copy or TXT for the converted text.</li><li><strong>Apply the font:</strong> Paste the output into your target application, select an installed AnmolLipi font and inspect the rendered text.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does the output look like English letters?</strong><br>A: It contains legacy AnmolLipi character codes. Select an installed AnmolLipi font for the text in your target application to display the Gurmukhi glyphs.</p>
          <p><strong>Q: Does this converter install or embed AnmolLipi?</strong><br>A: No. It converts text codes only. You need a compatible AnmolLipi font in the application where you use the output.</p>
          <p><strong>Q: Will every Unicode character convert?</strong><br>A: Complete coverage is not guaranteed. The mapping table is finite, and unsupported characters may remain unchanged. Review the result in the target application.</p>
          <p><strong>Q: Can I upload a Word or PDF document?</strong><br>A: No. Paste text into the input box. The tool does not import files or preserve document formatting.</p>
          <p><strong>Q: Can I use AnmolLipi output on websites or messaging apps?</strong><br>A: Use standard Unicode for websites, email and messaging. Legacy AnmolLipi output depends on a compatible font and may not display as Gurmukhi elsewhere.</p>
          <p><strong>Q: Does the converter translate or proofread Punjabi?</strong><br>A: No. It maps supported Unicode character sequences to legacy AnmolLipi codes; it does not translate or correct spelling.</p>
          <p><strong>Q: Is my text uploaded to a server?</strong><br>A: The conversion runs in the browser using the bundled JavaScript mapping engine. This component does not send entered text to a conversion API.</p>
        `
      }
    ]
  },

  // UNICODE TO JOY — page-specific, implementation-verified guidance
  "unicode-to-joy": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Unicode to Joy Converter Does",
        content: "<p>Paste Gurmukhi Unicode text into the input box. The converter applies its built-in Joy character table and shared Gurmukhi composition rules to produce legacy Joy character codes. The output is legacy-font text, not standard Unicode and not a Joy font file.</p>"
      },
      {
        title: "How to Display the Joy Output",
        content: "<p>Copy the converted text into the application where you need it and select an installed Joy font for that text. Without the matching font, the legacy codes may display as Latin or unrelated glyphs. This tool does not install or embed Joy and does not create or format a Word or PageMaker document.</p>"
      },
      {
        title: "Mapping Coverage and Limitations",
        content: "<p>The Joy character table is finite and works only for the characters and combinations represented in the built-in mapping. If the engine cannot find a matching mapping for a source character, it can leave that character unchanged. Modified Joy font versions and uncommon symbols may therefore produce incomplete output. Review the result in the target application using the intended Joy font.</p>"
      },
      {
        title: "Text Input and Output",
        content: "<p>This is a text-to-text converter. It accepts text typed or pasted into the input box; it does not import Word, PDF or PageMaker files or preserve document formatting. You can copy the result or download it as plain text. The shared converter's DOC-labelled control saves plain text with a .doc filename, not a formatted Word document.</p>"
      },
      {
        title: "How to Convert Unicode to Joy",
        content: "<ol><li><strong>Paste Unicode text:</strong> Enter or paste Gurmukhi Unicode text into the input box.</li><li><strong>Review the output:</strong> Joy-encoded characters appear as you type.</li><li><strong>Copy or download:</strong> Use Copy or TXT to take the converted text.</li><li><strong>Apply the Joy font:</strong> Paste the output into your target application, select an installed Joy font and check the rendered result.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does the converted output look like English or symbols?</strong><br>A: The output uses legacy Joy character codes. Select an installed Joy font in the receiving application to render the expected Gurmukhi glyphs.</p>
          <p><strong>Q: Does this tool install the Joy font?</strong><br>A: No. It converts text codes only; it does not provide or install the legacy font.</p>
          <p><strong>Q: Will every Unicode character convert to Joy?</strong><br>A: Complete coverage is not guaranteed. The engine uses a finite mapping table, and unsupported characters can remain unchanged. Review the output with the intended Joy font.</p>
          <p><strong>Q: Can I upload Word or PDF files?</strong><br>A: No. Paste text into the input box. The converter does not import documents or preserve formatting.</p>
          <p><strong>Q: Is Joy output suitable for websites, email or WhatsApp?</strong><br>A: Use standard Unicode for modern web and messaging content. Legacy Joy output may not display correctly where the Joy font is unavailable.</p>
          <p><strong>Q: Does it translate Punjabi or correct spelling?</strong><br>A: No. It maps supported Unicode character sequences to legacy Joy codes and does not translate, interpret or proofread the text.</p>
          <p><strong>Q: Is the text sent to a conversion server?</strong><br>A: The mapping runs in the browser using the bundled JavaScript engine. This component does not send the entered text to a conversion API.</p>
        `
      }
    ]
  },

  // UNICODE TO SATLUJ — page-specific, implementation-verified guidance
  "unicode-to-satluj": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Unicode to Satluj Converter Does",
        content: "<p>Paste standard Gurmukhi Unicode text into the input box. The converter maps supported Unicode characters and sequences to the legacy character codes used by its built-in Satluj table. The result is legacy-font text, not a Unicode Punjabi document or an installed font file.</p>"
      },
      {
        title: "How to Display the Satluj Output",
        content: "<p>Copy the output into the application where you need to use it and select an installed Satluj font for that text. Without the matching Satluj font, the legacy character codes may appear as Latin or other unrelated glyphs. This page does not install, embed or supply the Satluj font, and it does not create a Word, PageMaker or CorelDraw document.</p>"
      },
      {
        title: "Mapping Coverage and Limitations",
        content: "<p>The converter uses a finite Satluj character table and shared Gurmukhi composition rules. Not every possible Unicode code point or font-specific glyph has a corresponding Satluj mapping. When the engine cannot find a mapping, the original character can remain in the output unchanged. Check the result in the target application with the intended Satluj font, especially for vowel signs, subjoined characters, numerals, punctuation and uncommon symbols.</p>"
      },
      {
        title: "Text Input and Output",
        content: "<p>This is a text-to-text converter. It accepts text typed or pasted into the input box; it does not import Word, PDF or PageMaker files and does not preserve the formatting of a source document. You can copy the result or download it as plain text. The shared converter also has a DOC-labelled control that saves plain text with a .doc filename, not a formatted Word document.</p>"
      },
      {
        title: "How to Convert Unicode to Satluj",
        content: "<ol><li><strong>Prepare Unicode text:</strong> Copy Gurmukhi text from your document or type it into the input box.</li><li><strong>Review the converted text:</strong> The Satluj-encoded output appears as you type.</li><li><strong>Copy the output:</strong> Use Copy or the TXT download.</li><li><strong>Apply Satluj in your editor:</strong> Paste the text into the target application and select the matching installed Satluj font. Inspect the rendered result before printing or publishing.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does the output look like English or unrelated characters?</strong><br>A: The output uses legacy Satluj character codes. Select an installed Satluj font for the pasted text in your target application. Without that font, the codes will not display as Gurmukhi.</p>
          <p><strong>Q: Does this tool install or embed the Satluj font?</strong><br>A: No. It converts text codes only. You must obtain and install a compatible Satluj font separately.</p>
          <p><strong>Q: Can I upload a Word or PDF document?</strong><br>A: No. Paste Unicode text into the input box. The converter does not import documents or preserve their layout and styling.</p>
          <p><strong>Q: Will every Unicode character convert to Satluj?</strong><br>A: No complete-coverage guarantee is made. The converter has a finite mapping table; unsupported characters can remain unchanged. Check the output with your intended font.</p>
          <p><strong>Q: Can I use the converted output on websites or WhatsApp?</strong><br>A: Legacy Satluj text depends on a matching font to display as Gurmukhi. Use standard Unicode for websites, email and messaging unless the receiving environment specifically supports the legacy encoding.</p>
          <p><strong>Q: Does this converter translate Punjabi or correct spelling?</strong><br>A: No. It maps supported Unicode character sequences to legacy Satluj codes. It does not translate, interpret or proofread the text.</p>
          <p><strong>Q: Is the text uploaded to a conversion server?</strong><br>A: The conversion runs in the browser using the bundled JavaScript mapping engine. This font-conversion component does not send the entered text to a conversion API.</p>
        `
      }
    ]
  },

  // UNICODE TO ASEES — page-specific, implementation-verified guidance
  "unicode-to-asees": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Unicode to Asees Converter Does",
        content: "<p>Paste standard Gurmukhi Unicode text into the input box. The converter maps supported Unicode characters and sequences to the legacy character codes used by its built-in Asees table. The output is legacy-font text, not standard Unicode and not a font file.</p>"
      },
      {
        title: "How to Display the Asees Output",
        content: "<p>Copy the output into your word processor or design application and select an installed Asees font for the pasted text. Without the matching font, legacy character codes can appear as Latin or unrelated glyphs. This tool does not install or embed Asees, and it does not create or format a Word, PageMaker or CorelDraw document.</p>"
      },
      {
        title: "Mapping Coverage and Limitations",
        content: "<p>The converter uses a finite Asees character table and shared Gurmukhi composition and ordering rules. Some character-table entries are not defined, and not every possible Unicode character or font-specific glyph has a corresponding Asees code. If the engine has no mapping for a character, it can remain unchanged. Check the converted output in the target application with the matching Asees font, especially for vowel signs, subjoined characters, numerals, punctuation and uncommon symbols.</p>"
      },
      {
        title: "Text Input and Output",
        content: "<p>This is a text-to-text converter. It accepts text typed or pasted into the input box; it does not import Word, PDF or PageMaker files or preserve document formatting. You can copy the output or download it as plain text. The shared converter's DOC-labelled control saves plain text with a .doc filename; it does not create a formatted Word document.</p>"
      },
      {
        title: "How to Convert Unicode to Asees",
        content: "<ol><li><strong>Prepare Unicode text:</strong> Copy Gurmukhi text from your source document or type it into the input box.</li><li><strong>Review the converted text:</strong> Asees-encoded output appears as you type.</li><li><strong>Copy or download:</strong> Use Copy or TXT to save the plain text output.</li><li><strong>Apply Asees in your editor:</strong> Paste the text into the target application, select the installed Asees font, and inspect the rendered result before using it.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why does the output look like English letters?</strong><br>A: The output contains legacy Asees character codes. Select an installed Asees font for the text in your target application to display the intended Gurmukhi glyphs.</p>
          <p><strong>Q: Does this tool install or embed the Asees font?</strong><br>A: No. It converts text codes only. A compatible Asees font must already be available in the application where you use the output.</p>
          <p><strong>Q: Can I upload a Word, PDF or PageMaker document?</strong><br>A: No. Paste Unicode text into the input box. The tool does not import documents or preserve font styling, page layout, tables or images.</p>
          <p><strong>Q: Will every Unicode character convert to Asees?</strong><br>A: No complete-coverage guarantee is made. The Asees mapping has undefined entries and unsupported characters can remain unchanged. Review the output with the intended font.</p>
          <p><strong>Q: Should I use Asees text on websites and messaging apps?</strong><br>A: Use standard Unicode for websites, email and messaging. Legacy Asees output depends on a compatible font and may not display as Gurmukhi in systems that do not have it.</p>
          <p><strong>Q: Does this converter translate or proofread Punjabi?</strong><br>A: No. It maps supported Unicode character sequences to legacy Asees codes. It does not translate or check spelling and grammar.</p>
          <p><strong>Q: Is the text uploaded to a conversion server?</strong><br>A: The conversion runs in the browser using the bundled JavaScript mapping engine. This font-conversion component does not send the entered text to a conversion API.</p>
          <p><strong>Q: Is the DOC download a formatted Word file?</strong><br>A: No. The shared converter saves plain text with a .doc filename. Use TXT for a plain-text download.</p>
        `
      }
    ]
  },

  // ASEES TO UNICODE — page-specific, implementation-verified guidance
  "asees-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Asees to Unicode Converter Does",
        content: "<p>Paste text encoded with the Asees Punjabi font into the input box. The converter uses its built-in Asees character mapping to produce Gurmukhi Unicode text. It is intended for text that matches the Asees encoding expected by this tool; it does not identify an unknown source font, translate Punjabi, or check spelling and grammar.</p>"
      },
      {
        title: "How the Asees Character Mapping Works",
        content: "<p>The conversion uses a predefined Asees character table together with shared Gurmukhi character-composition and ordering rules. These rules handle mapped vowel signs and supported composed forms when converting the legacy character sequence to Unicode. This is character-encoding conversion, not a meaning-based or phonetic translation.</p><p>The mapping is finite. Some character-table entries are not defined, and the conversion engine leaves an input character unchanged when it finds no matching mapping. The result can therefore contain characters that did not convert. The page also displays an experimental warning: review the output against the source, especially for names, numerals, punctuation and older or customised font files.</p>"
      },
      {
        title: "Text Input and Output Limits",
        content: "<p>This converter works with text typed or pasted into the input box. It does not upload or open Word, PDF or PageMaker files, extract text from scanned pages, or preserve document layout, font styling, tables or images.</p><p>You can copy the converted text, download a TXT file, print or share the text. There is also a button labelled DOC, but the current implementation downloads the same plain text string with a .doc filename; it does not generate a formatted Microsoft Word document. Use the TXT option when you need an accurately labelled plain-text file.</p>"
      },
      {
        title: "How to Convert Asees Text",
        content: "<ol><li><strong>Copy the source text:</strong> Select and copy text that was entered using the Asees font encoding expected by this converter.</li><li><strong>Paste it into the input box:</strong> The Unicode result updates as you type or paste.</li><li><strong>Review the result:</strong> Compare words, vowel signs, subjoined forms, numerals and punctuation with the source. The page is marked experimental because some characters or font variants may not be covered.</li><li><strong>Copy or export:</strong> Use Copy or TXT download for the converted plain text. Formatting from the original document is not carried over.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I upload a Word, PDF or PageMaker file?</strong><br>A: No. This page accepts text typed or pasted into the input box. It does not import files or extract text from a scanned document.</p>
          <p><strong>Q: Does the converter detect whether my text uses Asees?</strong><br>A: No. This page applies the Asees mapping. Text from another Punjabi font or a modified Asees font may convert incorrectly or remain unchanged.</p>
          <p><strong>Q: Will every Asees character convert correctly?</strong><br>A: A perfect result is not guaranteed. The converter uses a finite mapping table, and unsupported characters can pass through unchanged. Check the output against your source text.</p>
          <p><strong>Q: Does the converter have a Convert Digits option?</strong><br>A: No. There is no separate digit-conversion toggle in this tool. Numerals are handled only according to the character mappings in the conversion engine.</p>
          <p><strong>Q: Does it preserve the original formatting?</strong><br>A: No. It converts text characters only. Font styling, page layout, tables, images and other document formatting are not preserved.</p>
          <p><strong>Q: Is my text uploaded to a conversion server?</strong><br>A: The Asees mapping runs in the browser using the bundled JavaScript conversion engine. The font-conversion component does not send the entered text to a conversion API.</p>
          <p><strong>Q: Is the DOC download a formatted Word document?</strong><br>A: No. The current DOC-labelled control saves the converted text with a .doc filename; it does not create a native or formatted Word document. Use TXT for a plain-text download.</p>
          <p><strong>Q: Do I need the Asees font to read the converted output?</strong><br>A: No. The output is Gurmukhi Unicode. Your receiving device or application needs a font with Gurmukhi glyph support, but it does not need the legacy Asees font to display the converted Unicode text.</p>
        `
      }
    ]
  },

  // GURBANI AKHAR TO UNICODE — page-specific, implementation-verified guidance
  "gurbani-akhar-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Gurbani Akhar to Unicode Page Does",
        content: "<p>This page accepts text pasted into the input box and converts it using the Punjabi engine configuration assigned to the Gurbani Akhar/GurbaniLipi option. It does not open Word, PDF or PageMaker files, extract scanned text, or preserve document formatting. The conversion is experimental; compatibility with every historical Gurbani Akhar or GurbaniLipi font file has not been established.</p>"
      },
      {
        title: "Important: Which Character Mapping Does It Use?",
        content: "<p>The current engine does not define a separate, complete Gurbani Akhar character table. Its GurbaniLipi configuration reuses the AnmolLipi character mapping and overlays a small GurbaniLipi-specific table for Gurmukhi digit positions. As a result, the page should only be used with source text that matches this mapping behaviour. It should not be treated as a verified converter for every font distributed under the names Gurbani Akhar or GurbaniLipi.</p><p>The shared engine also applies Gurmukhi composition and character-ordering rules. A character that is not represented by the selected mapping may pass through unchanged. Compare the converted output with the original source, especially for Gurbani-specific symbols, numerals, punctuation and subjoined forms.</p>"
      },
      {
        title: "Text-Only Conversion and Output",
        content: "<p>Paste text that can be selected and copied from the source application. This tool does not upload or parse original documents, read scanned pages, or retain font styling, page layout, tables or images. You can copy the Unicode result or download it as plain text. The separate DOC-labelled control in the shared converter saves plain text with a .doc filename; it does not generate a formatted Word document.</p>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Copy source text:</strong> Select text from a source that uses the encoding expected by this page.</li><li><strong>Paste it into the input box:</strong> The converted output appears as you type or paste.</li><li><strong>Check it carefully:</strong> Compare each line with the original. Do not assume that every Gurbani Akhar variant, symbol or glyph is supported.</li><li><strong>Copy or download:</strong> Use Copy or the TXT download for plain Unicode text. Reapply document formatting separately.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this page have a dedicated, complete Gurbani Akhar mapping table?</strong><br>A: No. The current engine configuration reuses the AnmolLipi character table and adds a small GurbaniLipi-specific digit mapping. This does not establish compatibility with every font labelled Gurbani Akhar or GurbaniLipi.</p>
          <p><strong>Q: Will all Gurbani symbols, Ek Onkar forms and punctuation convert correctly?</strong><br>A: This is not guaranteed. The shared engine has some Gurmukhi compositions, but the page has not been validated against every historical Gurbani font variant and symbol set. Check the output against your source.</p>
          <p><strong>Q: Can I upload a Gurbani Word or PDF document?</strong><br>A: No. Paste selectable text into the input box. The converter does not import files or extract text from scanned pages.</p>
          <p><strong>Q: Does the tool preserve the original document formatting?</strong><br>A: No. It converts text characters only. Font styles, page layout, tables and images are not retained.</p>
          <p><strong>Q: Does it translate or proofread Gurbani text?</strong><br>A: No. It performs character mapping to Unicode. It does not translate, interpret, verify scripture, correct spelling or validate textual accuracy.</p>
          <p><strong>Q: Is my pasted text uploaded to a conversion server?</strong><br>A: The font conversion runs in the browser using the bundled JavaScript mapping engine. This component does not send the entered text to a conversion API.</p>
          <p><strong>Q: Is the DOC download a real Word document?</strong><br>A: No. The shared converter saves plain text with a .doc filename. Use the TXT option for a plain-text download.</p>
        `
      }
    ]
  },

  // ANMOLLIPI TO UNICODE — page-specific, implementation-verified guidance
  "anmollipi-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the AnmolLipi to Unicode Converter Does",
        content: "<p>Paste text encoded with the AnmolLipi Punjabi font into the input box. The converter applies its built-in AnmolLipi character mapping to produce Gurmukhi Unicode text. It processes entered or pasted text; it does not open Word, PDF or PageMaker files, extract text from scanned pages, or preserve document formatting.</p>"
      },
      {
        title: "How the AnmolLipi Character Mapping Works",
        content: "<p>The conversion uses a predefined AnmolLipi character table together with shared Gurmukhi character-composition and ordering rules. The engine uses those rules to resolve supported multi-character combinations and reorder mapped signs where required. This is character-encoding conversion, not Punjabi translation, phonetic transcription or spelling correction.</p><p>The character table is finite and does not define a mapping for every possible character or font-specific glyph. When no mapping is found, the conversion engine can pass the source character through unchanged. Modified AnmolLipi fonts or text encoded with a different Punjabi font can therefore produce incomplete or incorrect output. Review the result against the original.</p>"
      },
      {
        title: "Text Input, Output and Formatting",
        content: "<p>Enter or paste text into the input box. You can copy the Unicode result, download TXT, print or share it. The interface also has a DOC-labelled download, but the current implementation saves the same plain text content with a .doc filename; it does not generate a formatted Microsoft Word document. Use TXT when you need a plain-text file with a matching extension.</p><p>The converter does not import source documents or retain page layout, font styling, tables, images or other formatting. It converts the text characters only.</p>"
      },
      {
        title: "How to Convert AnmolLipi Text",
        content: "<ol><li><strong>Copy the source text:</strong> Select text that was entered using the AnmolLipi encoding expected by this converter.</li><li><strong>Paste it into the input box:</strong> The Unicode output updates as you type or paste.</li><li><strong>Review the result:</strong> Check letters, vowel signs, subjoined forms, numerals and punctuation against the source. Unsupported characters may remain unchanged.</li><li><strong>Copy or export:</strong> Use Copy or TXT download for the converted plain text. Reapply formatting in your document editor if needed.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I upload a Word, PDF or PageMaker document?</strong><br>A: No. This converter accepts typed or pasted text. It does not read document files or extract text from scanned pages.</p>
          <p><strong>Q: Does the converter identify AnmolLipi automatically?</strong><br>A: No. This page applies the AnmolLipi mapping. Text encoded with another Punjabi font or a modified AnmolLipi font may not convert correctly.</p>
          <p><strong>Q: Will every AnmolLipi character convert?</strong><br>A: A complete conversion is not guaranteed. The engine uses a finite mapping table, and characters without an applicable mapping can remain unchanged. Review the output before relying on it.</p>
          <p><strong>Q: Does it correct Punjabi spelling or translate the text?</strong><br>A: No. It changes supported legacy character encodings into Unicode. It does not translate language, infer sentence meaning, or proofread spelling and grammar.</p>
          <p><strong>Q: Is my text uploaded to a conversion server?</strong><br>A: The AnmolLipi conversion runs in the browser using the bundled JavaScript mapping engine. This font-conversion component does not send the entered text to a conversion API.</p>
          <p><strong>Q: Does the DOC button create a formatted Word document?</strong><br>A: No. The current DOC-labelled control saves plain text with a .doc filename. It does not create a native or formatted Word document. Use TXT for a plain-text download.</p>
          <p><strong>Q: Do I need the AnmolLipi font to read the converted output?</strong><br>A: No. The output is Gurmukhi Unicode. The receiving device or application needs a font with Gurmukhi glyph support, but it does not need the legacy AnmolLipi font to display the Unicode text.</p>
          <p><strong>Q: Is there a guaranteed unlimited text capacity?</strong><br>A: The interface does not display a fixed text quota, but the converter does not publish a tested unlimited-capacity guarantee. Very large inputs remain subject to browser and device memory and performance.</p>
        `
      }
    ]
  },

  // JOY TO UNICODE — page-specific, implementation-verified guidance
  "joy-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Joy to Unicode Converter Does",
        content: "<p>Paste text encoded with the legacy Joy Punjabi font. This tool converts the pasted characters into standard Gurmukhi Unicode using its built-in Joy mapping. It works with text entered or pasted into the input box; it does not open Word or PDF files, preserve document formatting, translate between languages, or correct spelling.</p>"
      },
      {
        title: "How the Joy Character Mapping Works",
        content: "<p>The converter applies a predefined Joy character map together with shared Gurmukhi character-composition and reordering rules. It is a character-encoding conversion, not a phonetic or meaning-based translation. When a source character or glyph has no matching entry, the converter can leave that character unchanged. Review the converted text before using it.</p>"
      },
      {
        title: "Important Accuracy Limitations",
        content: "<p>The page displays an experimental notice because conversion results may contain errors. The output depends on the source text matching the Joy encoding expected by the built-in mapping. Text from another Punjabi font, a modified font version, or a glyph that is not covered by the map may convert incorrectly or remain unchanged. Proofread the result, especially before using it in official, legal, academic, or published material.</p>"
      },
      {
        title: "How to Use This Converter",
        content: "<ol><li><strong>Paste Joy-encoded text:</strong> Enter or paste the text in the input box.</li><li><strong>Check the output:</strong> The Unicode result appears in the output box as you type.</li><li><strong>Copy the result:</strong> Review the characters and use the Copy button to take the Unicode text into another application.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I upload a Word or PDF document?</strong><br>A: No. This converter accepts pasted or typed text. It does not import document files or retain fonts, page layout, tables, or other formatting.</p>
          <p><strong>Q: Does the tool identify the source font automatically?</strong><br>A: No. This page is configured for Joy text. Use it only when the source text is encoded with the Joy mapping expected by this converter.</p>
          <p><strong>Q: Will every Joy character convert correctly?</strong><br>A: A perfect result is not guaranteed. The converter uses a finite mapping table, and unsupported characters can pass through unchanged. The page is labelled experimental, so proofread the output.</p>
          <p><strong>Q: Is this a Punjabi translator or spell-checker?</strong><br>A: No. It changes character encoding from the supported Joy mapping to Gurmukhi Unicode. It does not translate language, infer meaning, or check spelling and grammar.</p>
          <p><strong>Q: Is my text sent to a conversion server?</strong><br>A: The conversion runs in the browser using the bundled JavaScript mapping code; the font-conversion component does not send the text to a conversion API.</p>
          <p><strong>Q: Do I need the Joy font to read the converted output?</strong><br>A: No. The output is Gurmukhi Unicode. Your device or application needs a font with Gurmukhi Unicode glyph support, but it does not need the legacy Joy font to display the converted text.</p>
        `
      }
    ]
  },

  // SATLUJ TO UNICODE — page-specific, implementation-verified guidance
  "satluj-to-unicode": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Satluj to Unicode Converter Does",
        content: "<p>Paste text encoded with the legacy Satluj Punjabi font to convert its supported characters into Gurmukhi Unicode. The converter works on text in the input box. It does not open or convert Word, PDF, or PageMaker files, and it does not preserve document layout, font styling, tables, or images.</p>"
      },
      {
        title: "How Satluj Character Conversion Works",
        content: "<p>The tool uses a built-in Satluj character mapping together with shared Gurmukhi character-composition and character-ordering rules. It converts character codes; it does not read the visual appearance of a page, translate Punjabi, or determine the intended meaning of a sentence. Characters that are not covered by the mapping may remain unchanged, so check the output against the source.</p>"
      },
      {
        title: "Using Text from Older Documents",
        content: "<p>For an older Word, PageMaker, or PDF document, first copy the text from the application where it is available as selectable text, then paste it here. This converter cannot extract text from a file or from a scanned page. If the copied text was encoded with a different legacy Punjabi font or a modified Satluj font, the result may be incorrect.</p>"
      },
      {
        title: "How to Convert Satluj Text",
        content: "<ol><li><strong>Copy the Satluj text:</strong> Select and copy the text from the original application.</li><li><strong>Paste it into the input box:</strong> The converter processes the entered text and displays the Unicode result.</li><li><strong>Review the output:</strong> Check letters, vowel signs, conjuncts, numerals, and punctuation against the source.</li><li><strong>Copy or export:</strong> Use the available Copy or download controls to take the converted text into another application.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I upload a Satluj Word or PDF file?</strong><br>A: No. The tool accepts text pasted into its input box. Copy selectable text from the original document first; scanned pages and document formatting are not imported.</p>
          <p><strong>Q: Will it preserve the original document's layout and formatting?</strong><br>A: No. It converts text characters only. Page layout, font styling, tables, images, and other document formatting are outside the converter's scope.</p>
          <p><strong>Q: Does the converter translate Punjabi or correct spelling?</strong><br>A: No. It maps supported Satluj-encoded characters to Unicode. It does not translate language, infer meaning, or check spelling and grammar.</p>
          <p><strong>Q: Why do some characters remain unchanged or look incorrect?</strong><br>A: The source may use a different font encoding or a glyph that is not covered by the built-in Satluj mapping. Review the output and do not assume every character or font variant is supported.</p>
          <p><strong>Q: Do I need the Satluj font to read the converted text?</strong><br>A: The output is Gurmukhi Unicode, so the receiving device or application needs a font with Gurmukhi Unicode glyph support. It does not need the legacy Satluj font to display the Unicode output.</p>
          <p><strong>Q: Is my text uploaded to a conversion server?</strong><br>A: The font conversion runs in the browser using the bundled JavaScript mapping code. The font-conversion component does not send the text to a conversion API.</p>
        `
      }
    ]
  },

  // UNICODE TO RAAVI — guide page; no active conversion interface
  "unicode-to-raavi": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What This Raavi Font Page Does",
        content: "<p>This page is a guide to displaying Gurmukhi Unicode text with the Raavi font. It is not a character-encoding converter. The page's current route does not mount a text input/output converter and displays a notice that the interactive tool is unavailable.</p><p>If your text is already Gurmukhi Unicode, you do not need to convert its characters to use a Gurmukhi-capable display font. Choosing a font changes how the Unicode characters look; it does not change the text's encoding.</p>"
      },
      {
        title: "How to Display Unicode Text with Raavi",
        content: "<ol><li><strong>Use Unicode text:</strong> Start with Punjabi text that is already encoded as Gurmukhi Unicode.</li><li><strong>Open your document editor:</strong> Paste or type the Unicode text in the application where you want to use it.</li><li><strong>Choose an installed font:</strong> Select Raavi from the font list if it is installed and available in that application. A different font with Gurmukhi Unicode glyph support may also display the same text.</li><li><strong>Check the result:</strong> Confirm that the Gurmukhi characters and signs render as expected in the receiving application.</li></ol>"
      },
      {
        title: "When You Need a Legacy Font Converter",
        content: "<p>If copied text appears as Latin letters or unrelated symbols, it may be stored using a legacy font encoding rather than Unicode. Changing the display font alone will not convert those legacy character codes into Unicode. Use a converter for the specific source font only when you know which encoding the text uses.</p><ul><li><a href=\"/asees-to-unicode\">Asees to Unicode</a> — for text encoded with the supported Asees mapping.</li><li><a href=\"/satluj-to-unicode\">Satluj to Unicode</a> — for text encoded with the supported Satluj mapping.</li><li><a href=\"/joy-to-unicode\">Joy to Unicode</a> — for text encoded with the supported Joy mapping.</li><li><a href=\"/anmollipi-to-unicode\">AnmolLipi to Unicode</a> — for text encoded with the supported AnmolLipi mapping.</li></ul><p>These converters work with pasted text and have finite mappings. Review their output; they do not import or repair an entire formatted document.</p>"
      },
      {
        title: "Current Page Availability",
        content: "<p>The interactive converter associated with this route is currently unavailable. This page provides font-display guidance only; it does not install Raavi, create a font file, convert text or generate a downloadable document.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do I need to convert Gurmukhi Unicode text to Raavi?</strong><br>A: No. Unicode is the character encoding. Raavi is a font used to display Gurmukhi Unicode characters. Selecting a compatible font does not require changing the text encoding.</p>
          <p><strong>Q: Does this page convert text into Raavi?</strong><br>A: No. The interactive converter is currently unavailable on this route. The page provides guidance about displaying Unicode text with a Gurmukhi font.</p>
          <p><strong>Q: Does this page install or provide the Raavi font?</strong><br>A: No. It does not install, embed or download a font. Select Raavi only if it is already installed and available in your application.</p>
          <p><strong>Q: What if my Punjabi text looks like English letters?</strong><br>A: It may be legacy-font text rather than Unicode. Identify the source font before choosing a converter; this page does not detect the source encoding automatically.</p>
          <p><strong>Q: Is Raavi mandatory for every official typing test?</strong><br>A: This page does not verify current recruitment or examination rules. Check the latest official notification and application instructions for the specific test.</p>
        `
      }
    ]
  },
  // KRUTI DEV TO UNICODE / MANGAL CONVERTER
  "krutidev-to-unicode": {
    sections: [
      {
        title: "Kruti Dev to Unicode & Mangal Font Converter",
        content: "<p>Convert legacy <strong>Kruti Dev (010, 011, 016, 020, 021) and DevLys</strong> text into universal <strong>Unicode Hindi (Mangal font)</strong> directly in your browser. Whether you are preparing for typing practice, drafting documents, or sharing Hindi text on WhatsApp and websites, this tool provides character mapping to standard Unicode.</p>"
      },
      {
        title: "What is Mangal Font and Why is it Useful?",
        content: "<p><strong>Mangal</strong> is the standard Unicode Devanagari font developed for Indian languages. Unlike legacy fonts like Kruti Dev (which require specific .ttf font files to be installed on each computer), <strong>Unicode text works across all smartphones, computers, tablets, and web browsers</strong>.</p><ul><li><strong>Universal Readability:</strong> Converted Unicode text can be pasted into WhatsApp, email, Google Docs, and web portals.</li><li><strong>In-Browser Processing:</strong> Text conversion runs locally inside your web browser without uploading your files.</li></ul>"
      },
      {
        title: "How to Convert Kruti Dev to Unicode",
        content: "<ol><li><strong>Paste Kruti Dev Text:</strong> Paste your Kruti Dev or DevLys text into the left box.</li><li><strong>Automatic Conversion:</strong> The tool translates your text into readable Unicode on the right.</li><li><strong>Copy Output:</strong> Click 'Copy' to copy to your clipboard for use in your documents.</li></ol>"
      },
      {
        title: "Frequently Asked Questions (FAQ) – Mangal & Kruti Dev",
        content: `
          <p><strong>Q: Is Unicode Hindi the same as Mangal font?</strong><br>A: Yes. Mangal is the default font used by Windows to display standard Devanagari Unicode. Any Unicode text generated by this converter will display in Mangal font on Windows systems.</p>
          <p><strong>Q: Why does my Kruti Dev text show as English letters like 'd', 'j', 'k' on WhatsApp?</strong><br>A: Kruti Dev mapped English keyboard keys to Hindi glyphs. Without the Kruti Dev font installed, devices display raw English letters. Converting to Unicode fixes this so text displays properly on any screen.</p>
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
