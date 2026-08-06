"use client";

import React from "react";
import Image from "next/image";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CommunityHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalMembers: number;
  onBrowseClick: () => void;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalMembers,
  onBrowseClick,
}) => {
  return (
    <div className="bg-white border-b border-pesofts-gray-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="md:col-span-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pesofts-gray-100 text-xs font-semibold text-black mb-6 border border-pesofts-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span>
                {totalMembers.toLocaleString()} {totalMembers === 1 ? "practitioner" : "practitioners"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4 animate-in fade-in duration-300">
              The community for online <br className="hidden sm:inline" />
              examination teams
            </h1>

            <p className="text-lg text-black max-w-3xl mb-8 leading-relaxed">
              Ask questions, share workflows and learn from universities, coaching institutes and
              enterprise recruiters running PeSofts.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                href="/community/ask"
                variant="primary"
                className="shadow-lg hover:shadow-xl transition-all !bg-orange-500 hover:!bg-orange-600 focus:!ring-orange-500 focus:ring-offset-2 border-transparent"
              >
                Ask a question <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                onClick={onBrowseClick}
                variant="outline"
                className="bg-white text-black border-pesofts-gray-200 hover:bg-pesofts-gray-50"
              >
                Browse discussions
              </Button>
            </div>

            {/* Large Search Bar */}
            <div className="relative w-full max-w-3xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-black" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions, tags or usernames..."
                className="block w-full pl-12 pr-6 py-4 text-base text-black placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Column (Logo) */}
          <div className="hidden md:col-span-4 md:flex justify-end items-center">
            <Image
              src="/logo.png"
              alt="PeSofts Logo"
              width={220}
              height={64}
              priority
              className="h-56 w-auto object-contain transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
