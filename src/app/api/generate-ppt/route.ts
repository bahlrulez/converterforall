import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { prompt, slideCount = 6 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." }, { status: 500 });
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
          parts: [{ text: `Create a professional presentation outline based on the following request: "${prompt}".
          Return a JSON array of exactly ${slideCount} slide objects. Ensure the presentation flows logically.
          CRITICAL: You MUST include at least 2 or 3 slides with the 'split' layout (text on one side, image on the other) to make the presentation visually engaging. 
          EVERY slide must have 'content', even 'split' layouts. Make the text content informative and well-structured.
          The VERY LAST slide MUST be a professional closing/Thank You slide summarizing the presentation or providing contact info/next steps.` }]
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
                enum: ["title", "content", "split"],
                description: "The layout type for the slide. You MUST use 'split' for at least 2 or 3 slides to make the presentation visually engaging. 'split' means it will have an AI generated image."
              },
              title: {
                type: "STRING",
                description: "The main heading for the slide."
              },
              subtitle: {
                type: "STRING",
                description: "A short, catchy subtitle. Only use this for the 'title' layout."
              },
              content: {
                type: "STRING",
                description: "The main body content. Use this for both 'content' and 'split' layouts. Write concise sentences, formatted as bullet points separated by new lines (e.g., 'Point 1\\nPoint 2'). EVERY SLIDE (except title) MUST HAVE CONTENT."
              },
              imagePrompt: {
                type: "STRING",
                description: "Required ONLY if layout is 'split'. A detailed prompt to generate an image for this slide (e.g., 'Professional photograph of beautiful alpine scenery in Queenstown, highly detailed')."
              }
            },
            required: ["layout", "title", "content"]
          }
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const slides = JSON.parse(text);
    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error("Error generating presentation:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presentation" }, { status: 500 });
  }
}
