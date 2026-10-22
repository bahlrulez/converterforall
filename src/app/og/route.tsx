import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const CACHE_HEADERS = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTitle = searchParams.get("title") || "Free Online File Converter";
    const rawCat = searchParams.get("cat") || "Tools";

    const title = rawTitle.slice(0, 100);
    const cat = rawCat.slice(0, 40);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            backgroundColor: "#060b19",
            padding: "60px 80px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Brand Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              C
            </div>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
              ConverterForAll
            </span>
            <span
              style={{
                marginLeft: "16px",
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(37, 99, 235, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                color: "#60a5fa",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {cat} Tool
            </span>
          </div>

          {/* Center Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1040px" }}>
            <div
              style={{
                fontSize: title.length > 35 ? "48px" : "58px",
                fontWeight: 900,
                color: "#f8fafc",
                lineHeight: 1.15,
                letterSpacing: "-1px",
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: "22px", color: "#94a3b8", lineHeight: 1.4 }}>
              Fast, private in-browser utility. Your documents stay on your device.
            </div>
          </div>

          {/* Footer Guarantee Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(148, 163, 184, 0.15)",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "24px", color: "#38bdf8", fontSize: "16px", fontWeight: 600 }}>
              <span>✓ In-Browser Processing</span>
              <span>✓ No Registration</span>
              <span>✓ No Watermarks</span>
            </div>
            <span style={{ color: "#64748b", fontSize: "16px", fontWeight: 500 }}>
              converterforall.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: CACHE_HEADERS,
      }
    );
  } catch (err) {
    // Guaranteed 200 fallback so this route CAN NEVER return a 5xx response
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#060b19",
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: 800,
          }}
        >
          ConverterForAll — Free In-Browser Utilities
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: CACHE_HEADERS,
      }
    );
  }
}
