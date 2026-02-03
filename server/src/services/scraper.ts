export interface ScrapedBookMeta {
  title: string;
  author?: string;
  cover?: string;
  formats?: string[];
  pages?: number;
  language?: string;
  rating?: number;
}

export function parseZlibSearchHtml(html: string): ScrapedBookMeta[] {
  const titleRegex = /<h3[^>]*>\s*<a[^>]*>([^<]+)<\/a>/gi;
  const results: ScrapedBookMeta[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = titleRegex.exec(html))) {
    results.push({ title: match[1].trim() });
  }

  return results;
}
