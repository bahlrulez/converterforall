import { toolsDatabase, SLUG_ALIASES, getToolBySlug } from "@/lib/tools-db";
import { ToolSeoInventoryItem, ToolType, ProcessingType } from "../types";
import { computeInternalLinkGraph } from "./internal-link-analyzer";
import { evaluateToolContent } from "./thin-content-detector";
import { calculateToolSeoScore } from "../scoring/seo-scorer";

export function collectSeoInventory(): ToolSeoInventoryItem[] {
  const linkGraph = computeInternalLinkGraph();
  const inventory: ToolSeoInventoryItem[] = [];

  // Track discovered slugs to prevent duplicate object entries
  const processedSlugs = new Set<string>();

  // 1. Process all 154 Canonical Tools across all categories
  for (const [categorySlug, categoryTools] of Object.entries(toolsDatabase)) {
    for (const [toolSlug, toolObj] of Object.entries(categoryTools as any)) {
      if (processedSlugs.has(toolSlug)) continue;
      processedSlugs.add(toolSlug);

      const tool = toolObj as any;

      // Classify Tool Type
      let toolType: ToolType = "converter";
      if (tool.converterType === "length") toolType = "converter";
      else if (tool.converterType === "font") toolType = "converter";
      else if (tool.converterType === "font-detector") toolType = "detector";
      else if (tool.converterType === "unicode-tools") {
        if (tool.toolType === "normalizer") toolType = "normalizer";
        else if (tool.toolType === "cleaner" || tool.toolType === "hidden-chars") toolType = "cleaner";
        else toolType = "utility";
      } else if (toolSlug.includes("calculator")) toolType = "calculator";
      else if (toolSlug.includes("generator")) toolType = "generator";
      else if (toolSlug.includes("scanner")) toolType = "scanner";
      else if (toolSlug.includes("ruler") || toolSlug.includes("measure")) toolType = "utility";
      else if (toolSlug.includes("compress")) toolType = "compressor";
      else if (toolSlug.includes("edit") || toolSlug.includes("repair") || toolSlug.includes("clean")) toolType = "editor";

      // Conversion Direction
      let primaryConversionDirection = "N/A - Utility";
      if (toolSlug.includes("-to-")) {
        const parts = toolSlug.split("-to-");
        primaryConversionDirection = `${parts[0].toUpperCase()} → ${parts[1].toUpperCase()}`;
      } else if (tool.inputFormat && tool.outputFormat && tool.inputFormat !== "none" && tool.outputFormat !== "none") {
        primaryConversionDirection = `${tool.inputFormat.toUpperCase()} → ${tool.outputFormat.toUpperCase()}`;
      } else if (toolSlug === "remove-background") {
        primaryConversionDirection = "Image → Transparent PNG";
      }

      // Input Formats
      const supportedInputFormats: string[] = [];
      if (tool.acceptedTypes && Object.keys(tool.acceptedTypes).length > 0) {
        for (const [mime, exts] of Object.entries(tool.acceptedTypes as Record<string, string[]>)) {
          if (Array.isArray(exts)) {
            supportedInputFormats.push(...exts);
          } else {
            supportedInputFormats.push(mime);
          }
        }
      } else if (tool.inputFormat && tool.inputFormat !== "none") {
        supportedInputFormats.push(tool.inputFormat);
      }

      // Output Formats
      const supportedOutputFormats: string[] = [];
      if (tool.outputFormat && tool.outputFormat !== "none") {
        supportedOutputFormats.push(tool.outputFormat);
      }

      // Requires file upload
      const noUploadSlugs = [
        "live-ruler", "camera-measure", "age-calculator", "qr-generator", "barcode-generator",
        "password-generator", "fuel-calculator", "mileage-calculator", "font-detector",
        "jwt-decoder", "json-formatter", "unix-timestamp-converter", "uuid-generator",
        "screen-recorder"
      ];
      const requiresFileUpload = !(
        noUploadSlugs.includes(toolSlug) || 
        tool.converterType === "length" || 
        tool.converterType === "font" ||
        tool.converterType === "unicode-tools"
      );

      // Processing Location
      let processingLocation: ProcessingType = "client-side (browser WASM/JS)";
      if (toolSlug === "remove-background") {
        processingLocation = "client-side (WebGPU/AI)";
      } else if (categorySlug === "utilities" || toolType === "calculator" || toolType === "generator") {
        processingLocation = "client-side (Canvas/DOM)";
      } else if (toolSlug === "word-to-pdf" || toolSlug === "powerpoint-to-pdf" || toolSlug === "excel-to-pdf") {
        processingLocation = "hybrid (client-side + ephemeral cloud)";
      }

      // Content Evaluation
      const contentEval = evaluateToolContent(toolSlug, tool.title || toolSlug, tool.description || "");

      // On-page SEO Metadata
      const currentH1 = tool.title || toolSlug;
      const currentTitle = tool.seoTitle || `${tool.title} | 100% Free & Private Online Tool`;
      const currentMetaDescription = tool.seoDescription || `${tool.description} Fast, secure, client-side conversion powered by in-browser WebAssembly & WebGPU hardware acceleration.`;
      const canonicalUrl = `https://www.converterforall.com/${toolSlug}`;

      // Inbound & Outbound Links
      const incomingInternalLinks = linkGraph.inboundLinksBySlug[toolSlug] || [];
      const outgoingInternalLinks = linkGraph.outboundLinksBySlug[toolSlug] || [];
      const relatedTools = linkGraph.relatedToolsBySlug[toolSlug] || [];

      // Breadcrumb Structure
      const breadcrumbStructure = [
        { name: "Home", url: "https://www.converterforall.com", position: 1 },
        { name: tool.title, url: canonicalUrl, position: 2 }
      ];

      // Structured Data
      const structuredDataTypes = ["BreadcrumbList", "SoftwareApplication"];

      // Scoring
      const scoreResult = calculateToolSeoScore({
        title: currentTitle,
        metaDescription: currentMetaDescription,
        canonicalUrl,
        isAlias: false,
        wordCount: contentEval.wordCount,
        isThinContent: contentEval.isThinContent,
        incomingLinkCount: incomingInternalLinks.length,
        hasBreadcrumbs: true,
        hasStructuredData: true
      });

      inventory.push({
        toolName: tool.title || toolSlug,
        urlPath: `/${toolSlug}`,
        isAlias: false,
        canonicalUrl,
        category: categorySlug,
        subCategory: tool.subCategory || tool.fontCategory,
        toolType,
        primaryConversionDirection,
        supportedInputFormats: Array.from(new Set(supportedInputFormats)),
        supportedOutputFormats: Array.from(new Set(supportedOutputFormats)),
        requiresFileUpload,
        processingLocation,
        isFunctional: true,
        currentH1,
        currentTitle,
        currentMetaDescription,
        indexability: "indexable",
        robotsDirectives: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        structuredDataTypes,
        breadcrumbStructure,
        wordCount: contentEval.wordCount,
        introductoryContent: contentEval.introductoryContent,
        faqSections: contentEval.faqSections,
        hasUniqueSeoContent: contentEval.hasUniqueSeoContent,
        isThinContent: contentEval.isThinContent,
        thinContentReason: contentEval.thinContentReason,
        incomingInternalLinks,
        incomingInternalLinkCount: incomingInternalLinks.length,
        outgoingInternalLinks,
        outgoingInternalLinkCount: outgoingInternalLinks.length,
        relatedTools,
        seoHealthScore: scoreResult.score,
        issues: scoreResult.issues
      });
    }
  }

  // 2. Process all 87 Alias Routes
  for (const [aliasSlug, targetSlug] of Object.entries(SLUG_ALIASES)) {
    if (processedSlugs.has(aliasSlug)) continue;
    processedSlugs.add(aliasSlug);

    const targetToolData = getToolBySlug(targetSlug);
    const targetTool = targetToolData?.tool || { title: aliasSlug, description: "" };
    const categorySlug = targetToolData?.categorySlug || "utilities";

    const contentEval = evaluateToolContent(targetSlug, targetTool.title, targetTool.description);
    const incomingInternalLinks = linkGraph.inboundLinksBySlug[aliasSlug] || [];
    const relatedTools = linkGraph.relatedToolsBySlug[targetSlug] || [];

    const currentH1 = targetTool.title || aliasSlug;
    const currentTitle = targetTool.seoTitle || `${targetTool.title} | 100% Free & Private Online Tool`;
    const currentMetaDescription = targetTool.seoDescription || `${targetTool.description} Fast, secure, client-side conversion powered by in-browser WebAssembly & WebGPU hardware acceleration.`;
    
    // In current production code, canonical is self-referential to the alias path!
    const canonicalUrl = `https://www.converterforall.com/${aliasSlug}`;

    const scoreResult = calculateToolSeoScore({
      title: currentTitle,
      metaDescription: currentMetaDescription,
      canonicalUrl,
      isAlias: true,
      wordCount: contentEval.wordCount,
      isThinContent: contentEval.isThinContent,
      incomingLinkCount: incomingInternalLinks.length,
      hasBreadcrumbs: true,
      hasStructuredData: true
    });

    inventory.push({
      toolName: `${targetTool.title} (Alias: /${aliasSlug})`,
      urlPath: `/${aliasSlug}`,
      isAlias: true,
      canonicalTargetSlug: targetSlug,
      canonicalUrl,
      category: categorySlug,
      subCategory: targetTool.subCategory || targetTool.fontCategory,
      toolType: "converter",
      primaryConversionDirection: `Alias of /${targetSlug}`,
      supportedInputFormats: [],
      supportedOutputFormats: [],
      requiresFileUpload: true,
      processingLocation: "client-side (browser WASM/JS)",
      isFunctional: true,
      currentH1,
      currentTitle,
      currentMetaDescription,
      indexability: "canonicalized-alias",
      robotsDirectives: "index, follow",
      structuredDataTypes: ["BreadcrumbList", "SoftwareApplication"],
      breadcrumbStructure: [
        { name: "Home", url: "https://www.converterforall.com", position: 1 },
        { name: targetTool.title, url: canonicalUrl, position: 2 }
      ],
      wordCount: contentEval.wordCount,
      introductoryContent: contentEval.introductoryContent,
      faqSections: contentEval.faqSections,
      hasUniqueSeoContent: contentEval.hasUniqueSeoContent,
      isThinContent: contentEval.isThinContent,
      thinContentReason: contentEval.thinContentReason,
      incomingInternalLinks,
      incomingInternalLinkCount: incomingInternalLinks.length,
      outgoingInternalLinks: [],
      outgoingInternalLinkCount: 0,
      relatedTools,
      seoHealthScore: scoreResult.score,
      issues: [
        ...scoreResult.issues,
        `Duplicate Content / Canonical Risk: Alias /${aliasSlug} duplicates /${targetSlug} but self-canonicalizes to /${aliasSlug} instead of target canonical.`
      ]
    });
  }

  return inventory;
}
