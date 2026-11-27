export const lengthToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "nanometers-to-micrometers": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Nanometers vs Micrometers Unit Converter",
        content: "<p>Nanometers (nm) and micrometers (µm, informally called microns) are metric units of length used in optics, microbiology, cleanroom inspection, and semiconductor engineering. One micrometer equals exactly 1,000 nanometers (0.001 mm), making conversion an exact decimal shift of three places without rounding error.</p>"
      },
      {
        title: "How to Convert Nanometers to Micrometers",
        content: "<ol><li><strong>Enter nanometers:</strong> Type the measurement in nm into the input field above (e.g., 450 nm blue light or 2,500 nm particle size).</li><li><strong>Conversion formula:</strong> Divide nanometers by 1,000 using the conversion formula <code>µm = nm / 1000</code> (for example, 500 nm equals 0.5 µm).</li><li><strong>Copy the value:</strong> Copy the computed micrometer output directly into your lab notes, datasheet, or optics calculation.</li></ol>"
      },
      {
        title: "Scientific and Industrial Context",
        content: "<p>Nanometers typically measure visible light wavelengths (400–700 nm), UV spectrum bands, viral particle sizes (20–300 nm), thin-film optical coatings, and semiconductor process nodes, while micrometers measure human hair diameter (~70 µm), bacteria, air filter pore ratings (e.g., 0.3 µm HEPA), and red blood cells (~8 µm).</p><p>Checking cleanroom particle ratings, laser diode wavelengths, and microscope calibration reticles often requires toggling between <code>nm</code> specifications on datasheets and <code>µm</code> tolerances on mechanical inspection drawings.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How many nanometers make one micrometer?</strong><br>A: Exactly 1,000 nanometers equal 1 micrometer. Multiply micrometers by 1,000 to convert back to nanometers.</p>
          <p><strong>Q: Does this calculator apply significant-figure rounding rules?</strong><br>A: No. It computes exact decimal unit conversion from your entered digits inside browser JavaScript without sending values to a server.</p>
        `
      }
    ]
  },
  "nautical-miles-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Nautical Miles vs Statute Miles Unit Converter",
        content: "<p>A Nautical Mile (nmi) is defined by international agreement as exactly 1,852 meters—originally one minute of latitude along any meridian—and serves as the global distance unit in aviation and maritime navigation. A Statute Mile (mi) equals 5,280 feet (1,609.344 meters) for land highways and road signage.</p>"
      },
      {
        title: "How to Convert Nautical Miles to Statute Miles",
        content: "<ol><li><strong>Enter nautical miles:</strong> Type the sea or air leg distance in nautical miles into the unit converter above.</li><li><strong>Conversion formula:</strong> Multiply by the international ratio 1852 / 1609.344 (~1.15078) using <code>miles = nautical miles × 1.15078</code> (so 100 nmi is approximately 115.078 statute miles).</li><li><strong>Copy result:</strong> Copy the converted land-mile figure for flight planning, boat logs, or geography study.</li></ol>"
      },
      {
        title: "Precision and Usage Notes",
        content: "<p>Because 1 knot equals 1 nautical mile per hour, converting marine speeds (for example 20 knots ≈ 23.02 mph) follows the exact same multiplier. This reference unit converter executes in browser JavaScript for quick comparisons and does not account for wind drift, ocean currents, or certified flight computer corrections.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Why is a nautical mile longer than a statute land mile?</strong><br>A: A nautical mile corresponds to one arcminute of latitude along Earth's surface (1,852 meters), whereas a statute land mile is fixed at 5,280 feet (1,609.344 meters).</p>
          <p><strong>Q: How do I convert back from statute miles to nautical miles?</strong><br>A: Divide statute miles by 1.15078 or multiply by approximately 0.868976.</p>
        `
      }
    ]
  },
  "feet-to-yards": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Feet to Yards Unit Converter",
        content: "<p>Converting feet (ft) to yards (yd) is one of the most frequent measurements in US and UK construction, landscaping, fabric buying, carpeting, and athletics. By definition under international Imperial and US Customary standards, <strong>3 feet equal exactly 1 yard</strong> (and 1 yard equals 36 inches).</p>"
      },
      {
        title: "How to Convert Feet to Yards",
        content: "<ol><li><strong>Enter feet:</strong> Type your linear measurement in feet into the input box above (whole numbers or decimals such as 13.5 ft).</li><li><strong>Conversion formula:</strong> Divide feet by 3 using <code>yd = ft / 3</code> (for example, 15 feet equals 5 yards, and 300 feet equals 100 yards).</li><li><strong>Review decimals:</strong> Copy the converted decimal output, or round up when estimating fabric, turf, or fencing material.</li></ol>"
      },
      {
        title: "Common Everyday & Project Examples",
        content: "<p>Dividing by 3 produces repeating decimals whenever feet are not divisible by 3 (for example, 10 feet equals 3.333... yards and 20 feet equals 6.667 yards). Fabric bolts, topsoil yards (cubic area basis), backyard fencing runs, and American football fields (100 yards = 300 feet) all rely on this exact 3:1 unit ratio.</p><p>Landscapers calculating mulch borders, contractors ordering rolled turf, and tailors measuring bolt yardage convert linear feet into yards routinely before placing material orders or estimating area coverage.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How many feet are in a yard?</strong><br>A: Exactly 3 feet equal 1 yard (36 inches).</p>
          <p><strong>Q: How do I convert yards back to feet?</strong><br>A: Multiply the yardage value by 3 using the conversion formula <code>ft = yd × 3</code> inside browser JavaScript.</p>
        `
      }
    ]
  },
  "leagues-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Historical Leagues to Statute Miles Unit Converter",
        content: "<p>A league is a historical unit of distance that originally represented roughly how far a person or horse could walk in one hour of travel. Because early measurements varied by kingdom and terrain before metrication, land leagues, French metric leagues, and maritime nautical leagues differed across centuries.</p>"
      },
      {
        title: "How to Convert Leagues to Miles",
        content: "<ol><li><strong>Enter leagues:</strong> Input the number of leagues into the unit converter above.</li><li><strong>Conversion formula:</strong> Standard English land convention sets 1 league equal to 3 statute miles using <code>Miles = Leagues × 3</code> (so 5 English leagues equals 15 statute miles).</li><li><strong>Note historical regional differences:</strong> Keep regional definitions in mind when interpreting classic French or nautical books.</li></ol>"
      },
      {
        title: "Literature Variations & Modern Context",
        content: "<p>In Jules Verne's <em>Twenty Thousand Leagues Under the Seas</em>, the author used the French metric league (4 km ≈ 2.485 statute miles), making 20,000 leagues roughly 80,000 km (~49,700 miles). Meanwhile a maritime nautical league equals 3 nautical miles (~3.452 statute miles). Today, the league appears almost exclusively in literature, historical geography, and tabletop role-playing games.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How many miles are in one standard English land league?</strong><br>A: One standard English land league equals 3 statute miles (~4.828 kilometers).</p>
          <p><strong>Q: Does this calculator convert nautical or French metric leagues automatically?</strong><br>A: It applies the standard 3 statute miles per English land league ratio inside browser JavaScript; a nautical league equals ~3.452 statute miles.</p>
        `
      }
    ]
  },
  "light-years-to-parsecs": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Light Years to Parsecs Astronomical Unit Converter",
        content: "<p>Light years (ly) and parsecs (pc) measure astronomical distances between stars, nebulae, and galaxies. Despite having the word \"year\" in the name, a light year is a distance unit: how far light travels in vacuum during one Julian year (365.25 days, roughly 9.461 trillion km or 5.879 trillion miles).</p>"
      },
      {
        title: "How to Convert Light Years to Parsecs",
        content: "<ol><li><strong>Enter light years:</strong> Input the stellar or galactic distance in light years above.</li><li><strong>Conversion formula:</strong> Divide by 3.26156 using <code>pc = ly / 3.26156</code> (for example, Proxima Centauri at 4.24 ly is ~1.30 parsecs away, and Sirius at 8.60 ly is ~2.64 pc).</li><li><strong>Copy the value:</strong> Copy the parsec result for astronomy study, physics coursework, or scale comparisons.</li></ol>"
      },
      {
        title: "Why Observational Astronomers Use Parsecs",
        content: "<p>A parsec (parallax of one arcsecond) equals the distance at which 1 astronomical unit (Earth-to-Sun distance) subtends an angle of one arcsecond, tying directly to telescope parallax measurements rather than speed-of-light timing.</p><p>Catalogs published by space observatories like Gaia report stellar distances in parsecs or kiloparsecs, whereas outreach articles and textbooks present those stars in light years—making a direct multiplier handy for celestial charts.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: Is a parsec larger than a light year?</strong><br>A: Yes. One parsec equals approximately 3.26156 light years (about 30.86 trillion kilometers).</p>
          <p><strong>Q: How many light years equal 100 parsecs?</strong><br>A: Multiplying 100 parsecs by 3.26156 gives roughly 326.16 light years.</p>
          <p><strong>Q: Does a light year measure time or distance?</strong><br>A: Physical distance—the path light covers through empty space over one Julian year.</p>
        `
      }
    ]
  },
  "furlongs-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Furlongs to Miles Unit Converter",
        content: "<p>A furlong is an Imperial distance unit standardized at 220 yards (660 feet), or exactly one-eighth (1/8) of a statute mile. Originally derived from \"furrow long\"—the length an ox team plowed before turning—it remains standard in thoroughbred horse racing such as the 10-furlong (1.25-mile) Kentucky Derby and 12-furlong (1.5-mile) Belmont Stakes.</p>"
      },
      {
        title: "How to Convert Furlongs to Miles",
        content: "<ol><li><strong>Enter furlongs:</strong> Type the track or distance figure in furlongs into the unit converter above.</li><li><strong>Conversion formula:</strong> Divide furlongs by 8 using <code>miles = furlongs / 8</code> (or multiply by 0.125; for example, 10 furlongs equals exactly 1.25 miles).</li><li><strong>Copy result:</strong> Copy the exact decimal output generated cleanly inside your browser without sending values remotely.</li></ol>"
      },
      {
        title: "Common Racing Benchmarks & Precision",
        content: "<p>Because 1/8 equals exactly 0.125, whole-furlong measurements produce exact terminating decimals: 4 furlongs = 0.50 miles, 5 furlongs = 0.625 miles, 6 furlongs = 0.75 miles, 8 furlongs = 1.00 mile, and 16 furlongs = 2.00 miles.</p><p>Agricultural land surveys historically paired furlong lengths (660 feet) with chain widths (66 feet) to lay out rectangular 10-acre parcels, tying historic deed records directly to modern statute-mile fractions.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: `
          <p><strong>Q: How many furlongs make one statute mile?</strong><br>A: Exactly 8 furlongs equal 1 statute mile (8 × 660 feet = 5,280 feet).</p>
          <p><strong>Q: How many yards are in one furlong?</strong><br>A: One furlong measures 220 yards (or 660 feet).</p>
          <p><strong>Q: How long is a 6-furlong sprint vs a 10-furlong race?</strong><br>A: Six furlongs equals 0.75 miles (three-quarters of a mile), whereas ten furlongs equals 1.25 miles.</p>
        `
      }
    ]
  }
};
