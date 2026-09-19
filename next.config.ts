import type { NextConfig } from "next";
import { SLUG_ALIASES } from "./src/lib/tools-db";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  async redirects() {
    const legacyRedirects = [
      {
        source: "/kruti-to-unicode",
        destination: "/krutidev-to-unicode",
        permanent: true,
      },
      {
        source: "/unicode-to-ams",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/images-to-pdf",
        destination: "/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/unicode-to-hindi",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/unicode-to-mangal",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/base64-decoder",
        destination: "/base64-encoder-decoder",
        permanent: true,
      },
      {
        source: "/merge-image",
        destination: "/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/merge-video",
        destination: "/video-compressor",
        permanent: true,
      },
      {
        source: "/webm-to-wmv",
        destination: "/video-to-wmv",
        permanent: true,
      },
      {
        source: "/mkv-to-jpg",
        destination: "/video-to-jpg",
        permanent: true,
      },
      {
        source: "/m4v-decode",
        destination: "/video-to-mp4",
        permanent: true,
      },
      {
        source: "/sample-detector",
        destination: "/font-detector",
        permanent: true,
      },
      {
        source: "/unity-to-meters",
        destination: "/meters-to-kilometers",
        permanent: true,
      },
      {
        source: "/mp3-to-png",
        destination: "/category/audio",
        permanent: true,
      },
      {
        source: "/blog/font-not-download-showing-as-english-in-word",
        destination: "/blog/kruti-dev-font-showing-as-english-in-word",
        permanent: true,
      },
      {
        source: "/blog/fix-kruti-dev-font-not-showing-and-convert-to-unicode",
        destination: "/blog/the-ultimate-guide-to-hindi-and-punjabi-font-conversion",
        permanent: true,
      },
      {
        source: "/blog/how-to-fix-mangal-font-showing-question-marks-in-ms-word",
        destination: "/blog/kruti-dev-font-showing-as-english-in-word",
        permanent: true,
      },
      {
        source: "/blog/free-pdf-merger-no-file-limits",
        destination: "/blog/free-smallpdf-alternative-no-daily-limits",
        permanent: true,
      },
    ];

    const aliasRedirects = Object.entries(SLUG_ALIASES).map(([alias, target]) => ({
      source: `/${alias}`,
      destination: `/${target}`,
      permanent: true,
    }));

    return [...legacyRedirects, ...aliasRedirects];
  },
  async headers() {
    return [
      {
        source: "/:slug(compress-video|video-to-jpg|mp4-to-mp3|mov-to-mp4|video-to-mp4|video-to-avi|video-to-mkv|video-to-wmv|video-to-mov|video-to-flv|mp3-to-wav|wav-to-mp3|ogg-to-mp3|mp3-to-ogg)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
      {
        source: "/ffmpeg/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.clarity.ms https://pagead2.googlesyndication.com https://partner.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formsubmit.co; frame-ancestors 'none'; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; media-src 'self' blob: data:; connect-src 'self' blob: data: https://www.google-analytics.com https://region1.google-analytics.com https://*.clarity.ms https://pagead2.googlesyndication.com https://*.doubleclick.net https://unpkg.com https://static.imgly.com https://staticimgly.com; worker-src 'self' blob: data: https://unpkg.com https://staticimgly.com;",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
