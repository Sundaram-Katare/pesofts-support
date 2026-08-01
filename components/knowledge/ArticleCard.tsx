import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Article } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      href={`/knowledge-base/${article.slug}`}
      className="group block p-6 bg-white border border-pesofts-gray-200 hover:border-pesofts-red-200 rounded-xl transition-all duration-200 hover:shadow-md flex flex-col h-full justify-between"
    >
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pesofts-red-50 text-pesofts-red">
            {article.category}
          </span>
          <span className="inline-flex items-center text-xs text-pesofts-gray-400">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {article.readingTime}
          </span>
        </div>

        <h3 className="text-lg font-bold text-pesofts-gray-900 group-hover:text-pesofts-red transition-colors duration-150 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-pesofts-gray-500 line-clamp-3 mb-4">
          {article.description}
        </p>
      </div>

      <div className="flex items-center text-sm font-semibold text-pesofts-red mt-auto group-hover:translate-x-1 transition-transform duration-200">
        <span className="mr-1">Read Article</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
};
