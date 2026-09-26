export interface FontContentProfile {
  slug: string;
  fontName: string;
  direction: 'to-unicode' | 'from-unicode';
  description: string;
  primaryUseCases: string[];
  mappingConsiderations: string[];
  compatibilityNotes: string[];
  relatedConverters: { slug: string; name: string }[];
}

export function generatePunjabiFontContent(profile: FontContentProfile) {
  const isToUnicode = profile.direction === 'to-unicode';
  const targetFont = isToUnicode ? 'Unicode (Raavi/Mangal)' : profile.fontName;
  const sourceFont = isToUnicode ? profile.fontName : 'Unicode';
  
  const sections: { title: string, content: string }[] = [];

  // Section 1: What this conversion does
  sections.push({
    title: `What does the ${profile.fontName} converter do?`,
    content: `<p>${profile.description}</p>`
  });

  // Section 2: Use Cases (Only generated if they exist)
  if (profile.primaryUseCases && profile.primaryUseCases.length > 0) {
    sections.push({
      title: `Common Use Cases for ${targetFont}`,
      content: `<ul class="list-disc pl-5 mt-2 space-y-1">${profile.primaryUseCases.map(uc => `<li>${uc}</li>`).join('')}</ul>`
    });
  }

  // Section 3: Mapping Considerations
  if (profile.mappingConsiderations && profile.mappingConsiderations.length > 0) {
    sections.push({
      title: "Font-Specific Mapping Behavior",
      content: `<ul class="list-disc pl-5 mt-2 space-y-1">${profile.mappingConsiderations.map(mc => `<li>${mc}</li>`).join('')}</ul>`
    });
  }

  // Section 4: Compatibility and Troubleshooting
  if (profile.compatibilityNotes && profile.compatibilityNotes.length > 0) {
    sections.push({
      title: "Compatibility & Troubleshooting",
      content: `<ul class="list-disc pl-5 mt-2 space-y-1">${profile.compatibilityNotes.map(cn => `<li>${cn}</li>`).join('')}</ul>`
    });
  }

  // Section 5: Related Converters
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
      "Handles the repositioning of Siari (ि) which is often typed before the consonant in legacy layouts but must be stored after the consonant in Unicode.",
      "Translates Joy-specific half-characters and conjuncts into standard Unicode ligature formats."
    ],
    compatibilityNotes: [
      "If your text looks like English gibberish when pasted into Word, it was likely typed in a legacy font like Joy. Converting to Unicode permanently resolves this.",
      "No specific font installation is required to read the generated Unicode text on iOS, Android, or Windows."
    ],
    relatedConverters: [
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" }
    ]
  },
  {
    slug: "unicode-to-satluj",
    fontName: "Satluj",
    direction: "from-unicode",
    description: "Converts standard Punjabi Unicode (Raavi) text back into the legacy Satluj font format.",
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
      { slug: "asees-to-unicode", name: "Asees to Unicode" }
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
      "The resulting text will render using your system's default Punjabi font (such as Raavi on Windows or Nirmala UI).",
      "Formatting like bold or italics from PageMaker will be lost during plain-text conversion; only the character data is preserved."
    ],
    relatedConverters: [
      { slug: "unicode-to-satluj", name: "Unicode to Satluj" },
      { slug: "joy-to-unicode", name: "Joy to Unicode" }
    ]
  },
  {
    slug: "asees-to-unicode",
    fontName: "Asees",
    direction: "to-unicode",
    description: "Converts text typed using the Asees keyboard layout into standard Gurmukhi Unicode.",
    primaryUseCases: [
      "Migrating documents typed using the non-standard Asees typewriter key mapping for Unicode compatibility.",
      "Submitting offline typed documents to modern online portals.",
      "Sharing Asees-encoded files with users on mobile devices."
    ],
    mappingConsiderations: [
      "Asees utilizes a specific typewriter-style key mapping distinct from Satluj or Joy.",
      "The converter accurately maps Asees-specific conjuncts to their standard Unicode equivalents."
    ],
    compatibilityNotes: [
      "If your document displays question marks (???) or square boxes on another computer, it is missing the Asees .ttf file. Convert to Unicode to make the document universally readable."
    ],
    relatedConverters: [
      { slug: "satluj-to-unicode", name: "Satluj to Unicode" },
      { slug: "unicode-to-gurbani-akhar", name: "Unicode to Gurbani Akhar" }
    ]
  },
  {
    slug: "unicode-to-gurbani-akhar",
    fontName: "Gurbani Akhar",
    direction: "from-unicode",
    description: "Converts conversational Punjabi Unicode text into the specialized Gurbani Akhar font format used for religious texts.",
    primaryUseCases: [
      "Applying specialized formatting that standard Unicode conversational fonts may not support aesthetically.",
      "Preparing text for traditional printing presses."
    ],
    mappingConsiderations: [
      "Gurbani Akhar handles specific religious symbols (like Ek Onkar) and specialized half-characters uniquely compared to standard conversational fonts."
    ],
    compatibilityNotes: [
      "This font is highly specialized. Do not use this conversion for casual web chatting or email, as the recipient must have the Gurbani Akhar font installed to read it.",
      "Ensure your publishing software fully supports legacy ASCII font rendering before importing the converted text."
    ],
    relatedConverters: [
      { slug: "asees-to-unicode", name: "Asees to Unicode" }
    ]
  }
];

export const generatedPunjabiProfiles: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich: boolean }> = {};
for (const profile of punjabiProfiles) {
  generatedPunjabiProfiles[profile.slug] = generatePunjabiFontContent(profile);
}
