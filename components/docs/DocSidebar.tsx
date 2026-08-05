"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, BookOpen, Settings, HelpCircle, FileText, Users, Cpu, Star } from "lucide-react";
import { DOC_CATEGORIES, DocCategory } from "@/lib/docsData";

interface DocSidebarProps {
  categories?: DocCategory[];
}

export const DocSidebar: React.FC<DocSidebarProps> = ({ categories: propCategories }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const categories = propCategories || DOC_CATEGORIES;

  // Map category slugs to matching icons for clean visual cues
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "getting-started":
        return <Star className="w-4 h-4 mr-2 text-orange-500" />;
      case "exam-creation":
        return <FileText className="w-4 h-4 mr-2 text-orange-500" />;
      case "question-bank":
        return <BookOpen className="w-4 h-4 mr-2 text-orange-500" />;
      case "candidate-management":
        return <Users className="w-4 h-4 mr-2 text-orange-500" />;
      case "ai-proctoring":
        return <Cpu className="w-4 h-4 mr-2 text-orange-500" />;
      case "advanced":
        return <Settings className="w-4 h-4 mr-2 text-orange-500" />;
      default:
        return <HelpCircle className="w-4 h-4 mr-2 text-orange-500" />;
    }
  };

  // Filter categories and items based on search query
  const filteredCategories = categories.map((cat) => {
    const matchedItems = cat.items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items: matchedItems };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="w-full h-full flex flex-col bg-white text-black">
      {/* Search Input */}
      <div className="p-4 border-b border-pesofts-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs..."
            className="w-full pl-9 pr-4 py-2 text-sm text-black placeholder-pesofts-gray-500 bg-pesofts-gray-50 border border-pesofts-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-grow overflow-y-auto px-4 py-6 space-y-7 no-scrollbar">
        {filteredCategories.map((category) => (
          <div key={category.slug} className="space-y-2">
            <h3 className="text-xs font-bold tracking-widest text-black uppercase flex items-center px-2 select-none">
              {getCategoryIcon(category.slug)}
              {category.name}
            </h3>
            
            <ul className="space-y-1">
              {category.items.map((item) => {
                const itemPath = `/docs/${category.slug}/${item.slug}`;
                const isActive = pathname === itemPath;
                
                return (
                  <li key={item.slug}>
                    <Link
                      href={itemPath}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-gray-600 hover:text-orange-600 hover:bg-pesofts-gray-50 font-semibold"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <p className="text-sm text-black text-center py-4 font-semibold">
            No documentation matched.
          </p>
        )}
      </div>
    </div>
  );
};
