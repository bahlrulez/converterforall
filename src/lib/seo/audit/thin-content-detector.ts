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
 * Evaluates on-page content using defensible heuristics:
 * 1. Dedicated content record existence in toolContent registry.
 * 2. Content specificity examining procedural instructions, format constraints, and substantive FAQs.
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
  let totalFaqQuestions = 0;

  for (const section of sections) {
    const rawContent = section.content || "";
    // Strip HTML tags to get pure visible textual words
    const strippedText = rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    totalText += ` ${section.title} ${strippedText}`;

    // Count questions in FAQs (matching 'Q:' or '<strong>Q:' or '<li>')
    const qMatches = rawContent.match(/<strong>Q:|\?<\/strong>|\?<\/b>|<strong>[0-9]+\./gi);
    const questionCount = qMatches 
      ? qMatches.length 
      : (section.title.toLowerCase().includes("faq") || section.title.toLowerCase().includes("question") ? 3 : 0);

    totalFaqQuestions += questionCount;

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
  // - No generic fallback boilerplate
  // - Procedural guidance or technical instructions (e.g., Steps, How-To, Format Guidance, Dimensions, Formulas)
  // - Substantive tool-relevant FAQs (at least 2 questions)
  // - Mention of concrete formats, operations, or units relevant to the slug
  const hasInstructionsSection = sections.some(s => {
    const t = s.title.toLowerCase();
    return t.includes("how to") || t.includes("steps") || t.includes("instructions") || t.includes("using") || t.includes("guide");
  });

  const mentionsSpecificFormatsOrUnits = 
    /(\.(pdf|png|jpg|jpeg|webp|heic|mp4|mov|mp3|wav|opus|svg|docx|pptx|xlsx|csv|json|srt|vtt)|unicode|krutidev|asees|satluj|joy|anmollipi|gurbani|matra|dpi|pixel|cm|mm|inches|feet|meters|bitrate|h\.264|aac|ocr|jwt|hash|uuid|barcode|qr)/i.test(totalText);

  const hasSubstantiveFaqs = totalFaqQuestions >= 2;

  const hasToolSpecificContent = 
    !isGenericBoilerplate && 
    (hasDedicatedContentRecord || (hasInstructionsSection && mentionsSpecificFormatsOrUnits) || (hasSubstantiveFaqs && mentionsSpecificFormatsOrUnits));

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
