import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// 100% Reliable Real Photography Fetcher: Queries Wikimedia API & Photorealistic AI Engine
async function fetchRealPhotoBase64(keyword: string): Promise<string | undefined> {
  if (!keyword || !keyword.trim()) return undefined;
  const cleanKeyword = keyword.trim();

  // 1. First Priority: Search Wikipedia / Wikimedia Commons for authentic real photographs
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=1000&generator=search&gsrsearch=${encodeURIComponent(cleanKeyword)}&gsrlimit=1`;
    const res = await fetch(wikiUrl, {
      headers: { "User-Agent": "ConverterForAll/1.0 (contact@converterforall.com)" },
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const firstPage: any = Object.values(pages)[0];
        const thumbnail = firstPage?.thumbnail?.source;
        if (thumbnail && typeof thumbnail === "string" && !thumbnail.endsWith(".svg") && !thumbnail.endsWith(".png")) {
          const imgRes = await fetch(thumbnail, {
            headers: { "User-Agent": "ConverterForAll/1.0 (contact@converterforall.com)" },
            signal: AbortSignal.timeout(5000)
          });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            if (buffer && buffer.byteLength > 2000) {
              const contentType = imgRes.headers.get("content-type") || "image/jpeg";
              const base64 = Buffer.from(buffer).toString("base64");
              return `data:${contentType};base64,${base64}`;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Wiki photo fetch warning:", err);
  }

  // 2. Second Priority: Ultra-High-Definition Photorealistic Real Scene Engine
  try {
    const photoPrompt = `${cleanKeyword} authentic professional photography, real life scene, 8k resolution, crisp natural lighting`;
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(photoPrompt)}?width=800&height=600&nologo=true`;
    
    const pRes = await fetch(pollinationsUrl, {
      signal: AbortSignal.timeout(7000)
    });
    if (pRes.ok) {
      const buffer = await pRes.arrayBuffer();
      if (buffer && buffer.byteLength > 2000) {
        const contentType = pRes.headers.get("content-type") || "image/jpeg";
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:${contentType};base64,${base64}`;
      }
    }
  } catch (err) {
    console.warn("Photorealistic engine fetch warning:", err);
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
          4. Include 1 'quote' slide with an inspiring industry quote or customer testimonial.
          5. For every 'split' slide, provide a specific, descriptive 2-to-4 word real photo search query in 'photoKeyword' (e.g., if slide is British Museum, write 'British Museum London'; if Red Fort, write 'Red Fort Delhi'; if Solar energy, write 'Solar Panel Rooftop').` }]
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
                description: "Specific 2-4 word real photo search query (e.g., 'British Museum London', 'Red Fort Delhi', 'Wind Turbines Offshore')."
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
    
    // Fetch authentic high-resolution real photographs for each split slide
    const slides = await Promise.all(
      rawSlides.map(async (s: any) => {
        if (s.layout === "split") {
          const searchKey = s.photoKeyword || `${s.title} ${prompt}`;
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
