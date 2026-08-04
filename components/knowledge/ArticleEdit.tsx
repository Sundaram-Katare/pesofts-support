import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Save, X, FileEdit, Eye } from "lucide-react";
import { Article } from "@/lib/articles";

interface ArticleEditProps {
  article: Article;
  onSave: () => void;
  onCancel: () => void;
}

export const ArticleEdit: React.FC<ArticleEditProps> = ({
  article,
  onSave,
  onCancel,
}) => {
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

  // Convert markdown to preview HTML when switching to preview tab
  useEffect(() => {
    if (editTab === "preview") {
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setError("Unauthorized: Please log in again.");
        setIsSaving(false);
        return;
      }

      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: article.slug,
          title,
          description,
          category,
          readingTime,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update article.");
      } else {
        onSave();
      }
    } catch {
      setError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

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
              onClick={onCancel}
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
};
