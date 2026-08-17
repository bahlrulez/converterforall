import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Server-side photo fetcher: fetches real photographic images and converts to Base64 JPEG
async function fetchRealPhotoBase64(keyword: string): Promise<string | undefined> {
  const cleanKeyword = encodeURIComponent(keyword.trim().replace(/[^a-zA-Z0-9\s]/g, ""));
  
  // 1. Try fetching high-res photography from curated photo sources
  const candidateUrls = [
    `https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80`, // fallback
    `https://loremflickr.com/800/600/${cleanKeyword}/all`,
  ];

  // If keyword matches known famous topics or cities, use verified high-res photos
  const kw = keyword.toLowerCase();
  let directUrl = "";
  if (kw.includes("delhi") || kw.includes("red fort") || kw.includes("qutub") || kw.includes("india")) {
    directUrl = "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80"; // India Gate / Delhi
  } else if (kw.includes("mumbai") || kw.includes("gateway")) {
    directUrl = "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80"; // Mumbai Gateway
  } else if (kw.includes("solar") || kw.includes("renewable") || kw.includes("energy")) {
    directUrl = "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80"; // Solar
  } else if (kw.includes("wind") || kw.includes("turbine")) {
    directUrl = "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80"; // Wind
  } else if (kw.includes("ai") || kw.includes("tech") || kw.includes("robot") || kw.includes("software")) {
    directUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"; // Tech
  } else if (kw.includes("business") || kw.includes("finance") || kw.includes("money") || kw.includes("market")) {
    directUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"; // Skyscraper
  } else if (kw.includes("food") || kw.includes("culinary") || kw.includes("cooking")) {
    directUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"; // Food
  } else if (kw.includes("health") || kw.includes("medical") || kw.includes("doctor")) {
    directUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"; // Health
  } else if (kw.includes("nature") || kw.includes("travel") || kw.includes("forest")) {
    directUrl = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80"; // Nature
  }

  const urlsToTry = directUrl ? [directUrl, ...candidateUrls] : [`https://loremflickr.com/800/600/${cleanKeyword}/all`, ...candidateUrls];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, { 
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        if (buffer && buffer.byteLength > 1000) {
          const contentType = res.headers.get("content-type") || "image/jpeg";
          const base64 = Buffer.from(buffer).toString("base64");
          return `data:${contentType};base64,${base64}`;
        }
      }
    } catch {
      // try next
    }
  }

  return undefined;
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
          parts: [{ text: `You are an expert keynote presentation designer. Create a high-converting, professional presentation outline based on: "${prompt}".
          Return a JSON array of exactly ${slideCount} slide objects.
          
          RULES:
          1. Slide 1 MUST be layout: 'title'. Compelling title and insightful subtitle.
          2. Include at least 2 or 3 'split' slides (side-by-side text and high-res photographic visual).
          3. Include 1 'metrics' slide with 3 impressive numerical stats or KPIs.
          4. Include 1 'quote' slide with an inspiring or thought-provoking industry quote or customer testimonial.
          5. For every 'split' slide, provide a specific, descriptive 2-to-3 word photographic search keyword (e.g., 'delhi landmarks', 'solar rooftop', 'qutub minar', 'mumbai skyline', 'financial charts') in the 'photoKeyword' field.` }]
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
              photoKeyword: {
                type: "STRING",
                description: "Specific 2-3 word real photo keyword (e.g., 'delhi landmarks', 'red fort', 'modern solar panels')."
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
    
    // Auto-fetch real photographic Base64 images for split slides in parallel
    const slides = await Promise.all(
      rawSlides.map(async (s: any) => {
        if (s.layout === "split") {
          const searchKey = s.photoKeyword || s.title || prompt;
          const photoBase64 = await fetchRealPhotoBase64(searchKey);
          return {
            ...s,
            image: photoBase64
          };
        }
        return s;
      })
    );

    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error("Error generating presentation:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presentation" }, { status: 500 });
  }
}
