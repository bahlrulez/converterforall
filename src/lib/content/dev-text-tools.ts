export const devTextToolsContent: Record<string, { disableAutoEnrich?: boolean; sections: { title: string, content: string }[] }> = {
  "unicode-normalizer": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Understanding Unicode Normalization",
        content: "Unicode text can often appear visually identical on a screen but be represented by completely different underlying byte sequences in memory. For example, the character \"é\" can be represented as a single precomposed character (U+00E9) or as an \"e\" followed by a combining acute accent mark (U+0065 + U+0301). The Unicode Normalizer tool converts your text into a standard canonical form, ensuring consistency across your dataset so that string comparison and database indexing function correctly."
      },
      {
        title: "How NFC Normalization Works",
        content: "This tool applies NFC (Normalization Form Canonical Composition) to your input via native JavaScript string methods. NFC converts combining character sequences into shortest precomposed equivalents wherever a canonical precomposed form exists (the standard form recommended by the W3C for HTML documents). It strictly applies NFC and does not run NFD, NFKC, or NFKD."
      },
      {
        title: "Important Limitations &amp; Browser Execution",
        content: "Normalization strictly canonicalizes valid Unicode sequences rather than repairing Mojibake decoded from legacy encodings or OCR errors. JavaScript normalization runs inside browser memory without sending pasted text across the network."
      }
    ]
  },
  "unicode-text-cleaner": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What the Text Cleaner Does",
        content: "The Unicode Text Cleaner scrubs inconsistent spacing and specific invisible artifacts from strings: it collapses consecutive spaces, tabs, and erratic line breaks into single spaces, and strips targeted zero-width code points that break code parsers and database keys."
      },
      {
        title: "Targeted Invisible Characters &amp; Limitations",
        content: "Regex rules strip Zero-Width Space (U+200B), Zero-Width Non-Joiner (U+200C), Zero-Width Joiner (U+200D), and Byte Order Mark / Zero-Width No-Break Space (U+FEFF). It keeps letters, punctuation, and visible characters intact without normalizing combining marks (use Unicode Normalizer for NFC)."
      },
      {
        title: "Browser-Based Execution",
        content: "Regular expression cleaning executes in your browser memory without uploading pasted text or source code to external servers."
      }
    ]
  },
  "remove-hidden-characters": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Why Remove Hidden Characters?",
        content: "Invisible Unicode characters frequently get copied from PDFs, rich-text editors, or database exports and silently break strict string equality checks (`===`), JSON parsers, or database keys. This utility detects and strips them from pasted strings."
      },
      {
        title: "Exact Unicode Ranges Stripped",
        content: "Targets Zero-Width characters (U+200B, U+200C, U+200D), Byte Order Mark (U+FEFF), Left-to-Right / Right-to-Left Marks (U+200E, U+200F), and Directional Embedding/Override Marks LRE/RLE/PDF/LRO/RLO (U+202A–U+202E)."
      },
      {
        title: "Browser Processing",
        content: "Regex replacement runs inside browser JavaScript without sending pasted code snippets or tokens over the network."
      }
    ]
  },
  "fix-copy-paste-text": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Fixing Broken PDF Copy-Paste",
        content: "Copying text from multi-column PDFs often inserts stray line breaks in the middle of sentences because PDF pages position lines by coordinates rather than flowing paragraphs. This tool unwraps unwanted single line breaks back into spaces."
      },
      {
        title: "How the Newline Fixer Works &amp; Limitations",
        content: "Single mid-sentence line breaks convert into spaces while preserving multi-line paragraph breaks normalized to clean double breaks. It focuses on structural newline wrapping rather than performing OCR, repairing legacy ASCII fonts (use Font Text Fixer for that), or removing literal end-of-line hyphens."
      },
      {
        title: "Browser-Based Execution",
        content: "Line unwrapping executes inside browser JavaScript without sending pasted excerpts to external conversion servers."
      }
    ]
  }
};
