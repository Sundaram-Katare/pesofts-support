"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Breadcrumb } from "./Breadcrumb";
import { CategoryCard } from "./CategoryCard";
import { ArticleCard } from "./ArticleCard";
import { SearchBar } from "../ui/SearchBar";
import { Button } from "../ui/Button";
import { Article, CategoryInfo } from "@/lib/articles";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/components/layout/AuthContext";

interface KnowledgeBaseClientProps {
  initialArticles: Article[];
  categories: CategoryInfo[];
}

const KnowledgeBaseInner: React.FC<KnowledgeBaseClientProps> = ({
  initialArticles,
  categories,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const searchParams = useSearchParams();
  const router = useRouter();

  // Active states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sync with search params (e.g. from homepage redirect)
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    if (activeCategory === categoryName) {
      // Toggle off
      setActiveCategory(null);
      // Remove query param
      updateQueryParams(searchQuery, null);
    } else {
      setActiveCategory(categoryName);
      updateQueryParams(searchQuery, categoryName);
    }
  };

  // Helper to update URL query params
  const updateQueryParams = (q: string, category: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);

    const stringParams = params.toString();
    router.replace(`/knowledge-base${stringParams ? `?${stringParams}` : ""}`, { scroll: false });
  };

  // Filter articles dynamically based on search query and category
  const filteredArticles = initialArticles.filter((article) => {
    const matchesCategory = activeCategory ? article.category === activeCategory : true;

    const matchesSearch = searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
    router.replace("/knowledge-base", { scroll: false });
  };

  // Calculate article counts per category dynamically depending on search
  // but wait, the cards display the TOTAL count in the whole platform (as requested in design "AI Proctoring 28 articles").
  // So we use categories prop directly for counts, which is perfect.

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Knowledge Base" }]} className="mb-6" />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-pesofts-gray-900 tracking-tight mb-4">
            Knowledge Base
          </h1>
          {/* <p className="text-base sm:text-lg text-pesofts-gray-500 max-w-3xl leading-relaxed">
            Industry concepts, frameworks and long-form guides on online examinations, AI proctoring and modern assessment — written by practitioners.
          </p> */}
        </div>
        {isAdmin && (
          <Button
            href="/knowledge-base/new"
            variant="primary"
            className="!px-4 !py-2.5 !text-xs font-bold shrink-0 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            + Add Article
          </Button>
        )}
      </div>

      {/* Dynamic Search Bar */}
      <div className="mb-12">
        <SearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            updateQueryParams(val, activeCategory);
          }}
          placeholder="Search articles, concepts, standards..."
        />
      </div>

      {/* Browse by Category */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-pesofts-gray-400 uppercase tracking-widest">
            Browse by Category
          </h2>
          {(activeCategory || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-pesofts-red hover:underline flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              count={cat.count}
              isActive={activeCategory === cat.name}
              onClick={() => handleCategorySelect(cat.name)}
            />
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <div className="border-b border-pesofts-gray-100 pb-5 mb-8 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-bold text-pesofts-red uppercase tracking-wider block mb-1">
              {activeCategory ? activeCategory : "Editors' Picks"}
            </span>
            <h2 className="text-2xl font-extrabold text-pesofts-gray-900 tracking-tight">
              {searchQuery ? `Search Results (${filteredArticles.length})` : "Foundational reads"}
            </h2>
          </div>

          {/* {!searchQuery && !activeCategory && (
            // <span className="text-sm font-semibold text-pesofts-gray-400 hover:text-pesofts-red transition-colors duration-150">
            //   View all
            // </span>
          )} */}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-pesofts-gray-50/50 rounded-2xl border border-dashed border-pesofts-gray-200">
            <p className="text-pesofts-gray-400 mb-4">No articles found matching your criteria.</p>
            <Button variant="outline" onClick={handleResetFilters} className="text-xs">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const KnowledgeBaseClient: React.FC<KnowledgeBaseClientProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pesofts-red"></div>
      </div>
    }>
      <KnowledgeBaseInner {...props} />
    </Suspense>
  );
};
