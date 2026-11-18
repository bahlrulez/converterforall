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
  const targetFont = isToUnicode ? 'Unicode' : profile.fontName;
  
  const sections: { title: string, content: string }[] = [];

  // Section 1: What this conversion does
  let section1Title = `What does the ${profile.fontName} converter do?`;
  if (profile.slug === 'unicode-to-satluj') {
    section1Title = 'Converting Unicode Punjabi Text to Satluj Font';
  } else if (profile.slug === 'satluj-to-unicode') {
    section1Title = 'Converting Satluj Font to Punjabi Unicode Text';
  } else if (profile.slug === 'gurbani-akhar-to-unicode') {
    section1Title = 'Converting Gurbani Akhar Font to Gurmukhi Unicode';
  } else if (profile.slug === 'anmollipi-to-unicode') {
    section1Title = 'Converting AnmolLipi Font to Gurmukhi Unicode';
  }

  sections.push({
    title: section1Title,
    content: `<p>${profile.description} This conversion is essential for individuals working with Punjabi literature, regional news publications, and government documentation where maintaining the exact intent of the original language is critical. Legacy fonts were built before modern standards existed, causing them to break on today's devices. Converting them bridges the gap between old typesetting methods and modern digital platforms.</p>`
  });

  // Section 2: Use Cases (Only generated if they exist)
  if (profile.primaryUseCases && profile.primaryUseCases.length > 0) {
    sections.push({
      title: `Common Use Cases for ${targetFont}`,
      content: `<p>There are many situations where converting between these font formats becomes necessary in everyday workflows:</p><ul class="list-disc pl-5 mt-2 space-y-1">${profile.primaryUseCases.map(uc => `<li>${uc}</li>`).join('')}</ul>`
    });
  }

  // Section 3: Mapping Considerations
  if (profile.mappingConsiderations && profile.mappingConsiderations.length > 0) {
    sections.push({
      title: "Font-Specific Mapping Behavior",
      content: `<p>Unlike simple English translation, converting Indian languages requires complex character mapping to ensure phonetic accuracy and visual fidelity:</p><ul class="list-disc pl-5 mt-2 space-y-1">${profile.mappingConsiderations.map(mc => `<li>${mc}</li>`).join('')}</ul>`
    });
  }

  // Section 4: Compatibility and Troubleshooting
  if (profile.compatibilityNotes && profile.compatibilityNotes.length > 0) {
    sections.push({
      title: "Compatibility & Troubleshooting",
      content: `<p>If you are experiencing issues reading or formatting your converted text, keep the following technical considerations in mind:</p><ul class="list-disc pl-5 mt-2 space-y-1">${profile.compatibilityNotes.map(cn => `<li>${cn}</li>`).join('')}</ul>`
    });
  }

  // Section 5: FAQs (if provided)
  if (profile.faqs && profile.faqs.length > 0) {
    sections.push({
      title: "Frequently Asked Questions",
      content: profile.faqs.map(faq => `<p><strong>Q: ${faq.question}</strong><br>A: ${faq.answer}</p>`).join('\n')
    });
  }

  // Section 6: Privacy and Local Processing
  sections.push({
    title: "Do You Need to Upload Your Documents?",
    content: "<p>Most of our tools run directly inside your browser so your documents stay on your device. Your Punjabi text is converted locally in your browser's memory without sending your words to a remote server. No login or account is required.</p>"
  });

  // Section 7: Free and Unlimited
  sections.push({
    title: "Is This Converter Free to Use?",
    content: "<p>Yes. You can convert as many paragraphs or documents as you need, completely free of charge. There are no daily usage limits, no hidden waiting queues, and no requirement to create an account or provide an email address. Simply paste your text into the box and receive instant, unlimited conversions.</p>"
  });

  // Section 8: Related Converters
  if (profile.relatedConverters && profile.relatedConverters.length > 0) {
    sections.push({
      title: "Related Punjabi Converters",
      content: `<ul class="list-disc pl-5 mt-2 space-y-1">${profile.relatedConverters.map(rc => `<li><a href="/${rc.slug}" class="text-blue-600 dark:text-blue-400 hover:underline">${rc.name}</a></li>`).join('')}</ul>`
    });
  }

  return {
    sections,
    disableAutoEnrich: true
  };
}

const punjabiProfiles: FontContentProfile[] = [
  {
    slug: "joy-to-unicode",
    fontName: "Joy",
    direction: "to-unicode",
    description: "Converts legacy Joy font text (a popular non-Unicode Punjabi font) into standard Gurmukhi Unicode.",
    primaryUseCases: [
      "Pasting legacy Joy text into modern web browsers, WhatsApp, or social media.",
      "Fixing broken Punjabi documents where the text appears as random English letters.",
      "Preparing text for modern data storage and search engines which require Unicode."
    ],
    mappingConsiderations: [
      "Joy maps Punjabi characters directly onto English ASCII keys. The converter reconstructs the phonetic intent.",
      "Handles the repositioning of Sihari (ਿ) which is often typed before the consonant in legacy layouts but must be stored after the consonant in Unicode.",
      "Translates Joy-specific half-characters and conjuncts into standard Unicode ligature formats."
    ],
    compatibilityNotes: [
      "If your text looks like English gibberish when pasted into Word, it was likely typed in a legacy font like Joy. Converting to Unicode permanently resolves this.",
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
        answer: "Joy is an older ASCII font. In modern applications and web browsers that expect Unicode, Joy text displays as random English characters. Converting to Unicode permanently fixes the text so it can be read anywhere."
      },
      {
        question: "Do I need to install Joy font to read the converted text?",
        answer: "No. The converted output is standard Unicode Gurmukhi, which is natively supported on all modern computers, phones, and browsers."
      },
      {
        question: "Does this conversion happen locally on my computer?",
        answer: "Most of our tools run directly inside your browser so your documents stay on your device. The font conversion executes entirely within your browser's memory without sending your text to a server."
      }
    ]
  },
  {
    slug: "unicode-to-satluj",
    fontName: "Satluj",
    direction: "from-unicode",
    description: "Converts standard Punjabi Unicode text back into the legacy Satluj font format.",
    primaryUseCases: [
      "Formatting text for Adobe PageMaker, CorelDraw, and traditional DTP (Desktop Publishing) workflows in Punjab.",
      "Preparing documents for legacy offset printing presses that mandate the use of Satluj font files.",
      "Editing older newspaper templates that have not yet migrated to Unicode."
    ],
    mappingConsiderations: [
      "Translates standard Unicode sequence rules back into visual rendering keystrokes required by Satluj.",
      "Adjusts the placement of vowel modifiers (matras) to match the physical typing layout of the Satluj font."
    ],
    compatibilityNotes: [
      "IMPORTANT: After conversion, you MUST select 'Satluj' from the font dropdown menu in your design software. Otherwise, the text will appear as meaningless English characters.",
      "Satluj text is not suitable for emails or web pages. Use this strictly for offline print design."
    ],
    relatedConverters: [
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "asees-to-unicode", name: "Asees to Unicode" },
      { slug: "unicode-to-asees", name: "Unicode to Asees" }
    ],
    faqs: [
      {
        question: "Why do I need to convert Unicode to Satluj?",
        answer: "Older desktop publishing software like Adobe PageMaker 6.5 and some regional offset printing presses require legacy ASCII fonts like Satluj. Converting Unicode to Satluj allows you to work with these older publishing workflows."
      },
      {
        question: "Why does the output look garbled until I select the Satluj font?",
        answer: "Satluj uses standard ASCII and ANSI character slots. You must select 'Satluj' from your font dropdown menu in Word or PageMaker for the characters to render as Gurmukhi."
      },
      {
        question: "Is Satluj text suitable for websites or messaging apps?",
        answer: "No. Satluj text will display as random characters on devices that do not have the Satluj font installed. For websites, emails, and messaging apps, use standard Unicode instead."
      }
    ]
  },
  {
    slug: "satluj-to-unicode",
    fontName: "Satluj",
    direction: "to-unicode",
    description: "Converts older Satluj font documents into modern, universally readable Gurmukhi Unicode.",
    primaryUseCases: [
      "Salvaging old PageMaker documents, newspaper archives, or legacy DTP files for the modern web.",
      "Fixing rendering issues when copying text from older Punjabi PDFs into web forms.",
      "Modernizing print-ready text for digital archiving and indexing."
    ],
    mappingConsiderations: [
      "Parses the visual layout of Satluj keystrokes and restructures them into logical Unicode sequencing.",
      "Resolves ambiguity in Satluj half-characters that map to multiple Unicode scalar values."
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
        answer: "Satluj is a popular legacy Punjabi font widely used in Punjab for newspaper publishing, book typesetting, and PageMaker documents. Converting it to Unicode allows those legacy documents to be read on modern screens and websites."
      },
      {
        question: "Will converting Satluj text to Unicode change its spelling?",
        answer: "The converter maps characters according to proper Gurmukhi grammar and phonetic rules, reordering vowels like Sihari to ensure accurate spelling in Unicode."
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
    description: "Converts text typed using the legacy Asees keyboard layout into standard Gurmukhi Unicode. Specifically designed for candidates preparing for PSSSB, Punjab Police, and High Court typing tests.",
    primaryUseCases: [
      "Converting practice paragraphs from Asees into standard Unicode to verify typing accuracy for PSSSB and state exams.",
      "Migrating old government documents typed in Asees into modern, searchable Unicode text.",
      "Fixing garbled Punjabi text on mobile devices and WhatsApp by converting the legacy ASCII encoding into universal UTF-8."
    ],
    mappingConsiderations: [
      "Asees utilizes a specific typewriter-style key mapping where matras like Sihari ('f') are typed before the consonant. This tool automatically repositions them correctly for Unicode rendering.",
      "Handles all complex Pairi characters (Pairi Rara, Pairi Haha, Pairi Vava), Bindis, Tippis, and Addaks with precise typographical mapping."
    ],
    compatibilityNotes: [
      "Converted text will automatically render using your system's default Gurmukhi font (such as Raavi on Windows or Nirmala UI).",
      "Toggle the 'Convert digits' option if you specifically need standard English numbers (0-9) converted to traditional Gurmukhi numerals (੦-੯)."
    ],
    relatedConverters: [
      { slug: "unicode-to-asees", name: "Unicode to Asees" },
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "anmollipi-to-unicode", name: "AnmolLipi to Unicode" }
    ],
    faqs: [
      {
        question: "Is Asees font accepted in PSSSB typing tests?",
        answer: "Most official government typing exams, including PSSSB and Punjab High Court, now require typing in Unicode using the Raavi font layout. Many typists practice using Asees layout rules; this converter helps verify text and convert practice passages into standard Unicode."
      },
      {
        question: "How is Unicode different from Asees?",
        answer: "Asees is a legacy font that stores Punjabi text using English ASCII character codes, requiring the Asees font file on every machine. Unicode is an international standard where each Gurmukhi character has its own universal code, making text readable across all devices without installing fonts."
      },
      {
        question: "Does this converter run locally on my computer?",
        answer: "Most of our tools run directly inside your browser so your documents stay on your device. Your typing is processed in your browser memory and never uploaded to any remote server."
      }
    ]
  },
  {
    slug: "unicode-to-asees",
    fontName: "Asees",
    direction: "from-unicode",
    description: "Converts standard Gurmukhi Unicode Punjabi text into the legacy Asees font format for desktop publishing and print workflows.",
    primaryUseCases: [
      "Importing modern Punjabi text into legacy software like Adobe PageMaker 6.5 or older versions of CorelDraw that do not support Unicode.",
      "Preparing text for traditional offset printing presses in Punjab that require Asees font files.",
      "Working with existing publishing templates designed specifically for the Asees font layout."
    ],
    mappingConsiderations: [
      "Translates logical Unicode character sequences back into the visual typing order required by the Asees font.",
      "Repositions vowel modifiers such as Sihari ('f') to appear before the consonant as required by the legacy font layout.",
      "Maps Gurmukhi ligatures and pairin characters into the corresponding Asees keystroke combinations."
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
        question: "Does this tool work offline or upload my text?",
        answer: "Most of our tools run directly inside your browser so your documents stay on your device. The conversion runs entirely in local browser memory and does not upload your text."
      }
    ]
  },
  {
    slug: "anmollipi-to-unicode",
    fontName: "AnmolLipi",
    direction: "to-unicode",
    description: "Converts legacy AnmolLipi font text into standard Gurmukhi Unicode.",
    primaryUseCases: [
      "Converting legacy Punjabi documents, university notes, and books typed in AnmolLipi into modern Unicode.",
      "Fixing AnmolLipi text that appears as random English characters when pasted into web browsers or Word.",
      "Preparing Punjabi text for publishing on websites, blogs, and social media platforms."
    ],
    mappingConsiderations: [
      "AnmolLipi was developed by Dr. Kulbir S. Thind with a phonetic keyboard layout mapped to ASCII codes. The converter translates these keystrokes into standard Gurmukhi Unicode.",
      "Automatically handles pre-base Sihari (ਿ) repositioning, reordering it to follow the consonant in memory per Unicode standards.",
      "Correctly maps subjoined pairin consonants (Pairi Rara, Pairi Haha, Pairi Vava), Bindi, Tippi, and Addak."
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
        question: "Is there any limit on how much text I can convert?",
        answer: "No. You can convert as much text as you need for free without signing up for an account."
      }
    ]
  },
  {
    slug: "gurbani-akhar-to-unicode",
    fontName: "Gurbani Akhar",
    direction: "to-unicode",
    description: "Converts text typed in legacy Gurbani Akhar and GurbaniLipi ASCII fonts into standard Gurmukhi Unicode.",
    primaryUseCases: [
      "Converting Gurbani Shabads, Steeks, and Nitnem files typed in Gurbani Akhar into standard Unicode.",
      "Modernizing legacy Sikh literature and religious publications for websites, mobile apps, and search engines.",
      "Displaying Gurbani verses properly on smartphones and tablets without needing custom font files installed."
    ],
    mappingConsiderations: [
      "Gurbani Akhar uses ASCII key mapping designed for typewriter typing of Gurmukhi hymns, with specific positions for matras and sacred symbols like Ek Onkar (ੴ).",
      "Our engine restructures pre-base vowels (Sihari) and subjoined consonants (Pairin characters) into logical Unicode code points.",
      "Note: While core Gurmukhi characters, numerals, and common lagamatras convert reliably, complex poetic ligatures or custom punctuation from older desktop publishing templates should be reviewed after conversion."
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
        answer: "Gurbani Akhar is a legacy ASCII-encoded font from the 1990s and 2000s that mapped Gurmukhi characters onto English keyboard keys. Unicode is the universal international standard where each Gurmukhi character has its own unique character code, allowing text to display properly on any computer or smartphone without installing special fonts."
      },
      {
        question: "Will symbols like Ek Onkar (ੴ) convert properly?",
        answer: "Yes. Common religious characters including Ek Onkar and standard Gurmukhi punctuation are mapped to their corresponding Unicode Gurmukhi code points."
      },
      {
        question: "Does this converter send my text to a server?",
        answer: "Most of our tools run directly inside your browser so your documents stay on your device. The font conversion executes entirely within your browser using local JavaScript, ensuring your text remains private."
      }
    ]
  }
];

export const generatedPunjabiProfiles: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich: boolean }> = {};
for (const profile of punjabiProfiles) {
  generatedPunjabiProfiles[profile.slug] = generatePunjabiFontContent(profile);
}
