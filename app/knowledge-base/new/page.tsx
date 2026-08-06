"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/knowledge/Breadcrumb";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { NewArticleForm } from "@/components/knowledge/NewArticleForm";

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
    <div className="bg-pesofts-gray-50/30 min-h-screen py-10 text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: "Knowledge Base", href: "/knowledge-base" },
            { label: "New Article" }
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

        {/* Form Container */}
        <form onSubmit={handlePublish} className="space-y-8 bg-white border border-pesofts-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-pesofts-gray-100">
            <div>
              <span className="text-xs font-bold text-pesofts-red uppercase tracking-wider block mb-1">
                Admin Studio
              </span>
              <h1 className="text-2xl font-black text-pesofts-gray-900 tracking-tight">
                Create Knowledge Base Article
              </h1>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={publishing}
              className="flex items-center font-bold text-xs shadow-sm !bg-pesofts-red hover:!bg-pesofts-red-600 focus:!ring-pesofts-red border-transparent text-white"
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

          <NewArticleForm
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            category={category}
            setCategory={setCategory}
            customCategory={customCategory}
            setCustomCategory={setCustomCategory}
            readingTime={readingTime}
            setReadingTime={setReadingTime}
            description={description}
            setDescription={setDescription}
            content={content}
            setContent={setContent}
            tab={tab}
            setTab={setTab}
            previewHtml={previewHtml}
          />
        </form>
      </div>
    </div>
  );
}
