export type ScrapeResult = {
  title: string;
  coverUrl?: string;
  formats: string[];
  pages?: number;
  language?: string;
  rating?: string;
};

export type Scraper = {
  parseSearchResults: (html: string) => ScrapeResult[];
};

const stripTags = (value: string) => value.replace(/<[^>]+>/g, "").trim();

export const zlibScraper: Scraper = {
  parseSearchResults(html) {
    const itemRegex = /<div class="resItemBox"[\s\S]*?<\/div>\s*<\/div>/g;
    const items = html.match(itemRegex) ?? [];

    return items.map((item) => {
      const titleMatch = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
      const coverMatch = item.match(/<img[^>]+src="([^"]+)"/);
      const formatMatch = item.match(/<div class="bookProperty property__format">([\s\S]*?)<\/div>/);
      const pagesMatch = item.match(/Pages:\s*<[^>]*>(\d+)</);
      const languageMatch = item.match(/Language:\s*<[^>]*>([^<]+)</);
      const ratingMatch = item.match(/rating">([^<]+)</);

      return {
        title: stripTags(titleMatch?.[1] ?? "Unknown title"),
        coverUrl: coverMatch?.[1],
        formats: formatMatch ? stripTags(formatMatch[1]).split(",").map((value) => value.trim()) : [],
        pages: pagesMatch ? Number(pagesMatch[1]) : undefined,
        language: languageMatch?.[1],
        rating: ratingMatch?.[1]
      };
    });
  }
};
