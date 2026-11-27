export const automotiveToolsContent: Record<string, { disableAutoEnrich?: boolean; sections: { title: string, content: string }[] }> = {
  "mileage-calculator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "How to Measure Real-World Car Mileage (Tank-to-Tank Method)",
        content: "To estimate your car's real-world fuel economy rather than relying solely on dashboard displays, use the full-tank method: fill your fuel tank completely, reset your trip odometer to zero, and drive normally. On your next visit to the petrol pump, fill the tank completely once more and note the fuel added (gallons or liters) alongside the distance (in miles or kilometers) on your trip odometer. Inputting these numbers into this calculator gives you a practical real-world fuel economy estimate."
      },
      {
        title: "Step-by-step mileage calculation guide",
        content: "<ol><li><strong>Choose Imperial or Metric units:</strong> Toggle between Miles/Gallons or Kilometers/Liters in the calculator above.</li><li><strong>Enter trip distance and fuel volume:</strong> Type the distance traveled since your last full tank and the exact amount of fuel added at refill.</li><li><strong>Review MPG, L/100km, and km/L:</strong> Inspect the computed fuel consumption metrics directly on the page.</li></ol>"
      },
      {
        title: "Calculating MPG, L/100km, and km/L",
        content: "<p>In Imperial units, <code>MPG = Distance (miles) / Fuel Added (gallons)</code>—higher values indicate better fuel economy. In Metric regions, fuel consumption is often written as <code>L/100km = (Fuel Used (liters) / Distance (km)) × 100</code> (lower is more efficient) alongside <code>km/L = Distance (km) / Fuel Added (liters)</code>.</p>"
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: Why does calculated mileage differ from the car's dashboard display?</strong><br>A: Dashboard fuel-economy displays are estimates and may differ from pump-based calculations. Their accuracy and calculation methods vary by vehicle and driving conditions. Recording distance between consecutive full-tank refills over two or three tanks provides a more representative average.</p><p><strong>Q: Does city driving significantly reduce fuel economy compared to highway driving?</strong><br>A: Yes. Stop-and-go city traffic requires frequent acceleration from a stop, whereas steady highway cruising lets the engine hold lower RPMs.</p><p><strong>Q: Is this mileage calculator private?</strong><br>A: Yes. The arithmetic runs inside your web browser with no calculation inputs sent to an external server.</p>"
      }
    ]
  },
  "fuel-calculator": {
    disableAutoEnrich: true,
    sections: [
      {
        title: "Calculate Your Road Trip Costs",
        content: "The fuel cost calculator estimates the fuel volume and pump spend required for a planned trip. By entering your trip distance, your vehicle's average fuel efficiency, and the price of petrol or diesel per gallon or liter, you can budget travel expenses or split gas costs. All math runs locally inside your browser without sending your trip figures to a server."
      },
      {
        title: "Step-by-step trip fuel calculator guide",
        content: "<ol><li><strong>Pick Imperial or Metric units:</strong> Choose Miles &amp; Gallons or Kilometers &amp; Liters.</li><li><strong>Enter distance, vehicle efficiency, and fuel price:</strong> Input trip distance, average MPG or L/100km, and local price per unit.</li><li><strong>Review estimated cost and fuel consumption:</strong> Inspect total required fuel volume and estimated trip spend.</li></ol>"
      },
      {
        title: "Cost Calculation Formulas (Imperial & Metric)",
        content: "<p>In Imperial mode, required volume is <code>Gallons = Distance (miles) / MPG</code> and <code>Total Cost = Gallons × Price per Gallon</code>. In Metric mode, volume uses <code>Liters = (Distance (km) / 100) × L/100km</code> multiplied by the fuel price per liter.</p>"
      },
      {
        title: "Important Limitations",
        content: "This fuel cost calculator provides arithmetic estimates from the static values you enter. It does not query live petrol pump pricing APIs, account for hilly terrain, traffic idling, or toll fees, so real pump totals may vary slightly."
      },
      {
        title: "Frequently Asked Questions",
        content: "<p><strong>Q: How do I find my car's fuel efficiency before entering it?</strong><br>A: Check your dashboard trip computer or measure tank-to-tank mileage using our Mileage Calculator based on your real driving mix.</p><p><strong>Q: Are my trip figures sent to a server?</strong><br>A: No. The cost calculation runs inside JavaScript in your browser without sending your numbers to a backend service.</p>"
      }
    ]
  }
};
