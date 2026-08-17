import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// High-quality curated thematic fallback images by keyword
const THEME_IMAGES: Record<string, string[]> = {
  energy: [
    "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80", // Solar panels
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80", // Wind turbines
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80", // Green energy
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", // Chip / Circuit
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", // AI Abstract
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", // Code Matrix
  ],
  business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80", // Modern skyscraper
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Analytics chart
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80", // Team meeting
  ],
  health: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80", // Healthcare lab
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80", // Medical science
  ],
  nature: [
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", // Forest
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Ocean
  ],
  default: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", // Global network
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", // Team workstation
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80", // Modern workspace
  ]
};

function getThematicImage(promptText: string, slideTitle: string, index: number): string {
  const combined = `${promptText} ${slideTitle}`.toLowerCase();
  
  let pool = THEME_IMAGES.default;
  if (combined.includes("solar") || combined.includes("energy") || combined.includes("wind") || combined.includes("green") || combined.includes("renewable")) {
    pool = THEME_IMAGES.energy;
  } else if (combined.includes("ai") || combined.includes("tech") || combined.includes("software") || combined.includes("data") || combined.includes("cloud")) {
    pool = THEME_IMAGES.tech;
  } else if (combined.includes("business") || combined.includes("market") || combined.includes("sales") || combined.includes("finance") || combined.includes("revenue") || combined.includes("pitch")) {
    pool = THEME_IMAGES.business;
  } else if (combined.includes("health") || combined.includes("medical") || combined.includes("pharma") || combined.includes("bio")) {
    pool = THEME_IMAGES.health;
  } else if (combined.includes("environment") || combined.includes("nature") || combined.includes("eco") || combined.includes("tree")) {
    pool = THEME_IMAGES.nature;
  }

  return pool[index % pool.length];
}

export async function POST(req: Request) {
  try {
    const { prompt, slideCount = 6 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { apiVersion: 'v1' }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: `You are an expert keynote presentation designer. Create a high-converting, professional, world-class presentation outline based on: "${prompt}".
          Return a JSON array of exactly ${slideCount} slide objects.
          
          RULES FOR VARIETY & VISUAL APPEAL:
          1. Slide 1 MUST be layout: 'title'. Give it a compelling title and an insightful subtitle.
          2. Include at least 2 or 3 'split' slides (side-by-side text and visual diagram/image).
          3. Include 1 'metrics' slide with 3 impressive numerical KPIs, stats, or metrics relevant to the topic.
          4. Include 1 'quote' slide with an inspiring or thought-provoking industry quote or takeaway.
          5. Ensure bullet points are concise, high-impact, and clean without markdown asterisks.
          6. The very last slide should be an inspiring conclusion, next steps, or Q&A.` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              layout: {
                type: "STRING",
                enum: ["title", "content", "split", "metrics", "quote"],
                description: "The layout type for the slide."
              },
              title: {
                type: "STRING",
                description: "The main heading for the slide."
              },
              subtitle: {
                type: "STRING",
                description: "A short, catchy subtitle (for title slide)."
              },
              content: {
                type: "STRING",
                description: "Main bullet points or quote text separated by new lines."
              },
              quoteAuthor: {
                type: "STRING",
                description: "Author name or role if layout is quote."
              },
              metric1Value: { type: "STRING", description: "Metric 1 number e.g. '$45B', '98.5%', '10x'" },
              metric1Label: { type: "STRING", description: "Metric 1 label e.g. 'Market Opportunity'" },
              metric2Value: { type: "STRING", description: "Metric 2 number" },
              metric2Label: { type: "STRING", description: "Metric 2 label" },
              metric3Value: { type: "STRING", description: "Metric 3 number" },
              metric3Label: { type: "STRING", description: "Metric 3 label" },
              imageKeyword: {
                type: "STRING",
                description: "Specific search keyword for this slide image (e.g., 'solar energy', 'wind turbine')."
              }
            },
            required: ["layout", "title"]
          }
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const rawSlides = JSON.parse(text);
    
    // Auto-attach high-resolution thematic images
    const slides = rawSlides.map((s: any, idx: number) => {
      const thematicImg = getThematicImage(prompt, s.title, idx);
      return {
        ...s,
        image: s.layout === "split" ? thematicImg : undefined
      };
    });

    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error("Error generating presentation:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presentation" }, { status: 500 });
  }
}
