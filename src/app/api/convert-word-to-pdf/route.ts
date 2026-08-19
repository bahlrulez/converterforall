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

    const fileName = file.name || "document.docx";

    // 1. Primary Engine: Cloudmersive High-Precision Document API (800 Free/Mo)
    const cloudmersiveKey = (
      process.env.CLOUDMERSIVE_API_KEY ||
      "6c6b59af-1066-4eab-9d23-0ad8fa8f4b60"
    ).trim();

    if (cloudmersiveKey) {
      try {
        const cmFormData = new FormData();
        const fileObj = new File([buffer], fileName, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        cmFormData.append("inputFile", fileObj);

        console.info(`[Word->PDF] Converting via Cloudmersive API (${buffer.length} bytes)...`);

        const cmRes = await fetch("https://api.cloudmersive.com/convert/docx/to/pdf", {
          method: "POST",
          headers: {
            "Apikey": cloudmersiveKey,
          },
          body: cmFormData,
          signal: AbortSignal.timeout(30000),
        });

        if (cmRes.ok) {
          const pdfBuffer = await cmRes.arrayBuffer();
          if (pdfBuffer.byteLength > 100) {
            console.info(`[Word->PDF] Cloudmersive success! Generated ${pdfBuffer.byteLength} bytes PDF`);
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
          }
        } else {
          const errText = await cmRes.text().catch(() => "");
          console.warn(`[Word->PDF] Cloudmersive returned ${cmRes.status}: ${errText}`);
        }
      } catch (cmErr) {
        console.warn("[Word->PDF] Cloudmersive call error:", cmErr);
      }
    }

    // 2. Secondary Engine: Gotenberg / LibreOffice Headless Microservice
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
        const upstreamFormData = new FormData();
        const fileObj = new File([buffer], fileName, {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        upstreamFormData.append("files", fileObj);

        const upstreamRes = await fetch(endpoint, {
          method: "POST",
          body: upstreamFormData,
          signal: AbortSignal.timeout(30000),
        });

        if (upstreamRes.ok) {
          const pdfBuffer = await upstreamRes.arrayBuffer();
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
        }
      } catch (upstreamErr) {
        console.warn("[Word->PDF] Gotenberg service unreachable:", upstreamErr);
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
