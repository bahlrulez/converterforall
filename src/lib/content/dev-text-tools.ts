export const devTextToolsContent: Record<string, { disableAutoEnrich?: boolean; sections: { title: string, content: string }[] }> = {
  "unicode-normalizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Understanding Unicode Normalization",
        content: "Unicode text can often appear visually identical on a screen but be represented by completely different underlying byte sequences in memory. For example, the character \"é\" can be represented as a single precomposed character (U+00E9) or as an \"e\" followed by a combining acute accent mark (U+0065 + U+0301). The Unicode Normalizer tool converts your text into a standard canonical form, ensuring consistency across your entire dataset so that string comparison and database indexing function correctly."
      },
      {
        title: "How NFC Normalization Works",
        content: "This specific tool applies NFC (Normalization Form Canonical Composition) to your input via native JavaScript string prototype methods. NFC systematically converts all combining character sequences into their shortest precomposed single-character equivalents wherever a canonical precomposed character exists. This is the official standard normalization form recommended by the W3C for HTML documents and general web development. Please note that this tool strictly applies NFC; it does not apply NFD (Decomposition) or compatibility normalizations like NFKC or NFKD."
      },
      {
        title: "Important Limitations",
        content: "While normalization is crucial for programmatic string matching, it is not a magic wand for all text corruption. This tool will not magically repair corrupted Mojibake (where text was decoded using the wrong character set like Windows-1252 instead of UTF-8), it does not translate languages, and it does not fix optical character recognition (OCR) errors. It strictly mathematically canonicalizes valid Unicode sequences."
      },
      {
        title: "100% Client-Side Processing",
        content: "Because normalization is often required before storing sensitive user data or proprietary source code in a backend database, this tool operates entirely within your web browser. All JavaScript string normalization operations are executed locally on your device with zero server transmission, guaranteeing absolute privacy for your data."
      }
    ]
  },
  "unicode-text-cleaner": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Text Cleaner Does",
        content: "The Unicode Text Cleaner is a specialized utility designed to scrub inconsistent formatting and invisible artifacts from your text strings. It systematically performs two distinct operations: first, it aggressively collapses all excessive whitespace (including multiple consecutive spaces, tabs, and erratic line breaks) into single, uniform spaces; second, it targets and strips out a specific list of common zero-width artifacts that frequently disrupt code parsers and text editors."
      },
      {
        title: "Targeted Invisible Characters",
        content: "In addition to standardizing whitespace, this tool explicitly removes specific invisible characters using strict regular expressions. The characters targeted include the Zero-Width Space (U+200B), the Zero-Width Non-Joiner (U+200C), the Zero-Width Joiner (U+200D), and the Byte Order Mark / Zero-Width No-Break Space (U+FEFF). These artifacts often hitchhike into your codebase when copying snippets from rich-text blogs or PDF documents, resulting in mysterious syntax errors that are impossible to spot with the naked eye."
      },
      {
        title: "Limitations of the Cleaner",
        content: "It is important to understand what this cleaner does not do. It is not a universal text cleaner. It preserves alphanumeric characters, standard punctuation, and visible symbols entirely unchanged. It does not correct spelling, it does not normalize Unicode combining sequences (you must use the Unicode Normalizer for that), and it does not remove every single possible invisible character in the vast Unicode standard—only the most common problematic ones encountered in web development."
      },
      {
        title: "Privacy and Security",
        content: "To protect your proprietary code and sensitive data, this utility operates 100% client-side. The JavaScript string replacement and regular expression cleaning happen instantaneously in your local browser memory, meaning your input is never uploaded to an external server or logged in a database."
      }
    ]
  },
  "remove-hidden-characters": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Remove Hidden Characters?",
        content: "Invisible Unicode characters are frequently and accidentally copied from PDFs, rich text editors, email clients, or corrupted database exports. While you cannot see them on your screen, these hidden artifacts exist in the underlying data. They can cause mysterious syntax errors in programming languages, fail strict database constraints, break JSON parsers, or disrupt search indexing algorithms. This tool systematically finds and removes them from your string."
      },
      {
        title: "Exact Unicode Ranges Stripped",
        content: "This utility utilizes strict JavaScript regular expressions to remove specific targeted ranges of invisible and directional formatting characters. The exact list of removed characters includes Zero-Width Joiners and Spaces (U+200B, U+200C, U+200D), the Byte Order Mark (U+FEFF), and explicit Directional Formatting Marks such as the Left-to-Right Mark (U+200E) and the Right-to-Left Mark (U+200F). It also strips Directional Embedding and Override Marks like LRE, RLE, PDF, LRO, and RLO (spanning U+202A through U+202E)."
      },
      {
        title: "String Comparison and Debugging",
        content: "One of the most common practical use cases for this tool is debugging failed string comparisons. If two strings look identical in your console but a strictly typed equality operator (`===`) evaluates to false, an invisible zero-width space is often the culprit. By pasting your strings through this tool, you guarantee that all standard invisible artifacts are purged before running your comparisons."
      },
      {
        title: "100% Local Processing",
        content: "Because developers frequently paste sensitive source code, API keys, or proprietary data into this tool to debug syntax errors, we built it to run entirely locally. The regular expression cleanup happens strictly within your local web browser environment. No text is ever transmitted over the network or saved to any backend infrastructure."
      }
    ]
  },
  "fix-copy-paste-text": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Fixing Broken PDF Copy-Paste",
        content: "When you attempt to copy text from a multi-column PDF document or an older legacy document viewer, the text frequently pastes into your editor with broken, unwanted line breaks in the middle of sentences. This frustrating formatting error happens because PDFs often treat lines of text as absolute visual coordinates on a page rather than continuously flowing semantic paragraphs. This tool is designed to reverse that structural damage."
      },
      {
        title: "How the Newline Fixer Works",
        content: "This tool repairs structural newline issues through a targeted replacement algorithm. It intelligently detects single line breaks that occur independently in the middle of a sentence and unwraps them, replacing them with a single space to combine the text back into a flowing paragraph. Crucially, it preserves intended paragraph separation: if it detects multiple consecutive line breaks (two or more), it recognizes a deliberate paragraph change and normalizes those excessive gaps into a clean double line break."
      },
      {
        title: "Limitations of the Formatting Repair",
        content: "Please note that this tool focuses strictly on structural newline wrapping. It does not perform Optical Character Recognition (OCR), it cannot fix corrupted font encodings (like broken Wingdings or Mojibake), and it does not perform semantic grammar correction. If a PDF has inserted physical hyphen characters at the end of every line, those hyphens will remain in the unwrapped text and must be manually reviewed."
      },
      {
        title: "Private and Secure Execution",
        content: "Your copied document text is processed entirely locally on your device. The JavaScript un-wrapping algorithm executes directly in your web browser, ensuring your documents, legal text, or personal notes remain completely private and are never uploaded to our servers for processing."
      }
    ]
  }
};
