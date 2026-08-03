export const utilitiesToolsContent: Record<string, { sections: { title: string, content: string }[] }> = {
  "age-calculator": {
    sections: [
      {
        title: "What is the Age Calculator?",
        content: "<p>The Age Calculator is a highly accurate utility that determines your exact age in years, months, and days based on your date of birth. It also calculates the total number of days you've been alive, making it a fun and practical tool for milestones, legal document filling, or personal curiosity.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>You simply input your Date of Birth and a Target Date (which defaults to today). The calculator uses standard Gregorian calendar algorithms to precisely compute the difference between the two dates. It accounts for leap years, variable month lengths, and time zone discrepancies by utilizing your device's local time settings.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select your Date of Birth:</strong> Use the date picker to choose the exact year, month, and day you were born.</li><li><strong>Set the Target Date:</strong> If you want to know your age as of today, leave this as the default. Otherwise, select a past or future date.</li><li><strong>Click Calculate:</strong> Instantly view your exact age breakdown and your total days alive.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Filling out forms:</strong> Quickly determining exact age in years and months for medical or government documents.</li><li><strong>Event Planning:</strong> Figuring out exactly how old someone will be on a specific future date (like a wedding or graduation).</li><li><strong>Pet Ages:</strong> Calculating the exact age of your pets if you know their birth date.</li><li><strong>Curiosity:</strong> Finding out exactly how many days you've been alive.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is my birth date saved or stored anywhere?</strong><br>A: No. All calculations are performed entirely in your web browser. We do not store, track, or send your birth date to any servers, ensuring absolute privacy.</p>
          <p><strong>Q: Does the calculator account for leap years?</strong><br>A: Yes, our algorithm uses native JavaScript Date objects which perfectly account for leap years (e.g., February 29th).</p>
          <p><strong>Q: Can I calculate my age for a date in the future?</strong><br>A: Absolutely. By changing the 'Target Date' to a future date, you can find out exactly how old you will be on that day.</p>
          <p><strong>Q: Can I calculate how old someone was when they died?</strong><br>A: Yes, simply set the 'Date of Birth' and set the 'Target Date' to the date of their passing.</p>
          <p><strong>Q: Why does the Total Days result look different from multiplying my years by 365?</strong><br>A: Multiplying by 365 is inaccurate because it ignores leap years and the extra quarter-day per year. Our tool calculates the exact number of days.</p>
          <p><strong>Q: Will this work if I was born before the year 1900?</strong><br>A: Yes, the calculator supports historical dates going back thousands of years.</p>
          <p><strong>Q: Does time zone affect the calculation?</strong><br>A: The tool uses your device's local timezone. Unless you were born on the exact stroke of midnight and are currently in a wildly different timezone, it will be perfectly accurate.</p>
          <p><strong>Q: Is this tool free to use?</strong><br>A: Yes, the Age Calculator is 100% free with no limits on how many times you can use it.</p>
          <p><strong>Q: What if I only know the month and year of birth?</strong><br>A: For an exact calculation, a specific day is required. If you don't know it, you can select the 1st of the month as a placeholder.</p>
          <p><strong>Q: Can it calculate time between any two dates?</strong><br>A: Yes! Even though it's called an Age Calculator, it functions perfectly as a general date-difference calculator.</p>
        `
      }
    ]
  },
  "qr-generator": {
    sections: [
      {
        title: "What is the QR Code Generator?",
        content: "<p>The QR Code Generator is a fast, client-side tool that converts any text, URL, email address, or contact information into a scannable 2D barcode (QR Code). It allows you to instantly download a high-resolution PNG of the code for use in marketing materials, business cards, menus, or digital displays.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>As you type into the input field, the tool dynamically encodes your text into a standard QR matrix using an advanced mathematical algorithm. It adds built-in error correction (Level H), meaning the QR code can sustain up to 30% damage or obstruction and still be perfectly readable by a scanner.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Enter your content:</strong> Type or paste your website URL, text message, or data into the input box.</li><li><strong>Preview:</strong> The QR code on the screen will update instantly as you type.</li><li><strong>Test it:</strong> Optionally point your smartphone's camera at the screen to verify it scans correctly.</li><li><strong>Download:</strong> Click the Download button to save a high-quality, crisp PNG image of your QR code to your device.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Restaurants:</strong> Creating touchless digital menus that customers can scan at their tables.</li><li><strong>Marketing:</strong> Adding QR codes to flyers, posters, and billboards to instantly link people to promotional websites.</li><li><strong>Networking:</strong> Putting a link to your LinkedIn profile or portfolio on your physical business cards.</li><li><strong>Event Management:</strong> Generating codes for event ticketing or linking to venue maps.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Do these QR codes ever expire?</strong><br>A: No! We generate "Static" QR codes. The data is hardcoded directly into the visual pattern, meaning as long as your destination URL remains active, the QR code will work forever.</p>
          <p><strong>Q: Is there a scan limit on my QR codes?</strong><br>A: Absolutely not. Because the codes are static and not routed through our servers, you can scan them infinitely for free.</p>
          <p><strong>Q: Can I use the generated QR codes for commercial purposes?</strong><br>A: Yes, you retain full rights to the QR codes you generate and can use them freely on commercial products or advertisements.</p>
          <p><strong>Q: Are my QR codes tracked?</strong><br>A: No. We do not track scans or collect any data on how your QR codes are used. For analytics, you should use tracking tags (like UTM parameters) on your destination URL.</p>
          <p><strong>Q: Why does the QR code pattern get denser when I type more?</strong><br>A: QR codes consist of a grid of modules. As you add more data, the grid must increase in density to encode all the information.</p>
          <p><strong>Q: What does the "Level H" error correction mean?</strong><br>A: It stands for High. It means up to 30% of the QR code can be missing, covered, or damaged, and a phone can still successfully read it.</p>
          <p><strong>Q: Can I put a logo in the center of the QR code?</strong><br>A: Because we use Level H error correction, you can technically take the downloaded PNG and overlay a small logo in the center using an image editor, and it will still scan!</p>
          <p><strong>Q: What format does the download button provide?</strong><br>A: The tool generates a high-resolution PNG file, which is widely compatible and perfectly crisp for both web and print use.</p>
          <p><strong>Q: What happens if I type a very long paragraph?</strong><br>A: While QR codes can hold up to 4,000 alphanumeric characters, we recommend keeping it brief (like a URL) to ensure older phone cameras can easily read the dense pattern.</p>
          <p><strong>Q: Does generating a QR code cost money?</strong><br>A: No, our generator is completely free with no hidden fees or subscriptions.</p>
        `
      }
    ]
  },
  "barcode-generator": {
    sections: [
      {
        title: "What is the Barcode Generator?",
        content: "<p>The Barcode Generator is a professional utility designed to create standard 1D linear barcodes (specifically utilizing the ubiquitous CODE128 format by default). It is perfect for retail, inventory management, warehousing, and personal cataloging, allowing you to instantly turn any alphanumeric string into a scannable graphic.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>When you input your data, the tool utilizes a client-side rendering engine to map your characters to the specific line-and-space widths dictated by the barcode symbology standard. It renders this directly onto an HTML Canvas, ensuring pixel-perfect scaling, which can then be exported as a high-resolution image.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Input your data:</strong> Type the UPC, EAN, or custom inventory number into the text field.</li><li><strong>Review the Preview:</strong> The barcode image will automatically generate and update on the screen in real-time.</li><li><strong>Download:</strong> Click the 'Download High-Res PNG' button to save a crisp, unblurred image file that is ready for printing on labels.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Retail & Sales:</strong> Generating scannable barcodes for physical products to use with Point-of-Sale (POS) systems.</li><li><strong>Inventory Management:</strong> Labeling warehouse bins or tracking assets and hardware within an organization.</li><li><strong>Libraries & Archives:</strong> Cataloging books, documents, or media with unique scannable identifiers.</li><li><strong>Ticketing:</strong> Adding barcodes to event tickets or vouchers for fast entry scanning.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: What type of barcode does this generate?</strong><br>A: By default, this tool generates CODE128 barcodes, which are the industry standard for alphanumeric data and support a wide range of characters.</p>
          <p><strong>Q: Can standard laser scanners read these downloaded barcodes?</strong><br>A: Yes. As long as you print them cleanly (without stretching the aspect ratio), standard retail and warehouse laser scanners will read them perfectly.</p>
          <p><strong>Q: Is there a character limit for the barcode?</strong><br>A: Technically, CODE128 can hold a large amount of data, but practically, barcodes longer than 20-30 characters become too wide for most handheld scanners to read.</p>
          <p><strong>Q: Can I use spaces in my barcode?</strong><br>A: Yes, CODE128 supports spaces, uppercase and lowercase letters, numbers, and most standard punctuation marks.</p>
          <p><strong>Q: Will my barcode expire?</strong><br>A: No. A barcode is simply a font or a visual representation of text. It never expires.</p>
          <p><strong>Q: Are my inventory numbers logged on your servers?</strong><br>A: No. Generation happens locally in your browser. We have zero visibility into the data you are converting into barcodes.</p>
          <p><strong>Q: Why is my downloaded image so large?</strong><br>A: We artificially upscale the generated barcode during the download process (4x scale) to ensure it prints crisply without pixelation on high-DPI label printers.</p>
          <p><strong>Q: Does the barcode include a check digit?</strong><br>A: Yes, the underlying CODE128 rendering algorithm automatically calculates and inserts the necessary checksum character required by scanners.</p>
          <p><strong>Q: Can I change the colors of the barcode?</strong><br>A: For maximum scannability, we enforce a strict black-on-white high contrast theme, which is required by most optical scanners.</p>
          <p><strong>Q: Can I sell products on Amazon using these barcodes?</strong><br>A: To sell commercially on platforms like Amazon, you must purchase official GS1 UPC or EAN codes. Our tool can generate the barcode image for those numbers, but it does not register the numbers for you.</p>
        `
      }
    ]
  },
  "password-generator": {
    sections: [
      {
        title: "What is the Password Generator?",
        content: "<p>The Password Generator is an essential security tool that creates incredibly strong, highly randomized passwords. By allowing you to mix uppercase letters, lowercase letters, numbers, and symbols up to 64 characters in length, it ensures your accounts remain safe from brute-force attacks and dictionary hacking attempts.</p>"
      },
      {
        title: "How does it work?",
        content: "<p>The tool relies on your browser's native Math.random() cryptographic functions to select characters from your chosen character pools. Because the entire generation process happens locally in JavaScript on your device, the generated password is never transmitted across the network, guaranteeing that you are the only person who will ever see it.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select Length:</strong> Use the slider to choose a password length. Experts recommend at least 16 characters for critical accounts.</li><li><strong>Choose Complexity:</strong> Toggle checkboxes to include or exclude Uppercase, Lowercase, Numbers, and Symbols.</li><li><strong>Generate:</strong> The password generates automatically as you adjust settings. You can click the 'Regenerate' button for a new combination.</li><li><strong>Copy:</strong> Click the Copy icon to instantly copy the secure string to your clipboard for pasting into a password manager.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Securing Accounts:</strong> Creating unbreakable passwords for banking, email, and social media accounts.</li><li><strong>Wi-Fi Security:</strong> Generating long, random strings to secure your home or business router networks.</li><li><strong>Software Development:</strong> Creating random secret keys, API tokens, or temporary passwords for new user accounts.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is this password generator safe to use?</strong><br>A: Yes, it is 100% safe. The password generation happens entirely within your web browser (client-side). No data is sent to our servers.</p>
          <p><strong>Q: Does ConverterForAll keep a copy of generated passwords?</strong><br>A: Absolutely not. We have no databases storing your passwords, and we cannot see what the tool generates on your screen.</p>
          <p><strong>Q: How long should my password be?</strong><br>A: For maximum security, cybersecurity experts recommend passwords be at least 16 characters long. Length is generally more important than complexity.</p>
          <p><strong>Q: What makes a password "Strong"?</strong><br>A: A strong password is long, completely random (not based on dictionary words or personal info), and utilizes a mix of different character types.</p>
          <p><strong>Q: Should I memorize the generated passwords?</strong><br>A: It is virtually impossible to memorize highly secure, random passwords. We strongly recommend using a reputable Password Manager to store them securely.</p>
          <p><strong>Q: Why was my clipboard blocked when clicking copy?</strong><br>A: Some strict browser security settings or ad-blockers prevent scripts from writing to the clipboard. If this happens, you can manually highlight and copy the text.</p>
          <p><strong>Q: Can the tool generate pronounceable passwords?</strong><br>A: Currently, this tool generates purely random strings for maximum entropy. Pronounceable passwords are inherently less random and therefore slightly less secure.</p>
          <p><strong>Q: Is there a maximum password length?</strong><br>A: Our tool allows generating passwords up to 64 characters, which is more than enough to thwart any modern supercomputer brute-force attempt.</p>
          <p><strong>Q: What are the symbols used in the generator?</strong><br>A: We use standard keyboard symbols: !@#$%^&*()_+~|\`{}[]:;?><,./-=</p>
          <p><strong>Q: Are these passwords vulnerable to dictionary attacks?</strong><br>A: No. Because they are completely random character strings rather than known words, dictionary attacks are entirely useless against them.</p>
        `
      }
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
        content: "<p>This tool leverages your device's camera to estimate the real-world dimensions of objects. Since standard web browsers do not have access to advanced depth sensors (like LiDAR), this tool relies on 'Reference Object Photogrammetry'. By comparing the pixel width of an object of known size (like a credit card) to the pixel width of the unknown object in the same photograph, it calculates the physical dimensions.</p>"
      },
      {
        title: "Step-by-step guide",
        content: "<ol><li><strong>Select a Reference:</strong> Choose a standard object you have nearby, such as a Credit Card or a standard piece of paper.</li><li><strong>Frame the Shot:</strong> Place the reference object directly next to the item you want to measure. It is critical they are at the exact same distance from the camera lens.</li><li><strong>Take Photo:</strong> Capture the image ensuring both objects are clearly visible.</li><li><strong>Calibrate:</strong> Draw a line on the screen exactly across the width of your reference object.</li><li><strong>Measure:</strong> Draw lines across the object you want to measure. The app calculates its real-world dimensions instantly.</li></ol>"
      },
      {
        title: "Practical uses",
        content: "<ul><li><strong>Furniture Shopping:</strong> Estimating the dimensions of a couch or table to see if it will fit in your living room.</li><li><strong>Shipping:</strong> Estimating the dimensions of a box to calculate shipping costs.</li><li><strong>DIY Projects:</strong> Measuring the length of a pipe, board, or window frame without needing a tape measure.</li></ul>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How accurate is the camera measurement?</strong><br>A: Under ideal conditions (good lighting, objects at the exact same depth, camera perfectly parallel), it can be accurate to within a few millimeters. However, perspective distortion can cause errors.</p>
          <p><strong>Q: Why does the reference object have to be at the same distance?</strong><br>A: If the reference object is closer to the camera, it appears larger in pixels. The math relies on both objects experiencing the exact same lens perspective and distance scaling.</p>
          <p><strong>Q: Do my photos get uploaded to your server?</strong><br>A: No! The camera feed and photo processing happen entirely locally within your web browser using HTML5 Canvas. We never see your photos.</p>
          <p><strong>Q: Why do I need a reference object?</strong><br>A: A standard 2D camera image contains no depth information. Without knowing the physical size of at least one thing in the photo, it is mathematically impossible to determine the scale of anything else.</p>
          <p><strong>Q: Can I use a coin as a reference?</strong><br>A: Yes, but larger reference objects (like a piece of A4 paper) yield more accurate results because drawing the calibration line across a larger pixel area reduces the margin of error.</p>
          <p><strong>Q: Does this work on desktop computers?</strong><br>A: Yes, if your desktop has a webcam, you can hold objects up to the camera. However, it is much easier to use on a smartphone or tablet.</p>
          <p><strong>Q: Why does the measurement change when I tilt the camera?</strong><br>A: Tilting introduces perspective foreshortening. For accurate measurements, your camera lens must be perfectly parallel to the surface the objects are resting on.</p>
          <p><strong>Q: Can I measure the height of a building?</strong><br>A: Only if you place a massive reference object right next to the building! For large distant objects, this simple reference method is not suitable.</p>
          <p><strong>Q: Is this an augmented reality (AR) app?</strong><br>A: No, this uses 2D photogrammetry. Native AR apps use device-specific sensors (like Apple's LiDAR) which provide full 3D spatial mapping.</p>
          <p><strong>Q: Does it cost money to use the camera tool?</strong><br>A: No, the camera measurement tool is fully accessible and 100% free.</p>
        `
      }
    ]
  }
};
