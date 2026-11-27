import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60; // 60s max execution

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No PowerPoint file uploaded." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || "presentation.pptx";
    const isLegacyPpt = fileName.toLowerCase().endsWith(".ppt");
    const fileMime = isLegacyPpt
      ? "application/vnd.ms-powerpoint"
      : "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    // 1. Primary Engine: Cloudmersive High-Precision Presentation API (800 Free/Mo)
    const rawKey = process.env.CLOUDMERSIVE_API_KEY;
    const cloudmersiveKey = typeof rawKey === "string" ? rawKey.trim() : "";

    if (cloudmersiveKey) {
      try {
        const cmFormData = new FormData();
        const fileObj = new File([buffer], fileName, { type: fileMime });
        cmFormData.append("inputFile", fileObj);

        console.info(`[PPTX->PDF] Converting via Cloudmersive API (${buffer.length} bytes, isLegacyPpt=${isLegacyPpt})...`);

        const cmEndpoint = isLegacyPpt
          ? "https://api.cloudmersive.com/convert/autodetect/to/pdf"
          : "https://api.cloudmersive.com/convert/pptx/to/pdf";

        const cmRes = await fetch(cmEndpoint, {
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
            console.info(`[PPTX->PDF] Cloudmersive success! Generated ${pdfBuffer.byteLength} bytes PDF`);
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
          console.warn(`[PPTX->PDF] Cloudmersive returned status ${cmRes.status}`);
        }
      } catch (cmErr) {
        console.warn("[PPTX->PDF] Cloudmersive call failed:", cmErr instanceof Error ? cmErr.message : "Network error");
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
          type: fileMime,
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
        console.warn("[PPTX->PDF] Gotenberg service unreachable:", upstreamErr);
      }
    }

    return new Response(
      JSON.stringify({
        error: "High-accuracy server engines unavailable. Switching to in-browser client fallback.",
        status: "client_fallback",
        fallback: true
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    console.error("[PPTX->PDF] Conversion endpoint error occurred");
    return new Response(
      JSON.stringify({ error: "Failed to process PowerPoint conversion." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
