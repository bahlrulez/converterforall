export const utilitiesToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "presentation-maker": {
    sections: [
      {
        title: "Online Presentation Maker – Create PowerPoint Slides in Your Browser",
        content: "<p>Turn your ideas into a professional slideshow instantly without leaving your browser. ConverterForAll’s Presentation Maker empowers you to structure, organize, and download editable .pptx slide files completely locally. We offer a fast, frictionless experience designed to help you quickly draft presentations, lecture notes, or business pitches with zero watermarks, no account sign-ups, and absolute privacy. You can build up to 12 structured slides and export them seamlessly to Microsoft PowerPoint, Google Slides, or Apple Keynote.</p>"
      },
      {
        title: "How to Use the Presentation Maker",
        content: "<ol><li><strong>Select Slide Count:</strong> Use the slider to pick exactly how many slides you need for your pitch or lecture.</li><li><strong>Add Titles &amp; Content:</strong> Type or paste your headings, key takeaways, and bullet points directly into the provided text fields.</li><li><strong>Download PPTX:</strong> Click the 'Download PPTX' button to immediately save your presentation file. You can then open it in your preferred presentation software to add themes, images, and complex transitions.</li></ol>"
      },
      {
        title: "How the Tool Works",
        content: "<p>Behind the scenes, this tool uses a powerful client-side library called <code>pptxgenjs</code> to construct the internal XML structure required for the standard Office Open XML presentation format. This means your text is dynamically assembled into a real <code>.pptx</code> file right on your computer. It is not just generating images; it outputs fully editable text boxes and structured slides.</p>"
      },
      {
        title: "100% Private and Local Processing",
        content: "<p>Your privacy is our priority. Unlike cloud-based design platforms that require you to upload your sensitive business strategies or personal notes to their servers, our Presentation Maker runs entirely within your local browser. There are no API calls, no network <code>fetch</code> requests, and absolutely no server uploads. The presentation is generated directly in your device's memory and handed straight to you.</p>"
      },
      {
        title: "Supported Functionality and Limitations",
        content: "<p>This tool is heavily optimized for speed and structure. It supports generating standard text-based slides, bulleted lists, and basic slide titles across up to 12 slides. However, it is not a full Canva or Microsoft PowerPoint replacement. It does not support cloud collaboration, AI-driven slide generation, template themes, adding images directly from our interface, or complex slide transitions. It is strictly a structural drafting tool designed to get your outline out of your head and into a standard file format as fast as possible.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can I edit the downloaded file in Microsoft PowerPoint or Google Slides?</strong><br>A: Yes! The tool exports a standard .pptx file that is fully compatible with Microsoft PowerPoint, Google Slides, LibreOffice Impress, and Apple Keynote.</p>
          <p><strong>Q: Are there any watermarks on the downloaded presentation?</strong><br>A: Absolutely not. The downloaded .pptx files are completely clean with no forced logos, watermarks, or branding.</p>
          <p><strong>Q: Is my presentation data saved on your servers?</strong><br>A: No. Because we use client-side generation, your text and slide data never leave your computer. We cannot see, store, or access your presentations.</p>
          <p><strong>Q: Do I need an account to use this?</strong><br>A: No account, email, or subscription is required. You can generate unlimited slides for free.</p>
        `
      }
    ]
  },
  "age-calculator": {
    sections: [
      { title: "What the Age Calculator Does", content: "<p>Calculate the difference between a date of birth and a target date in Gregorian calendar years, months and days. The page also reports the number of whole calendar days between the two dates.</p>" },
      { title: "How Date Calculation Works", content: "<p>The date picker supplies calendar dates in YYYY-MM-DD form. The calculator compares those date values using UTC calendar fields, so browser time zones and daylight-saving clock changes do not shift the selected date. The default target date is today's local calendar date when the page is opened.</p><p>The years/months/days breakdown follows calendar-month arithmetic. For birthdays on February 29, the displayed month-and-day breakdown follows the calendar subtraction used by the tool; legal age rules can vary by jurisdiction, so use the relevant official rule for legal eligibility.</p>" },
      { title: "How to Calculate an Age", content: "<ol><li><strong>Enter the date of birth:</strong> Choose the year, month and day.</li><li><strong>Choose a target date:</strong> Leave today's date or select another past or future calendar date.</li><li><strong>Calculate:</strong> View the years, months, days and total whole days between the selected dates.</li><li><strong>Check the input:</strong> The birth date must not be later than the target date.</li></ol>" },
      { title: "Frequently Asked Questions", content: "<p><strong>Q: Does the calculator account for leap years?</strong><br>A: Yes. Calendar date arithmetic uses the Gregorian calendar and the actual number of days in each month.</p><p><strong>Q: Can I calculate an age on a future date?</strong><br>A: Yes. Select a future target date to calculate the calendar difference.</p><p><strong>Q: Is the total-days figure affected by daylight-saving time?</strong><br>A: No. The calculator compares date-only values using UTC calendar arithmetic rather than elapsed local hours.</p><p><strong>Q: How does it handle February 29 birthdays?</strong><br>A: It uses calendar subtraction. Legal age treatment for a leap-day birthday can differ by jurisdiction, so check the applicable official rule when the result is used for legal eligibility.</p><p><strong>Q: Does it calculate legal eligibility automatically?</strong><br>A: No. It reports a date difference and does not determine legal eligibility or apply jurisdiction-specific age rules.</p></p>" }
    ]
  },
  "qr-generator": {
    sections: [
      { title: "What the QR Code Generator Does", content: "<p>Enter text or a URL to create a static QR code and preview it as you type. Download the generated code as a 1,024 × 1,024 pixel PNG. The QR code stores the entered data directly in its pattern; it is not a dynamic redirect link managed by this tool.</p>" },
      { title: "Error Correction Level H", content: "<p>The QR code is generated with error-correction Level H. The standard describes Level H as having an approximate recovery capability of up to 30% of codewords under suitable conditions. This is not a promise that any 30% of the visible surface may be covered or removed. Scan success depends on which modules are damaged, print size, contrast, quiet-zone space and the scanner.</p>" },
      { title: "Static QR Codes and Destination Links", content: "<p>The encoded data is static: changing the destination later requires generating and distributing a new QR code. A QR code does not itself expire, but a URL can stop working or its content can change. The QR pattern does not impose a scan counter; any limits, redirects or analytics applied by the destination website are separate.</p>" },
      { title: "How to Generate and Download a QR Code", content: "<ol><li><strong>Enter the data:</strong> Type or paste a URL or text into the QR Content box.</li><li><strong>Preview the code:</strong> The QR pattern updates as the text changes.</li><li><strong>Test it:</strong> Scan the preview with a phone camera before printing or sharing it.</li><li><strong>Download:</strong> Save the PNG file and test the saved image at its intended size.</li></ol>" },
      { title: "Frequently Asked Questions", content: "<p><strong>Q: Do these QR codes expire?</strong><br>A: The static QR pattern has no built-in expiry date. A URL or service encoded in the code may later become unavailable or change.</p><p><strong>Q: Does Level H let me cover 30% of the visible QR image?</strong><br>A: No. The approximate 30% recovery figure refers to codewords, not an arbitrary portion of the visible surface. Damage location and scan conditions matter.</p><p><strong>Q: Does the generator count scans?</strong><br>A: The generated QR is static and contains the data you entered. It does not add a ConverterForAll scan-count redirect. The destination service may have its own analytics or limits.</p><p><strong>Q: Which output format is available?</strong><br>A: The download button exports a 1,024 × 1,024 pixel PNG.</p><p><strong>Q: Why should I test the QR code before printing?</strong><br>A: Small module size, low contrast, insufficient quiet zone or print damage can make a QR code harder to scan. Test the downloaded or printed result.</p></p>" }
    ]
  },
  "barcode-generator": {
    sections: [
      {
        title: "Free 1D Barcode Generator",
        content: "<p>The ConverterForAll Barcode Generator is a fast, reliable utility designed to create standard 1D linear barcodes instantly. Specifically utilizing the ubiquitous CODE128 format, this tool is perfect for retail operations, internal inventory management, warehousing, and personal cataloging. It allows you to transform any standard alphanumeric string into a precise, scannable graphic. Operating entirely locally in your web browser, our tool guarantees privacy and speed, enabling you to generate and download high-resolution barcodes for printing without any software installation.</p>"
      },
      {
        title: "How to Use the Barcode Generator",
        content: "<ol><li><strong>Input Your Data:</strong> Type your inventory number, tracking ID, or alphanumeric string into the text field.</li><li><strong>Live Preview:</strong> The barcode image will automatically generate and update on your screen in real-time as you type, allowing you to instantly verify its appearance.</li><li><strong>Download:</strong> Click the 'Download High-Res PNG' button. We automatically upscale the generated graphic so you receive a crisp, unblurred image file that is perfectly suited for high-DPI label printers.</li></ol>"
      },
      {
        title: "How the Tool Works",
        content: "<p>When you input data, the tool utilizes the <code>react-barcode</code> client-side rendering engine to map your text characters to the specific line-and-space widths dictated by the CODE128 symbology standard. It calculates the necessary checksums and renders the strict black-on-white high contrast pattern onto an HTML Canvas, ensuring pixel-perfect scaling.</p>"
      },
      {
        title: "Supported Functionality and Limitations",
        content: "<p>By default, this tool strictly generates CODE128 barcodes, which are highly versatile and widely supported by nearly all commercial laser scanners. However, it is important to note the tool's limitations. It does not support selecting multiple barcode formats from the UI, meaning you cannot currently generate EAN-13, UPC-A, ISBN, or specific GS1 retail compliance barcodes. It is intended for internal tracking, general alphanumeric encoding, and systems that accept the robust CODE128 standard.</p>"
      },
      {
        title: "Privacy and Security",
        content: "<p>Your tracking numbers and inventory data are safe. The entire barcode generation process occurs locally in your browser's memory. We have absolutely zero visibility into the numbers you are converting, and we do not log or transmit your data to any remote servers.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Can standard laser scanners read these downloaded barcodes?</strong><br>A: Yes. As long as you print them cleanly on a white background without stretching the aspect ratio, standard retail and warehouse laser scanners will read them perfectly.</p>
          <p><strong>Q: Can I use spaces or letters in my barcode?</strong><br>A: Yes! Unlike some older formats that only allow numbers, the CODE128 standard supports uppercase letters, lowercase letters, numbers, spaces, and standard punctuation.</p>
          <p><strong>Q: Does the generated barcode include the required check digit?</strong><br>A: Yes, the underlying rendering algorithm automatically calculates and inserts the necessary checksum character required by laser scanners for successful reads.</p>
          <p><strong>Q: Can I use this tool to sell products on Amazon?</strong><br>A: To sell commercially on major retail platforms, you typically must purchase official GS1 UPC or EAN codes. Our tool generates CODE128, which is generally used for internal shipping and inventory tracking rather than global retail registration.</p>
        `
      }
    ]
  },
  "password-generator": {
    sections: [
      { title: "What the Password Generator Does", content: "<p>Create a random password up to 64 characters from the selected uppercase letters, lowercase letters, digits and symbols. The tool uses the browser Web Crypto API to obtain random bytes and rejection sampling to choose characters without modulo bias.</p>" },
      { title: "Randomness and Security", content: "<p>This page uses <code>crypto.getRandomValues()</code>, not <code>Math.random()</code>, to generate password characters. A password is only as useful as the way it is stored and used: do not reuse it across services, and save it in a trusted password manager. The strength label shown here is a simple heuristic based on length and selected character groups; it is not a formal entropy calculation or a check against known breached passwords.</p><p>If Web Crypto is not available, the tool shows an error rather than falling back to a non-cryptographic random generator.</p>" },
      { title: "How to Generate a Password", content: "<ol><li><strong>Set a length:</strong> Choose between 6 and 64 characters.</li><li><strong>Select character groups:</strong> Choose uppercase, lowercase, digits and/or symbols. At least one group remains selected.</li><li><strong>Generate:</strong> A new password is created when the settings change or when you press Regenerate.</li><li><strong>Copy safely:</strong> Copy the password and save it in a trusted password manager.</li></ol>" },
      { title: "Frequently Asked Questions", content: "<p><strong>Q: Does it use cryptographically secure randomness?</strong><br>A: Yes. It uses the browser's Web Crypto API <code>crypto.getRandomValues()</code> with rejection sampling. It does not use <code>Math.random()</code>.</p><p><strong>Q: Is the strength label a formal security score?</strong><br>A: No. It is a basic heuristic based on password length and selected character groups. It does not measure entropy or check password-breach databases.</p><p><strong>Q: What happens if Web Crypto is unavailable?</strong><br>A: The tool displays an error and does not generate a password using a weaker random-number fallback.</p><p><strong>Q: What is the maximum length?</strong><br>A: The slider allows passwords from 6 to 64 characters.</p><p><strong>Q: Should I reuse the same generated password?</strong><br>A: No. Use a unique password for each account and store it in a trusted password manager.</p></p>" }
    ]
  },
  "fuel-calculator": {
    sections: [
      {
        title: "What is the Fuel Cost Calculator?",
        content: "<p>The Fuel Cost Calculator is a handy financial planning tool designed to estimate exactly how much money you will spend on gas or diesel for a specific trip. It also calculates the total volume of fuel your vehicle will consume, helping you budget for road trips or daily commutes.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>You provide three data points: the distance of your trip, your vehicle's average fuel efficiency, and the current price of fuel at the pump. The calculator then applies standard mathematical formulas depending on your chosen unit system (Imperial or Metric) to compute the final cost and volume requirements in real-time.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select Unit System:</strong> Choose Imperial (Miles, Gallons) or Metric (Kilometers, Liters) using the toggle at the top.</li><li><strong>Enter Distance:</strong> Input the total distance you plan to drive.</li><li><strong>Enter Efficiency:</strong> Input your car's fuel efficiency (e.g., 25 MPG or 7.5 L/100km).</li><li><strong>Enter Price:</strong> Input the cost of fuel per gallon or liter.</li><li><strong>Review Results:</strong> The estimated total cost and fuel volume required will update automatically at the bottom.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Road Trip Budgeting:</strong> Calculating the exact gas costs for a cross-country vacation.</li><li><strong>Commute Analysis:</strong> Determining how much money you spend driving to work every month to see if public transit is cheaper.</li><li><strong>Expense Splitting:</strong> Accurately calculating gas costs so you can fairly split the bill with friends on a shared trip.</li><li><strong>Fleet Management:</strong> Estimating delivery route costs for small businesses.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How do I find my vehicle's fuel efficiency?</strong><br>A: Most modern cars have a dashboard display showing average MPG or L/100km. Alternatively, you can look up your car's make and model online via government EPA websites.</p>
          <p><strong>Q: Should I use City or Highway efficiency?</strong><br>A: If your trip is mostly on the highway, use the Highway efficiency number. If it's a mix, use the Combined efficiency number.</p>
          <p><strong>Q: Does the calculator account for traffic or hills?</strong><br>A: No, the calculator uses the flat efficiency rate you provide. For mountainous trips or heavy traffic, you should manually lower your efficiency estimate slightly.</p>
          <p><strong>Q: What is the difference between Imperial and Metric in this tool?</strong><br>A: Imperial uses Miles, Miles per Gallon (MPG), and Price per Gallon. Metric uses Kilometers, Liters per 100km (L/100km), and Price per Liter.</p>
          <p><strong>Q: Can I use this for electric vehicles (EVs)?</strong><br>A: While designed for liquid fuel, you can adapt it for EVs by entering Distance, efficiency in kWh/mile, and electricity cost per kWh.</p>
          <p><strong>Q: Why is my estimated cost different from what I actually paid?</strong><br>A: Real-world driving involves accelerating, idling, and varying fuel prices at different gas stations, which can cause minor discrepancies from the mathematical estimate.</p>
          <p><strong>Q: Does this tool work for motorcycles and trucks?</strong><br>A: Yes, as long as you know the vehicle's average fuel efficiency, the math applies universally to any vehicle.</p>
          <p><strong>Q: Is my route data saved?</strong><br>A: No, we do not ask for your start/end destinations, and all numbers you type are processed locally and discarded when you close the tab.</p>
          <p><strong>Q: Can I change the currency symbol?</strong><br>A: Currently, it defaults to a generic '$' symbol, but the math works perfectly regardless of whether you are calculating in Dollars, Euros, or Pounds.</p>
          <p><strong>Q: Does it account for air conditioning use?</strong><br>A: Using AC lowers your fuel efficiency. If you plan to blast the AC, you should lower your MPG input by 1-2 points to get a more accurate cost estimate.</p>
        `
      }
    ]
  },
  "mileage-calculator": {
    sections: [
      {
        title: "What is the Mileage Calculator?",
        content: "<p>The Mileage Calculator is a straightforward tool that helps you determine your vehicle's true, real-world fuel efficiency. By inputting the distance you drove and how much fuel it took to refill your tank, the calculator will output your exact Miles per Gallon (MPG) or Liters per 100km (L/100km).</p>"
      },
      {
        title: "How does it work?",
        content: "<p>It reverses the standard fuel cost formula. If you are using the Imperial system, it divides the miles driven by the gallons used. If using the Metric system, it calculates how many liters are used to drive exactly 100 kilometers. This provides a hyper-accurate picture of your car's health and efficiency.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Fill your tank:</strong> Fill your vehicle's gas tank completely and reset your trip odometer to zero.</li><li><strong>Drive:</strong> Drive normally until you need gas again.</li><li><strong>Refill and Record:</strong> Fill the tank completely again. Note the exact amount of fuel it took to fill it, and record the distance on your trip odometer.</li><li><strong>Calculate:</strong> Enter the Distance Traveled and Fuel Used into the tool. Your true real-world efficiency will instantly appear.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Vehicle Maintenance:</strong> Monitoring your MPG over time. A sudden drop in efficiency can indicate issues like low tire pressure or a failing oxygen sensor.</li><li><strong>Verifying Specs:</strong> Checking if your car actually gets the fuel efficiency advertised by the manufacturer.</li><li><strong>Hyper-miling:</strong> Testing different driving techniques (like slower acceleration) to see how it measurably improves your fuel economy.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why is my calculated MPG lower than what the manufacturer claims?</strong><br>A: Manufacturer numbers are obtained under perfect, controlled laboratory conditions. Real-world driving involves wind resistance, traffic, varying loads, and weather, which usually result in lower efficiency.</p>
          <p><strong>Q: What is the most accurate way to measure distance?</strong><br>A: Using your car's built-in Trip Odometer is highly accurate. Reset it exactly when you fill up your tank, and read it right before you fill up next.</p>
          <p><strong>Q: Does the Metric setting give me km/L or L/100km?</strong><br>A: The global standard is L/100km (how much fuel is needed to go a set distance), so that is the primary output. However, the tool also displays km/L underneath for your convenience.</p>
          <p><strong>Q: How often should I calculate my mileage?</strong><br>A: Calculating it every time you fill up provides the best average data. Many people use a small notebook in their glovebox to track this over years.</p>
          <p><strong>Q: Can carrying heavy loads affect my results?</strong><br>A: Significantly. Towing a trailer or filling your trunk with heavy items requires more energy to move the vehicle, which will noticeably lower your fuel efficiency.</p>
          <p><strong>Q: Does tire pressure matter?</strong><br>A: Yes. Under-inflated tires increase rolling resistance, causing your engine to work harder and burn more fuel. Keeping tires properly inflated is the easiest way to improve MPG.</p>
          <p><strong>Q: Is MPG or L/100km better?</strong><br>A: They are just different ways to measure the same thing. MPG measures distance per unit of fuel, while L/100km measures fuel per unit of distance. The tool handles both.</p>
          <p><strong>Q: What if I only fill my tank halfway?</strong><br>A: The math still works perfectly as long as you accurately record the exact volume of fuel you put in and the exact distance driven since the last fill-up.</p>
          <p><strong>Q: Will using premium gas improve my mileage?</strong><br>A: Generally, no, unless your car's engine specifically requires high-octane fuel to prevent knocking. For most standard cars, regular gas provides the exact same mileage.</p>
          <p><strong>Q: Is my data private?</strong><br>A: Yes. All mileage calculations happen exclusively in your browser. We do not track or store your vehicle's performance data.</p>
        `
      }
    ]
  },
  "live-ruler": {
    sections: [
      {
        title: "What is the Live CM Ruler?",
        content: "<p>The Live CM Ruler is a precise, on-screen measuring tool that transforms your desktop monitor, tablet, or smartphone into a highly accurate physical ruler. By allowing you to calibrate the screen using standard objects, the ruler displays true-to-life Centimeters and Inches.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>Monitors and phone screens have vastly different pixel densities (PPI). A CSS 'inch' on a 4K monitor might physically measure differently than on a 1080p laptop. Our tool solves this by providing a calibration mechanism. Once you visually match the on-screen box to a physical reference object, the application calculates your exact screen PPI and dynamically scales the SVG ruler to match the physical world perfectly.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Click Calibrate:</strong> Open the calibration modal to set your screen's pixel density.</li><li><strong>Use a Reference Object:</strong> Place a standard ID card, credit card, or dollar bill against the screen.</li><li><strong>Adjust the Slider:</strong> Drag the slider until the blue box on the screen perfectly matches the physical width of your object.</li><li><strong>Measure:</strong> Close the modal. The on-screen ruler is now 100% accurate. Place small objects against your screen to measure them.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Online Shopping:</strong> Measuring rings, jewelry, or small hardware components to ensure you order the correct size.</li><li><strong>Crafting & DIY:</strong> Quickly checking the dimensions of small parts, screws, or paper cutouts when you don't have a physical ruler nearby.</li><li><strong>Education:</strong> Helping students visualize measurements and practice reading rulers digitally.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is it safe to put a credit card on my screen?</strong><br>A: Yes, gently holding a card against a modern glass or plastic screen will not damage it. Just avoid pressing hard or scraping the edges.</p>
          <p><strong>Q: Why do I need to calibrate?</strong><br>A: Because every screen is built differently. Without calibration, the web browser just guesses what an 'inch' is, which can be off by 20% or more depending on your monitor.</p>
          <p><strong>Q: Do I have to calibrate every time?</strong><br>A: For the most accurate measurements, it is recommended to verify the calibration when you start a new session, especially if you move the browser window to a different monitor.</p>
          <p><strong>Q: Are credit cards always the same size?</strong><br>A: Yes, standard credit cards, ID cards, and driver's licenses globally adhere to the ISO/IEC 7810 ID-1 standard, making them exactly 85.60 mm wide.</p>
          <p><strong>Q: What if I don't have a credit card?</strong><br>A: The calibration tool often supports multiple reference objects like dollar bills, coins, or standard A4 paper widths.</p>
          <p><strong>Q: Is the ruler accurate enough for engineering work?</strong><br>A: While highly accurate after calibration (within a millimeter), we do not recommend using an on-screen ruler for mission-critical engineering, machining, or medical measurements due to the parallax effect of glass screens.</p>
          <p><strong>Q: Can I measure in both Inches and Centimeters?</strong><br>A: Yes, the ruler displays both Imperial (Inches) and Metric (Centimeters/Millimeters) scales simultaneously.</p>
          <p><strong>Q: Why does the ruler look blurry on my phone?</strong><br>A: It shouldn't! Our ruler is generated using scalable vector graphics (SVG) to ensure crisp lines on even the highest resolution Retina displays.</p>
          <p><strong>Q: Can I measure things larger than my screen?</strong><br>A: Unfortunately, the on-screen ruler is physically limited by the size of your monitor or device.</p>
          <p><strong>Q: Does this tool require a webcam?</strong><br>A: No, the Live Ruler is completely passive and only uses your screen display. It does not require or request camera access.</p>
        `
      }
    ]
  },
  "camera-measure": {
    sections: [
      {
        title: "How does the Camera Measurement Tool work?",
        content: "<p>Your camera cannot measure real-world distances on its own because 2D photos do not have depth. This tool uses a simple, smart technique called <strong>Optical Reference Scaling</strong>: by placing an item of known size (such as a standard credit card, coin, or A4 paper) right next to your object, the tool compares pixel counts to calculate exact real-world dimensions in centimeters, millimeters, inches, or feet.</p>"
      },
      {
        title: "Simple Real-World Example: Measuring a Book",
        content: `<div class="space-y-3">
          <p>Imagine you want to measure the exact length and width of a <strong>Book</strong> on your desk without a physical tape measure:</p>
          <ol class="list-decimal pl-5 space-y-2">
            <li><strong>Place a Reference Item:</strong> Put any standard <strong>Credit Card</strong> or ID flat on your desk right next to the book.</li>
            <li><strong>Point & Freeze:</strong> Aim your phone or webcam straight down at both items. Tap <strong>"Freeze / Snapshot Frame"</strong> so hand shaking doesn't blur your drawing.</li>
            <li><strong>Calibrate (Step 1):</strong> Drag a line across the width of your Credit Card (from left to right). The tool locks the <strong>8.56 cm</strong> reference scale.</li>
            <li><strong>Measure (Step 2):</strong> Drag a line across your Book. The tool immediately displays its exact size: <code>21.4 cm (8.43 in)</code>.</li>
            <li><strong>Measure 2D Area:</strong> Switch to <strong>"2D Area Box"</strong> to draw a box and instantly see its length, width, and surface area (e.g. <code>320.5 cm²</code>).</li>
          </ol>
        </div>`
      },
      {
        title: "Tips for Accurate Measurements",
        content: `<ul>
          <li><strong>1. Same Flat Surface:</strong> Place your reference card or coin right next to the object on the same flat surface.</li>
          <li><strong>2. Keep Your Phone Level (0° Tilt):</strong> Look at the green <strong>"Level: 0°"</strong> indicator. Holding your phone parallel to the table reduces perspective distortion.</li>
          <li><strong>3. Use the 2.5x Zoom Loupe:</strong> When you touch and drag on the screen, a 2.5x magnifying crosshair appears so your finger doesn't block the edge.</li>
        </ul>`
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        content: `
          <p><strong>Q: What reference items can I use?</strong><br>A: You can use any standard Credit Card / ID (8.56 cm), A4 Paper (21.0 cm), US Letter (21.59 cm / 8.5 in), US Quarter ($0.25), 1 Euro / 2 Euro coins, UK £1 coin, Indian ₹10 coin, or enter any custom object size in centimeters.</p>
          <p><strong>Q: What is the "Freeze Frame" button for?</strong><br>A: Tapping "Freeze / Snapshot Frame" captures a still image so you can draw and fine-tune measurements without camera shaking.</p>
          <p><strong>Q: Can I measure in inches or millimeters?</strong><br>A: Yes! You can toggle between <strong>cm</strong>, <strong>mm</strong>, <strong>inch</strong>, and <strong>ft</strong> at any time.</p>
          <p><strong>Q: Can I save or export the photo with measurements?</strong><br>A: Yes! Click the <strong>"Export Photo"</strong> button to download a JPG stamped with your drawn lines and dimensions.</p>
          <p><strong>Q: Are my camera images uploaded to any server?</strong><br>A: No. Camera processing and pixel calculations run entirely locally in your browser.</p>
        `
      }
    ]
  },
  "qr-scanner": {
    sections: [
      {
        title: "Secure Online QR Code Scanner",
        content: "<p>Easily scan, read, and decode QR codes directly in your web browser without downloading any sketchy apps. The ConverterForAll QR Code Scanner is a powerful, lightning-fast utility that allows you to instantly scan codes using your mobile smartphone camera, desktop webcam, or by uploading an image file. Designed for ultimate privacy and speed, it safely decodes website URLs, hidden text, and contact information embedded inside QR codes so you can inspect them securely before visiting any potentially dangerous links.</p>"
      },
      {
        title: "How to Use the QR Scanner",
        content: "<ol><li><strong>Select Your Method:</strong> Choose whether you want to use your device's live camera or upload a static image.</li><li><strong>Live Camera Scanning:</strong> If you are on a smartphone or have a webcam, click 'Start Camera'. Grant your browser permission to access the camera, then hold the QR code in front of the lens. The tool will automatically detect and decode it instantly.</li><li><strong>Image Upload Scanning:</strong> If someone sent you a screenshot of a QR code, switch to the 'Upload Image' tab. Drag and drop the picture into the box, and the tool will extract the data.</li><li><strong>Review Results:</strong> The decoded text or URL will appear on screen. You can safely copy it or click to visit the link.</li></ol>"
      },
      {
        title: "How the Tool Works",
        content: "<p>The scanner leverages the <code>jsQR</code> library and standard HTML5 Canvas technology to analyze video frames and static images. When you use your camera, the browser captures a local video stream and continuously searches the pixels for the distinct alignment squares of a QR code. Once the pattern is identified, it extracts the encoded binary data and translates it back into human-readable text.</p>"
      },
      {
        title: "100% Private Local Processing",
        content: "<p>This QR Scanner is built with absolute privacy in mind. When you grant camera access via <code>navigator.mediaDevices.getUserMedia</code>, the video feed is processed strictly locally inside your web browser. We do not transmit, record, or upload your video stream or your uploaded images to any remote server. Your camera data never leaves your device.</p>"
      },
      {
        title: "Limitations",
        content: "<p>This tool is specifically optimized for standard 2D QR codes. While highly accurate for QR patterns, it does not currently support Optical Character Recognition (OCR), meaning it cannot read plain text. It also does not store a history of your past scans, nor does it perform automatic cloud lookups to verify if a link is safe. It is up to you to review the decoded URL before clicking it.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is it safe to grant camera permissions to this website?</strong><br>A: Yes. Camera access is strictly required for the browser to see the QR code. The video stream is analyzed locally and never leaves your computer or phone.</p>
          <p><strong>Q: What should I do if the camera isn't working?</strong><br>A: Ensure that you haven't blocked camera access in your browser settings. On iOS Safari or Android Chrome, you may need to refresh the page and tap 'Allow' when the permission prompt appears.</p>
          <p><strong>Q: Can I scan a QR code from a screenshot on my phone?</strong><br>A: Yes! Simply save the screenshot to your camera roll, select the 'Upload Image' option in our tool, and pick the screenshot from your gallery.</p>
          <p><strong>Q: Does this scanner work on desktop computers?</strong><br>A: Absolutely. If you have a webcam attached to your PC or Mac, you can hold a physical QR code up to the lens to scan it.</p>
        `
      }
    ]
  }
};
