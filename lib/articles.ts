import { supabase } from "./supabase";

export interface Article {
  title: string;
  description: string;
  category: string;
  readingTime: string;
  slug: string;
  lastUpdated: string;
  content: string;
}

interface ArticleRow {
  slug: string;
  title?: string;
  description?: string;
  category?: string;
  reading_time?: string;
  readingTime?: string;
  updated_at?: string;
  lastUpdated?: string;
  content?: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*");

    if (error) {
      console.error("Error fetching articles:", error);
      return [];
    }

    const allArticlesData = (data as unknown as ArticleRow[] || []).map((row) => {
      return {
        slug: row.slug,
        title: row.title || "Untitled",
        description: row.description || "",
        category: row.category || "General",
        readingTime: row.reading_time || row.readingTime || "5 min",
        lastUpdated: (row.updated_at || row.lastUpdated)
          ? new Date((row.updated_at || row.lastUpdated) as string).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        content: row.content || "",
      } as Article;
    });

    return allArticlesData.sort((a, b) => {
      if (a.lastUpdated < b.lastUpdated) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (err) {
    console.error("Failed to load articles:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      // Fallback: search in getArticles
      const articles = await getArticles();
      return articles.find((art) => art.slug === slug) || null;
    }

    return {
      slug: data.slug,
      title: data.title || "Untitled",
      description: data.description || "",
      category: data.category || "General",
      readingTime: data.reading_time || data.readingTime || "5 min",
      lastUpdated: (data.updated_at || data.lastUpdated)
        ? new Date((data.updated_at || data.lastUpdated) as string).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      content: data.content || "",
    } as Article;
  } catch {
    const articles = await getArticles();
    return articles.find((art) => art.slug === slug) || null;
  }
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export function getCategories(articles: Article[]): CategoryInfo[] {
  const categoryCounts: { [key: string]: number } = {};

  articles.forEach((article) => {
    const category = article.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return Object.keys(categoryCounts).map((name) => ({
    name,
    count: categoryCounts[name],
  }));
}

export function getRelatedArticles(
  articles: Article[],
  currentSlug: string,
  category: string,
  limit: number = 3
): Article[] {
  return articles
    .filter((article) => article.category === category && article.slug !== currentSlug)
    .slice(0, limit);
}
