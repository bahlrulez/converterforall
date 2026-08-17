// Generates high-definition, guaranteed local SVG/Canvas abstract slide artwork with zero network dependencies

export function getAbstractSlideGraphic(topic: string = "tech", accentColor: string = "#2563EB", bgCardColor: string = "#1E293B"): string {
  const t = topic.toLowerCase();
  
  // Custom abstract visual presets by category
  if (t.includes("solar") || t.includes("energy") || t.includes("green") || t.includes("renewable")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bgCardColor}" />
            <stop offset="100%" stop-color="#022c22" />
          </linearGradient>
          <linearGradient id="accentG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" rx="32" fill="url(#g1)" />
        <circle cx="400" cy="240" r="140" fill="url(#accentG)" opacity="0.85" />
        <path d="M100 500 L300 380 L500 440 L700 320 L750 500 Z" fill="#047857" opacity="0.6" />
        <path d="M150 540 L350 420 L550 480 L750 360 L800 540 Z" fill="#065f46" opacity="0.9" />
        <!-- Sun Rays & Solar Grid -->
        <line x1="400" y1="50" x2="400" y2="80" stroke="#FBBF24" stroke-width="6" stroke-linecap="round"/>
        <line x1="260" y1="100" x2="280" y2="120" stroke="#FBBF24" stroke-width="6" stroke-linecap="round"/>
        <line x1="540" y1="100" x2="520" y2="120" stroke="#FBBF24" stroke-width="6" stroke-linecap="round"/>
        <circle cx="400" cy="240" r="180" stroke="#F59E0B" stroke-width="2" stroke-dasharray="12 8" fill="none" opacity="0.4" />
      </svg>
    `)}`;
  }

  if (t.includes("ai") || t.includes("tech") || t.includes("data") || t.includes("software") || t.includes("cloud")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bgCardColor}" />
            <stop offset="100%" stop-color="#090D16" />
          </linearGradient>
          <linearGradient id="pulseG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${accentColor}" />
            <stop offset="100%" stop-color="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" rx="32" fill="url(#g1)" />
        <!-- Abstract Neural Grid Nodes -->
        <circle cx="400" cy="300" r="160" stroke="${accentColor}" stroke-width="2" fill="none" opacity="0.3"/>
        <circle cx="400" cy="300" r="90" fill="url(#pulseG)" opacity="0.8"/>
        <circle cx="200" cy="200" r="30" fill="${accentColor}" opacity="0.6"/>
        <circle cx="600" cy="200" r="40" fill="#8B5CF6" opacity="0.7"/>
        <circle cx="220" cy="420" r="35" fill="#06B6D4" opacity="0.6"/>
        <circle cx="580" cy="420" r="30" fill="${accentColor}" opacity="0.6"/>
        <!-- Node Link Lines -->
        <line x1="200" y1="200" x2="400" y2="300" stroke="${accentColor}" stroke-width="3" opacity="0.5"/>
        <line x1="600" y1="200" x2="400" y2="300" stroke="#8B5CF6" stroke-width="3" opacity="0.5"/>
        <line x1="220" y1="420" x2="400" y2="300" stroke="#06B6D4" stroke-width="3" opacity="0.5"/>
        <line x1="580" y1="420" x2="400" y2="300" stroke="${accentColor}" stroke-width="3" opacity="0.5"/>
        <line x1="200" y1="200" x2="220" y2="420" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6 6" opacity="0.4"/>
        <line x1="600" y1="200" x2="580" y2="420" stroke="#8B5CF6" stroke-width="2" stroke-dasharray="6 6" opacity="0.4"/>
      </svg>
    `)}`;
  }

  if (t.includes("business") || t.includes("finance") || t.includes("market") || t.includes("growth") || t.includes("revenue") || t.includes("pitch")) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bgCardColor}" />
            <stop offset="100%" stop-color="#0a192f" />
          </linearGradient>
          <linearGradient id="barG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${accentColor}" />
            <stop offset="100%" stop-color="#3B82F6" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" rx="32" fill="url(#g1)" />
        <!-- Abstract Growth Bars -->
        <rect x="160" y="340" width="80" height="180" rx="16" fill="url(#barG)" opacity="0.5" />
        <rect x="280" y="270" width="80" height="250" rx="16" fill="url(#barG)" opacity="0.7" />
        <rect x="400" y="200" width="80" height="320" rx="16" fill="url(#barG)" opacity="0.85" />
        <rect x="520" y="120" width="80" height="400" rx="16" fill="${accentColor}" />
        <!-- Trend Curve Line -->
        <path d="M140 370 Q 320 280, 440 180 T 620 90" fill="none" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" />
        <circle cx="620" cy="90" r="14" fill="#F59E0B" />
      </svg>
    `)}`;
  }

  // Default Abstract Modern Geometry
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgCardColor}" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
        <linearGradient id="blobG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentColor}" />
          <stop offset="100%" stop-color="#6366F1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="32" fill="url(#g1)" />
      <circle cx="450" cy="300" r="190" fill="url(#blobG)" opacity="0.75" />
      <circle cx="280" cy="220" r="110" fill="${accentColor}" opacity="0.5" />
      <rect x="180" y="320" width="220" height="140" rx="24" fill="#1E293B" opacity="0.8" stroke="${accentColor}" stroke-width="2" />
      <circle cx="560" cy="420" r="60" fill="#38BDF8" opacity="0.6" />
    </svg>
  `)}`;
}
