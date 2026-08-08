"use client";

import React, { useRef } from "react";
import { FileEdit, Eye } from "lucide-react";
import { MediaUploadCards } from "@/components/ui/MediaUploadCards";

interface CategoryMapEntry {
  slug: string;
  name: string;
}

interface EditDocFormProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  categorySlug: string;
  setCategorySlug: (val: string) => void;
  readingTime: string;
  setReadingTime: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  categoriesMap: CategoryMapEntry[];
  tab: "write" | "preview";
  setTab: (val: "write" | "preview") => void;
  previewHtml: string;
}

export const EditDocForm: React.FC<EditDocFormProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  categorySlug,
  setCategorySlug,
  readingTime,
  setReadingTime,
  description,
  setDescription,
  content,
  setContent,
  categoriesMap,
  tab,
  setTab,
  previewHtml,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="space-y-6">
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
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full px-4 py-2.5 text-sm text-black bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {categoriesMap.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
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
    </div>
  );
};
