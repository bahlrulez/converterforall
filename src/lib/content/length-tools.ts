export const lengthToolsContent: Record<string, { sections: { title: string, content: string }[], disableAutoEnrich?: boolean }> = {
  "nanometers-to-micrometers": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Nanometers vs Micrometers",
        content: "Nanometers (nm) and micrometers (µm, often informally referred to as microns) are both microscopic metric units of length utilized in science and manufacturing. Because they are both based on the metric system, their relationship is an exact factor of one thousand. Specifically, one micrometer is equal to exactly 1,000 nanometers. They are the standard baseline units used to measure microscopic structures like human cells, bacteria, and modern semiconductor manufacturing nodes."
      },
      {
        title: "How to Convert nm to µm",
        content: "To convert a measurement from nanometers to micrometers, you simply divide the nanometer value by 1,000. This is mathematically equivalent to moving the decimal point three places to the left. <ul><li><strong>Conversion Formula:</strong> <code>µm = nm / 1000</code></li><li><strong>Worked Example:</strong> If you have a measurement of 500 nm, dividing 500 by 1,000 results in exactly 0.5 µm.</li></ul> This calculator performs this basic arithmetic instantly in your browser."
      },
      {
        title: "Scientific and Industrial Context",
        content: "Nanometers (nm) are typically used in physics and engineering to measure the exact wavelengths of visible light (which span from 400 to 700 nm), the size of individual viruses (ranging from 20 to 300 nm), and the transistor nodes in cutting-edge computer processors (such as 3 nm or 5 nm architecture). Micrometers (µm), being a thousand times larger, are usually employed in biology and manufacturing to measure the diameter of a human hair (approximately 70 µm), red blood cells (about 8 µm), and standard bacteria."
      },
      {
        title: "Accuracy and Limitations",
        content: "Please note that while this tool provides mathematically precise decimal conversions between the two units based on the metric system, it is purely a mathematical calculator. It does not perform physical scientific measurements, nor does it account for significant figures or measurement uncertainty inherent in actual microscopic observation."
      }
    ]
  },
  "nautical-miles-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Nautical Miles vs Statute Miles",
        content: "A Nautical Mile (nmi) is a specialized unit of measurement specifically based on the physical circumference of the Earth. It is defined as exactly one minute of latitude along any meridian. This geographical basis makes it absolutely essential for global air and marine navigation. In contrast, a standard Statute Mile (mi) is a traditional land-based measurement defined historically as exactly 5,280 feet."
      },
      {
        title: "Conversion Formula and Relationship",
        content: "A nautical mile is significantly longer than a standard statute mile. By international agreement, exactly one nautical mile is equivalent to 1.15078 statute miles. <ul><li><strong>Conversion Formula:</strong> <code>miles = nautical miles × 1.15078</code></li><li><strong>Worked Example:</strong> A cargo ship traveling a distance of 100 nautical miles has covered a physical distance of approximately 115.078 standard miles.</li></ul> The calculator handles this multiplication directly to provide quick conversions."
      },
      {
        title: "Aviation and Maritime Context",
        content: "Because the Earth is a sphere, navigating across vast oceans or through the sky requires a measurement system inherently tied to degrees of longitude and latitude. Since one nautical mile represents exactly one minute of arc along a meridian, maritime navigators and pilots can easily read distances directly off a standard navigational chart without needing complex mathematical conversion tables."
      },
      {
        title: "Precision and Usage Notes",
        content: "This tool uses the exact international conversion factor of 1.15078 to compute distances. However, it is a general-purpose unit calculator intended for quick reference and educational use. It does not account for the oblate spheroid shape of the Earth in advanced geodetic calculations, and should not be used as a substitute for certified navigation-grade flight computers or marine GPS systems."
      }
    ]
  },
  "feet-to-yards": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Feet to Yards Relationship",
        content: "Converting feet (ft) to yards (yd) is one of the most common and fundamental everyday calculations in the United States Customary measurement system. The relationship is simple and exact: there are exactly 3 feet contained within 1 yard. Both units are widely used in construction, landscaping, and sports across the US and the UK."
      },
      {
        title: "How to Convert Feet to Yards",
        content: "To find the yardage of a measurement that is currently provided in feet, you simply perform basic division by dividing the total number of feet by 3. <ul><li><strong>Conversion Formula:</strong> <code>yd = ft / 3</code></li><li><strong>Worked Example:</strong> If a room is 15 feet long, dividing 15 by 3 reveals that the room is exactly 5 yards long.</li></ul> For the reverse conversion (yards to feet), you simply multiply the yardage by 3."
      },
      {
        title: "Common Contexts and Applications",
        content: "You will frequently encounter the need for this specific conversion during home improvement projects, such as ordering bolts of fabric, purchasing rolls of carpet, estimating poured concrete volume, or reviewing architectural floor plans where both units are often mixed. It is also deeply ingrained in sports, most notably in American football, where the 100-yard field is frequently discussed in terms of feet during specific play analyses."
      },
      {
        title: "Rounding Considerations",
        content: "Because dividing by 3 often results in repeating decimals (for example, 10 feet divided by 3 is 3.333... yards), this calculator utilizes floating-point arithmetic to provide a highly precise decimal output. In practical construction scenarios, you will typically round up to the nearest whole yard to ensure you purchase enough material."
      }
    ]
  },
  "meters-to-kilometers": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Metric System Conversion",
        content: "The metric system is elegantly designed entirely around multiples of 10, making unit conversions mathematically simple and intuitive. The standard prefix \"kilo-\" explicitly translates to one thousand. Therefore, by definition, there are exactly 1,000 meters (m) contained within a single kilometer (km). This standardization is the foundation of modern scientific measurement and international travel, ensuring that distance calculations remain universally consistent across different borders and industries."
      },
      {
        title: "How to Convert Meters to Kilometers",
        content: "To convert a distance from meters to kilometers, you divide the total number of meters by 1,000. In practical terms, this is as simple as moving the decimal point exactly three places to the left. <ul><li><strong>Conversion Formula:</strong> <code>km = m / 1000</code></li><li><strong>Worked Example:</strong> If you run a standard 5,000-meter race (commonly referred to as a 5K), dividing 5,000 by 1,000 confirms the distance is exactly 5.0 kilometers.</li></ul> For the reverse calculation, converting kilometers back into meters, you simply multiply the kilometer value by 1,000."
      },
      {
        title: "Everyday Contexts and Applications",
        content: "While meters are the standard base unit used to measure relatively short distances—such as the length of an Olympic swimming pool, the height of a skyscraper, or the dimensions of a running track—kilometers are the globally accepted standard for macroscopic distances. Kilometers are used worldwide for geographical mapping, calculating highway driving distances, tracking long-distance endurance workouts like cycling and marathons, and planning commercial aviation flight paths. Understanding this basic conversion is essential for international travel and global logistics."
      },
      {
        title: "Decimal Precision and Calculator Behavior",
        content: "Because this conversion is a strict division by a power of ten, it never results in irrational or infinitely repeating decimals. The conversion is always perfectly exact, regardless of the input size. This calculator handles the decimal shifting securely in your web browser to provide an instantaneous, error-free result. It is fully capable of processing very large numbers as well as microscopic fractional inputs, ensuring high precision for all standard engineering and everyday needs without transmitting your data."
      }
    ]
  },
  "leagues-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "The Historical Context of the League",
        content: "A league is a fascinating historical unit of distance that originally represented the physical distance a person or a horse could reasonably walk in one hour. Because of its informal and practical origin, the exact mathematical length of a league was never globally standardized. It varied wildly across different centuries, different European countries, and different terrains (such as a land league versus a nautical sea league)."
      },
      {
        title: "Standard Leagues to Miles Conversion",
        content: "In the modern English-speaking world, when historical texts are translated, a standard English land league is generally mathematically agreed to be exactly 3 statute miles (which equates to roughly 4.828 kilometers). <ul><li><strong>Standard English Formula:</strong> <code>Miles = Leagues × 3</code></li><li><strong>Worked Example:</strong> A journey of 5 English leagues is equivalent to exactly 15 statute miles.</li></ul> However, it is vital to note that a nautical league is defined as 3 nautical miles, which translates to approximately 3.45 statute miles."
      },
      {
        title: "Variations in Literature",
        content: "Because historical leagues varied by region, it is important not to treat the 3-mile definition as universally identical across all texts. For example, in Jules Verne's famous novel \"20,000 Leagues Under the Sea,\" the author utilized the French metric league (the lieue), which is officially defined as exactly 4 kilometers, or about 2.48 statute miles."
      },
      {
        title: "Modern Obsolescence",
        content: "Today, the league is an entirely obsolete unit of measurement. It is no longer used in modern maritime navigation, scientific literature, or international law. You will almost exclusively encounter the term when reading historical fiction, classical poetry, or when playing fantasy role-playing games."
      }
    ]
  },
  "light-years-to-parsecs": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Understanding Astronomical Distances",
        content: "Both light years (ly) and parsecs (pc) are advanced astronomical units used by astrophysicists to measure the unimaginably vast distances between stars, nebulae, and galaxies. Despite containing the word \"year\" in its name, a light year measures physical distance, not time. It is defined as the exact distance that light travels in a vacuum in one Earth year, which equals approximately 5.88 trillion miles (or 9.46 trillion kilometers)."
      },
      {
        title: "How to Convert Light Years to Parsecs",
        content: "A parsec (short for parallax second) is a unit of length even larger than a light year. By definition, one parsec is equivalent to approximately 3.26156 light years. <ul><li><strong>Conversion Formula:</strong> <code>pc = ly / 3.26156</code></li><li><strong>Worked Example:</strong> The closest star to our solar system, Proxima Centauri, is located roughly 4.24 light years away. Dividing 4.24 by 3.26156 reveals that it is located approximately 1.30 parsecs away.</li></ul>"
      },
      {
        title: "Why Astronomers Prefer Parsecs",
        content: "While light years are incredibly popular in science fiction and public science communication because they are intuitive to visualize, professional astronomers almost exclusively use parsecs in their research. A parsec is mathematically derived directly from the observable parallax angles of stars as the Earth orbits the Sun. This makes it a much more useful and direct raw measurement for observational astrophysics calculations."
      },
      {
        title: "Precision and Calculator Usage",
        content: "This tool performs basic arithmetic conversion using the accepted 3.26156 constant. It is a mathematical unit converter and does not perform actual astronomical observation or complex spatial coordinate transformations. Due to the massive scale of these units, minor rounding in the decimal places can represent billions of miles, so standard scientific precision guidelines apply."
      }
    ]
  },
  "furlongs-to-miles": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "What is a Furlong?",
        content: "A furlong is a traditional Imperial measurement of distance with deep agrarian roots dating back to the early medieval period. Originally, it represented a \"furrow long\"—the physical distance a team of oxen could plow a field in a straight line before needing to stop, rest, and turn around. In modern standardized measurements, a furlong is defined as exactly 220 yards, or 660 feet. Most importantly for this specific mathematical calculation, it is exactly equivalent to one-eighth (1/8) of a standard statute mile."
      },
      {
        title: "Furlongs to Miles Conversion Formula",
        content: "Because a furlong is officially standardized as exactly 1/8th of a mile, converting it into miles requires straightforward division. <ul><li><strong>Conversion Formula:</strong> <code>miles = furlongs / 8</code></li><li><strong>Worked Example:</strong> If a race track is 10 furlongs long, dividing 10 by 8 reveals the distance is exactly 1.25 miles.</li></ul> The reverse conversion simply requires multiplying the mileage by 8. This mathematical relationship has remained constant since it was formally codified in England centuries ago."
      },
      {
        title: "Equestrian and Racing Context",
        content: "While the furlong is completely obsolete in everyday modern life, urban planning, and civil engineering, it stubbornly remains the global standard unit of distance measurement in international horse racing. The distances of the most famous thoroughbred races in the world are officially tracked, intensely debated by handicappers, and historically recorded in furlongs. For example, the legendary Kentucky Derby is officially run as a 10-furlong race, which equates to exactly one and a quarter miles on the dirt track."
      },
      {
        title: "Local Browser Calculation and Precision",
        content: "This calculator performs the furlong-to-mile division mathematics entirely locally in your web browser environment. Because the calculation relies on a simple division by 8, the resulting decimals are clean and finite (such as 0.125 for a single furlong). No data is ever transmitted to an external server, ensuring an instantaneous, highly accurate, and completely private calculation experience for your sports analysis, historical reading, or general curiosity needs."
      }
    ]
  }
};
