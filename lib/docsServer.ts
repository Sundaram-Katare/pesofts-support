import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DocArticle, DocCategory, DOC_CATEGORIES } from "./docsData";
import { supabase } from "./supabase";

// Directory on disk for docs markdown files
const contentDirectory = path.join(process.cwd(), "content/docs");

/**
 * Retrieve a specific documentation article.
 * Checks Supabase database (docs table) first.
 * Falls back to disk (content/docs/[categorySlug]/[slug].md) and then static definitions.
 */
export async function getDocArticleServer(categorySlug: string, slug: string): Promise<DocArticle | null> {
  // 1. Try Supabase Database first
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("docs")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (!error && data) {
        return {
          slug: data.slug,
          title: data.title,
          description: data.description || "",
          categorySlug: data.category_slug || categorySlug,
          categoryName: data.category_name || getCategoryName(data.category_slug || categorySlug),
          readingTime: data.reading_time || "5 min read",
          updatedDate: new Date(data.updated_at || new Date()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          content: data.content,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching doc article from Supabase:", error);
  }

  // 2. Fallback to disk
  try {
    const fullPath = path.join(contentDirectory, categorySlug, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      return {
        slug: data.slug || slug,
        title: data.title || "Untitled",
        description: data.description || "",
        categorySlug: categorySlug,
        categoryName: data.categoryName || getCategoryName(categorySlug),
        readingTime: data.readingTime || data.reading_time || "5 min read",
        updatedDate: data.lastUpdated || data.updatedDate || new Date().toISOString().split("T")[0],
        content: content,
      };
    }
  } catch (error) {
    console.error("Error reading doc article from disk:", error);
  }

  // 3. Fallback (return null if not found)
  return null;
}

/**
 * Scans Supabase docs table and content/docs subdirectories to build a dynamic category mapping
 * merged with static categories.
 */
export async function getDocCategoriesServer(): Promise<DocCategory[]> {
  // Start with a deep copy of static categories
  const categories: DocCategory[] = JSON.parse(JSON.stringify(DOC_CATEGORIES));

  // 1. Try Supabase Database first
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("docs")
        .select("slug, category_slug, category_name, title");
      
      if (!error && data && data.length > 0) {
        data.forEach((doc: any) => {
          const catSlug = doc.category_slug;
          const catName = doc.category_name;
          const itemSlug = doc.slug;
          const itemTitle = doc.title;

          // Find if category already exists in config
          const existingCat = categories.find((c) => c.slug === catSlug);
          if (existingCat) {
            // Avoid duplicates
            if (!existingCat.items.some((i) => i.slug === itemSlug)) {
              existingCat.items.push({ slug: itemSlug, title: itemTitle });
            }
          } else {
            // Add new category
            categories.push({
              slug: catSlug,
              name: catName,
              items: [{ slug: itemSlug, title: itemTitle }],
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching doc categories from Supabase:", error);
  }

  // 2. Scan disk files to merge
  if (fs.existsSync(contentDirectory)) {
    try {
      const categoryDirs = fs.readdirSync(contentDirectory);

      categoryDirs.forEach((catSlug) => {
        const catPath = path.join(contentDirectory, catSlug);
        if (!fs.statSync(catPath).isDirectory()) return;

        const fileNames = fs.readdirSync(catPath);
        const items: { slug: string; title: string }[] = [];

        fileNames.forEach((fileName) => {
          if (!fileName.endsWith(".md")) return;
          try {
            const filePath = path.join(catPath, fileName);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const { data } = matter(fileContents);
            const slug = data.slug || fileName.replace(/\.md$/, "");
            const title = data.title || "Untitled";
            items.push({ slug, title });
          } catch (err) {
            console.error(`Error parsing frontmatter in ${fileName}:`, err);
          }
        });

        const existingCat = categories.find((c) => c.slug === catSlug);
        if (existingCat) {
          items.forEach((item) => {
            if (!existingCat.items.some((i) => i.slug === item.slug)) {
              existingCat.items.push(item);
            }
          });
        } else if (items.length > 0) {
          categories.push({
            slug: catSlug,
            name: getCategoryName(catSlug),
            items,
          });
        }
      });
    } catch (error) {
      console.error("Error scanning dynamic doc categories from disk:", error);
    }
  }

  return categories;
}

// Helper to convert category slug to pretty title
function getCategoryName(slug: string): string {
  const staticCat = DOC_CATEGORIES.find((c) => c.slug === slug);
  if (staticCat) return staticCat.name;
  
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
