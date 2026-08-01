import React from "react";
import { getArticles, getCategories } from "@/lib/articles";
import { KnowledgeBaseClient } from "@/components/knowledge/KnowledgeBaseClient";

// Disable caching to make it read the markdown filesystem dynamically in dev and production
export const revalidate = 0;

export default async function KnowledgeBasePage() {
  const articles = await getArticles();
  const categories = getCategories(articles);

  return (
    <div className="bg-white">
      <KnowledgeBaseClient initialArticles={articles} categories={categories} />
    </div>
  );
}
