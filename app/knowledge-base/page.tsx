import React from "react";
import { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/articles";
import { KnowledgeBaseClient } from "@/components/knowledge/KnowledgeBaseClient";

export const metadata: Metadata = {
  title: "Knowledge Base | Online Exam Software & Proctoring - PeSofts",
  description: "Explore detailed guides, research, and standards regarding AI proctoring, online exam software, web proctoring security, and student authentication.",
  keywords: "proctoring guidelines, AI assessment security, CBT guides, school exams proctoring",
};

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
