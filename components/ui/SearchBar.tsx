"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search articles, concepts, tutorials...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-pesofts-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="block w-full pl-11 pr-16 py-3.5 text-base text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-colors duration-150"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-sans font-medium text-pesofts-gray-400 border border-pesofts-gray-200 rounded bg-pesofts-gray-50">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};
