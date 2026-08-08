"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Save, Eye, FileEdit, ArrowLeft, Loader2 } from "lucide-react";
import { MediaUploadCards } from "@/components/ui/MediaUploadCards";

export default function NewDocPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [readingTime, setReadingTime] = useState("5 min");
  const [description, setDescription] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  
  // UI states
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const categoriesMap = [
    { slug: "getting-started", name: "Getting Started" },
    { slug: "exam-creation", name: "Exam Creation" },
    { slug: "question-bank", name: "Question Bank" },
    { slug: "candidate-management", name: "Candidate Management" },
    { slug: "ai-proctoring", name: "AI Proctoring" },
    { slug: "features", name: "Platform Features" },
    { slug: "advanced", name: "Advanced Settings" },
  ];

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
    setReadingTime(`${minutes} min read`);
  }, [content]);

  // Compile markdown to HTML for preview tab
  useEffect(() => {
    if (tab === "preview" && content.trim()) {
      import("@/lib/markdown")
        .then(({ markdownToHtml }) => markdownToHtml(content))
        .then((html) => setPreviewHtml(html))
        .catch(() => setPreviewHtml("<p class='text-red-500'>Error parsing Markdown</p>"));
    } else {
      setPreviewHtml("<p class='text-black italic'>Write some markdown content to preview it here.</p>");
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
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-sm font-semibold text-black">Checking authorization...</p>
      </div>
    );
  }



  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Document title is required.");
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setError("You must be logged in to publish documentation.");
        setPublishing(false);
        return;
      }

      const selectedCat = categoriesMap[categoryIndex];

      const response = await fetch("/api/docs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug,
          categorySlug: selectedCat.slug,
          categoryName: selectedCat.name,
          title,
          description,
          readingTime,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to publish document. Check logs.");
      } else {
        router.push(`/docs/${selectedCat.slug}/${slug}`);
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
        
        {/* Back Link */}
        <Link
          href="/docs"
          className="inline-flex items-center text-xs font-bold text-black hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Docs Directory
        </Link>



        {/* Form & Workspace Container */}
        <form onSubmit={handlePublish} className="space-y-8 bg-white border border-pesofts-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-pesofts-gray-100">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block mb-1">
                Docs Studio
              </span>
              <h1 className="text-2xl font-black text-black tracking-tight">
                Create New Documentation Article
              </h1>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={publishing}
              className="flex items-center font-bold text-xs shadow-sm !bg-orange-500 hover:!bg-orange-600 focus:!ring-orange-500 border-transparent text-white"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Publish Document
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm font-semibold text-orange-600">
              {error}
            </div>
          )}



          {/* Title & Metadata fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Setting up custom domains"
                required
                className="w-full px-4 py-2.5 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                Document Slug (URL path)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. setting-up-custom-domains"
                required
                className="w-full px-4 py-2.5 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                Category Group
              </label>
              <select
                value={categoryIndex}
                onChange={(e) => setCategoryIndex(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm text-black bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                {categoriesMap.map((cat, i) => (
                  <option key={cat.slug} value={i}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                Reading Time Estimate
              </label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
              Brief Description (SEO Description)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a search-engine friendly summary of this document..."
              rows={2}
              className="w-full px-4 py-2.5 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 resize-y"
            />
          </div>

          {/* Tab switching */}
          <div className="border-b border-pesofts-gray-100">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  tab === "write"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-black hover:text-orange-500"
                }`}
              >
                <span className="flex items-center">
                  <FileEdit className="w-4 h-4 mr-1.5" /> Write Markdown
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  tab === "preview"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-black hover:text-orange-500"
                }`}
              >
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1.5" /> Live Preview
                </span>
              </button>
            </div>
          </div>

          {/* Editor Workspace */}
          {tab === "write" ? (
            <div className="space-y-4">
              <MediaUploadCards
                content={content}
                setContent={setContent}
                textareaRef={textareaRef}
              />
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Document Body (Markdown)
                </label>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="## Heading&#10;Write content in standard Markdown format here..."
                  rows={16}
                  required
                  className="w-full px-4 py-3 text-sm text-black placeholder-pesofts-gray-500 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono resize-y"
                />
              </div>
            </div>
          ) : (
            <div className="bg-pesofts-gray-50/50 border border-pesofts-gray-200 rounded-2xl p-6 sm:p-8 min-h-[300px]">
              <article className="prose max-w-none text-black doc-content font-normal leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </article>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
