import React from "react";
import { notFound } from "next/navigation";
import { getDocArticleServer } from "@/lib/docsServer";
import { EditDocClient } from "./EditDocClient";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function EditDocPage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getDocArticleServer(category, slug);

  if (!article) {
    notFound();
  }

  return <EditDocClient initialArticle={article} />;
}
