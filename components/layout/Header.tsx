"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "@/components/layout/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const isKnowledgeBase = pathname.startsWith("/knowledge-base");
  const isCommunity = pathname.startsWith("/community");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-pesofts-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-pesofts-red text-white w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-lg shadow-sm">
              P
            </div>
            <span className="font-bold text-lg text-pesofts-gray-900 tracking-tight">
              PeSofts <span className="text-pesofts-gray-500 font-medium">Knowledge</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/knowledge-base"
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150 ${
                isKnowledgeBase
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Knowledge Base
            </Link>
            <span
              className="px-3 py-1.5 text-sm font-medium text-pesofts-gray-300 cursor-not-allowed"
              title="Coming Soon"
            >
              Documentation
            </span>
            <span
              className="px-3 py-1.5 text-sm font-medium text-pesofts-gray-300 cursor-not-allowed"
              title="Coming Soon"
            >
              Academy
            </span>
            <Link
              href="/community"
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150 ${
                isCommunity
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Community
            </Link>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-pesofts-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full pl-9 pr-4 py-1.5 text-xs text-pesofts-gray-900 bg-pesofts-gray-50 border border-pesofts-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pesofts-red focus:bg-white transition-all"
            />
          </form>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span
                    className="text-xs text-pesofts-gray-500 font-semibold max-w-[120px] truncate hidden sm:inline"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="!px-3 !py-1.5 !text-xs font-bold border-pesofts-gray-200"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  href="/login"
                  variant="ghost"
                  className="!px-3 !py-1.5 !text-xs font-bold text-pesofts-gray-700 hover:text-pesofts-red"
                >
                  Login
                </Button>
              )}
            </>
          )}

          <Button
            href="https://pesofts.com"
            variant="primary"
            className="!px-4 !py-2 !text-xs font-bold"
          >
            Visit Product
          </Button>
        </div>
      </div>
    </header>
  );
};
