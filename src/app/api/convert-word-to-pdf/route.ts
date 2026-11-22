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
    const isDoc = fileName.toLowerCase().endsWith(".doc");
    const fileMime = isDoc
      ? "application/msword"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // 1. Primary Engine: Cloudmersive High-Precision Document API (800 Free/Mo)
    const rawKey = process.env.CLOUDMERSIVE_API_KEY;
    const cloudmersiveKey = typeof rawKey === "string" ? rawKey.trim() : "";

    if (cloudmersiveKey) {
      try {
        const cmFormData = new FormData();
        const fileObj = new File([buffer], fileName, { type: fileMime });
        cmFormData.append("inputFile", fileObj);

        console.info(`[Word->PDF] Converting via Cloudmersive API (${buffer.length} bytes, isDoc=${isDoc})...`);

        const cmEndpoint = isDoc
          ? "https://api.cloudmersive.com/convert/autodetect/to/pdf"
          : "https://api.cloudmersive.com/convert/docx/to/pdf";

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
          console.warn(`[Word->PDF] Cloudmersive returned status ${cmRes.status}`);
        }
      } catch (cmErr) {
        console.warn("[Word->PDF] Cloudmersive call failed:", cmErr instanceof Error ? cmErr.message : "Network error");
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

    // If no cloud conversion engines are available or configured, respond with controlled 503 so client uses client-side engine
    return new Response(
      JSON.stringify({
        status: "client_fallback",
        message: "Cloud conversion service is currently unconfigured or unavailable. Falling back to high-fidelity client-side engine.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    console.error("[Word->PDF] Conversion endpoint error occurred");
    return new Response(JSON.stringify({ error: "Conversion service encountered an error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
