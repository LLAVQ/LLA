import { BookRecommendation } from "@/types";

export interface ZlibSearchResult {
  title: string;
  author?: string;
  cover?: string;
  formats?: string[];
  pages?: number;
  language?: string;
  rating?: number;
}

export function parseZlibSearchHtml(html: string): ZlibSearchResult[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const cards = Array.from(doc.querySelectorAll(".resItemBox"));

  return cards.map((card) => {
    const title = card.querySelector("h3 a")?.textContent?.trim() ?? "";
    const author = card.querySelector(".authors")?.textContent?.trim();
    const cover = card.querySelector("img")?.getAttribute("src") ?? undefined;
    const meta = card.querySelector(".bookProperty")?.textContent ?? "";
    const pagesMatch = meta.match(/(\d+)\s+pages/i);
    const languageMatch = meta.match(/Language\s*:\s*([A-Za-z]+)/i);

    return {
      title,
      author,
      cover,
      formats: Array.from(card.querySelectorAll(".property__file"))
        .map((el) => el.textContent?.trim())
        .filter(Boolean) as string[],
      pages: pagesMatch ? Number(pagesMatch[1]) : undefined,
      language: languageMatch?.[1],
      rating: undefined
    };
  });
}

export function mergeScrapedMetadata(
  book: BookRecommendation,
  scraped: ZlibSearchResult
): BookRecommendation {
  return {
    ...book,
    cover: scraped.cover ?? book.cover,
    formats: scraped.formats ?? book.formats,
    pages: scraped.pages ?? book.pages,
    language: scraped.language ?? book.language,
    rating: scraped.rating ?? book.rating
  };
}
