import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/articles";
import { markdownToHtml } from "@/lib/markdown";
import { Breadcrumb } from "@/components/knowledge/Breadcrumb";
import { ArticleContainer } from "@/components/knowledge/ArticleContainer";

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function extractHeadings(content: string): { text: string; id: string }[] {
  const headings: { text: string; id: string }[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ text, id });
    }
  });

  return headings;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Convert markdown body to HTML
  const htmlContent = await markdownToHtml(article.content);

  // Extract headings for Table of Contents
  const headings = extractHeadings(article.content);

  // Fetch all articles to resolve related articles
  const allArticles = await getArticles();
  const relatedArticles = getRelatedArticles(allArticles, slug, article.category, 3);

  // Parse last updated date for visual rendering
  const formattedDate = new Date(article.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-pesofts-gray-100 gap-4">
          <Breadcrumb
            items={[
              { label: "Knowledge Base", href: "/knowledge-base" },
              {
                label: article.category,
                href: `/knowledge-base?category=${encodeURIComponent(article.category)}`,
              },
              { label: article.title },
            ]}
          />
          <Link
            href="/knowledge-base"
            className="inline-flex items-center text-sm font-semibold text-pesofts-gray-500 hover:text-pesofts-red transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Knowledge Base
          </Link>
        </div>

        {/* Dynamic Wrapper supporting live edits */}
        <ArticleContainer
          article={article}
          htmlContent={htmlContent}
          headings={headings}
          relatedArticles={relatedArticles}
          formattedDate={formattedDate}
        />
      </div>
    </div>
  );
}
