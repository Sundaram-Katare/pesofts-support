"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "@/components/layout/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isKnowledgeBase = pathname.startsWith("/knowledge-base");
  const isCommunity = pathname.startsWith("/community");
  const isDocs = pathname.startsWith("/docs");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/knowledge-base?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-pesofts-gray-200 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Leftmost logo and desktop links */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="PeSofts Logo"
              width={110}
              height={32}
              priority
              className="h-8 w-auto object-contain transform hover:scale-105 transition-transform duration-150"
            />
          </Link>

          {/* Desktop Navigation Links - using Light font & whitespace-nowrap */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              href="/knowledge-base"
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-light whitespace-nowrap tracking-wide transition-all duration-150 ${
                isKnowledgeBase
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Knowledge Base
            </Link>
            <Link
              href="/docs"
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-light whitespace-nowrap tracking-wide transition-all duration-150 ${
                isDocs
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Documentation
            </Link>
            <span
              className="px-3 py-2 text-xs lg:text-sm font-light whitespace-nowrap tracking-wide text-pesofts-gray-300 cursor-not-allowed select-none"
              title="Coming Soon"
            >
              Academy
            </span>
            <Link
              href="/community"
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-light whitespace-nowrap tracking-wide transition-all duration-150 ${
                isCommunity
                  ? "bg-pesofts-gray-100 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Community
            </Link>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          
          {/* Reduced Width Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-32 lg:w-44 xl:w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-pesofts-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs text-pesofts-gray-900 bg-pesofts-gray-50 border border-pesofts-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd0000] focus:bg-white transition-all duration-150"
            />
          </form>

          {/* User profile dropdown - rightmost */}
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-pesofts-gray-50 border border-pesofts-gray-200 text-pesofts-gray-600 hover:border-pesofts-gray-300 hover:bg-pesofts-gray-100 focus:outline-none transition-all shadow-sm z-50 relative"
                  >
                    <span className="font-bold text-xs uppercase text-pesofts-gray-700">
                      {user.email ? user.email.slice(0, 2).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-pesofts-gray-200 shadow-lg py-2 z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-pesofts-gray-100">
                          <p className="text-xs font-bold text-pesofts-gray-800 truncate" title={user.email}>
                            {user.email}
                          </p>
                          <span 
                            className="inline-block text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded mt-1 text-white"
                            style={{ background: "linear-gradient(to right, #fd0000 0%, #ca5407ba 100%)" }}
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-pesofts-gray-600 hover:text-[#fd0000] hover:bg-pesofts-gray-50 flex items-center transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2 text-pesofts-gray-400" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  href="/login"
                  variant="ghost"
                  className="!px-3 !py-1.5 !text-xs font-light text-pesofts-gray-700 hover:text-[#fd0000] hover:bg-pesofts-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Button>
              )}
            </>
          )}

          {/* Visit Product Button - brand gradient */}
          <Button
            href="https://pesofts.com"
            variant="primary"
            style={{ background: "linear-gradient(to right, #fd0000 0%, #ca5407ba 100%)" }}
            className="!px-4 !py-2 !text-xs font-light text-white border-none shadow-sm hover:shadow transition-shadow hidden sm:inline-flex"
          >
            Visit Product
          </Button>

          {/* Hamburger Menu Button - mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-pesofts-gray-600 hover:text-pesofts-gray-900 focus:outline-none transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-pesofts-gray-200 bg-white px-4 pt-2 pb-6 space-y-4 shadow-lg absolute top-16 left-0 right-0 z-30 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/knowledge-base"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-light transition-colors ${
                isKnowledgeBase
                  ? "bg-pesofts-gray-50 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Knowledge Base
            </Link>
            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-light transition-colors ${
                isDocs
                  ? "bg-pesofts-gray-50 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Documentation
            </Link>
            <span className="px-3 py-2.5 text-sm font-light text-pesofts-gray-300 cursor-not-allowed select-none">
              Academy
            </span>
            <Link
              href="/community"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-light transition-colors ${
                isCommunity
                  ? "bg-pesofts-gray-50 text-pesofts-gray-900 font-normal"
                  : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-50"
              }`}
            >
              Community
            </Link>
          </nav>

          {/* Search bar inside mobile drawer */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-pesofts-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm text-pesofts-gray-900 bg-pesofts-gray-50 border border-pesofts-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fd0000]"
            />
          </form>

          {/* Visit Product Button - mobile view */}
          <Button
            href="https://pesofts.com"
            variant="primary"
            style={{ background: "linear-gradient(to right, #fd0000 0%, #ca5407ba 100%)" }}
            className="w-full py-2.5 font-light text-sm shadow-md rounded-xl text-white border-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Visit Product
          </Button>
        </div>
      )}
    </header>
  );
};
