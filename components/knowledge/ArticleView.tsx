import React from "react";
import Link from "next/link";
import { Bookmark, Clock, Calendar, Edit3, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Article } from "@/lib/articles";

interface ArticleViewProps {
  article: Article;
  htmlContent: string;
  formattedDate: string;
  isAdmin: boolean;
  onEditClick: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  htmlContent,
  formattedDate,
  isAdmin,
  onEditClick,
}) => {
  return (
    <article className="lg:col-span-8">
      {/* Header info */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            href={`/knowledge-base?category=${encodeURIComponent(article.category)}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1" />
            {article.category}
          </Link>
          <span className="inline-flex items-center text-xs text-pesofts-gray-400">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {article.readingTime} read
          </span>
          <span className="inline-flex items-center text-xs text-pesofts-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Updated {formattedDate}
          </span>

          {/* Admin Edit Trigger */}
          {isAdmin && (
            <button
              onClick={onEditClick}
              className="ml-auto inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border border-orange-500 bg-white text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit Article
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-pesofts-gray-900 tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-lg text-pesofts-gray-500 leading-relaxed italic border-l-2 border-pesofts-gray-200 pl-4 py-1">
          {article.description}
        </p>
      </div>

      {/* Rendered Markdown Body */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Bottom Actions */}
      <div className="mt-12 pt-8 border-t border-pesofts-gray-100 flex justify-between items-center">
        <Button
          href="/knowledge-base"
          variant="outline"
          className="flex items-center font-bold text-xs"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Knowledge Base Home
        </Button>

        <span className="text-xs text-pesofts-gray-400">Was this article helpful?</span>
      </div>
    </article>
  );
};
