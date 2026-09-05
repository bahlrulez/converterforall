import { toolContent, getToolContent } from "@/lib/tool-content";

export interface ThinContentResult {
  hasUniqueSeoContent: boolean;
  isThinContent: boolean;
  wordCount: number;
  introductoryContent: string;
  faqSections: { title: string; contentSnippet: string; questionCount: number }[];
  thinContentReason?: string;
}

export function evaluateToolContent(
  toolSlug: string,
  toolTitle: string,
  toolDescription: string
): ThinContentResult {
  const sections = getToolContent(toolSlug, toolTitle, toolDescription);
  
  let totalText = `${toolTitle} ${toolDescription} `;
  const faqSections: { title: string; contentSnippet: string; questionCount: number }[] = [];

  for (const section of sections) {
    const rawContent = section.content || "";
    // Strip HTML tags to get pure visible textual words
    const strippedText = rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    totalText += ` ${section.title} ${strippedText}`;

    // Count questions in FAQs (matching 'Q:' or '<strong>Q:' or '<li>')
    const qMatches = rawContent.match(/<strong>Q:|\?<\/strong>|\?<\/b>|<strong>[0-9]+\./gi);
    const questionCount = qMatches ? qMatches.length : (section.title.toLowerCase().includes("faq") || section.title.toLowerCase().includes("question") ? 3 : 0);

    faqSections.push({
      title: section.title,
      contentSnippet: strippedText.slice(0, 160) + (strippedText.length > 160 ? "..." : ""),
      questionCount
    });
  }

  // Calculate clean word count
  const words = totalText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Detect whether it's using the generic boilerplate template
  const isGenericFallback = 
    !toolContent[toolSlug] && 
    !toolSlug.includes("-to-") && 
    totalText.includes("We built this tool to make everyday file tasks simple");

  const hasSpecificLengthFormula = 
    toolSlug.includes("-to-") && 
    (toolSlug.includes("inches") || toolSlug.includes("meters") || toolSlug.includes("feet") || toolSlug.includes("miles") || toolSlug.includes("centimeter") || toolSlug.includes("millimeter"));

  const hasSpecificFontFaq = 
    toolSlug.includes("-to-") && 
    (toolSlug.includes("unicode") || toolSlug.includes("krutidev") || toolSlug.includes("chanakya") || toolSlug.includes("devlys") || toolSlug.includes("anmollipi") || toolSlug.includes("asees"));

  const hasUniqueSeoContent = Boolean(toolContent[toolSlug]) || hasSpecificLengthFormula || hasSpecificFontFaq;

  let isThinContent = false;
  let thinContentReason: string | undefined;

  if (isGenericFallback) {
    isThinContent = true;
    thinContentReason = "Uses generic fallback copy ('We built this tool to make everyday file tasks simple...') with under 200 unique words.";
  } else if (wordCount < 250) {
    isThinContent = true;
    thinContentReason = `Low visible word count (${wordCount} words; recommended minimum is 300 words).`;
  }

  return {
    hasUniqueSeoContent,
    isThinContent,
    wordCount,
    introductoryContent: toolDescription || sections[0]?.content?.replace(/<[^>]+>/g, " ")?.slice(0, 200) || "",
    faqSections,
    thinContentReason
  };
}
