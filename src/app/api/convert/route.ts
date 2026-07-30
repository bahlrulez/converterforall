import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileBase64, targetFormat } = body;

    if (!fileBase64 || !targetFormat) {
      return NextResponse.json({ error: "File data and target format are required." }, { status: 400 });
    }

    const validFormats = ["png", "jpeg", "jpg", "webp", "avif"];
    if (!validFormats.includes(targetFormat.toLowerCase())) {
      return NextResponse.json({ error: "Unsupported target format for images." }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, "base64");

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

    const base64Data = convertedBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      format: targetFormat.toLowerCase(),
      data: base64Data,
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: error.message || "Conversion failed." }, { status: 500 });
  }
}
