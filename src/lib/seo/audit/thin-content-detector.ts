import { toolContent, getToolContent } from "@/lib/tool-content";

export interface ThinContentResult {
  hasDedicatedContentRecord: boolean;
  hasToolSpecificContent: boolean;
  isThinContent: boolean;
  wordCount: number;
  introductoryContent: string;
  faqSections: { title: string; contentSnippet: string; questionCount: number }[];
  thinContentReason?: string;
}

/**
 * Counts actual detected question-and-answer pairs or explicit question entries in raw section HTML.
 * Never infers counts from headings or section titles alone.
 */
export function countActualFaqQuestions(rawContent: string): number {
  if (!rawContent || typeof rawContent !== "string") return 0;

  // Match actual Q&A question markers:
  // 1. <strong>Q:...</strong> or <b>Q:...</b> or Q:...
  // 2. <dt> tags in definition lists
  // 3. Question sentences ending with '?' inside strong, bold, or heading tags
  // 4. Numbered list items containing question marks
  const qMatches = rawContent.match(
    /(?:<p>|<br\s*\/?>|^)\s*(?:<strong>|<b>)?\s*Q(?:uestion)?\s*(?:[0-9]+)?\s*[:\.\-]|<dt\b[^>]*>|<\b(?:h[3-6]|strong|b)\b[^>]*>[^<]*\?\s*<\/(?:h[3-6]|strong|b)>|<li\b[^>]*>(?:[0-9]+\.|\bQ\b)[^<]*\?[^<]*<\/li>/gi
  );

  return qMatches ? qMatches.length : 0;
}

/**
 * Evaluates on-page content using defensible heuristics:
 * 1. Dedicated content record existence in toolContent registry (informational only; does not guarantee specificity).
 * 2. Content specificity examining procedural instructions, relevant formats/specs, tool limitations, and genuine FAQs.
 * 3. Word count as an internal editorial-review flag (<250w), not a search engine ranking prediction.
 */
export function evaluateToolContent(
  toolSlug: string,
  toolTitle: string,
  toolDescription: string
): ThinContentResult {
  const sections = getToolContent(toolSlug, toolTitle, toolDescription);
  const hasDedicatedContentRecord = Boolean(toolContent[toolSlug]);
  
  let totalText = `${toolTitle} ${toolDescription} `;
  const faqSections: { title: string; contentSnippet: string; questionCount: number }[] = [];
  let totalActualFaqQuestions = 0;

  for (const section of sections) {
    const rawContent = section.content || "";
    // Strip HTML tags to get pure visible textual words
    const strippedText = rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    totalText += ` ${section.title} ${strippedText}`;

    // Count only actual detected questions, never assuming counts from title alone
    const questionCount = countActualFaqQuestions(rawContent);
    totalActualFaqQuestions += questionCount;

    faqSections.push({
      title: section.title,
      contentSnippet: strippedText.slice(0, 160) + (strippedText.length > 160 ? "..." : ""),
      questionCount
    });
  }

  // Calculate clean visible word count
  const words = totalText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Detect whether it's using the generic boilerplate template
  const isGenericBoilerplate = totalText.includes("We built this tool to make everyday file tasks simple");

  // Content-specificity analysis:
  // Requires:
  // - Disqualification if generic fallback boilerplate
  // - Minimum substantive text depth (>= 180 words); shallow stubs are not specific
  // - Procedural instructions (step-by-step guidance with actionable verbs and markup)
  // - Concrete format, unit, or operation specifications matching tool domain
  // - Substantive FAQs with >= 2 actual detected questions
  const hasProceduralInstructions = sections.some(s => {
    const t = s.title.toLowerCase();
    const hasInstructionTitle = t.includes("how to") || t.includes("step") || t.includes("instructions") || t.includes("guide") || t.includes("using");
    const hasStepsHtml = /<ol\b|<li\b|step\s*[0-9]|1\.\s+<strong>/i.test(s.content || "");
    const rawWords = (s.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    return hasInstructionTitle && (hasStepsHtml || rawWords >= 25);
  });

  const mentionsRelevantFormatsOrSpecs = 
    /(\.(pdf|png|jpg|jpeg|webp|heic|mp4|mov|mp3|wav|opus|svg|docx|pptx|xlsx|csv|json|srt|vtt)|unicode|krutidev|asees|satluj|joy|anmollipi|gurbani|matra|dpi|pixel|cm|mm|inches|feet|meters|bitrate|h\.264|aac|ocr|jwt|base64|uuid|barcode|qr|rasteriz|vector|transparency|alpha channel|lossless|lossy|compression|metadata)/i.test(totalText);

  const hasSubstantiveFaqs = totalActualFaqQuestions >= 2;
  const hasSubstantiveDepth = wordCount >= 180;

  // Dedicated content record existence does NOT automatically establish specificity.
  // Content is specific only if it possesses substantive depth, domain formats/specs, and actionable instructions or genuine FAQs.
  const hasToolSpecificContent = 
    !isGenericBoilerplate && 
    hasSubstantiveDepth && 
    mentionsRelevantFormatsOrSpecs && 
    (hasProceduralInstructions || hasSubstantiveFaqs);

  let isThinContent = false;
  let thinContentReason: string | undefined;

  if (isGenericBoilerplate) {
    isThinContent = true;
    thinContentReason = "Relies on generic fallback template copy ('We built this tool to make everyday file tasks simple...'). Flagged for editorial review.";
  } else if (wordCount < 250) {
    isThinContent = true;
    thinContentReason = `Visible copy is ${wordCount} words (flagged for editorial review (<250w); internal editorial threshold only, not a Google ranking factor).`;
  }

  return {
    hasDedicatedContentRecord,
    hasToolSpecificContent,
    isThinContent,
    wordCount,
    introductoryContent: toolDescription || sections[0]?.content?.replace(/<[^>]+>/g, " ")?.slice(0, 200) || "",
    faqSections,
    thinContentReason
  };
}
