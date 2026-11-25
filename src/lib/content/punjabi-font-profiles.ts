export interface FontContentProfile {
  slug: string;
  fontName: string;
  direction: 'to-unicode' | 'from-unicode';
  description: string;
  primaryUseCases: string[];
  mappingConsiderations: string[];
  compatibilityNotes: string[];
  relatedConverters: { slug: string; name: string }[];
  faqs?: { question: string; answer: string }[];
}

export function generatePunjabiFontContent(profile: FontContentProfile) {
  const isToUnicode = profile.direction === 'to-unicode';
  const directionLabel = isToUnicode
    ? profile.fontName + ' to Unicode'
    : 'Unicode to ' + profile.fontName;
  const sections: { title: string, content: string }[] = [];

  sections.push({
    title: directionLabel + ' Punjabi Text Converter',
    content: '<p>' + profile.description + '</p>'
  });

  if (profile.primaryUseCases && profile.primaryUseCases.length > 0) {
    sections.push({
      title: 'When to use this conversion',
      content: '<p>This text converter is intended for workflows that already contain text in the source encoding or need text in the selected legacy font encoding.</p><ul class="list-disc pl-5 mt-2 space-y-1">' +
        profile.primaryUseCases.map(uc => '<li>' + uc + '</li>').join('') + '</ul>'
    });
  }

  if (profile.mappingConsiderations && profile.mappingConsiderations.length > 0) {
    sections.push({
      title: 'How the ' + profile.fontName + ' character mapping works',
      content: '<p>The converter applies a character map for ' + profile.fontName + '. It changes character encoding; it does not translate Punjabi into another language or identify a font from an uploaded document. Mapping coverage can vary across font editions and custom layouts.</p><ul class="list-disc pl-5 mt-2 space-y-1">' +
        profile.mappingConsiderations.map(mc => '<li>' + mc + '</li>').join('') + '</ul>'
    });
  }

  if (profile.compatibilityNotes && profile.compatibilityNotes.length > 0) {
    sections.push({
      title: 'Compatibility and troubleshooting',
      content: '<ul class="list-disc pl-5 mt-2 space-y-1">' +
        profile.compatibilityNotes.map(cn => '<li>' + cn + '</li>').join('') + '</ul>'
    });
  }

  sections.push({
    title: 'How to use this text converter',
    content: isToUnicode
      ? '<ol><li><strong>Copy the encoded text:</strong> In the original application, select the text that uses the ' + profile.fontName + ' font and copy it.</li><li><strong>Paste it here:</strong> Paste the copied characters into the input box. This page converts text, not the original document file.</li><li><strong>Review the Unicode result:</strong> Compare names, numbers, punctuation and less-common characters with the source before reusing the result.</li><li><strong>Copy or save:</strong> Copy the converted Gurmukhi Unicode text or use the available text export controls.</li></ol>'
      : '<ol><li><strong>Enter Unicode text:</strong> Paste standard Gurmukhi Unicode text into the input box.</li><li><strong>Review the converted characters:</strong> The output is encoded for the ' + profile.fontName + ' legacy font mapping.</li><li><strong>Copy the output:</strong> Copy it into the application where you need to use it.</li><li><strong>Apply the target font:</strong> Select the ' + profile.fontName + ' font in that application so its legacy character codes display as Gurmukhi.</li></ol>'
  });

  sections.push({
    title: 'Input, output and file limitations',
    content: '<p>This is a paste-text converter. It does not open or upload Word, PDF, PageMaker or other document files. It converts the characters entered in the text boxes; document layout, tables, images, styles and page formatting are not carried across. Conversion is performed in the browser using JavaScript.</p><p>The toolbar offers TXT and DOC-labelled downloads. The DOC-labelled option currently saves plain text with a <code>.doc</code> filename; it is not a formatted Microsoft Word document. Use the TXT option for a plain-text export, or paste the result into Word and save it in the document format you need.</p>'
  });

  if (profile.faqs && profile.faqs.length > 0) {
    sections.push({
      title: 'Frequently asked questions',
      content: profile.faqs.map(faq => '<p><strong>Q: ' + faq.question + '</strong><br>A: ' + faq.answer + '</p>').join('\n')
    });
  }

  if (profile.relatedConverters && profile.relatedConverters.length > 0) {
    sections.push({
      title: 'Related Punjabi converters',
      content: '<ul class="list-disc pl-5 mt-2 space-y-1">' +
        profile.relatedConverters.map(rc => '<li><a href="/' + rc.slug + '" class="text-blue-600 dark:text-blue-400 hover:underline">' + rc.name + '</a></li>').join('') + '</ul>'
    });
  }

  return { sections, disableAutoEnrich: true };
}

const punjabiProfiles: FontContentProfile[] = [
  {
    slug: "joy-to-unicode",
    fontName: "Joy",
    direction: "to-unicode",
    description: "Converts pasted text encoded with the legacy Joy Punjabi font mapping into standard Gurmukhi Unicode. The page accepts text in its input box; it does not import a complete document.",
    primaryUseCases: [
      "Converting text copied from a document that uses the Joy font before sharing the resulting Unicode text in a browser, WhatsApp, or social media.",
      "Converting copied passages from older Word or desktop-publishing documents when their underlying text uses the Joy mapping.",
      "Preparing text for modern data storage and search engines which require Unicode."
    ],
    mappingConsiderations: [
      "The converter uses the Joy character table present in the current mapping engine. Modified Joy fonts or text containing unsupported glyphs may not match this table.",
      "The shared conversion engine includes logic for repositioning pre-base Sihari (ਿ). Review words containing repeated Sihari marks because sequence edge cases may affect the result.",
      "The mapping includes selected subjoined-consonant and composed-character sequences; check uncommon conjuncts and symbols against the source text."
    ],
    compatibilityNotes: [
      "If copied text appears as Latin characters, it may have been typed with a legacy font. Conversion can decode characters covered by the Joy mapping; compare the result with the original.",
      "No specific font installation is required to read the generated Unicode text on iOS, Android, or Windows."
    ],
    relatedConverters: [
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "anmollipi-to-unicode", name: "AnmolLipi to Unicode" }
    ],
    faqs: [
      {
        question: "Why does Joy font text appear broken in modern applications?",
        answer: "Joy uses a legacy non-Unicode character mapping. Converting text covered by the current mapping produces Unicode Gurmukhi that can be used in applications supporting Gurmukhi Unicode; compare the result with the original for accuracy."
      },
      {
        question: "Do I need to install Joy font to read the converted text?",
        answer: "No. The converted output is standard Unicode Gurmukhi, which is natively supported on all modern computers, phones, and browsers."
      },
      {
        question: "Does Joy to Unicode keep Word formatting or export a formatted DOC file?",
        answer: "No. This page converts pasted text only, so bold styling, tables, images and layout are not preserved. The DOC-labelled download saves plain text with a .doc extension rather than a formatted Microsoft Word document."
      }
    ]
  },
  {
    slug: "unicode-to-satluj",
    fontName: "Satluj",
    direction: "from-unicode",
    description: "Converts pasted standard Gurmukhi Unicode text into character codes for the Satluj legacy font mapping. Apply the Satluj font in the destination application to view the output as Gurmukhi.",
    primaryUseCases: [
      "Preparing pasted Punjabi text to paste into Adobe PageMaker, CorelDraw, or desktop-publishing layouts using the Satluj font.",
      "Converting Unicode text into Satluj character codes for legacy print workflows that require the Satluj font.",
      "Updating copied text inside older newspaper templates that have not migrated to Unicode."
    ],
    mappingConsiderations: [
      "Maps supported Unicode characters to the character codes in the current Satluj table. The result is legacy-font text, not standard Unicode.",
      "The converter applies sequence handling for selected Gurmukhi compositions. Check vowel signs, numbers and punctuation in the target Satluj font before relying on the output."
    ],
    compatibilityNotes: [
      "IMPORTANT: After conversion, you MUST select 'Satluj' from the font dropdown menu in your design software. Otherwise, the text will appear as Latin or extended characters.",
      "Satluj text is not suitable for emails or web pages. Use this strictly for workflows where the Satluj font is applied."
    ],
    relatedConverters: [
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "unicode-to-asees", name: "Unicode to Asees" }
    ],
    faqs: [
      {
        question: "Why do I need to convert Unicode to Satluj?",
        answer: "Older desktop publishing software like Adobe PageMaker 6.5 and some regional print templates still use legacy non-Unicode fonts like Satluj. Converting pasted Unicode text into Satluj codes lets you place it into those older layouts."
      },
      {
        question: "Why does the output look garbled until I select the Satluj font?",
        answer: "The output uses character codes intended for the Satluj font. Select Satluj in the destination application; without the matching font, the text may look like Latin or extended characters."
      },
      {
        question: "Is Satluj text suitable for websites or messaging apps?",
        answer: "Legacy-font text is not a substitute for Unicode on websites or messaging apps. Use Unicode for modern digital sharing; use Satluj output only where the receiving workflow supports that font."
      }
    ]
  },
  {
    slug: "satluj-to-unicode",
    fontName: "Satluj",
    direction: "to-unicode",
    description: "Converts pasted text encoded with the supported Satluj legacy character mapping into Gurmukhi Unicode. The converter processes text, not the original document or its formatting.",
    primaryUseCases: [
      "Converting text copied from older PageMaker layouts, newspaper archives or desktop-publishing files when it retains Satluj character codes.",
      "Converting text copied from older Punjabi PDFs when the copied characters retain the supported Satluj legacy encoding.",
      "Modernizing print-ready text for digital archiving and indexing."
    ],
    mappingConsiderations: [
      "Maps character codes in the current Satluj table to Gurmukhi Unicode. It does not read page layout or infer characters from an image of a document.",
      "Font editions, numeral conventions and documents with custom glyph substitutions can differ across legacy files; proofread numbers, vowel signs and uncommon characters against the source."
    ],
    compatibilityNotes: [
      "The resulting text will render using your system's default Gurmukhi font (such as Raavi on Windows or Nirmala UI).",
      "Formatting like bold or italics from PageMaker will be lost during plain-text conversion; only the character data is preserved."
    ],
    relatedConverters: [
      { slug: "unicode-to-satluj", name: "Unicode to Satluj" },
      { slug: "joy-to-unicode", name: "Joy to Unicode" },
      { slug: "asees-to-unicode", name: "Asees to Unicode" }
    ],
    faqs: [
      {
        question: "What is Satluj font commonly used for?",
        answer: "When copied text contains Satluj character codes, this converter can map supported characters to Unicode Gurmukhi. It does not import the original PDF or PageMaker file."
      },
      {
        question: "Will converting Satluj text to Unicode change its spelling?",
        answer: "The converter applies the character mappings available for Satluj. It does not proofread Punjabi spelling or guarantee that every font variant and special character is covered, so compare the output with the source."
      },
      {
        question: "Do I need to install any font to read the converted text?",
        answer: "No. Standard Gurmukhi Unicode is built into Windows (via Raavi or Nirmala UI), macOS, iOS, and Android. The converted text works immediately across all modern devices."
      }
    ]
  },
  {
    slug: "asees-to-unicode",
    fontName: "Asees",
    direction: "to-unicode",
    description: "Converts pasted text encoded with the Asees Punjabi legacy font mapping into standard Gurmukhi Unicode. It is a text conversion utility, not an official examination typing or validation system.",
    primaryUseCases: [
      "Converting Asees practice passages into Unicode so the characters can be reviewed separately; this tool does not score typing speed or certify exam readiness.",
      "Converting text copied from older government documents that use the Asees legacy mapping into searchable Unicode text.",
      "Converting copied Asees-encoded text into Unicode before using it in mobile apps, websites or messaging services."
    ],
    mappingConsiderations: [
      "The current Asees table includes legacy character mappings and uses the shared engine for Gurmukhi sequence handling. Check words with repeated vowel signs and uncommon combinations against the source.",
      "The mapping includes entries for selected Pairi characters, Bindi, Tippi and Addak sequences. This should not be read as a guarantee that every Asees font edition or custom glyph is covered."
    ],
    compatibilityNotes: [
      "Converted text will automatically render using your system's default Gurmukhi font (such as Raavi on Windows or Nirmala UI).",
      "Check numbers and punctuation separately if the source mixes Western digits with legacy-font characters; the converter page does not provide a separate digit-conversion toggle."
    ],
    relatedConverters: [
      { slug: "unicode-to-asees", name: "Unicode to Asees" },
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "anmollipi-to-unicode", name: "AnmolLipi to Unicode" }
    ],
    faqs: [
      {
        question: "Can this converter confirm whether my Asees practice text meets PSSSB typing-test requirements?",
        answer: "No. The tool converts pasted Asees-encoded text into Unicode; it does not reproduce or certify an official typing-test environment. Check the current PSSSB notification for the required input method, font and layout. Use the converter only to inspect or convert practice text."
      },
      {
        question: "How is Unicode different from Asees?",
        answer: "Asees is a legacy font that stores Punjabi text using English ASCII character codes, requiring the Asees font file on every machine. Unicode is an international standard where each Gurmukhi character has its own universal code, making text readable across all devices without installing fonts."
      },
      {
        question: "Does Asees to Unicode preserve layout or export a formatted Word file?",
        answer: "No. It converts pasted characters only and does not carry across Word styles, tables or formatting. The toolbar DOC button downloads plain text with a .doc filename rather than a formatted Word document."
      }
    ]
  },
  {
    slug: "unicode-to-asees",
    fontName: "Asees",
    direction: "from-unicode",
    description: "Converts pasted Gurmukhi Unicode text into character codes for the Asees legacy font mapping. Apply the Asees font in the destination application to display the output as Gurmukhi.",
    primaryUseCases: [
      "Preparing pasted Unicode Punjabi text for older software such as Adobe PageMaker 6.5 or CorelDraw that relies on the Asees font.",
      "Converting Unicode passages into Asees character codes for print templates that require the Asees font.",
      "Creating a legacy Asees text copy alongside existing publishing templates designed for the Asees font layout."
    ],
    mappingConsiderations: [
      "Maps supported Gurmukhi Unicode characters and sequences to the character codes in the current Asees table.",
      "Uses the shared conversion engine to handle selected pre-base vowel sequences. Check words with repeated Sihari and uncommon combinations after conversion.",
      "Includes selected subjoined-consonant and composed-character mappings; it may not cover every custom or modified Asees glyph."
    ],
    compatibilityNotes: [
      "Important: After pasting the converted text into Microsoft Word, PageMaker, or CorelDraw, you must highlight the text and choose 'Asees' from your font dropdown. If you do not have the Asees font selected, it will look like random English characters.",
      "Do not use Asees text for sending emails, web pages, or WhatsApp messages, as recipients without the Asees font installed will not be able to read it. Use Unicode for digital communication."
    ],
    relatedConverters: [
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "unicode-to-satluj", name: "Unicode to Satluj" },
      { slug: "unicode-to-joy", name: "Unicode to Joy" }
    ],
    faqs: [
      {
        question: "Why does my converted text look like English letters after converting to Asees?",
        answer: "Asees is a legacy non-Unicode font. After converting, copy the output, paste it into your word processor or design application, and select the 'Asees' font from your font menu."
      },
      {
        question: "Should I use Asees or Unicode for typing Punjabi?",
        answer: "For almost all modern purposes—including websites, government portals, emails, and mobile phones—standard Unicode is recommended. Asees should only be used if you are working with older printing presses or legacy software like PageMaker."
      },
      {
        question: "Does Unicode to Asees keep Word formatting or create a formatted DOCX file?",
        answer: "No. The converter outputs unformatted plain text, and the DOC download button saves plain text with a .doc filename. Paste the output into Word or PageMaker, select the Asees font, and apply formatting there."
      }
    ]
  },
  {
    slug: "anmollipi-to-unicode",
    fontName: "AnmolLipi",
    direction: "to-unicode",
    description: "Converts pasted text encoded with the AnmolLipi legacy character mapping into standard Gurmukhi Unicode. It does not import a complete Word, PDF or PageMaker document.",
    primaryUseCases: [
      "Converting passages copied from Punjabi documents, notes or books that use the AnmolLipi character mapping into Unicode.",
      "Converting AnmolLipi-encoded text copied from Word or another document editor when it appears as Latin or extended characters.",
      "Preparing Punjabi text for publishing on websites, blogs, and social media platforms."
    ],
    mappingConsiderations: [
      "The converter uses the AnmolLipi character table in the current engine to map legacy character codes to Gurmukhi Unicode.",
      "The shared conversion engine includes pre-base Sihari (ਿ) repositioning. Repeated Sihari sequences are a known edge case and should be checked in the result.",
      "The table includes mappings for selected subjoined consonants, Bindi, Tippi and Addak. This does not guarantee full coverage of every font edition or custom glyph."
    ],
    compatibilityNotes: [
      "Once converted, your text does not need the AnmolLipi font installed to be viewed. It will display in system fonts like Raavi or Nirmala UI.",
      "Original formatting like text color and table borders is not preserved during plain text conversion; copy the converted text back into Word to reapply styling."
    ],
    relatedConverters: [
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "joy-to-unicode", name: "Joy to Unicode" }
    ],
    faqs: [
      {
        question: "Why does my AnmolLipi text look like English gibberish in Word or WhatsApp?",
        answer: "AnmolLipi is a legacy ASCII font that borrowed standard English keys for Gurmukhi letters. Without the AnmolLipi font installed, modern devices display the raw English letters. Converting to Unicode gives each Punjabi letter its own genuine Unicode character code."
      },
      {
        question: "Can I use this converted text on mobile phones?",
        answer: "Yes. All modern Android and iOS devices have built-in support for Gurmukhi Unicode, so your text will display properly on phones, tablets, and computers."
      },
      {
        question: "Will converting AnmolLipi text preserve document layout and formatting?",
        answer: "No. This tool converts pasted plain text only, so fonts, headings, tables, images and page layout are not carried over. Paste the Unicode output back into Word or your editor to reapply styles; the DOC download button saves plain text with a .doc extension rather than a formatted Word file."
      }
    ]
  },
  {
    slug: "gurbani-akhar-to-unicode",
    fontName: "Gurbani Akhar",
    direction: "to-unicode",
    description: "Converts pasted text intended for legacy Gurbani Akhar/GurbaniLipi encoding into Gurmukhi Unicode. The current route uses the GurbaniLipi mapping profile; compatibility with every font carrying these names has not been established.",
    primaryUseCases: [
      "Converting copied Gurbani Shabad, Steek or Nitnem passages when their text uses the legacy mapping selected by this route.",
      "Preparing copied text from older Sikh literature or religious publications for use in Unicode-based websites and mobile apps.",
      "Sharing converted Unicode Gurbani passages on devices that support Gurmukhi Unicode, without requiring the recipient to install the source legacy font."
    ],
    mappingConsiderations: [
      "In the current implementation, the Gurbani Akhar route selects the GurbaniLipi profile, which reuses the AnmolLipi base character table and overlays GurbaniLipi-specific numeral entries. This is not evidence of a separately verified full mapping for every Gurbani Akhar font edition.",
      "The shared engine includes sequence handling for selected pre-base vowels and subjoined characters. Review religious text against the original, particularly repeated vowel signs, uncommon ligatures and punctuation.",
      "Do not assume every poetic ligature, custom punctuation mark or nonstandard glyph is covered; compare each converted passage with a trusted copy of the source."
    ],
    compatibilityNotes: [
      "The converted Unicode text will render in any standard Gurmukhi font such as Raavi, Nirmala UI, or Gurmukhi MN on Mac/iOS.",
      "No specialized Gurbani font installation is needed on recipient devices to read the converted Unicode text."
    ],
    relatedConverters: [
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "anmollipi-to-unicode", name: "AnmolLipi to Unicode" },
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" }
    ],
    faqs: [
      {
        question: "How is Gurbani Akhar different from standard Unicode?",
        answer: "Gurbani Akhar is a legacy non-Unicode font family from the 1990s and 2000s that mapped Gurmukhi characters onto English keyboard keys. Unicode is the universal international standard where each Gurmukhi character has its own unique character code, allowing text to display properly on any computer or smartphone without installing special fonts."
      },
      {
        question: "Will symbols like Ek Onkar (ੴ) convert properly?",
        answer: "The current mapping contains an Ek Onkar composition, but the output should still be checked against the source font and the original passage. Custom ligatures and punctuation may not be represented."
      },
      {
        question: "How does this Gurbani Akhar route relate to GurbaniLipi and AnmolLipi?",
        answer: "In the current converter code, the Gurbani Akhar route selects the GurbaniLipi profile, which inherits the AnmolLipi base mapping table and adds separate numeral entries. Because it does not use a separate verified Gurbani Akhar table, compare converted Gurbani text carefully against the source."
      }
    ]
  },
  {
    slug: "unicode-to-anmollipi",
    fontName: "AnmolLipi",
    direction: "from-unicode",
    description: "Converts pasted Gurmukhi Unicode text into character codes for the AnmolLipi legacy font mapping. Select the AnmolLipi font in the destination application to view the output as Punjabi.",
    primaryUseCases: [
      "Preparing Unicode Punjabi text for an existing document template that requires AnmolLipi.",
      "Moving text into legacy desktop-publishing workflows that still use the AnmolLipi font.",
      "Creating a legacy-font text copy while retaining the original Unicode version separately."
    ],
    mappingConsiderations: [
      "The converter uses the AnmolLipi character table in the current engine; unsupported characters may remain unchanged or may not have a matching legacy glyph.",
      "The shared engine handles selected Gurmukhi compositions and vowel sequences, but repeated Sihari sequences and uncommon characters should be reviewed.",
      "The output is legacy-font character data, not Unicode Punjabi. Apply the AnmolLipi font to display the intended Gurmukhi glyphs."
    ],
    compatibilityNotes: [
      "Use the output only in an application where the AnmolLipi font is installed and available.",
      "The converter produces plain text. It does not create a formatted Word or PageMaker document or preserve layout, tables, images or styles."
    ],
    relatedConverters: [
      { slug: "anmollipi-to-unicode", name: "AnmolLipi to Unicode" },
      { slug: "unicode-to-asees", name: "Unicode to Asees" },
      { slug: "unicode-to-joy", name: "Unicode to Joy" }
    ],
    faqs: [
      {
        question: "Why does the output look like English or extended characters?",
        answer: "That is expected for legacy-font encoding. Select the AnmolLipi font in the application where you pasted the output so its character codes render as Gurmukhi."
      },
      {
        question: "Can I use AnmolLipi output on WhatsApp or a website?",
        answer: "Use standard Unicode for websites, WhatsApp and modern messaging. Legacy AnmolLipi text generally requires the matching font to display as intended."
      },
      {
        question: "Does this create a formatted Word document?",
        answer: "No. The converter outputs plain text. It does not preserve document layout or create a formatted DOCX file."
      }
    ]
  },
  {
    slug: "unicode-to-joy",
    fontName: "Joy",
    direction: "from-unicode",
    description: "Converts pasted Gurmukhi Unicode text into character codes for the Joy legacy font mapping. Select the Joy font in the destination application to view the output as Punjabi.",
    primaryUseCases: [
      "Preparing Unicode Punjabi text for an existing document template that requires Joy.",
      "Moving text into legacy desktop-publishing workflows that still use the Joy font.",
      "Creating a legacy-font text copy while retaining the original Unicode version separately."
    ],
    mappingConsiderations: [
      "The converter uses the Joy character table in the current engine; it does not translate language or infer a font from a document.",
      "The shared engine handles selected Gurmukhi compositions and vowel sequences. Check repeated Sihari sequences, uncommon conjuncts and unsupported characters.",
      "The result is legacy-font character data, not Unicode Punjabi. Apply the Joy font to display the intended Gurmukhi glyphs."
    ],
    compatibilityNotes: [
      "Use the output only in an application where the Joy font is installed and available.",
      "The converter produces plain text; it does not preserve the source document's layout, tables, images or styles."
    ],
    relatedConverters: [
      { slug: "joy-to-unicode", name: "Joy to Unicode" },
      { slug: "unicode-to-asees", name: "Unicode to Asees" },
      { slug: "unicode-to-satluj", name: "Unicode to Satluj" }
    ],
    faqs: [
      {
        question: "Why does the output look like English or extended characters?",
        answer: "That is expected for legacy-font encoding. Select the Joy font in the application where you pasted the output so its character codes render as Gurmukhi."
      },
      {
        question: "Can I use Joy output on WhatsApp or a website?",
        answer: "Use standard Unicode for websites, WhatsApp and modern messaging. Legacy Joy text generally requires the matching font to display as intended."
      },
      {
        question: "Does this create a formatted Word document?",
        answer: "No. The converter outputs plain text. It does not preserve document layout or create a formatted DOCX file."
      }
    ]
  }
];

export const generatedPunjabiProfiles: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich: boolean }> = {};
for (const profile of punjabiProfiles) {
  generatedPunjabiProfiles[profile.slug] = generatePunjabiFontContent(profile);
}
