import { supabase, isUsingMockAuth } from "@/lib/supabase";

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
    if (isUsingMockAuth) {
      if (typeof window === "undefined") {
        // Server-side: read directly from filesystem
        const fs = await import("fs");
        const path = await import("path");
        const matter = (await import("gray-matter")).default;
        const contentDir = path.join(process.cwd(), "content/knowledge-base");

        if (!fs.existsSync(contentDir)) {
          return [];
        }

        const fileNames = fs.readdirSync(contentDir);
        const articles = fileNames
          .filter((name) => name.endsWith(".md"))
          .map((name) => {
            const fullPath = path.join(contentDir, name);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);
            return {
              slug: matterResult.data.slug || name.replace(/\.md$/, ""),
              title: matterResult.data.title || "Untitled",
              description: matterResult.data.description || "",
              category: matterResult.data.category || "General",
              readingTime: matterResult.data.readingTime || matterResult.data.reading_time || "5 min",
              lastUpdated: matterResult.data.lastUpdated || matterResult.data.updatedAt || new Date().toISOString().split("T")[0],
              content: matterResult.content,
            } as Article;
          });

        return articles.sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
      } else {
        // Client-side: fetch from API
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to fetch articles");
        const json = await res.json();
        const articles = (json.articles || []).map((art: any) => ({
          slug: art.slug,
          title: art.title || "Untitled",
          description: art.description || "",
          category: art.category || "General",
          readingTime: art.readingTime || "5 min",
          lastUpdated: art.lastUpdated || new Date().toISOString().split("T")[0],
          content: art.content || "",
        })) as Article[];
        return articles.sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
      }
    } else {
      // Real database validation
      const { data, error } = await supabase
        .from("articles")
        .select("*");

      if (error) {
        console.error("Error fetching articles from Supabase:", error);
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

      return allArticlesData.sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1));
    }
  } catch (err) {
    console.error("Failed to load articles:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    if (isUsingMockAuth) {
      const articles = await getArticles();
      return articles.find((art) => art.slug === slug) || null;
    } else {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
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
    }
  } catch (err) {
    console.error(`Failed to get article by slug ${slug}:`, err);
    return null;
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
