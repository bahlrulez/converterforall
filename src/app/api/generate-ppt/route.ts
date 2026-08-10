import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

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
          Return a JSON array of slide objects. Ensure the presentation flows logically.
          Limit to 5-10 slides max. Make the content informative and well-structured.` }]
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
                enum: ["title", "content", "image"]
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
                description: "The main body content. Only use this for the 'content' layout. Write concise sentences, formatted as bullet points separated by new lines (e.g., 'Point 1\\nPoint 2')."
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

    const slides = JSON.parse(text);
    return NextResponse.json({ slides });
  } catch (error: any) {
    console.error("Error generating presentation:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presentation" }, { status: 500 });
  }
}
