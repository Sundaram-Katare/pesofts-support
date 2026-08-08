"use client";

import React, { useRef } from "react";
import { FileEdit, Eye, HelpCircle } from "lucide-react";
import { MediaUploadCards } from "@/components/ui/MediaUploadCards";

interface NewArticleFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  customCategory: string;
  setCustomCategory: (val: string) => void;
  readingTime: string;
  setReadingTime: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  tab: "write" | "preview";
  setTab: (val: "write" | "preview") => void;
  previewHtml: string;
}

export const NewArticleForm: React.FC<NewArticleFormProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  category,
  setCategory,
  customCategory,
  setCustomCategory,
  readingTime,
  setReadingTime,
  description,
  setDescription,
  content,
  setContent,
  tab,
  setTab,
  previewHtml,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="space-y-6">
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
            className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-bold text-pesofts-gray-900 transition-all"
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
            className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-semibold text-pesofts-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-pesofts-gray-400 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-pesofts-gray-800 bg-white transition-all"
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
              className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-pesofts-gray-800 transition-all"
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
            className="w-full px-4 py-2.5 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-pesofts-gray-800 transition-all"
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
          className="w-full px-4 py-3 border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-pesofts-gray-600 leading-relaxed transition-all"
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
                ? "border-orange-500 text-orange-600"
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
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-pesofts-gray-400 hover:text-pesofts-gray-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Live Preview
          </button>
        </div>

        {tab === "write" ? (
          <div className="space-y-4">
            <MediaUploadCards
              content={content}
              setContent={setContent}
              textareaRef={textareaRef}
            />
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                required
                rows={22}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Enter your Markdown document title&#10;&#10;Write your long form guide here. Use headers like ## Subtitle to generate sections.&#10;&#10;## Code Block Example&#10;```js&#10;console.log('Hello examinees');&#10;```&#10;"
                className="w-full px-4 py-4 border border-pesofts-gray-200 rounded-2xl font-mono text-sm leading-relaxed text-pesofts-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all"
              />
              <span className="flex items-center text-[10px] text-pesofts-gray-400">
                <HelpCircle className="w-3 h-3 mr-1" />
                Markdown is supported. Auto-saves drafts in form state.
              </span>
            </div>
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
    </div>
  );
};
