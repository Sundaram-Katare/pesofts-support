"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/layout/AuthContext";
import { Article } from "@/lib/articles";
import { ArticleEdit } from "./ArticleEdit";
import { ArticleView } from "./ArticleView";
import { ArticleSidebar } from "./ArticleSidebar";

interface ArticleContainerProps {
  article: Article;
  htmlContent: string;
  headings: { text: string; id: string }[];
  relatedArticles: Article[];
  formattedDate: string;
}

export const ArticleContainer: React.FC<ArticleContainerProps> = ({
  article,
  htmlContent,
  headings,
  relatedArticles,
  formattedDate,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveSuccess = () => {
    setIsEditing(false);
    router.refresh();
  };

  if (isEditing) {
    return (
      <ArticleEdit
        article={article}
        onSave={handleSaveSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <ArticleView
        article={article}
        htmlContent={htmlContent}
        formattedDate={formattedDate}
        isAdmin={isAdmin}
        onEditClick={() => setIsEditing(true)}
      />
      <ArticleSidebar
        headings={headings}
        relatedArticles={relatedArticles}
      />
    </div>
  );
};
