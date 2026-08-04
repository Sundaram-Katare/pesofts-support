"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/knowledge-base");
    }
  };

  return (
    <div className="w-full">
      {/* Large Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-pesofts-gray-400 group-focus-within:text-pesofts-red transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search concepts, articles, security tools..."
          className="block w-full pl-11 pr-32 py-4 text-base text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all duration-150"
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <Button type="submit" variant="primary" className="h-full !py-0 !px-5 rounded-lg !text-xs font-bold">
            Search
          </Button>
        </div>
      </form>

      {/* Quick links under search */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-pesofts-gray-400">
        <span>Popular:</span>
        <button
          onClick={() => router.push("/knowledge-base?q=AI%20Proctoring")}
          className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
        >
          AI Proctoring
        </button>
        <span>•</span>
        <button
          onClick={() => router.push("/knowledge-base?q=Browser%20Lock")}
          className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
        >
          Browser Lock
        </button>
        <span>•</span>
        <button
          onClick={() => router.push("/knowledge-base?q=CBT")}
          className="text-pesofts-gray-500 hover:text-pesofts-red underline decoration-dotted"
        >
          Computer Based Testing
        </button>
      </div>
    </div>
  );
};
