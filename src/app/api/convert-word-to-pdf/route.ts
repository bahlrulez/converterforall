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
    let gotenbergUrl = (
      process.env.GOTENBERG_URL ||
      process.env.DOCX_CONVERTER_URL ||
      process.env.LIBREOFFICE_API_URL ||
      ""
    ).trim();

    if (gotenbergUrl) {
      try {
        if (!gotenbergUrl.startsWith("http://") && !gotenbergUrl.startsWith("https://")) {
          gotenbergUrl = `https://${gotenbergUrl}`;
        }
        gotenbergUrl = gotenbergUrl.replace(/\/+$/, "").replace(/\/forms\/libreoffice\/convert\/?$/, "");

        const endpoint = `${gotenbergUrl}/forms/libreoffice/convert`;
        const fileName = file.name || "document.docx";

        const upstreamFormData = new FormData();
        const fileObj = new File([buffer], fileName, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        upstreamFormData.append("files", fileObj);

        console.info(`[Word->PDF] Forwarding ${fileName} (${buffer.length} bytes) to Gotenberg: ${endpoint}`);

        const upstreamRes = await fetch(endpoint, {
          method: "POST",
          body: upstreamFormData,
          signal: AbortSignal.timeout(60000), // 60s timeout to allow for Render cold-starts
        });

        if (upstreamRes.ok) {
          const pdfBuffer = await upstreamRes.arrayBuffer();
          console.info(`[Word->PDF] Success! Received ${pdfBuffer.byteLength} bytes PDF from Gotenberg`);
          return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${fileName.replace(/\.[^/.]+$/, "")}.pdf"`,
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          });
        } else {
          const errText = await upstreamRes.text().catch(() => "");
          console.warn(`[Word->PDF] Gotenberg returned status ${upstreamRes.status}: ${errText}`);
        }
      } catch (upstreamErr) {
        console.warn("[Word->PDF] Gotenberg service unreachable/timeout:", upstreamErr);
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
