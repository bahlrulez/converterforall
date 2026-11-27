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
        content: "The Header and Payload of a JWT are encoded using Base64URL encoding (a variant of Base64 that uses `-` instead of `+` and `_` instead of `/`, making it safe for HTTP URLs). This tool reverses that encoding to reveal the underlying JSON data. It cleanly parses standard registered claims like `alg` (Algorithm), `typ` (Token Type), `iat` (Issued At), `exp` (Expiration Time), `sub` (Subject), and `iss` (Issuer). Because the data is merely encoded and not encrypted, anyone who intercepts the token can decode and read the information inside."
      },
      {
        title: "Decoding Versus Verification",
        content: "It is critical to distinguish between decoding a token and verifying a token. Modifying the decoded payload does not create a valid token, because the trailing Signature will no longer match the altered payload. A decoded payload should never be trusted until the token's signature is cryptographically verified on a secure backend server using the appropriate secret or public key. This tool is designed purely for debugging and inspecting token contents locally, not for validating issuer authenticity or audience expiration."
      },
      {
        title: "Client-Side Privacy & Security",
        content: "Authentication tokens often contain sensitive session identifiers, authorization roles, and account IDs. Pasting live authentication tokens into third-party servers can expose your application to security risks. We parse your token directly inside your browser using standard JavaScript decoding. The decoded token stays in your device's browser memory rather than being transmitted over the network."
      },
      {
        title: "Decoded Token Structure Example",
        content: `
          <p>Here is what a typical decoded JSON Web Token looks like after parsing:</p>
          <pre class="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl text-xs overflow-x-auto font-mono">
// 1. Header (Algorithm & Token Type)
{
  "alg": "HS256",
  "typ": "JWT"
}

// 2. Payload (Claims)
{
  "sub": "user_12345",
  "name": "Alex Johnson",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700003600
}
          </pre>
        `
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this tool verify the JWT signature?</strong><br>A: No. This tool only decodes and parses the Base64URL-encoded header and payload. Verifying a cryptographic signature requires your application's private key or shared secret, which should only be handled on your secure server.</p>
          <p><strong>Q: Are my tokens or payload claims transmitted across the network?</strong><br>A: No. Decoding runs inside your browser's memory using JavaScript. Zero network requests are made with your token.</p>
          <p><strong>Q: Why is my token expiration marked expired?</strong><br>A: The tool reads the numeric <code>exp</code> (Expiration Time) claim from the payload and compares it against your device's current clock. If the timestamp has passed, the token is flagged as expired.</p>
          <p><strong>Q: How does Base64URL encoding differ from standard Base64?</strong><br>A: Base64URL replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>, and removes trailing <code>=</code> padding characters so the string can be safely passed in URL queries and HTTP headers without encoding conflicts.</p>
        `
      }
    ]
  },
  "base64-encoder-decoder": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Encode text and files to Base64, or decode Base64 strings back to plain text directly inside your browser with support for UTF-8 characters and URL-safe Base64 formatting without sending payloads to external servers."
      },
      {
        title: "Step-by-step Base64 guide",
        content: "<ol><li><strong>Choose Encode or Decode mode:</strong> Switch tabs for plain text or file Data URLs above.</li><li><strong>Paste input or drop a file:</strong> Type UTF-8 text, paste a Base64 string, or pick an asset file.</li><li><strong>Copy or export output:</strong> Toggle URL-safe Base64 if needed and copy the converted string.</li></ol>"
      },
      {
        title: "Binary-to-Text Encoding & UTF-8 Support",
        content: "Base64 converts binary data into ASCII text for CSS embeds, email payloads, and JSON transport (~33% larger than raw bytes). Native browser <code>btoa</code> and <code>atob</code> fail on multi-byte Unicode text, so this tool wraps conversion with <code>encodeURIComponent</code> / <code>decodeURIComponent</code> for UTF-8 strings and uses browser <code>FileReader</code> for files. Optional URL-safe output substitutes <code>+</code> with <code>-</code>, <code>/</code> with <code>_</code>, and trims trailing <code>=</code> padding."
      },
      {
        title: "Encoding is Not Encryption",
        content: "Base64 is a reversible serialization encoding—it provides zero confidentiality or encryption. Anyone with a decoded string can reverse Base64 back to its input directly, so avoid treating raw Base64 output as a security boundary."
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does Base64 protect sensitive API keys or passwords?</strong><br>A: No. Base64 is reversible serialization encoding rather than encryption; anyone who reads the string can decode it directly.</p>
          <p><strong>Q: Does the encoder handle emojis and Hindi/Punjabi UTF-8 text?</strong><br>A: Yes. It encodes multi-byte UTF-8 characters safely instead of failing with InvalidCharacterError like raw <code>btoa()</code>.</p>
          <p><strong>Q: Are my encoded strings or files uploaded to a server?</strong><br>A: No. JavaScript encoding and decoding run in your browser memory without network transmission.</p>
        `
      }
    ]
  },
  "json-formatter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Prettify, minify, and syntax-check JSON payloads inside your browser, including an optional regex-based Auto-Repair mode for single quotes and trailing commas before closing brackets. Designed for debugging API responses, config files, and nested schemas safely inside a tab."
      },
      {
        title: "Step-by-step JSON formatting guide",
        content: "<ol><li><strong>Paste JSON input:</strong> Enter formatted or minified JSON text into the editor above.</li><li><strong>Choose indentation or minify:</strong> Pretty-print with 2 spaces, 4 spaces, or tabs, or minify to compact single-line output.</li><li><strong>Run Auto-Repair if needed:</strong> Optionally fix single quotes and trailing commas before closing brackets, then copy validated output cleanly.</li></ol>"
      },
      {
        title: "Syntax Validation vs Schema Validation",
        content: "<p>Using native <code>JSON.parse</code> and <code>JSON.stringify</code> in browser memory, this utility verifies structural syntax (matching brackets, double-quoted property keys, valid primitives, and arrays) without validating semantic field types against a separate JSON Schema specification.</p><p>Catching unquoted keys, stray trailing commas, or unescaped line breaks inside large configuration dumps before pushing code avoids deployment crashes while formatting minified payloads cleanly into 2-space, 4-space, or tab indentation.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can Auto-Repair fix every broken JSON payload?</strong><br>A: It attempts targeted regex fixes for single-quoted literals and illegal trailing commas, though heavily corrupted brackets still require manual editing.</p>
          <p><strong>Q: Does this check JSON values against a JSON Schema?</strong><br>A: No. It validates JSON syntax strictly with <code>JSON.parse</code> rather than validating semantic field rules against a schema.</p>
          <p><strong>Q: Is my JSON payload sent over the internet?</strong><br>A: No. Formatting and syntax checks execute in browser memory without sending API payloads to a remote server.</p>
        `
      }
    ]
  },
  "json-to-csv": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Convert JSON arrays of objects into CSV spreadsheets, or parse CSV text back into JSON arrays, inside your browser with a live table preview and custom delimiter selection."
      },
      {
        title: "Step-by-step JSON to CSV guide",
        content: "<ol><li><strong>Paste JSON or CSV input:</strong> Provide an array of JSON objects or tabular CSV text with a header row.</li><li><strong>Pick a delimiter:</strong> Choose comma, semicolon, tab, or custom separator and inspect the live preview table.</li><li><strong>Copy or download output:</strong> Save your RFC-escaped CSV spreadsheet or parsed JSON array.</li></ol>"
      },
      {
        title: "First-Level Flattening & Escaping Rules",
        content: "The converter scans all objects in your JSON array to collect unique column headers, stringifies nested objects or arrays cleanly inside cells rather than recursively unpacking infinite levels, wraps fields containing delimiters/newlines in quotes, and escapes embedded quotes as <code>\"\"</code> following standard CSV rules."
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What happens when a JSON object contains nested objects or arrays?</strong><br>A: The converter applies first-level flattening and stringifies nested values into JSON text inside that cell so data is not lost.</p>
          <p><strong>Q: Are booleans and numeric strings kept when parsing CSV to JSON?</strong><br>A: When converting CSV back to JSON, <code>true</code>/<code>false</code> values convert to booleans and numeric values convert to JSON numbers.</p>
          <p><strong>Q: Is my JSON dataset sent to a backend server?</strong><br>A: No. All parsing, table previewing, and serialization execute in browser memory without uploading customer rows.</p>
        `
      }
    ]
  },
  "csv-to-json": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert CSV Spreadsheets to Structured JSON Arrays",
        content: "Parse CSV or delimiter-separated tables back into structured JSON object arrays inside your browser using quoted-field CSV rules, live table previews, custom delimiter toggles, and automatic boolean/numeric parsing for clean developer exports."
      },
      {
        title: "Step-by-step CSV to JSON guide",
        content: "<ol><li><strong>Paste CSV text:</strong> Paste comma-, semicolon-, or tab-delimited rows with column names on the first line into the editor above.</li><li><strong>Verify delimiter &amp; preview table:</strong> Check the rendered HTML table grid to verify that quoted text containing commas split into the intended columns.</li><li><strong>Copy or export formatted JSON:</strong> Copy the resulting JSON array directly into your script, seed file, or API payload.</li></ol>"
      },
      {
        title: "Type Casting & Escaped Quote Handling",
        content: "<p>The parser handles double-quoted fields containing line breaks or commas, unescapes doubled quotes (<code>\"\"</code>), ignores blank trailing lines, maps header column titles to object property names, casts literal <code>true</code>/<code>false</code> strings to JSON booleans and numeric strings to numbers, and leaves general values as strings.</p><p>Exported spreadsheets from Excel, Google Sheets, or bank portals frequently wrap addresses or currency labels containing commas inside quotes—handling those escapes keeps rows aligned when importing into JavaScript apps or databases.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does the CSV parser handle commas inside quoted text?</strong><br>A: Yes. Delimiters inside double-quoted CSV fields remain intact rather than splitting columns prematurely.</p>
          <p><strong>Q: Are my CSV tables sent to a server?</strong><br>A: No. CSV parsing and JSON serialization execute inside browser memory without transmitting rows to an external API.</p>
        `
      }
    ]
  },
  "unix-timestamp-converter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Unix Epoch Timestamp Converter (Seconds & Milliseconds)",
        content: "Convert Unix Epoch timestamps (10-digit seconds or 13-digit milliseconds) into readable UTC and local ISO 8601 date strings—or turn a calendar date and time back into an integer Unix Epoch timestamp—inside your browser for log debugging, database queries, and JWT claims."
      },
      {
        title: "Step-by-step timestamp conversion guide",
        content: "<ol><li><strong>Enter Unix Epoch or calendar date:</strong> Paste a 10-digit seconds integer or 13-digit millisecond integer, or pick a local/UTC date and time.</li><li><strong>Inspect UTC, ISO &amp; local zones:</strong> View formatted UTC timestamps, local browser timezone strings, and elapsed differences right away.</li><li><strong>Copy timestamp:</strong> Copy the converted Unix Epoch integer or formatted ISO 8601 string straight into your logs or query.</li></ol>"
      },
      {
        title: "Understanding Seconds vs Milliseconds",
        content: "<p>POSIX servers, Python time calls, and JWT claims (`exp`/`iat`) measure elapsed seconds since 1970-01-01T00:00:00Z (10 digits), whereas JavaScript <code>Date.now()</code> and JVM traces measure milliseconds (13 digits). Feeding seconds into a millisecond parser shows dates in January 1970, so unit alignment matters when inspecting payloads.</p><p>API webhook logs, database audit columns, and browser telemetry frequently mix both units across microservices, making manual unit checks helpful whenever comparing server records against UTC boundaries.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What is the difference between a 10-digit and 13-digit Unix timestamp?</strong><br>A: Ten-digit Unix Epoch values count seconds since 1970-01-01 UTC, whereas 13-digit values count milliseconds (1,000× larger).</p>
          <p><strong>Q: Are my logs or timestamps sent across the network?</strong><br>A: No. Date formatting relies on your browser's JavaScript <code>Date</code> object without sending values to a server.</p>
        `
      }
    ]
  },
  "uuid-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this tool?",
        content: "Generate and inspect RFC 4122 Universally Unique Identifiers (UUID v4) inside your browser with bulk batch generation (multiple IDs at once), uppercase/hyphen toggles, and a built-in parser showing UUID Version and Variant bits."
      },
      {
        title: "Step-by-step UUID generation guide",
        content: "<ol><li><strong>Choose batch size &amp; formatting:</strong> Set how many UUIDs to generate and toggle uppercase letters or hyphen separators.</li><li><strong>Generate batch:</strong> Click generate to populate fresh random RFC 4122 Version 4 identifiers via Web Crypto where available.</li><li><strong>Inspect or copy:</strong> Paste any existing UUID into the validator to verify RFC Version/Variant headers, or copy IDs cleanly.</li></ol>"
      },
      {
        title: "Web Crypto CSPRNG vs Fallback",
        content: "<p>Modern browsers produce Version 4 UUIDs via <code>crypto.randomUUID()</code> (cryptographically random 122-bit payloads formatted as 8-4-4-4-12 hex), falling back to <code>Math.random()</code> only on restricted runtimes lacking Web Crypto. Note that UUIDs identify database records and API requests rather than replacing private cryptographic secrets or API keys.</p><p>Batch generation lets backend developers populate SQL fixture tables, correlation trace headers, and unit test seed lists inside one clean copy operation.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Should I use generated UUID v4 values as secret API tokens or passwords?</strong><br>A: No. UUIDs are structured unique identifiers designed for database primary keys and request tracing rather than secret cryptographic credentials.</p>
          <p><strong>Q: What makes a Version 4 UUID different from a v1 UUID?</strong><br>A: Version 4 UUIDs rely on random bits rather than encoding network MAC addresses and hardware clock timestamps.</p>
          <p><strong>Q: Are generated UUIDs logged on your server?</strong><br>A: No. Identifier generation and syntax inspection execute inside your browser without network requests.</p>
        `
      }
    ]
  },
  "password-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is this Password Generator?",
        content: "<p>Create random passwords up to 64 characters long directly inside your browser with checkboxes for uppercase letters, lowercase letters, numbers, and keyboard punctuation symbols. Built as a fast browser password generator utility with one-click clipboard copy and visual length/character pool feedback.</p><p>Using distinct randomly generated combinations across email logins, billing portals, and development staging environments stops credential-stuffing attacks from spilling across unrelated accounts when any external service suffers a leak.</p>"
      },
      {
        title: "Step-by-step password generator guide",
        content: "<ol><li><strong>Choose password length:</strong> Drag the length slider (16+ characters is recommended for everyday online logins).</li><li><strong>Select character sets:</strong> Keep Uppercase, Lowercase, Numbers, and Symbols toggled on to widen the symbol pool.</li><li><strong>Regenerate &amp; copy:</strong> Click Regenerate for fresh combinations, then click Copy to save the generated password into your password manager.</li></ol>"
      },
      {
        title: "Important Randomness & Security Disclosure",
        content: "<strong>Note on underlying generator source:</strong> This component builds strings using standard JavaScript <code>Math.random()</code> indexing rather than hardware-backed Web Crypto <code>crypto.getRandomValues()</code>. While handy for quick general logins and test fixtures, always rely on a dedicated password manager or Web Crypto CSPRNG generator for sensitive vault master keys, avoid reusing passwords across websites, and enable Two-Factor Authentication (2FA) wherever supported."
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Does this password generator send generated strings to a remote server?</strong><br>A: No. Character selection runs inside your open browser tab without storing or transmitting passwords remotely.</p>
          <p><strong>Q: Does this tool use Web Crypto (crypto.getRandomValues) or Math.random?</strong><br>A: The current component uses standard JavaScript <code>Math.random()</code> indexing rather than hardware CSPRNG APIs.</p>
        `
      }
    ]
  }
};
