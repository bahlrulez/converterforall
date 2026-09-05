import { toolsDatabase, SLUG_ALIASES } from "@/lib/tools-db";
import { blogDatabase } from "@/lib/blog-data";
import { InternalLinkItem } from "../types";

// Footer specific direct tool links
const FOOTER_LINKS: Record<string, string> = {
  "pdf-to-word": "PDF to Word",
  "word-to-pdf": "Word to PDF",
  "merge-pdf": "Merge PDF",
  "split-pdf": "Split PDF",
  "compress-pdf": "Compress PDF",
  "pdf-to-jpg": "PDF to JPG",
  "jpg-to-pdf": "JPG to PDF",
  "ocr-pdf": "OCR PDF",
  "remove-background": "Background Remover",
  "passport-photo-maker": "Passport Photo Maker",
  "jpg-to-png": "JPG to PNG",
  "png-to-jpg": "PNG to JPG",
  "webp-to-jpg": "WEBP to JPG",
  "heic-to-jpg": "HEIC to JPG",
  "compress-jpg": "Compress Image",
  "gif-maker": "GIF Maker",
  "jwt-decoder": "JWT Decoder (Offline)",
  "json-formatter": "JSON Formatter & Validator",
  "json-to-csv": "JSON to CSV Converter",
  "csv-to-json": "CSV to JSON Converter",
  "base64-encoder-decoder": "Base64 Encoder & Decoder",
  "unix-timestamp-converter": "Unix Timestamp Converter",
  "uuid-generator": "UUID Generator (v4)",
  "edit-pdf": "Edit PDF",
  "mp4-to-mp3": "MP4 to MP3",
  "video-compressor": "Video Compressor",
  "compress-video-for-discord": "Discord Compressor",
  "compress-mp4": "Compress MP4",
  "compress-mov-video": "Compress MOV",
  "presentation-maker": "Presentation Maker",
  "qr-generator": "QR Generator",
  "krutidev-to-unicode": "Kruti Dev",
};

// Popular converters on homepage
const POPULAR_HOME_TOOLS = [
  "pdf-to-word",
  "jpg-to-pdf",
  "png-to-jpg",
  "mp4-to-mp3",
  "compress-pdf",
  "remove-background"
];

// Header mega menu popular tools
const HEADER_POPULAR_TOOLS = [
  "video-compressor",
  "compress-video-for-discord",
  "heic-to-jpg",
  "heic-to-png",
  "jwt-decoder",
  "json-formatter",
  "jpg-to-pdf",
  "edit-pdf",
  "remove-background",
  "merge-pdf",
  "compress-pdf",
  "pdf-to-word"
];

export function computeInternalLinkGraph(): {
  inboundLinksBySlug: Record<string, InternalLinkItem[]>;
  outboundLinksBySlug: Record<string, { targetUrl: string; anchorText: string }[]>;
  relatedToolsBySlug: Record<string, string[]>;
} {
  const inboundLinks: Record<string, InternalLinkItem[]> = {};
  const outboundLinks: Record<string, { targetUrl: string; anchorText: string }[]> = {};
  const relatedTools: Record<string, string[]> = {};

  // Initialize inbound links for all canonical tools and aliases
  const canonicalSlugs: string[] = [];
  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    for (const slug of Object.keys(categoryTools)) {
      canonicalSlugs.push(slug);
      inboundLinks[slug] = [];
    }
  }

  for (const aliasSlug of Object.keys(SLUG_ALIASES)) {
    if (!inboundLinks[aliasSlug]) {
      inboundLinks[aliasSlug] = [];
    }
  }

  // 1. Homepage AllToolsGrid links to all 154 canonical tools
  for (const slug of canonicalSlugs) {
    inboundLinks[slug].push({
      targetSlug: slug,
      targetUrl: `https://www.converterforall.com/${slug}`,
      anchorText: slug.replace(/-/g, " "),
      sourceType: "homepage"
    });
  }

  // 2. Homepage Popular Converters Strip
  for (const slug of POPULAR_HOME_TOOLS) {
    if (inboundLinks[slug]) {
      inboundLinks[slug].push({
        targetSlug: slug,
        targetUrl: `https://www.converterforall.com/${slug}`,
        anchorText: `Popular: ${slug.replace(/-/g, " ")}`,
        sourceType: "homepage"
      });
    }
  }

  // 3. Category Hub Pages (/category/[slug])
  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    for (const [slug, tool] of Object.entries(categoryTools as any)) {
      if (inboundLinks[slug]) {
        inboundLinks[slug].push({
          targetSlug: slug,
          targetUrl: `https://www.converterforall.com/${slug}`,
          anchorText: (tool as any).title || slug,
          sourceType: "category"
        });
      }
    }
  }

  // 4. Header MegaMenu (Header links popular items and category items)
  for (const slug of HEADER_POPULAR_TOOLS) {
    if (inboundLinks[slug]) {
      inboundLinks[slug].push({
        targetSlug: slug,
        targetUrl: `https://www.converterforall.com/${slug}`,
        anchorText: `Header: ${slug}`,
        sourceType: "header"
      });
    }
  }

  // 5. Footer Links
  for (const [slug, anchor] of Object.entries(FOOTER_LINKS)) {
    if (inboundLinks[slug]) {
      inboundLinks[slug].push({
        targetSlug: slug,
        targetUrl: `https://www.converterforall.com/${slug}`,
        anchorText: anchor,
        sourceType: "footer"
      });
    }
  }

  // 6. Blog Articles linking to tools
  for (const [blogSlug, post] of Object.entries(blogDatabase)) {
    const content = post.content || "";
    // Search for href="/..." or href="https://www.converterforall.com/..."
    for (const slug of canonicalSlugs) {
      if (content.includes(`/${slug}"`) || content.includes(`/${slug}/"`)) {
        inboundLinks[slug].push({
          targetSlug: slug,
          targetUrl: `https://www.converterforall.com/${slug}`,
          anchorText: `Blog: ${post.title}`,
          sourceType: "blog"
        });
      }
    }
  }

  // 7. Compute RelatedTools and Cross-links between tools
  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    const categorySlugs = Object.keys(categoryTools);
    
    for (const currentSlug of categorySlugs) {
      const related: string[] = [];
      
      // Pick other tools in same category
      for (const sibling of categorySlugs) {
        if (sibling !== currentSlug && related.length < 4) {
          related.push(sibling);
        }
      }

      // If under 4, add cross-category tools
      if (related.length < 4) {
        const fallbacks = ["developer", "document", "image", "utilities"];
        for (const fbCat of fallbacks) {
          if (fbCat !== categorySlug) {
            const fbTools = Object.keys((toolsDatabase as any)[fbCat] || {});
            for (const fbSlug of fbTools) {
              if (fbSlug !== currentSlug && !related.includes(fbSlug) && related.length < 4) {
                related.push(fbSlug);
              }
            }
          }
        }
      }

      relatedTools[currentSlug] = related;

      // Add inbound link to target tools from this tool's RelatedTools component
      for (const targetSlug of related) {
        if (inboundLinks[targetSlug]) {
          inboundLinks[targetSlug].push({
            targetSlug,
            targetUrl: `https://www.converterforall.com/${targetSlug}`,
            anchorText: `Related Tool from /${currentSlug}`,
            sourceType: "related-tools"
          });
        }
      }

      // Outbound links from this tool page
      outboundLinks[currentSlug] = [
        { targetUrl: "https://www.converterforall.com/", anchorText: "Back to All 150+ Tools" },
        ...related.map(r => ({
          targetUrl: `https://www.converterforall.com/${r}`,
          anchorText: r.replace(/-/g, " ")
        }))
      ];
    }
  }

  return {
    inboundLinksBySlug: inboundLinks,
    outboundLinksBySlug: outboundLinks,
    relatedToolsBySlug: relatedTools
  };
}
