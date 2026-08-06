"use client";

import React from "react";

interface Category {
  name: string;
  count: number;
}

interface CommunitySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  totalQuestionsCount: number;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  totalQuestionsCount,
}) => {
  return (
    <div>
      <h3 className="text-xs font-extrabold text-black uppercase tracking-widest mb-4">
        Categories
      </h3>
      <div className="space-y-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
            selectedCategory === null
              ? "bg-black text-[#E65C24] shadow-sm font-bold"
              : "text-black hover:text-[#E65C24] hover:bg-pesofts-gray-100"
          }`}
        >
          <span>All Categories</span>
          <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
            selectedCategory === null
              ? "text-black bg-[#E65C24] font-bold"
              : "text-black bg-pesofts-gray-100"
          }`}>
            {totalQuestionsCount}
          </span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === cat.name
                ? "bg-black text-[#E65C24] shadow-sm font-bold"
                : "text-black hover:text-[#E65C24] hover:bg-pesofts-gray-100"
            }`}
          >
            <span>{cat.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
              selectedCategory === cat.name
                ? "text-black bg-[#E65C24] font-bold"
                : "text-black bg-pesofts-gray-100"
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
