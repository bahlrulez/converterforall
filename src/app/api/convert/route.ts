import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetFormat = formData.get("targetFormat") as string | null;

    if (!file || !targetFormat) {
      return NextResponse.json({ error: "File and target format are required." }, { status: 400 });
    }

    const validFormats = ["png", "jpeg", "jpg", "webp", "avif"];
    if (!validFormats.includes(targetFormat.toLowerCase())) {
      return NextResponse.json({ error: "Unsupported target format for images." }, { status: 400 });
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

    return new Response(convertedBuffer, {
      status: 200,
      headers: {
        "Content-Type": `image/${targetFormat.toLowerCase()}`,
        "Content-Disposition": `attachment; filename="converted.${targetFormat.toLowerCase()}"`,
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: error.message || "Conversion failed." }, { status: 500 });
  }
}
