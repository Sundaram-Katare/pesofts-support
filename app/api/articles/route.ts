import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content/knowledge-base");

export async function GET() {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json({ articles: [] });
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const articles = fileNames
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const fullPath = path.join(contentDirectory, name);
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
        };
      });
    return NextResponse.json({ articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, description, category, readingTime, content } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const fileName = `${slug}.md`;
    const fullPath = path.join(contentDirectory, fileName);

    // Construct frontmatter and body
    const fileContent = `---
title: ${title}
description: ${description}
category: ${category}
readingTime: ${readingTime}
slug: ${slug}
lastUpdated: ${new Date().toISOString().split("T")[0]}
---

${content}
`;

    fs.writeFileSync(fullPath, fileContent, "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
