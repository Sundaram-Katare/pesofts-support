import React from "react";
import Link from "next/link";
import { List, ArrowRight } from "lucide-react";
import { Article } from "@/lib/articles";

interface ArticleSidebarProps {
  headings: { text: string; id: string }[];
  relatedArticles: Article[];
}

export const ArticleSidebar: React.FC<ArticleSidebarProps> = ({
  headings,
  relatedArticles,
}) => {
  return (
    <aside className="lg:col-span-4 space-y-10">
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-xl p-6">
          <h4 className="text-xs font-bold text-pesofts-gray-400 uppercase tracking-wider mb-4 flex items-center">
            <List className="w-4 h-4 mr-1.5" />
            Table of Contents
          </h4>
          <nav className="space-y-2.5">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className="block text-sm text-pesofts-gray-600 hover:text-orange-600 transition-colors duration-150 line-clamp-1 pl-1"
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Related Articles */}
      <div className="border border-pesofts-gray-200 rounded-xl p-6">
        <h4 className="text-xs font-bold text-pesofts-gray-400 uppercase tracking-wider mb-4">
          Related Articles
        </h4>
        {relatedArticles.length === 0 ? (
          <p className="text-sm text-pesofts-gray-400 font-normal">
            No other articles in this category.
          </p>
        ) : (
          <div className="space-y-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/knowledge-base/${rel.slug}`}
                className="group block"
              >
                <h5 className="text-sm font-bold text-pesofts-gray-800 group-hover:text-orange-600 transition-colors duration-150 line-clamp-2">
                  {rel.title}
                </h5>
                <span className="inline-flex items-center text-[11px] text-orange-600 font-medium mt-1">
                  Read now
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Support Callout */}
      <div className="bg-orange-50/30 border border-orange-100 rounded-xl p-6">
        <h4 className="font-bold text-sm text-pesofts-gray-900 mb-2">Need more assistance?</h4>
        <p className="text-xs text-pesofts-gray-500 mb-4 leading-relaxed">
          Can&apos;t find the answers you&apos;re looking for? Reach out to our technical support team for direct help.
        </p>
        <a
          href="https://pesofts.com/contact.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center font-bold rounded-lg text-xs px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-sm"
        >
          Contact Support
        </a>
      </div>
    </aside>
  );
};
