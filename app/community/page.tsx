"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { HelpCircle } from "lucide-react";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunitySidebar } from "@/components/community/CommunitySidebar";
import { DiscussionCard } from "@/components/community/DiscussionCard";
import { CommunityStatsCard } from "@/components/community/CommunityStatsCard";

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  title: string | null;
  organization: string | null;
  avatar_url: string | null;
}

interface Question {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_solved: boolean;
  views: number;
  created_at: string;
  profiles?: Profile;
  community_replies?: { id: string; user_id: string }[];
  community_upvotes?: { id: string; user_id: string }[];
}

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTableMissing, setIsTableMissing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_questions")
        .select(`
          *,
          profiles:user_id(*),
          community_replies(id, user_id),
          community_upvotes(id, user_id)
        `);

      if (error) {
        console.error("Error loading questions:", error);
        if (error.message && (error.message.includes("does not exist") || error.code === "P0001" || error.code === "42P01")) {
          setIsTableMissing(true);
        }
      } else {
        setQuestions(data || []);
      }

      // Fetch exact members count from DB
      const { data: pData, error: pError } = await supabase
        .from("profiles")
        .select("id");
      if (!pError && pData) {
        setMembersCount(pData.length);
      }
    } catch (err) {
      console.error("Failed to fetch community questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (e: React.MouseEvent, questionId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const upvotesList = question.community_upvotes || [];
    const userUpvote = upvotesList.find((u) => u.user_id === user.id);

    if (userUpvote) {
      // Delete upvote
      const { error } = await supabase
        .from("community_upvotes")
        .delete()
        .eq("id", userUpvote.id);

      if (!error) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                community_upvotes: upvotesList.filter((u) => u.id !== userUpvote.id),
              };
            }
            return q;
          })
        );
      }
    } else {
      // Insert upvote
      const { data, error } = await supabase
        .from("community_upvotes")
        .insert({ question_id: questionId, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                community_upvotes: [...upvotesList, data],
              };
            }
            return q;
          })
        );
      }
    }
  };

  const getInitials = (fullName: string | null, email: string | null) => {
    if (fullName) {
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    return "just now";
  };

  // Exact counts from DB
  const categories = [
    "AI Proctoring",
    "Question Banks",
    "Exam Security",
    "Reports & Analytics",
    "Recruitment",
    "Integrations",
  ].map((catName) => {
    const realCount = questions.filter((q) => q.category === catName).length;
    return {
      name: catName,
      count: realCount,
    };
  });

  const totalMembers = membersCount;
  const totalDiscussions = questions.length;
  const totalSolved = questions.filter((q) => q.is_solved).length;

  // Filter and Sort Questions
  const filteredQuestions = questions
    .filter((q) => {
      const matchesCategory = selectedCategory ? q.category === selectedCategory : true;
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(term) ||
        q.content.toLowerCase().includes(term) ||
        (q.profiles?.full_name || "").toLowerCase().includes(term) ||
        (q.profiles?.organization || "").toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Pinned questions always stay on top
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      // Default to recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="bg-pesofts-gray-50 flex-grow font-sans">
      {/* Main Banner */}
      <CommunityHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalMembers={totalMembers}
        onBrowseClick={() => {
          document.getElementById("discussions-list")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <div id="discussions-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {isTableMissing ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 max-w-4xl mx-auto mb-10">
            <div className="flex items-start space-x-4">
              <HelpCircle className="h-8 w-8 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-black mb-2">Supabase Tables Missing</h3>
                <p className="text-sm text-black mb-4 leading-relaxed">
                  The application is trying to load questions from Supabase, but the necessary tables (<code>community_questions</code>, <code>community_replies</code>, <code>community_upvotes</code>) have not been created yet in your Supabase project.
                </p>
                <div className="bg-pesofts-gray-900 text-pesofts-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-60 mb-4 select-all">
                  {`/* Run these commands in your Supabase SQL Editor */
-- Create community_questions, community_replies, community_upvotes, and profiles.`}
                </div>
                <p className="text-xs text-black">
                  Please open your Supabase dashboard SQL editor, copy the tables and RLS creation SQL from your <strong>Implementation Plan</strong>, run it, and refresh this page.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Categories */}
          <div className="lg:col-span-3 space-y-8">
            <CommunitySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              totalQuestionsCount={questions.length}
            />
          </div>

          {/* Middle Column - Recent discussions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-black">Recent discussions</h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-6 border border-pesofts-gray-200 animate-pulse space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-pesofts-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-pesofts-gray-200 rounded w-1/4"></div>
                        <div className="h-2 bg-pesofts-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-pesofts-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-pesofts-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-12 text-center">
                <HelpCircle className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-bold text-black mb-2">No discussions found</h3>
                <p className="text-sm text-black max-w-md mx-auto mb-6">
                  {selectedCategory
                    ? `No discussions have been posted in the "${selectedCategory}" category yet.`
                    : "No discussions match your current search. Be the first to start a conversation!"}
                </p>
                <Button 
                  href="/community/ask" 
                  variant="primary"
                  className="!bg-orange-500 hover:!bg-orange-600 focus:!ring-orange-500 border-transparent"
                >
                  Start a discussion
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((q) => (
                  <DiscussionCard
                    key={q.id}
                    question={q}
                    currentUserId={user?.id}
                    onUpvote={handleUpvote}
                    getInitials={getInitials}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-3 space-y-8">
            <CommunityStatsCard
              totalMembers={totalMembers}
              totalDiscussions={totalDiscussions}
              totalSolved={totalSolved}
            />
          </div>

        </div>
      </div>

    </div>
  );
}
