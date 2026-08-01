"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import {
  Edit3,
  Save,
  X,
  Clock,
  Calendar,
  Bookmark,
  ChevronLeft,
  List,
  ArrowRight,
  Eye,
  FileEdit,
} from "lucide-react";
import { Article } from "@/lib/articles";

interface ArticleContainerProps {
  article: Article;
  htmlContent: string;
  headings: { text: string; id: string }[];
  relatedArticles: Article[];
  formattedDate: string;
}

export const ArticleContainer: React.FC<ArticleContainerProps> = ({
  article,
  htmlContent,
  headings,
  relatedArticles,
  formattedDate,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const [category, setCategory] = useState(article.category);
  const [readingTime, setReadingTime] = useState(article.readingTime);
  const [content, setContent] = useState(article.content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview tab in editing mode
  const [editTab, setEditTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");

  // Sync state if server article changes
  useEffect(() => {
    setTitle(article.title);
    setDescription(article.description);
    setCategory(article.category);
    setReadingTime(article.readingTime);
    setContent(article.content);
  }, [article]);

  // Convert markdown to preview HTML when switching to preview tab
  useEffect(() => {
    if (editTab === "preview") {
      // Simple client-side converter just for editing preview feedback
      // In production, we refresh and use Server side compiled html,
      // but a simple regex replacer is great for live editing feedback.
      const html = content
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*)\*/g, "<em>$1</em>")
        .replace(/\n$/gim, "<br />");
      setPreviewHtml(html);
    }
  }, [editTab, content]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("articles")
        .update({
          title,
          description,
          category,
          reading_time: readingTime,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", article.slug);

      if (updateError) {
        setError(updateError.message);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset state
    setTitle(article.title);
    setDescription(article.description);
    setCategory(article.category);
    setReadingTime(article.readingTime);
    setContent(article.content);
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white py-10 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Actions */}
          <div className="flex justify-between items-center pb-6 border-b border-pesofts-gray-100 mb-8">
            <div>
              <span className="text-xs font-bold text-pesofts-red uppercase tracking-wider block mb-1">
                Admin Studio
              </span>
              <h1 className="text-2xl font-black text-pesofts-gray-900 tracking-tight">
                Edit Document
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center font-bold text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center font-bold text-xs"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : (
                  <Save className="w-3.5 h-3.5 mr-1" />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-pesofts-red-50 border border-pesofts-red-200 text-pesofts-red-700 p-3.5 rounded-xl text-xs font-medium mb-6 leading-relaxed">
              {error}
            </div>
          )}

          {/* Edit Tabs */}
          <div className="flex border-b border-pesofts-gray-200 mb-6">
            <button
              onClick={() => setEditTab("write")}
              className={`flex items-center px-4 py-2 border-b-2 font-semibold text-xs tracking-wider uppercase transition-colors ${
                editTab === "write"
                  ? "border-pesofts-red text-pesofts-red"
                  : "border-transparent text-pesofts-gray-400 hover:text-pesofts-gray-700"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 mr-1.5" />
              Write Markdown
            </button>
            <button
              onClick={() => setEditTab("preview")}
              className={`flex items-center px-4 py-2 border-b-2 font-semibold text-xs tracking-wider uppercase transition-colors ${
                editTab === "preview"
                  ? "border-pesofts-red text-pesofts-red"
                  : "border-transparent text-pesofts-gray-400 hover:text-pesofts-gray-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Live Preview
            </button>
          </div>

          {editTab === "write" ? (
            <div className="space-y-6">
              {/* Meta Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-base font-bold text-pesofts-gray-900"
                    placeholder="Article title"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-800"
                    placeholder="e.g. AI Proctoring"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-800"
                    placeholder="e.g. 12 min"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                    Slug (Read-Only)
                  </label>
                  <input
                    type="text"
                    value={article.slug}
                    disabled
                    className="w-full px-4 py-2.5 border border-pesofts-gray-200 bg-pesofts-gray-50 rounded-xl text-sm text-pesofts-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                  Brief Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent text-sm text-pesofts-gray-600 leading-relaxed"
                  placeholder="Summarize this article in a sentence or two..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
                  Markdown Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-4 border border-pesofts-gray-200 rounded-xl font-mono text-sm leading-relaxed text-pesofts-gray-800 focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent focus:bg-white transition-all"
                  placeholder="# Write your heading..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-8 min-h-[400px]">
              <h1 className="text-3xl font-extrabold text-pesofts-gray-900 mb-2">{title}</h1>
              <p className="text-sm text-pesofts-gray-500 mb-6 italic">{description}</p>
              <div
                className="prose max-w-none text-pesofts-gray-700"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal view page
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Article Content Column */}
      <article className="lg:col-span-8">
        {/* Header info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href={`/knowledge-base?category=${encodeURIComponent(article.category)}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-pesofts-red-50 text-pesofts-red hover:bg-pesofts-red-100 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              {article.category}
            </Link>
            <span className="inline-flex items-center text-xs text-pesofts-gray-400">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {article.readingTime} read
            </span>
            <span className="inline-flex items-center text-xs text-pesofts-gray-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Updated {formattedDate}
            </span>

            {/* Admin Edit Trigger */}
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-auto inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border border-pesofts-red bg-white text-pesofts-red hover:bg-pesofts-red-50 transition-colors"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit Article
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-pesofts-gray-900 tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg text-pesofts-gray-500 leading-relaxed italic border-l-2 border-pesofts-gray-200 pl-4 py-1">
            {article.description}
          </p>
        </div>

        {/* Rendered Markdown Body */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Bottom Actions */}
        <div className="mt-12 pt-8 border-t border-pesofts-gray-100 flex justify-between items-center">
          <Button
            href="/knowledge-base"
            variant="outline"
            className="flex items-center font-bold text-xs"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Knowledge Base Home
          </Button>

          <span className="text-xs text-pesofts-gray-400">Was this article helpful?</span>
        </div>
      </article>

      {/* Sidebar Column */}
      <aside className="lg:col-span-4 space-y-10">
        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-xl p-6">
            <h4 className="text-xs font-bold text-pesofts-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <List className="w-4 h-4 mr-1.5" />
              Table of Contents
            </h4>
            <nav className="space-y-2.5">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block text-sm text-pesofts-gray-600 hover:text-pesofts-red transition-colors duration-150 line-clamp-1 pl-1"
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Related Articles */}
        <div className="border border-pesofts-gray-200 rounded-xl p-6">
          <h4 className="text-xs font-bold text-pesofts-gray-400 uppercase tracking-wider mb-4">
            Related Articles
          </h4>
          {relatedArticles.length === 0 ? (
            <p className="text-sm text-pesofts-gray-400 font-normal">
              No other articles in this category.
            </p>
          ) : (
            <div className="space-y-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/knowledge-base/${rel.slug}`}
                  className="group block"
                >
                  <h5 className="text-sm font-bold text-pesofts-gray-800 group-hover:text-pesofts-red transition-colors duration-150 line-clamp-2">
                    {rel.title}
                  </h5>
                  <span className="inline-flex items-center text-[11px] text-pesofts-red font-medium mt-1">
                    Read now
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Support Callout */}
        <div className="bg-pesofts-red-50/30 border border-pesofts-red-100 rounded-xl p-6">
          <h4 className="font-bold text-sm text-pesofts-gray-900 mb-2">Need more assistance?</h4>
          <p className="text-xs text-pesofts-gray-500 mb-4 leading-relaxed">
            Can&apos;t find the answers you&apos;re looking for? Reach out to our technical support team for direct help.
          </p>
          <a
            href="https://pesofts.com/contact.html"
            className="inline-flex items-center justify-center font-bold rounded-lg text-xs px-4 py-2 bg-pesofts-red text-white hover:bg-pesofts-red-600 transition-all duration-200 shadow-sm"
          >
            Contact Support
          </a>
        </div>
      </aside>
    </div>
  );
};
