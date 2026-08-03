"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/knowledge/Breadcrumb";
import { Save, Eye, FileEdit, HelpCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("AI Proctoring");
  const [customCategory, setCustomCategory] = useState("");
  const [readingTime, setReadingTime] = useState("5 min");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  
  // UI states
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word/space/dash
      .replace(/[\s_-]+/g, "-") // replace spaces/underscores with single dash
      .replace(/^-+|-+$/g, ""); // trim dashes
    setSlug(generatedSlug);
  }, [title]);

  // Auto-calculate reading time
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadingTime(`${minutes} min`);
  }, [content]);

  // Compile markdown to HTML for preview tab
  useEffect(() => {
    if (tab === "preview" && content.trim()) {
      import("@/lib/markdown")
        .then(({ markdownToHtml }) => markdownToHtml(content))
        .then((html) => setPreviewHtml(html))
        .catch(() => setPreviewHtml("<p class='text-red-500'>Error parsing Markdown</p>"));
    } else {
      setPreviewHtml("<p class='text-pesofts-gray-400 italic'>Write some markdown content to preview it here.</p>");
    }
  }, [tab, content]);

  // Guard access: Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] bg-pesofts-gray-50/30">
        <Loader2 className="w-8 h-8 text-pesofts-red animate-spin mb-4" />
        <p className="text-sm font-semibold text-pesofts-gray-500">Checking authorization...</p>
      </div>
    );
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!content.trim()) {
      setError("Markdown content is required.");
      return;
    }

    setPublishing(true);

    try {
      // Get the current user's session token for security verification
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setError("You must be logged in to publish articles.");
        setPublishing(false);
        return;
      }

      const selectedCategory = category === "Custom" ? customCategory.trim() : category;
      if (!selectedCategory) {
        setError("Please specify a category.");
        setPublishing(false);
        return;
      }

      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug,
          title,
          description,
          category: selectedCategory,
          readingTime,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to publish article. Check logs.");
      } else {
        router.push(`/knowledge-base/${slug}`);
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred while publishing.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-pesofts-gray-50/30 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Knowledge Base", href: "/knowledge-base" },
            { label: "New Article" },
          ]}
          className="mb-6"
        />

        {/* Back Link */}
        <Link
          href="/knowledge-base"
          className="inline-flex items-center text-xs font-bold text-pesofts-gray-500 hover:text-pesofts-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Knowledge Base
        </Link>

        {/* Form & Workspace Container */}
        <form onSubmit={handlePublish} className="space-y-8 bg-white border border-pesofts-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-pesofts-gray-100">
            <div>
              <span className="text-xs font-bold text-pesofts-red uppercase tracking-wider block mb-1">
                Admin Studio
              </span>
              <h1 className="text-2xl font-black text-pesofts-gray-900 tracking-tight">
                Create New Article
              </h1>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={publishing}
              className="flex items-center font-bold text-xs shadow-sm"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Publish Article
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-pesofts-red-50 border border-pesofts-red-200 text-pesofts-red-700 p-4 rounded-xl text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Setting up Secure Browser Environment"
                className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm font-bold text-pesofts-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                Slug (URL Path)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="secure-browser-setup"
                className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm font-semibold text-pesofts-gray-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-800 bg-white transition-all"
              >
                <option value="AI Proctoring">AI Proctoring</option>
                <option value="CBT">Computer Based Testing (CBT)</option>
                <option value="Security">Security & Lockdowns</option>
                <option value="Assessment">Modern Assessment</option>
                <option value="General">General Guides</option>
                <option value="Custom">Custom Category...</option>
              </select>
            </div>

            {category === "Custom" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                  Custom Category Name
                </label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. AI Proctoring Tools"
                  className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-800 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                Reading Time (Auto-calculated)
              </label>
              <input
                type="text"
                required
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-800 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
              Brief Description
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short card summary for the listing page..."
              className="w-full px-4 py-3 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-600 leading-relaxed transition-all"
            />
          </div>

          {/* Edit Tabs */}
          <div className="border-t border-pesofts-gray-100 pt-6">
            <div className="flex border-b border-pesofts-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`flex items-center px-4 py-2 border-b-2 font-semibold text-xs tracking-wider uppercase transition-colors ${
                  tab === "write"
                    ? "border-pesofts-red text-pesofts-red"
                    : "border-transparent text-pesofts-gray-400 hover:text-pesofts-gray-700"
                }`}
              >
                <FileEdit className="w-3.5 h-3.5 mr-1.5" />
                Write Markdown
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`flex items-center px-4 py-2 border-b-2 font-semibold text-xs tracking-wider uppercase transition-colors ${
                  tab === "preview"
                    ? "border-pesofts-red text-pesofts-red"
                    : "border-transparent text-pesofts-gray-400 hover:text-pesofts-gray-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Live Preview
              </button>
            </div>

            {tab === "write" ? (
              <div className="space-y-2">
                <textarea
                  required
                  rows={22}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Enter your Markdown document title

Write your long form guide here. Use headers like ## Subtitle to generate sections.

## Code Block Example
```js
console.log('Hello examinees');
```
"
                  className="w-full px-4 py-4 border border-pesofts-gray-200 rounded-2xl font-mono text-sm leading-relaxed text-pesofts-gray-800 focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent focus:bg-white transition-all"
                />
                <span className="flex items-center text-[10px] text-pesofts-gray-400">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Markdown is supported. Auto-saves drafts in form state.
                </span>
              </div>
            ) : (
              <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-6 sm:p-8 min-h-[400px]">
                <h1 className="text-3xl font-extrabold text-pesofts-gray-900 mb-2">{title || "Untitled"}</h1>
                <p className="text-sm text-pesofts-gray-500 mb-6 italic">{description || "No description provided."}</p>
                <div
                  className="prose max-w-none text-pesofts-gray-700 article-content"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
