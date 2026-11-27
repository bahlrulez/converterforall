import { toolContent, getToolContent } from "@/lib/tool-content";
import { getToolBySlug } from "@/lib/tools-db";

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
 * Counts actual detected question-and-answer pairs in raw section HTML.
 * Rules:
 * - Ordinary definition-list terms in <dt> are NOT counted unless they contain actual questions.
 * - Where Q&A markup is used, verifies that a substantive answer is also present.
 * - Never infers counts from headings or section titles alone.
 */
export function countActualFaqQuestions(rawContent: string): number {
  if (!rawContent || typeof rawContent !== "string") return 0;
  let count = 0;
  const processedQuestions = new Set<string>();

  // 1. Definition lists: <dt>Question?</dt><dd>Substantive answer</dd>
  const dtRegex = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
  let match: RegExpExecArray | null;
  while ((match = dtRegex.exec(rawContent)) !== null) {
    const term = match[1].replace(/<[^>]+>/g, "").trim();
    const definition = match[2].replace(/<[^>]+>/g, "").trim();
    // Must be an actual question: contains '?' or starts with question marker words
    const isQuestion = /\?|^(?:Q(?:uestion)?\b|what\b|how\b|why\b|can\b|is\b|does\b|do\b|where\b|when\b|which\b)/i.test(term);
    const hasSubstantiveAnswer = definition.length >= 10 && definition.split(/\s+/).filter(Boolean).length >= 3;
    if (isQuestion && hasSubstantiveAnswer) {
      count++;
      processedQuestions.add(term.toLowerCase());
    }
  }

  // 2. Explicit Q&A paragraph patterns:
  // e.g. <p><strong>Q: ...?</strong><br>A: ...</p> or <p><strong>Q1: ...?</strong> A: ...</p>
  const pRegex = /<p\b[^>]*>\s*(?:<strong>|<b>)\s*Q(?:uestion)?\s*(?:[0-9]+)?\s*[:\.\-]\s*([\s\S]*?)\s*<\/(?:strong|b)>\s*(?:<br\s*\/?>|\n)?\s*(?:(?:<strong>|<b>)?\s*A(?:nswer)?\s*(?:[0-9]+)?\s*[:\.\-]\s*(?:<\/(?:strong|b)>)?\s*)?([\s\S]*?)<\/p>/gi;
  while ((match = pRegex.exec(rawContent)) !== null) {
    const questionText = match[1].replace(/<[^>]+>/g, "").trim();
    const answerText = match[2].replace(/<[^>]+>/g, "").trim();
    const hasQuestion = questionText.length >= 3;
    const hasSubstantiveAnswer = answerText.length >= 10 && answerText.split(/\s+/).filter(Boolean).length >= 3;
    if (hasQuestion && hasSubstantiveAnswer && !processedQuestions.has(questionText.toLowerCase())) {
      count++;
      processedQuestions.add(questionText.toLowerCase());
    }
  }

  // 3. Fallback for Q:... without strong tags inside paragraph or list item
  const simpleQaRegex = /(?:<p\b[^>]*>|<li\b[^>]*>)\s*Q(?:uestion)?\s*(?:[0-9]+)?\s*[:\.\-]\s*([^<\n\r]+)\s*(?:<br\s*\/?>|\n)?\s*(?:A(?:nswer)?\s*(?:[0-9]+)?\s*[:\.\-]\s*)?([\s\S]*?)(?=<\/p>|<\/li>|$)/gi;
  while ((match = simpleQaRegex.exec(rawContent)) !== null) {
    const questionText = match[1].replace(/<[^>]+>/g, "").trim();
    const answerText = match[2].replace(/<[^>]+>/g, "").trim();
    const hasQuestion = questionText.length >= 3;
    const hasSubstantiveAnswer = answerText.length >= 10 && answerText.split(/\s+/).filter(Boolean).length >= 3;
    if (hasQuestion && hasSubstantiveAnswer && !processedQuestions.has(questionText.toLowerCase())) {
      count++;
      processedQuestions.add(questionText.toLowerCase());
    }
  }

  // 4. Headings with '?' followed by a substantive paragraph
  const headingRegex = /<(h[3-6]|strong|b)\b[^>]*>([^<]*\?[^<]*)<\/\1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  while ((match = headingRegex.exec(rawContent)) !== null) {
    const headingText = match[2].replace(/<[^>]+>/g, "").trim();
    const answerText = match[3].replace(/<[^>]+>/g, "").trim();
    const hasSubstantiveAnswer = answerText.length >= 10 && answerText.split(/\s+/).filter(Boolean).length >= 3;
    if (headingText.includes("?") && hasSubstantiveAnswer && !processedQuestions.has(headingText.toLowerCase())) {
      if (!/^Q(?:uestion)?\s*[:\.\-]/i.test(headingText)) {
        count++;
        processedQuestions.add(headingText.toLowerCase());
      }
    }
  }

  return count;
}

/**
 * Validates domain-specific technical terminology matching the tool's actual domain,
 * inputs, outputs, and supported operations.
 * Generic terms (e.g. "compression", ".pdf") cannot establish specificity for an unrelated tool.
 */
export function hasToolDomainSpecificTerms(toolSlug: string, totalText: string): boolean {
  const toolData = getToolBySlug(toolSlug);
  const cat = toolData ? toolData.categorySlug : "";
  const tool = toolData ? toolData.tool : null;
  const convType = tool ? tool.converterType : "";
  const lowerText = totalText.toLowerCase();

  // 1. Font / Regional Script
  if (
    cat === "fonts" ||
    convType === "font" ||
    /(?:krutidev|chanakya|anmollipi|asees|satluj|joy|preeti|bijoy|inpage|unicode)/i.test(toolSlug)
  ) {
    return /(?:unicode|krutidev|chanakya|mangal|raavi|asees|satluj|joy|anmollipi|gurbani|punjabi|hindi|devanagari|gurmukhi|urdu|inpage|nastaliq|preeti|bijoy|zawgyi|burmese|tamil|telugu|kannada|malayalam|bengali|matra|halant|nukta|ligature|conjunct|character mapping|ascii font|legacy font|code points?|ansi mapping|phonetic keyboard|half letter|vowel sign)/i.test(lowerText);
  }

  // 2. Audio
  if (
    cat === "audio" ||
    toolSlug.includes("mp3") ||
    toolSlug.includes("audio") ||
    toolSlug.includes("voice-note")
  ) {
    return /(?:\.(mp3|wav|ogg|opus|m4a|aac|flac)\b|sample rate|44\.1\s*khz|48\s*khz|bitrate|kbps|stereo|mono|audio channel|audio trimming|audio cutter|lossy mp3|lossless wav|pcm|waveform|id3 tag|audio extraction|voice notes?|audio compression|compress audio|compress mp3)/i.test(lowerText);
  }

  // 3. Video
  if (
    cat === "video" ||
    toolSlug.includes("video") ||
    toolSlug.includes("caption")
  ) {
    return /(?:\.(mp4|mov|webm|mkv|avi)\b|h\.264|avc|hevc|h\.265|frame rate|fps|resolution|1080p|720p|4k|video bitrate|crf|aspect ratio|subtitles?|captions?|burned-in subtitles|open captions|webcodecs|transcode|mux|demux|video compression|compress video|compress mp4)/i.test(lowerText);
  }

  // 4. PDF & Documents
  if (
    cat === "document" ||
    toolSlug.includes("pdf") ||
    /(?:^|-)word(?:-|$)/i.test(toolSlug) ||
    toolSlug.includes("powerpoint") ||
    toolSlug.includes("presentation")
  ) {
    return /(?:\.(pdf|docx?|pptx?|xlsx?)\b|portable document format|word document|powerpoint|presentation slides?|rasteriz|vector text|page orientation|extract pages|merge pdf|split pdf|encrypt|decrypt|password protect|pdf\/a|page index|watermark|pdf compression|compress pdf|reduce pdf size|woff2?|ttf|otf|web font)/i.test(lowerText);
  }

  // 5. Image & Exam
  if (
    cat === "image" ||
    cat === "exam" ||
    toolSlug.includes("image") ||
    toolSlug.includes("photo")
  ) {
    return /(?:\.(png|jpe?g|webp|heic|svg|avif|gif)\b|\b(?:png|jpe?g|jpg|webp|heic|svg|avif|gif)\b|transparent background|transparency|alpha channel|isnet|background removal|foreground subject|optical character recognition|\bocr\b|tesseract|pixel dimensions?|megapixels?|aspect ratio|exif|crop|resize|lossless png|lossy webp|color space|rgb|dpi|dots per inch|passport photo|signature|dimensions in cm|dimensions in mm|photo stamper|date stamp|image compression|compress image|compress jpg|compress png)/i.test(lowerText);
  }

  // 6. Length & Units
  if (
    convType === "length" ||
    (toolSlug.includes("-to-") &&
      /(?:inches|centimeters|meters|feet|miles|yards|millimeters|furlong|chain|rod|league|parsec)/i.test(toolSlug))
  ) {
    return /(?:centimeter|millimeter|kilometer|meter|inches|feet|foot|yards|miles|furlong|chains?|rods?|leagues?|parsecs?|micrometer|nanometer|conversion formula|multiply by|divide by|decimal places?|unit converter)/i.test(lowerText);
  }

  // 7. Developer
  if (
    cat === "developer" ||
    /(?:jwt|json|csv|base64|uuid|timestamp)/i.test(toolSlug)
  ) {
    return /(?:jwt|json|csv|base64|uuid|unix timestamp|epoch|payload|header|signature|base64url|rfc\s*4122|serialization|delimiter|pretty print)/i.test(lowerText);
  }

  // 8. Utilities
  if (cat === "utilities") {
    return /(?:subtitles?|srt|vtt|qr code|barcode|camera stream|screen dpi|pixel ratio|date of birth|chronological age|leap year|calculator|fuel consumption|mileage|password generator)/i.test(lowerText);
  }

  // Unmatched tool domain: generic terms cannot establish specificity
  return false;
}

/**
 * Evaluates on-page content using defensible heuristics:
 * 1. Dedicated content record existence in toolContent registry (informational only; does not guarantee specificity).
 * 2. Content specificity examining procedural instructions, domain-relevant formats/specs, and genuine FAQs with substantive answers.
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

    // Count only actual detected questions with substantive answers
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
  // - Tool-domain-aware formats/specs (generic technical terms like "compression" alone or unrelated ".pdf" cannot qualify)
  // - Substantive FAQs with >= 2 actual detected questions having substantive answers
  const hasProceduralInstructions = sections.some(s => {
    const t = s.title.toLowerCase();
    const hasInstructionTitle = t.includes("how to") || t.includes("step") || t.includes("instructions") || t.includes("guide") || t.includes("using");
    const hasStepsHtml = /<ol\b|<li\b|step\s*[0-9]|1\.\s+<strong>/i.test(s.content || "");
    const rawWords = (s.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    return hasInstructionTitle && (hasStepsHtml || rawWords >= 25);
  });

  const mentionsRelevantFormatsOrSpecs = hasToolDomainSpecificTerms(toolSlug, totalText);

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
