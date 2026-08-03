"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, HelpCircle } from "lucide-react";

export default function AskQuestionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI Proctoring");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/community/ask");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !content.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase
        .from("community_questions")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category,
          is_pinned: false,
          is_solved: false,
          views: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating question:", error);
        setErrorMsg(error.message || "Failed to submit question. Please check if your Supabase tables are created.");
      } else if (data) {
        router.push("/community");
      }
    } catch (err: any) {
      console.error("Exception creating question:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "AI Proctoring",
    "Question Banks",
    "Exam Security",
    "Reports & Analytics",
    "Recruitment",
    "Integrations",
  ];

  if (authLoading || !user) {
    return (
      <div className="bg-pesofts-gray-50 flex-grow flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pesofts-red"></div>
      </div>
    );
  }

  return (
    <div className="bg-pesofts-gray-50 flex-grow py-10 font-sans">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-bold text-pesofts-gray-500 hover:text-pesofts-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to discussions
        </button>

        <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-pesofts-gray-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-pesofts-red">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-pesofts-gray-950">Ask a Question</h1>
              <p className="text-xs text-pesofts-gray-400 font-semibold">
                Share your problem with the PeSofts practitioner community
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-pesofts-red font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-wider mb-2">
                Question Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI proctoring flagging too many false positives during long exams"
                required
                maxLength={150}
                className="block w-full px-4 py-3 text-sm text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all"
              />
              <span className="text-[10px] text-pesofts-gray-400 mt-1 block">
                Be specific and brief. Max 150 characters.
              </span>
            </div>

            {/* Category selection */}
            <div>
              <label htmlFor="category" className="block text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-4 py-3 text-sm text-pesofts-gray-900 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="content" className="block text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-wider mb-2">
                Description / Details
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide details about your query, the tools you are using, and the steps to reproduce the issue..."
                required
                rows={8}
                className="block w-full px-4 py-3 text-sm text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all font-sans resize-y"
              />
              <span className="text-[10px] text-pesofts-gray-400 mt-1 block">
                Explain your question clearly. You can use markdown styling.
              </span>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-pesofts-gray-100 flex items-center justify-end space-x-3">
              <Button type="button" onClick={() => router.back()} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="min-w-[120px]">
                {submitting ? "Submitting..." : "Post Question"}
              </Button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
