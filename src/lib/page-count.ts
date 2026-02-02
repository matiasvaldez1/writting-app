// PDF layout constants matching book-pdf-document.tsx (A4 with 40pt padding)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PADDING = 40;
const USABLE_WIDTH = PAGE_WIDTH - PADDING * 2; // 515.28
const USABLE_HEIGHT = PAGE_HEIGHT - PADDING * 2; // 761.89

// Chapter header overhead: title(18+10) + description(12+10) + sectionMargin(20)
const CHAPTER_HEADER_HEIGHT = 18 + 10 + 12 + 10 + 20;
const FIRST_PAGE_BUDGET = USABLE_HEIGHT - CHAPTER_HEADER_HEIGHT; // ~692
const SUBSEQUENT_PAGE_BUDGET = USABLE_HEIGHT; // ~762

const BASE_FONT_SIZE = 12;
const LINE_HEIGHT = 1.6;
const LINE_PT = BASE_FONT_SIZE * LINE_HEIGHT; // 19.2
const PARAGRAPH_MARGIN_BOTTOM = 6;

const HEADING_METRICS: Record<
  string,
  { size: number; mt: number; mb: number }
> = {
  h1: { size: 24, mt: 12, mb: 8 },
  h2: { size: 20, mt: 10, mb: 6 },
  h3: { size: 16, mt: 8, mb: 4 },
  h4: { size: 14, mt: 6, mb: 4 },
  h5: { size: 12, mt: 4, mb: 2 },
  h6: { size: 11, mt: 4, mb: 2 },
};

function charsPerLine(fontSize: number): number {
  return Math.floor(USABLE_WIDTH / (fontSize * 0.55));
}

function textHeight(
  text: string,
  fontSize: number,
  lineHt: number,
  marginBottom: number
): number {
  const cpl = charsPerLine(fontSize);
  const lines = Math.max(1, Math.ceil(text.length / cpl));
  return lines * fontSize * lineHt + marginBottom;
}

/**
 * Estimate height of a ProseMirror node in PDF points.
 * Used by the editor page-break extension.
 */
export function estimateNodeHeight(
  nodeType: string,
  textContent: string,
  attrs?: Record<string, unknown>
): number {
  if (nodeType === "paragraph") {
    if (!textContent) return LINE_PT + PARAGRAPH_MARGIN_BOTTOM;
    return textHeight(
      textContent,
      BASE_FONT_SIZE,
      LINE_HEIGHT,
      PARAGRAPH_MARGIN_BOTTOM
    );
  }

  if (nodeType === "heading") {
    const level = (attrs?.level as number) ?? 1;
    const tag = `h${level}`;
    const m = HEADING_METRICS[tag] ?? HEADING_METRICS.h1;
    return textHeight(textContent, m.size, 1.3, m.mb) + m.mt;
  }

  if (nodeType === "codeBlock") {
    const cpl = charsPerLine(10);
    const lines = Math.max(1, Math.ceil((textContent.length || 1) / cpl));
    return lines * 10 * 1.4 + 8 * 2 + 8;
  }

  if (nodeType === "blockquote") {
    return textHeight(textContent, BASE_FONT_SIZE, LINE_HEIGHT, 8) + 8;
  }

  if (nodeType === "bulletList" || nodeType === "orderedList") {
    const items = textContent.split(/\n/).filter(Boolean);
    const itemCount = Math.max(1, items.length);
    return itemCount * (LINE_PT + 2) + 6;
  }

  if (nodeType === "horizontalRule") {
    return 25;
  }

  if (nodeType === "image") {
    return 200;
  }

  return textHeight(
    textContent || " ",
    BASE_FONT_SIZE,
    LINE_HEIGHT,
    PARAGRAPH_MARGIN_BOTTOM
  );
}

/**
 * Estimate total PDF page count from an HTML string.
 * Uses regex parsing — safe for server-side use (no DOM needed).
 */
export function estimatePageCount(html: string): number {
  if (!html || html === "<p></p>") return 1;

  const tagRegex =
    /<(h[1-6]|p|pre|blockquote|ul|ol|hr|img)[^>]*>([\s\S]*?)<\/\1>|<(hr|img)[^>]*\/?>/gi;
  let usedHeight = 0;
  let pageCount = 1;
  let budget = FIRST_PAGE_BUDGET;

  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = (match[1] || match[3] || "").toLowerCase();
    const inner = (match[2] || "").replace(/<[^>]*>/g, "").trim();

    let h = 0;

    if (tag === "hr") {
      h = 25;
    } else if (tag === "img") {
      h = 200;
    } else if (tag.startsWith("h")) {
      const m = HEADING_METRICS[tag] ?? HEADING_METRICS.h1;
      h = textHeight(inner, m.size, 1.3, m.mb) + m.mt;
    } else if (tag === "pre") {
      const cpl = charsPerLine(10);
      const lines = Math.max(1, Math.ceil((inner.length || 1) / cpl));
      h = lines * 10 * 1.4 + 8 * 2 + 8;
    } else if (tag === "blockquote") {
      h = textHeight(inner, BASE_FONT_SIZE, LINE_HEIGHT, 8) + 8;
    } else if (tag === "ul" || tag === "ol") {
      const items = inner.split(/\n/).filter(Boolean);
      const itemCount = Math.max(1, items.length);
      h = itemCount * (LINE_PT + 2) + 6;
    } else {
      // paragraph
      if (!inner) {
        h = LINE_PT + PARAGRAPH_MARGIN_BOTTOM;
      } else {
        h = textHeight(
          inner,
          BASE_FONT_SIZE,
          LINE_HEIGHT,
          PARAGRAPH_MARGIN_BOTTOM
        );
      }
    }

    usedHeight += h;

    if (usedHeight > budget) {
      pageCount++;
      usedHeight = h;
      budget = SUBSEQUENT_PAGE_BUDGET;
    }
  }

  return pageCount;
}

export { FIRST_PAGE_BUDGET, SUBSEQUENT_PAGE_BUDGET };
