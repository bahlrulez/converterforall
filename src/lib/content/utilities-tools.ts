export const utilitiesToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "subtitle-converter": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Convert, time-shift, and clean up SRT, VTT, SBV, and ASS subtitles",
        content: "<p>This browser-based subtitle utility parses <strong>SRT (SubRip)</strong>, <strong>WebVTT (.vtt)</strong>, <strong>YouTube SBV (.sbv)</strong>, and <strong>ASS/SSA (.ass, .ssa)</strong> files, previews the first three parsed cues along with basic validation warnings, lets you shift timestamps in milliseconds, strip markup tags, and download a clean converted file without uploading your subtitles to a conversion server.</p>"
      },
      {
        title: "Supported formats, timing sync, and cleanup behavior",
        content: "<ul><li><strong>Automatic or manual format detection:</strong> When you drop a subtitle file, the parser detects SRT, VTT, SBV, or ASS automatically; if detection fails on an unusual header, you can pick the source format manually before processing.</li><li><strong>Target outputs and ASS handling:</strong> You can export as <strong>SRT</strong>, <strong>WebVTT</strong>, or <strong>YouTube SBV</strong>, or choose <em>Keep Original (Cleanup Only)</em>. Note that ASS/SSA styling and screen positioning are not preserved—converting from ASS retains dialogue text and timing only, and keeping the original target on an ASS input exports as <code>.srt</code>.</li><li><strong>Timing shift &amp; tag cleanup:</strong> Enter positive milliseconds (e.g., <code>500</code>) to delay subtitles or negative values (e.g., <code>-500</code>) to shift them earlier, optionally remove empty or zero-duration cues, strip HTML tags (<code>&lt;b&gt;</code>, <code>&lt;i&gt;</code>), and strip ASS override tags (such as <code>{\\an8}</code>). Cue numbers are renumbered sequentially during compilation.</li></ul>"
      },
      {
        title: "Step-by-step subtitle workflow",
        content: "<ol><li><strong>Choose options or drop your file:</strong> Load an <code>.srt</code>, <code>.vtt</code>, <code>.sbv</code>, <code>.ass</code>, <code>.ssa</code>, or <code>.txt</code> subtitle track and verify the detected format and cue preview.</li><li><strong>Adjust target format, timing, and cleanup:</strong> Select a target format, enter any millisecond offset, and toggle empty-cue removal, HTML tag stripping, or ASS override tag removal.</li><li><strong>Process and save:</strong> Click <em>Process Subtitle</em> to compile the cleaned track directly in browser memory and download the resulting file.</li></ol>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Are my subtitle files sent to a server or cloud API?</strong><br>A: No. Parsing, timestamp shifting, tag cleanup, and output compilation run in your browser using JavaScript; your subtitle file is not uploaded to a conversion server.</p><p><strong>Q: Can I convert an ASS or SSA subtitle file and keep all custom styles?</strong><br>A: No. ASS and SSA styling, fonts, and override coordinates are not retained by the converter. Selecting Keep Original on an ASS file saves plain dialogue timing as SRT, and ASS override tags like <code>{\\an8}</code> are stripped by default.</p><p><strong>Q: How do I fix subtitles that appear too early or too late?</strong><br>A: Enter an offset in the <em>Shift Timing (ms)</em> field—use positive values like <code>1500</code> to push cues 1.5 seconds later, or negative values like <code>-1500</code> to move them earlier—then click Process Subtitle.</p>"
      }
    ]
  },
  "presentation-maker": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Online Presentation Maker – Create PowerPoint Slides in Your Browser",
        content: "<p>Turn an outline or set of notes into an editable <code>.pptx</code> presentation directly inside your web browser. You can organize up to 12 structured slides and export standard Office Open XML decks for Microsoft PowerPoint, Google Slides, LibreOffice Impress, or Apple Keynote with zero watermarks and no sign-up required.</p>"
      },
      {
        title: "How to Use the Presentation Maker",
        content: "<ol><li><strong>Select slide count:</strong> Pick how many slides you need for your lecture or pitch deck.</li><li><strong>Add titles &amp; bullet content:</strong> Draft slide text manually or optionally request an AI outline starting point.</li><li><strong>Download PPTX:</strong> Click Download PPTX to compile an editable <code>.pptx</code> deck you can polish in PowerPoint or Slides.</li></ol>"
      },
      {
        title: "How the Tool Works",
        content: "<p>Inside the browser, <code>pptxgenjs</code> builds standard OOXML presentation files containing editable text boxes, headings, split cards, and metrics slides rather than flat raster images.</p>"
      },
      {
        title: "Local Assembly and External Service Disclosures",
        content: "<p>Manual drafting, slide layout edits, and final <code>.pptx</code> file packaging run in browser memory via <code>pptxgenjs</code>. If you choose the optional AI presentation assistant, your topic and slide count are sent via our backend API to Google Gemini to draft titles and bullet points, and optional external image suggestions may query third-party image providers (such as Wikimedia or Pollinations). Manual drafting performs no external AI requests.</p>"
      },
      {
        title: "Supported Functionality and Limitations",
        content: "<p>Designed for structured slide outlines using title, content, split, quote, and metrics layouts. Complex animation timelines, embedded audio/video clips, and real-time multi-user collaboration are not supported.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I edit the downloaded file in Microsoft PowerPoint or Google Slides?</strong><br>A: Yes. Output exports as a standard <code>.pptx</code> presentation compatible with PowerPoint, Google Slides, LibreOffice Impress, and Apple Keynote.</p>
          <p><strong>Q: Are there any watermarks on the downloaded slides?</strong><br>A: No. Generated presentations export free and watermark-free.</p>
          <p><strong>Q: Are my slide inputs sent to external AI servers?</strong><br>A: Manual slide creation and <code>.pptx</code> file assembly run locally in your browser; opting into the optional AI outline generator sends your topic prompt to Google Gemini via our API endpoint.</p>
          <p><strong>Q: Do I need an account to create slides?</strong><br>A: No account, email address, or subscription is required.</p>
        `
      }
    ]
  },
  "age-calculator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is the Age Calculator?",
        content: "<p>This browser-based age calculator determines exact age in years, months, and days between your Date of Birth and a Target Date, along with total days lived for form filling, age milestones, or calendar date math.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Using Gregorian calendar month lengths and leap-year rules via JavaScript <code>Date</code> arithmetic, the calculator computes exact calendar differences using your device's local clock without transmitting birth dates over the internet.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select Date of Birth:</strong> Choose birth year, month, and day in the picker above.</li><li><strong>Set Target Date:</strong> Leave today's date selected or choose a future/past milestone date.</li><li><strong>Review breakdown:</strong> Read exact age in years, months, days, and total elapsed days right away.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Government &amp; Exam Forms:</strong> Checking exact cutoff age on application deadlines.</li><li><strong>Event Milestones:</strong> Computing future anniversary or retirement dates.</li><li><strong>Date Difference:</strong> Measuring exact calendar days between two historical dates.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my birth date saved or transmitted anywhere?</strong><br>A: No. Date calculations execute inside your browser using JavaScript without sending birth dates to a server.</p>
          <p><strong>Q: Does the calculator handle leap years?</strong><br>A: Yes. Gregorian leap days (February 29) and varying 28/30/31-day month lengths are accounted for accurately.</p>
          <p><strong>Q: Can I check my age on a future cutoff date?</strong><br>A: Yes. Change the Target Date to any upcoming exam or form cutoff date to see your exact age on that day.</p>
          <p><strong>Q: Why does Total Days differ from age multiplied by 365?</strong><br>A: Standard calendar calculations include leap years rather than assuming every year has 365 days.</p>
        `
      }
    ]
  },
  "qr-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Free Custom QR Code Generator",
        content: "<p>Create static, scannable QR codes for website links or plain text directly inside your browser using the QR Code Generator utility. There are no subscriptions, watermarks, or server redirects—the tool builds sharp PNG downloads right on your screen.</p>"
      },
      {
        title: "How to Generate a QR Code",
        content: "<ol><li><strong>Enter your URL or text:</strong> Paste a full web link (such as <code>https://example.com</code>) or plain message into the text field.</li><li><strong>Preview live update:</strong> Inspect the generated black-and-white QR grid as it updates in real time.</li><li><strong>Test &amp; download PNG:</strong> Scan the preview with your phone camera, then click Download to save a crisp <code>.png</code> image.</li></ol>"
      },
      {
        title: "How the Tool Works &amp; Error Correction",
        content: "<p>Using <code>qrcode.react</code>, text maps directly into a vector SVG pattern with Error Correction fixed at <strong>Level H (High)</strong> (up to ~30% redundancy against wear or glare) and renders via HTML5 canvas into a high-resolution PNG download in browser memory without tracking URLs on a server.</p>"
      },
      {
        title: "Supported Functionality and Limitations",
        content: "<p>This generator encodes static URLs and plain text strings directly at Level H and downloads PNG images. It does not offer structured vCard/Wi-Fi UI forms, dynamic redirect analytics, or vector SVG downloads directly.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do generated QR codes ever expire?</strong><br>A: No. Static QR codes store the full text or URL directly in the visual grid—there is no intermediary redirect link that expires.</p>
          <p><strong>Q: Are scans tracked or limited?</strong><br>A: No. Static codes embed no tracking redirect, so you can print and scan them without scan quotas.</p>
          <p><strong>Q: Why does the pattern look denser for longer paragraphs?</strong><br>A: Longer strings require more QR modules; keeping URLs concise helps phone cameras focus quickly.</p>
        `
      }
    ]
  },
  "barcode-generator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Free 1D CODE128 Barcode Generator",
        content: "<p>Create crisp 1D linear <strong>CODE128</strong> barcodes inside your web browser for inventory labels, warehousing SKUs, shipping numbers, shelf tags, and equipment stickers. Runs locally in browser memory with high-resolution PNG downloads suitable for thermal and laser label printing.</p>"
      },
      {
        title: "How to Use the Barcode Generator",
        content: "<ol><li><strong>Type your SKU or ID:</strong> Enter letters, numbers, or tracking text into the input box above (for example <code>SKU-4082-WH</code>).</li><li><strong>Verify live preview:</strong> Inspect the black-on-white bars and readable text caption as the barcode redraws on screen.</li><li><strong>Download PNG:</strong> Click Download High-Res PNG to save an upscaled bitmap graphic ready to drop into Word, Google Docs, or shipping label templates.</li></ol>"
      },
      {
        title: "How the Tool Works &amp; Format Limitations",
        content: "<p>Built with <code>react-barcode</code>, the generator calculates CODE128 start/stop patterns and check digits cleanly onto an HTML5 canvas so laser and camera scanners decode strings reliably. It outputs <strong>CODE128</strong> barcodes exclusively and does not generate retail GS1 EAN-13, UPC-A, or ISBN symbologies registered through retail numbering authorities.</p>"
      },
      {
        title: "Practical Barcode Uses",
        content: "<ul><li><strong>Warehouse Inventory:</strong> Tagging bins, shelving bays, and spare-parts drawers.</li><li><strong>Asset Tracking:</strong> Labeling office laptops, monitors, and library equipment.</li><li><strong>Internal Packing Slips:</strong> Embedding scannable order numbers onto internal dispatch forms.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can standard laser scanners read these downloaded CODE128 barcodes?</strong><br>A: Yes. When printed clearly on white backgrounds with quiet white margins around the bars and without stretching aspect ratio, standard warehouse scanners read CODE128 reliably.</p>
          <p><strong>Q: Does CODE128 support letters and spaces?</strong><br>A: Yes. Unlike numeric-only codes, CODE128 supports uppercase/lowercase ASCII letters, digits, spaces, and common symbols.</p>
          <p><strong>Q: Are my product IDs or tracking numbers sent to a server?</strong><br>A: No. Symbology calculation and canvas PNG rendering happen inside browser memory without backend logging.</p>
        `
      }
    ]
  },
  "live-ruler": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is the Live CM &amp; Inch On-Screen Ruler?",
        content: "<p>Measure small real-world objects right on your laptop monitor, tablet, or smartphone display. Because different monitors have different screen DPI and device pixel ratio densities, calibrating against a physical reference object scales the vector SVG ruler in millimeters, centimeters, and inches.</p>"
      },
      {
        title: "How does calibration work?",
        content: "<p>Desktop and mobile screens vary widely in physical pixels per inch. Clicking Calibrate lets you align an on-screen box with a known standard object (credit/ID card at 85.60 mm wide) so browser math adjusts screen DPI and pixel ratio scaling accurately across your display.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Click Calibrate:</strong> Open the calibration dialog before measuring physical items.</li><li><strong>Match a reference card:</strong> Hold a standard credit card, bank card, or ID against the screen and drag the slider until the box width matches the card's 85.60 mm physical width.</li><li><strong>Measure objects:</strong> Close calibration and read centimeters, millimeters, or inches directly along the crisp SVG scale.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Hardware &amp; Screws:</strong> Checking bolt diameters, jewelry sizes, or SIM tray cutouts.</li><li><strong>School &amp; DIY:</strong> Reading quick cm or inch measurements when no physical tape sits nearby.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why must I calibrate screen DPI on first use?</strong><br>A: Browsers cannot detect the physical millimeter width of external monitors reliably without user calibration, so aligning to an 85.60 mm ISO ID-1 card corrects screen DPI scaling.</p>
          <p><strong>Q: Should I use an on-screen ruler for machining or medical tolerances?</strong><br>A: No. Screen glass thickness causes slight parallax error; use physical calipers or certified steel rules for sub-millimeter tolerances.</p>
          <p><strong>Q: Does this ruler require webcam permissions?</strong><br>A: No. It renders a passive SVG scale on screen without camera access or server requests.</p>
        `
      }
    ]
  },
  "camera-measure": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "How does the Camera Measurement Tool work?",
        content: "<p>Standard phone cameras capture flat 2D frames without built-in depth rulers. This browser utility uses optical reference scaling on a local camera stream or snapshot: place an object of known size (credit card, coin, or A4 sheet) beside your target item so pixel measurements translate cleanly into centimeters, millimeters, inches, or feet.</p>"
      },
      {
        title: "Simple Real-World Example: Measuring a Book",
        content: `<div class="space-y-3">
          <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Place a reference card:</strong> Set a standard Credit Card / ID card (8.56 cm wide) flat beside the book on the same surface.</li>
            <li><strong>Point &amp; capture snapshot:</strong> Keep the phone parallel using the on-screen level readout and tap <strong>Freeze / Snapshot Frame</strong> on your camera stream.</li>
            <li><strong>Calibrate &amp; measure:</strong> Drag a line across the 8.56 cm card edge to lock scale, then drag across your item or switch to <strong>2D Area Box</strong> for width, height, and area.</li>
          </ol>
        </div>`
      },
      {
        title: "Tips for Accurate Measurements",
        content: "<ul><li><strong>Same flat plane:</strong> Rest both the reference item and measured object on the same level desk.</li><li><strong>Hold parallel (0° tilt):</strong> Align camera overhead so perspective skew stays minimal, and use the 2.5× zoom loupe when dragging endpoints.</li></ul>"
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: What reference items are built in?</strong><br>A: Credit Card / ID (8.56 cm), A4 Paper (21.0 cm), US Letter (21.59 cm / 8.5 in), common US/Euro/UK/Indian coins, or any custom width in centimeters.</p>
          <p><strong>Q: Can I save an annotated image of my measurements?</strong><br>A: Yes. Click <strong>Export Photo</strong> to download a JPG showing your drawn measurement lines and unit labels.</p>
          <p><strong>Q: Are my camera frames uploaded to a server?</strong><br>A: No. The camera stream and pixel geometry math run inside your browser without uploading camera frames remotely.</p>
        `
      }
    ]
  },
  "qr-scanner": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Browser-Based QR Code Scanner",
        content: "<p>Scan and decode QR codes directly inside your web browser using a device webcam, mobile phone camera, or uploaded PNG/JPG screenshot. Inspect decoded website links or plain text safely on screen before deciding whether to open a URL.</p>"
      },
      {
        title: "How to Use the QR Scanner",
        content: "<ol><li><strong>Choose Camera or Upload Image:</strong> Pick live webcam scanning or switch to Upload Image to read a saved screenshot.</li><li><strong>Scan the code:</strong> Grant temporary camera permission or drop an image so <code>jsQR</code> extracts the encoded text.</li><li><strong>Inspect before clicking:</strong> Check the decoded URL or string cleanly before copying or opening the destination.</li></ol>"
      },
      {
        title: "How Scanning Works &amp; Limitations",
        content: "<p>Using HTML5 Canvas and the <code>jsQR</code> library in browser memory, frames from <code>navigator.mediaDevices.getUserMedia</code> or static photos are decoded locally without uploading images to a backend scanner. It reads 2D QR codes rather than linear barcodes or general printed text (use <a href='/image-to-text'>Image to Text</a> for text OCR) and does not run automated malware checks on URLs.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is it safe to allow camera access to scan a QR code?</strong><br>A: Yes. The browser decodes frames locally in memory using JavaScript and does not stream or upload camera video to a backend server.</p>
          <p><strong>Q: Can I scan a QR code from a screenshot?</strong><br>A: Yes. Switch to the Upload Image tab and select any PNG/JPG screenshot containing a crisp QR square.</p>
          <p><strong>Q: Does this work on desktop webcams too?</strong><br>A: Yes. Any laptop or desktop browser with webcam access can hold printed QR codes up to the lens for decoding.</p>
        `
      }
    ]
  }
};
