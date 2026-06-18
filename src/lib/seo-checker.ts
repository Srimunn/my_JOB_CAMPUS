export interface SEOInput {
  title: string;
  description: string; // This can be the rich text content or blog description
  slug: string;
  focusKeyword: string;
  metaDescription?: string;
  imageAltText?: string;
  hasAltText?: boolean;
}

export interface SEOCheckResult {
  score: number;
  label: "Excellent" | "Good" | "Needs Improvement";
  color: "green" | "yellow" | "red";
  checks: {
    keywordInTitle: boolean;
    keywordInDescription: boolean;
    keywordInSlug: boolean;
    contentLength: number;
    contentLengthPass: boolean;
    hasAltText: boolean;
    hasInternalLinks: boolean;
    hasHeadings: boolean;
  };
}

export function checkSEO(input: SEOInput): SEOCheckResult {
  const {
    title = "",
    description = "",
    slug = "",
    focusKeyword = "",
    metaDescription = "",
    imageAltText = "",
    hasAltText = false,
  } = input;

  const kw = focusKeyword.trim().toLowerCase();

  // 1. Keyword checks
  const keywordInTitle = kw ? title.toLowerCase().includes(kw) : false;
  
  const descTextLower = description.toLowerCase();
  const metaTextLower = metaDescription.toLowerCase();
  const keywordInDescription = kw ? (descTextLower.includes(kw) || metaTextLower.includes(kw)) : false;
  
  const keywordInSlug = kw ? slug.toLowerCase().includes(kw) : false;

  // 2. Content Length (strip HTML tag wrapper if any)
  const cleanText = description.replace(/<[^>]*>/g, " ");
  const words = cleanText.trim().split(/\s+/).filter(Boolean);
  const contentLength = words.length;
  const contentLengthPass = contentLength >= 300;

  // 3. Image Alt text
  const finalHasAlt = hasAltText || imageAltText.trim().length > 0 || descTextLower.includes("alt=");

  // 4. Internal Links (relative links or domain-matching)
  const hasInternalLinks =
    descTextLower.includes("href=\"/") ||
    descTextLower.includes("href='/") ||
    descTextLower.includes("myjobcampus.com") ||
    /\[([^\]]+)\]\(\/(jobs|companies|career-guidance|about|contact)/.test(descTextLower);

  // 5. Headings Structure (presence of H2/H3 or bold heading blocks)
  const hasHeadings =
    /<h[2-6][^>]*>/.test(descTextLower) ||
    descTextLower.includes("##") ||
    descTextLower.includes("h2") ||
    descTextLower.includes("h3") ||
    descTextLower.includes("<strong>key responsibilities</strong>") ||
    descTextLower.includes("<strong>requirements</strong>") ||
    descTextLower.includes("<strong>benefits</strong>") ||
    descTextLower.includes("responsibilities:") ||
    descTextLower.includes("requirements:");

  // Score computation
  let score = 0;
  if (keywordInTitle) score += 20;
  if (keywordInDescription) score += 15;
  if (keywordInSlug) score += 15;

  if (contentLength >= 600) {
    score += 20;
  } else if (contentLength >= 300) {
    score += 12;
  } else if (contentLength >= 100) {
    score += 5;
  }

  if (finalHasAlt) score += 10;
  if (hasInternalLinks) score += 10;
  if (hasHeadings) score += 10;

  score = Math.min(100, Math.max(0, score));

  let label: "Excellent" | "Good" | "Needs Improvement" = "Needs Improvement";
  let color: "green" | "yellow" | "red" = "red";

  if (score >= 80) {
    label = "Excellent";
    color = "green";
  } else if (score >= 50) {
    label = "Good";
    color = "yellow";
  }

  return {
    score,
    label,
    color,
    checks: {
      keywordInTitle,
      keywordInDescription,
      keywordInSlug,
      contentLength,
      contentLengthPass,
      hasAltText: finalHasAlt,
      hasInternalLinks,
      hasHeadings,
    },
  };
}
