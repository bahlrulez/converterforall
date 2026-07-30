import { NextRequest } from "next/server";
import sharp from "sharp";

// Force Node.js runtime for Sharp compatibility on Vercel
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetFormat = formData.get("targetFormat") as string | null;

    if (!file || !targetFormat) {
      return new Response(JSON.stringify({ error: "File and target format are required." }), { status: 400 });
    }

    const validFormats = ["png", "jpeg", "jpg", "webp", "avif"];
    if (!validFormats.includes(targetFormat.toLowerCase())) {
      return new Response(JSON.stringify({ error: "Unsupported target format for images." }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let sharpInstance = sharp(buffer);

    switch (targetFormat.toLowerCase()) {
      case "png":
        sharpInstance = sharpInstance.png();
        break;
      case "jpeg":
      case "jpg":
        sharpInstance = sharpInstance.jpeg();
        break;
      case "webp":
        sharpInstance = sharpInstance.webp();
        break;
      case "avif":
        sharpInstance = sharpInstance.avif();
        break;
    }

    const convertedBuffer = await sharpInstance.toBuffer();
    
    if (!convertedBuffer || convertedBuffer.length === 0) {
      return new Response(JSON.stringify({ error: "Conversion produced an empty file." }), { status: 500 });
    }

    // Option B: Return pure binary stream with explicit Content-Length
    return new Response(convertedBuffer, {
      status: 200,
      headers: {
        "Content-Type": `image/${targetFormat.toLowerCase()}`,
        "Content-Disposition": `attachment; filename="converted.${targetFormat.toLowerCase()}"`,
        "Content-Length": convertedBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return new Response(JSON.stringify({ error: error.message || "Conversion failed." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
