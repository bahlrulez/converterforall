import type { NextConfig } from "next";
import { SLUG_ALIASES } from "./src/lib/tools-db";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      https: false,
      http: false,
      stream: false,
      zlib: false,
    };
    return config;
  },
  turbopack: {},
  async redirects() {
    const legacyRedirects = [
      {
        source: "/kruti-to-unicode",
        destination: "/krutidev-to-unicode",
        permanent: true,
      },
      {
        source: "/chanakya-to-unicode-page",
        destination: "/chanakya-to-unicode",
        permanent: true,
      },
      {
        source: "/krutidev-to-unicode-page",
        destination: "/krutidev-to-unicode",
        permanent: true,
      },
      {
        source: "/asees-font-to-unicode",
        destination: "/asees-to-unicode",
        permanent: true,
      },
      {
        source: "/punjabi-unicode",
        destination: "/asees-to-unicode",
        permanent: true,
      },
      {
        source: "/punjabi-font-converter",
        destination: "/asees-to-unicode",
        permanent: true,
      },
      {
        source: "/font-converter",
        destination: "/krutidev-to-unicode",
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
        source: "/unicode-to-mangal-font",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/unicode-to-urdu",
        destination: "/unicode-to-inpage",
        permanent: true,
      },
      {
        source: "/unicode-to-bambini",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/unicode-to-word",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/unicode-to-pdf",
        destination: "/unicode-to-krutidev",
        permanent: true,
      },
      {
        source: "/convert-tamil-to-unicode",
        destination: "/krutidev-to-unicode",
        permanent: true,
      },
      {
        source: "/py-to-unicode",
        destination: "/bijoy-to-unicode",
        permanent: true,
      },
      {
        source: "/merge-font-files",
        destination: "/font-text-fixer",
        permanent: true,
      },
      {
        source: "/remove-extra-spaces",
        destination: "/unicode-normalizer",
        permanent: true,
      },
      {
        source: "/remove-special-characters",
        destination: "/unicode-text-cleaner",
        permanent: true,
      },
      {
        source: "/increase-font-size",
        destination: "/font-text-fixer",
        permanent: true,
      },
      {
        source: "/decrease-font-size",
        destination: "/font-text-fixer",
        permanent: true,
      },
      {
        source: "/fancy-copy-paste-font",
        destination: "/category/fonts",
        permanent: true,
      },
      {
        source: "/unicode-logo-maker",
        destination: "/category/fonts",
        permanent: true,
      },
      {
        source: "/docx-to-pdf",
        destination: "/word-to-pdf",
        permanent: true,
      },
      {
        source: "/convert-word-to-pdf",
        destination: "/word-to-pdf",
        permanent: true,
      },
      {
        source: "/images-to-pdf",
        destination: "/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/merge-image",
        destination: "/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/face-crop-avatar",
        destination: "/image-cropper",
        permanent: true,
      },
      {
        source: "/increase-opacity",
        destination: "/category/image",
        permanent: true,
      },
      {
        source: "/html-to-text",
        destination: "/html-to-pdf",
        permanent: true,
      },
      {
        source: "/convert-video-to-mp4",
        destination: "/video-to-mp4",
        permanent: true,
      },
      {
        source: "/convert-video-to-flv",
        destination: "/video-to-flv",
        permanent: true,
      },
      {
        source: "/convert-video-to-mov",
        destination: "/video-to-mov",
        permanent: true,
      },
      {
        source: "/convert-video-to-webm",
        destination: "/video-to-wmv",
        permanent: true,
      },
      {
        source: "/convert-video",
        destination: "/video-compressor",
        permanent: true,
      },
      {
        source: "/merge-video",
        destination: "/video-compressor",
        permanent: true,
      },
      {
        source: "/large-video",
        destination: "/video-compressor",
        permanent: true,
      },
      {
        source: "/flip-video",
        destination: "/video-compressor",
        permanent: true,
      },
      {
        source: "/crop-audio-mp3",
        destination: "/trim-audio",
        permanent: true,
      },
      {
        source: "/base64-decode",
        destination: "/base64-encoder-decoder",
        permanent: true,
      },
      {
        source: "/base64-decoder",
        destination: "/base64-encoder-decoder",
        permanent: true,
      },
      {
        source: "/base64-encode-decoder",
        destination: "/base64-encoder-decoder",
        permanent: true,
      },
      {
        source: "/feet-to-centimeters",
        destination: "/inches-to-centimeters",
        permanent: true,
      },
      {
        source: "/light-years-to-meters",
        destination: "/inches-to-centimeters",
        permanent: true,
      },
      {
        source: "/meters-to-miles",
        destination: "/miles-to-kilometers",
        permanent: true,
      },
      {
        source: "/word-count-checker",
        destination: "/category/utilities",
        permanent: true,
      },
      {
        source: "/check-file-integrity",
        destination: "/category/developer",
        permanent: true,
      },
      {
        source: "/military-time-calculator",
        destination: "/age-calculator",
        permanent: true,
      },
      {
        source: "/compare-two-websites",
        destination: "/category/developer",
        permanent: true,
      },
      {
        source: "/compare-two-text-files",
        destination: "/category/developer",
        permanent: true,
      },
      {
        source: "/daily-todo-app",
        destination: "/category/utilities",
        permanent: true,
      },
      {
        source: "/force-delete",
        destination: "/category/utilities",
        permanent: true,
      },
      {
        source: "/color-picker",
        destination: "/category/utilities",
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
        source: "/copy-my-clients-file-conversion-link.com",
        destination: "/",
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
      {
        source: "/blog/the-ultimate-guide-to-converting-audio-for-social-media",
        destination: "/blog/how-to-compress-a-video-free-without-losing-quality",
        permanent: true,
      },
      {
        source: "/blog/the-ultimate-guide-to-video-compression",
        destination: "/blog/how-to-compress-a-video-free-without-losing-quality",
        permanent: true,
      },
      {
        source: "/blog/the-ultimate-guide-to-video-compression-free",
        destination: "/blog/how-to-compress-a-video-free-without-losing-quality",
        permanent: true,
      },
      {
        source: "/blog/free-act-merge-word-documents",
        destination: "/blog/how-to-convert-pdf-to-word-free",
        permanent: true,
      },
      {
        source: "/blog/how-to-trim",
        destination: "/trim-audio",
        permanent: true,
      },
      {
        source: "/convert-video-to-mkv",
        destination: "/video-to-mkv",
        permanent: true,
      },
      {
        source: "/convert-video-to-avi",
        destination: "/video-to-avi",
        permanent: true,
      },
      {
        source: "/convert-video-to-wmv",
        destination: "/video-to-wmv",
        permanent: true,
      },
      {
        source: "/centimeters-to-meters",
        destination: "/meters-to-kilometers",
        permanent: true,
      },
      {
        source: "/meters-to-centimeters",
        destination: "/inches-to-centimeters",
        permanent: true,
      },
      {
        source: "/centimeters-to-inches",
        destination: "/inches-to-centimeters",
        permanent: true,
      },
      {
        source: "/blog/word-to-pdf",
        destination: "/blog/word-to-pdf-formatting-tips",
        permanent: true,
      },
      {
        source: "/krutidev-010-to-mangal",
        destination: "/krutidev-to-unicode",
        permanent: true,
      },
      {
        source: "/case-converter",
        destination: "/unicode-normalizer",
        permanent: true,
      },
      {
        source: "/unit-converter-length-to-metric",
        destination: "/inches-to-centimeters",
        permanent: true,
      },
      {
        source: "/sutonnymj-to-unicode",
        destination: "/bijoy-to-unicode",
        permanent: true,
      },
      {
        source: "/unicode-to-sutonnymj",
        destination: "/unicode-to-bijoy",
        permanent: true,
      },
      {
        source: "/image-to-pdf",
        destination: "/jpg-to-pdf",
        permanent: true,
      },
      {
        source: "/blog/real-time-file-sharing-between-devices-without-the-cloud",
        destination: "/blog/why-client-side-conversion-is-the-future",
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
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
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
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.clarity.ms https://pagead2.googlesyndication.com https://partner.googleadservices.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formsubmit.co; frame-ancestors 'none'; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; media-src 'self' blob: data:; connect-src 'self' blob: data: https://huggingface.co https://*.huggingface.co https://*.hf.co https://www.google-analytics.com https://region1.google-analytics.com https://*.clarity.ms https://pagead2.googlesyndication.com https://*.doubleclick.net https://unpkg.com https://static.imgly.com https://staticimgly.com https://cdn.jsdelivr.net; worker-src 'self' blob: data: https://unpkg.com https://staticimgly.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://cdn.jsdelivr.net;",
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
