"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, BookOpen, Edit } from "lucide-react";
import { DocArticle, DocCategory } from "@/lib/docsData";
import { DocSidebar } from "./DocSidebar";
import { useAuth } from "@/components/layout/AuthContext";

interface HeadingItem {
  text: string;
  id: string;
}

interface DocPageClientProps {
  article: DocArticle;
  htmlContent: string;
  headings: HeadingItem[];
  categories: DocCategory[];
}

export const DocPageClient: React.FC<DocPageClientProps> = ({
  article,
  htmlContent,
  headings,
  categories,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // IntersectionObserver Scrollspy for active heading highlight
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Highlight the first visible heading on the screen
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px", // Trigger when heading is near the top
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings, htmlContent]);

  return (
    <div className="w-full flex flex-col min-h-full text-black">
      {/* Mobile Directory Sub-Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-pesofts-gray-100 bg-pesofts-gray-50/90 backdrop-blur-sm sticky top-16 z-25 select-none">
        <div className="flex items-center text-xs font-semibold text-black">
          <span>Docs</span>
          <ChevronRight className="w-3 h-3 mx-1 text-black" />
          <span>{article.categoryName}</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <Menu className="w-3.5 h-3.5 mr-1" /> Browse Menu
        </button>
      </div>

      {/* Mobile Sidebar Drawer overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Catcher */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full bg-white shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-pesofts-gray-100">
              <span className="text-sm font-bold text-black">Documentation Directory</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-md text-black hover:text-orange-600 hover:bg-pesofts-gray-50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-grow overflow-hidden" onClick={() => setIsMobileSidebarOpen(false)}>
              <DocSidebar categories={categories} />
            </div>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8">

        {/* Middle Column: Core Documentation Article */}
        <div className="lg:col-span-9 min-w-0">

          {/* Breadcrumbs - Desktop */}
          <nav className="hidden md:flex items-center space-x-1.5 text-xs text-black font-semibold mb-6 select-none">
            <Link href="/docs" className="hover:text-orange-600 transition-colors">Docs</Link>
            <ChevronRight className="w-3 h-3 text-black" />
            <span className="hover:text-orange-600 transition-colors cursor-pointer">{article.categoryName}</span>
            <ChevronRight className="w-3 h-3 text-black" />
            <span className="text-black font-bold">{article.title}</span>
          </nav>

          {/* Document Header Title & Admin Action */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                {article.title}
              </h1>
              {isAdmin && (
                <Link
                  href={`/docs/edit/${article.categorySlug}/${article.slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-all select-none"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" /> Edit Document
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-black select-none">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100/60">
                {article.categoryName}
              </span>
              <span>Updated {article.updatedDate}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
          </header>

          <hr className="border-pesofts-gray-100 my-6" />

          {/* Prerequisite Callout - Custom Box styled exactly like screenshot reference */}
          {article.slug === "your-first-exam" && (
            <div className="bg-orange-50/40 border border-orange-200/50 rounded-xl p-4 flex items-start space-x-3.5 my-6">
              <div className="bg-orange-100/70 text-orange-600 p-1.5 rounded-lg shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-orange-800 uppercase tracking-widest mb-0.5">Prerequisites</h4>
                <p className="text-xs text-orange-700 leading-relaxed font-semibold">
                  An active PeSofts workspace, an admin role, and at least one question ready to import.
                </p>
              </div>
            </div>
          )}

          {/* Rendered HTML Markup - optimized typography styling */}
          <article className="prose max-w-none text-black doc-content font-normal leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </article>
        </div>

        {/* Right Column: "ON THIS PAGE" Table of Contents list */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            {headings.length > 0 && (
              <div className="border-l border-pesofts-gray-100 pl-4 py-1.5">
                <h4 className="text-[10px] font-bold text-black uppercase tracking-widest mb-4">
                  On this page
                </h4>
                <nav className="space-y-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block text-xs transition-all duration-150 pl-1 border-l-2 ${activeId === heading.id
                          ? "text-orange-600 font-semibold border-orange-500"
                          : "text-black hover:text-orange-600 font-normal border-transparent hover:border-orange-500"
                        } focus:outline-none`}
                    >
                      # {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Help Prompt */}
            <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-100 rounded-xl p-5">
              <h5 className="text-xs font-bold text-black mb-1">Still stuck?</h5>
              <p className="text-[11px] text-black leading-relaxed mb-3.5 font-normal">
                If our documentation doesn&apos;t answer your question, get in touch with support.
              </p>
              <a
                href="https://pesofts.com/contact.html"
                className="inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Contact Support <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
