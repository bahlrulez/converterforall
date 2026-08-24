import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  async redirects() {
    return [
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
      }
    ];
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
