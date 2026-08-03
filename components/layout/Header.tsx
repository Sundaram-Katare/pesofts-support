"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User as UserIcon, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-pesofts-gray-200 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="bg-pesofts-red text-white w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-lg shadow-sm transform hover:scale-105 transition-transform duration-150">
              P
            </div>
            <span className="font-bold text-lg text-pesofts-gray-900 tracking-tight hidden sm:inline">
              PeSofts <span className="text-pesofts-gray-500 font-medium">Knowledge</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link
              href="/knowledge-base"
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-150 ${
                isKnowledgeBase
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Knowledge Base
            </Link>
            <span
              className="px-3 py-2 text-xs lg:text-sm font-semibold text-pesofts-gray-300 cursor-not-allowed select-none"
              title="Coming Soon"
            >
              Documentation
            </span>
            <span
              className="px-3 py-2 text-xs lg:text-sm font-semibold text-pesofts-gray-300 cursor-not-allowed select-none"
              title="Coming Soon"
            >
              Academy
            </span>
            <Link
              href="/community"
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-150 ${
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
        <div className="flex items-center space-x-3 lg:space-x-5">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-40 lg:w-56 xl:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-pesofts-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full pl-9 pr-4 py-2 text-xs text-pesofts-gray-900 bg-pesofts-gray-50 border border-pesofts-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:bg-white transition-all duration-150"
            />
          </form>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-2 bg-pesofts-gray-50 border border-pesofts-gray-200 pl-2 pr-1 py-1 rounded-full shadow-sm hover:border-pesofts-gray-300 transition-colors">
                  <div className="flex items-center space-x-1.5">
                    <div className="bg-pesofts-red/10 text-pesofts-red w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-inner select-none">
                      {user.email ? user.email.slice(0, 2).toUpperCase() : <UserIcon className="w-3 h-3" />}
                    </div>
                    <div className="flex flex-col pr-1 shrink-0">
                      <span
                        className="text-[10px] text-pesofts-gray-900 font-bold max-w-[80px] lg:max-w-[100px] truncate leading-tight"
                        title={user.email}
                      >
                        {user.email?.split("@")[0]}
                      </span>
                      {user.role === "admin" && (
                        <span className="text-[8px] bg-pesofts-red text-white px-1 py-0.2 rounded font-extrabold uppercase tracking-wide w-max scale-90 origin-left mt-0.5 select-none">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1 text-pesofts-gray-400 hover:text-pesofts-red hover:bg-white rounded-full border border-transparent hover:border-pesofts-gray-200 transition-all shadow-sm"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <Button
                  href="/login"
                  variant="ghost"
                  className="!px-3 !py-1.5 !text-xs font-bold text-pesofts-gray-700 hover:text-pesofts-red hover:bg-pesofts-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Button>
              )}
            </>
          )}

          <Button
            href="https://pesofts.com"
            variant="primary"
            className="!px-4 !py-2 !text-xs font-bold shadow-sm hover:shadow transition-shadow"
          >
            Visit Product
          </Button>
        </div>
      </div>
    </header>
  );
};
