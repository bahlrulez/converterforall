export const devSerializationToolsContent: Record<string, { disableAutoEnrich?: boolean; sections: { title: string, content: string }[] }> = {
  "jwt-decoder": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Decode JSON Web Tokens (JWT) locally in your browser. This tool parses the header and payload of your token without transmitting any data to a server. <strong>Important:</strong> This tool only <em>decodes</em> the token. It does not verify the cryptographic signature or validate the authenticity of the token. Decoding is not verification."
      },
      {
        title: "Understanding the JWT Three-Part Structure",
        content: "A standard JSON Web Token is a compact URL-safe means of representing claims to be transferred between two parties. It consists of three parts separated by dots (`.`): the Header, the Payload, and the Signature. The Header typically consists of two parts: the type of the token (JWT) and the signing algorithm being used, such as HMAC SHA256 or RSA. The Payload contains the claims, which are statements about an entity (typically, the user) and additional data. Finally, the Signature is used to verify the message wasn't changed along the way."
      },
      {
        title: "Base64URL Representation and Readability",
        content: "The Header and Payload of a JWT are encoded using Base64URL encoding (a variant of Base64 that uses `-` instead of `+` and `_` instead of `/`, making it safe for HTTP URLs). This tool reverses that encoding to reveal the underlying JSON data. It seamlessly parses standard registered claims like `alg` (Algorithm), `typ` (Token Type), `iat` (Issued At), `exp` (Expiration Time), `sub` (Subject), and `iss` (Issuer). Because the data is merely encoded and not encrypted, anyone who intercepts the token can decode and read the information inside."
      },
      {
        title: "Decoding Versus Verification",
        content: "It is critical to distinguish between decoding a token and verifying a token. Modifying the decoded payload does not magically create a valid token, because the trailing Signature will no longer match the altered payload. A decoded payload should never be trusted until the token's signature is cryptographically verified on a secure backend server using the appropriate secret or public key. This tool is designed purely for debugging and inspecting token contents locally, not for validating issuer authenticity or audience expiration."
      },
      {
        title: "100% Client-Side Privacy",
        content: "Authentication tokens often contain sensitive session identifiers, PII (Personally Identifiable Information), and authorization roles. Pasting live tokens into random internet tools can expose your infrastructure to severe security breaches. We process your token locally using native browser APIs (`atob` and `decodeURIComponent`). If the token is malformed, the decoder will fail safely without sending the broken token anywhere. Your token never leaves your device's memory."
      }
    ]
  },
  "base64-encoder-decoder": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Encode text and files to Base64, or decode Base64 strings back to plain text. Operates entirely in your browser with support for UTF-8 characters and URL-safe Base64 formatting without relying on external servers."
      },
      {
        title: "Binary-to-Text Encoding",
        content: "Base64 is a standard binary-to-text encoding scheme. It is designed to take raw binary data and translate it into a readable string of ASCII characters. This is essential when you need to transfer data over protocols that are designed to handle only text, such as embedding image data directly into CSS files, sending attachments via SMTP email protocols, or passing complex binary configurations inside JSON payloads. Note that Base64 encoding generally increases the representation size of the data by approximately 33%."
      },
      {
        title: "Handling Text and UTF-8 Character Sets",
        content: "This tool uses native browser APIs (`btoa` and `atob`) to convert your input. However, native browser Base64 functions struggle with modern Unicode strings containing emojis or non-Latin characters. For text encoding, this tool safely handles UTF-8 characters by applying `encodeURIComponent` and `decodeURIComponent` before converting to Base64, ensuring special characters are preserved without throwing invalid character errors."
      },
      {
        title: "File Encoding and URL-Safe Base64",
        content: "For files (like images, PDFs, or documents), the converter uses the browser's native `FileReader` API to generate a standard Base64 Data URL directly on your device. Furthermore, standard Base64 includes `+` and `/` characters, which can break URLs or file systems. By enabling the URL-Safe option, the encoder modifies the alphabet, replacing `+` with `-` and `/` with `_`, and stripping the `=` padding from the end of the string, making the result entirely safe for web transmission."
      },
      {
        title: "Encoding is Not Encryption",
        content: "A common misconception is that Base64 protects data. Base64 is merely an encoding method; it is absolutely not an encryption method and provides zero cryptographic security. Anyone who intercepts a Base64 string can easily decode it back to its original format instantly. Encoded data should never be treated as secret or secure without a secondary layer of actual encryption."
      }
    ]
  },
  "json-formatter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Prettify, minify, and validate JSON data instantly in your browser. Features auto-repair capabilities for common syntax issues like trailing commas and single quotes, ensuring your configurations remain usable."
      },
      {
        title: "JSON Formatting and Native Parsing",
        content: "JSON (JavaScript Object Notation) is the standard data-interchange format for modern web APIs. It relies on a strict syntax for objects (key-value pairs) and arrays, supporting strings, numbers, booleans, and null values. This tool parses your JSON structure using the browser's native `JSON.parse` engine, and safely reformats it using `JSON.stringify` with consistent indentation (your choice of 2 spaces, 4 spaces, or tabs). It performs basic syntax validation and will alert you if your JSON is fundamentally malformed."
      },
      {
        title: "Auto-Repair Features and Limitations",
        content: "When copying poorly formatted data or raw JavaScript object literals from codebases, strict JSON syntax errors are very common. Valid JSON requires double quotes for all keys and string values, and it strictly forbids trailing commas. The Auto-Repair function attempts a regex-based repair to fix broken JSON by converting single quotes (`'`) to double quotes (`\"`) and aggressively stripping out illegal trailing commas right before closing braces (`}` or `]`). However, this is not a complete JSON repair engine; highly corrupted structures or deeply nested invalid characters may still fail to parse."
      },
      {
        title: "Schema Validation Distinction",
        content: "Note that this tool validates JSON <em>syntax</em>, meaning it ensures the brackets match and the formatting is strictly legal. It does not perform semantic validation or JSON Schema validation against specific external data models. If a key expects a number but receives a string, this tool will consider the JSON perfectly valid as long as the structural syntax is correct."
      },
      {
        title: "Practical Debugging Workflow",
        content: "All parsing, formatting, and minification operations are handled locally. This allows you to safely paste massive database dumps or API responses directly into the formatter to quickly identify nesting errors without transmitting proprietary database information to an external server."
      }
    ]
  },
  "json-to-csv": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Convert JSON arrays of objects into CSV format, or parse CSV text back into structured JSON arrays. Operates entirely locally with a live tabular data preview and custom delimiter control."
      },
      {
        title: "Tabular vs Hierarchical Data Conversion",
        content: "Converting JSON to CSV involves mapping hierarchical, nested data structures into flat, tabular rows and columns. This converter is optimized specifically for JSON arrays containing objects. When processing your JSON array, the tool performs a comprehensive scan to extract all unique keys across every object to generate the complete set of CSV headers. If an object is missing a key present in another object, the corresponding column for that row is left safely blank."
      },
      {
        title: "First-Level Flattening and Nested Objects",
        content: "Because CSV is a flat format, handling deep nesting requires specific rules. This tool performs first-level flattening. If a value contains a nested object or a nested array (e.g., `{\"user\": {\"id\": 1}}`), that nested structure is aggressively stringified into a JSON string within the cell rather than being recursively flattened into separate individual columns. This ensures no data is lost during the conversion, though highly complex JSON structures may require manual preprocessing in a spreadsheet application for perfect readability."
      },
      {
        title: "Quoting, Escaping, and CSV Parsing",
        content: "When converting to CSV, values containing your chosen delimiter, line breaks, or existing quote characters are safely escaped. The converter wraps these complex values in double quotes and escapes internal quotes (using `\"\"`) following strict CSV RFC standards. When converting in the reverse direction (CSV to JSON), the parser intelligently splits lines while respecting data wrapped in quotes. It automatically casts primitive values: the strings `\"true\"` and `\"false\"` become booleans, and valid numeric strings are parsed into actual Number types."
      },
      {
        title: "Practical Spreadsheet Workflow",
        content: "All conversions happen locally in your browser memory. This is crucial for data privacy, allowing you to quickly translate raw API endpoints into CSV files for Excel or Google Sheets analysis without uploading customer datasets to a remote server."
      }
    ]
  },
  "uuid-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Generate and validate RFC 4122 compliant Universally Unique Identifiers (UUIDs) locally in your browser. Features bulk generation, custom formatting options, and a built-in syntax variant inspector."
      },
      {
        title: "UUID Version 4 and Cryptographic Security",
        content: "A UUID (Universally Unique Identifier) is a 128-bit label used for information in computer systems. This tool specifically generates UUID version 4. In modern environments, it utilizes the browser's native `crypto.randomUUID()` API. This ensures that the generated identifiers are built using a cryptographically secure pseudo-random number generator (CSPRNG), making them highly resistant to predictability. However, if your specific browser environment lacks Web Crypto API support, the generator gracefully falls back to a standard `Math.random()` implementation to ensure the tool remains functional."
      },
      {
        title: "Uniqueness and Practical Application",
        content: "UUIDs are primarily designed for unique identification across distributed systems without requiring a central coordination authority. While the probability of a collision (generating the exact same UUID twice) using a CSPRNG is astronomically low, it is not mathematically impossible. Furthermore, UUIDs are designed to be identifiers, not authentication secrets. They should be used for database primary keys, session tracking, and transaction IDs, but they are not a replacement for high-entropy secret cryptographic keys."
      },
      {
        title: "UUID Validation and Syntax Inspection",
        content: "The built-in validation inspector analyzes any UUID string to verify it conforms to the standard 32-hexadecimal-digit format separated by hyphens (8-4-4-4-12). It extracts specific bits to determine the Version (e.g., Version 1 Time-based vs Version 4 Randomly Generated) and the Variant (e.g., standard RFC 4122 Variant 1). This helps developers debug identifier compatibility issues across different backend frameworks without sending identifiers over the network."
      }
    ]
  },
  "password-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Generate random passwords up to 64 characters in length with highly customizable character sets (uppercase, lowercase, digits, and symbols). Operates entirely locally in your browser for absolute privacy."
      },
      {
        title: "Password Length and Character Sets",
        content: "Password strength is heavily dependent on two primary factors: the total length of the password and the size of the character pool (the inclusion of uppercase letters, lowercase letters, numbers, and symbols). The tool allows you to customize both. A longer password exponentially increases the total number of possible combinations. A 16-character password using only lowercase letters is generally harder for a computer to brute-force guess than an 8-character password utilizing every available symbol type."
      },
      {
        title: "Randomness and Entropy Considerations",
        content: "This generator constructs passwords by randomly selecting characters from your chosen pools. <strong>Important Note on Randomness:</strong> This specific utility utilizes a standard pseudo-random number generator (`Math.random()`) to pick characters. It does not use a cryptographically secure hardware-backed API (`crypto.getRandomValues()`). While the resulting entropy is more than sufficient for general web application accounts and day-to-day use, highly sensitive environments or cryptographic key generation should rely on dedicated hardware tokens."
      },
      {
        title: "Security Beyond Password Generation",
        content: "Generating a high-entropy password is only the first step in digital security. A complex, random password generated by this tool will not protect you from password reuse attacks (if you use the same password on multiple websites), sophisticated phishing campaigns, or direct database breaches on third-party servers. Always utilize unique passwords for every service and enable Two-Factor Authentication (2FA) wherever possible."
      },
      {
        title: "Client-Side Privacy Workflow",
        content: "Security dictates that passwords should never be transmitted over an unencrypted network in plain text. This password generator operates completely client-side. Your chosen parameters, length settings, and the resulting passwords are generated in your browser's memory and are never logged, stored, or transmitted to any server."
      }
    ]
  }
};
