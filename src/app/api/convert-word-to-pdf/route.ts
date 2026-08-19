import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Check for Gotenberg / LibreOffice headless microservice
    const gotenbergUrl =
      process.env.GOTENBERG_URL ||
      process.env.DOCX_CONVERTER_URL ||
      process.env.LIBREOFFICE_API_URL;

    if (gotenbergUrl) {
      try {
        const upstreamFormData = new FormData();
        upstreamFormData.append(
          "files",
          new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
          file.name || "document.docx"
        );

        const endpoint = gotenbergUrl.endsWith("/forms/libreoffice/convert")
          ? gotenbergUrl
          : `${gotenbergUrl.replace(/\/$/, "")}/forms/libreoffice/convert`;

        const upstreamRes = await fetch(endpoint, {
          method: "POST",
          body: upstreamFormData,
          signal: AbortSignal.timeout(15000), // 15s timeout
        });

        if (upstreamRes.ok) {
          const pdfBuffer = await upstreamRes.arrayBuffer();
          return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${(file.name || "document").replace(/\.[^/.]+$/, "")}.pdf"`,
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          });
        }
      } catch (upstreamErr) {
        console.warn("Upstream conversion service unreachable:", upstreamErr);
      }
    }

    // If no external Gotenberg instance is configured, respond with 503 so client uses client-side engine
    return new Response(
      JSON.stringify({
        status: "client_fallback",
        message: "No upstream LibreOffice server configured. Falling back to high-fidelity client-side engine.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Word to PDF API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Conversion failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
