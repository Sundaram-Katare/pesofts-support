"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Search, MessageSquare, Eye, ChevronRight, Pin, CheckCircle2, User, HelpCircle, ArrowUp } from "lucide-react";

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
  const [selectedTab, setSelectedTab] = useState<"recent" | "trending" | "unanswered" | "solved">("recent");
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
    .filter((q) => {
      if (selectedTab === "unanswered") return (q.community_replies || []).length === 0;
      if (selectedTab === "solved") return q.is_solved;
      return true;
    })
    .sort((a, b) => {
      // Pinned questions always stay on top
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      if (selectedTab === "trending") {
        const scoreA = (a.community_upvotes || []).length * 10 + a.views;
        const scoreB = (b.community_upvotes || []).length * 10 + b.views;
        return scoreB - scoreA;
      }

      // Default to recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="bg-pesofts-gray-50 flex-grow font-sans">
      {/* Main Banner */}
      <div className="bg-white border-b border-pesofts-gray-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pesofts-gray-100 text-xs font-semibold text-pesofts-gray-600 mb-6 border border-pesofts-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-pesofts-red animate-pulse"></span>
            <span>
              {totalMembers.toLocaleString()} {totalMembers === 1 ? "practitioner" : "practitioners"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-pesofts-gray-900 tracking-tight mb-4">
            The community for online <br className="hidden sm:inline" />
            examination teams
          </h1>

          <p className="text-lg text-pesofts-gray-500 max-w-3xl mb-8 leading-relaxed">
            Ask questions, share workflows and learn from universities, coaching institutes and
            enterprise recruiters running PeSofts.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button href="/community/ask" variant="primary" className="shadow-lg hover:shadow-xl transition-all">
              Ask a question <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              onClick={() => {
                document.getElementById("discussions-list")?.scrollIntoView({ behavior: "smooth" });
              }}
              variant="outline"
              className="bg-white"
            >
              Browse discussions
            </Button>
          </div>

          {/* Large Search Bar */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-pesofts-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, tags or usernames..."
              className="block w-full pl-12 pr-6 py-4 text-base text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="discussions-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {isTableMissing ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-4xl mx-auto mb-10">
            <div className="flex items-start space-x-4">
              <HelpCircle className="h-8 w-8 text-pesofts-red mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-pesofts-gray-900 mb-2">Supabase Tables Missing</h3>
                <p className="text-sm text-pesofts-gray-600 mb-4 leading-relaxed">
                  The application is trying to load questions from Supabase, but the necessary tables (<code>community_questions</code>, <code>community_replies</code>, <code>community_upvotes</code>) have not been created yet in your Supabase project.
                </p>
                <div className="bg-pesofts-gray-900 text-pesofts-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-60 mb-4 select-all">
                  {`/* Run these commands in your Supabase SQL Editor */
-- Create community_questions, community_replies, community_upvotes, and profiles.`}
                </div>
                <p className="text-xs text-pesofts-gray-500">
                  Please open your Supabase dashboard SQL editor, copy the tables and RLS creation SQL from your <strong>Implementation Plan</strong>, run it, and refresh this page.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Categories & Featured */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-widest mb-4">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    selectedCategory === null
                      ? "bg-white text-pesofts-red shadow-sm"
                      : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-100"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-xs text-pesofts-gray-400 bg-pesofts-gray-100 px-2 py-0.5 rounded-full">
                    {questions.length}
                  </span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      selectedCategory === cat.name
                        ? "bg-white text-pesofts-red shadow-sm"
                        : "text-pesofts-gray-600 hover:text-pesofts-gray-900 hover:bg-pesofts-gray-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-pesofts-gray-400 bg-pesofts-gray-100 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Solution */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-pesofts-red-100 rounded-2xl p-5 shadow-sm">
              <span className="inline-block text-[10px] font-extrabold text-pesofts-red bg-pesofts-red-50 border border-pesofts-red-200 px-2 py-0.5 rounded-full uppercase tracking-wider mb-3">
                Featured Solution
              </span>
              <h4 className="font-bold text-pesofts-gray-950 mb-2 text-sm leading-snug">
                Configuring safe exam browser fallback for hybrid tests
              </h4>
              <p className="text-xs text-pesofts-gray-600 mb-4 leading-relaxed">
                A community-verified playbook for preventing exam cheating by enforcing secure browser configurations with seamless fallback mechanisms.
              </p>
              <Link
                href="/knowledge-base"
                className="text-xs font-bold text-pesofts-red hover:text-pesofts-red-700 inline-flex items-center"
              >
                Read playbook <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Middle Column - Recent discussions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-pesofts-gray-900">Recent discussions</h2>
              </div>

              {/* Sort/Filter pills */}
              <div className="flex flex-wrap items-center bg-white border border-pesofts-gray-200 rounded-xl p-1 shadow-sm gap-1 self-start sm:self-auto">
                {[
                  { id: "recent", label: "Recent" },
                  { id: "trending", label: "Trending" },
                  { id: "unanswered", label: "Unanswered" },
                  { id: "solved", label: "Solved" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      selectedTab === tab.id
                        ? "bg-pesofts-gray-900 text-white"
                        : "text-pesofts-gray-500 hover:text-pesofts-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discussions List */}
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
                <HelpCircle className="h-12 w-12 text-pesofts-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-pesofts-gray-900 mb-2">No discussions found</h3>
                <p className="text-sm text-pesofts-gray-500 max-w-md mx-auto mb-6">
                  {selectedCategory
                    ? `No discussions have been posted in the "${selectedCategory}" category yet.`
                    : "No discussions match your current search and filters. Be the first to start a conversation!"}
                </p>
                <Button href="/community/ask" variant="primary">
                  Start a discussion
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((q) => {
                  const replyCount = (q.community_replies || []).length;
                  const upvoteCount = (q.community_upvotes || []).length;
                  const hasUpvoted = user && (q.community_upvotes || []).some((u) => u.user_id === user.id);

                  return (
                    <Link
                      key={q.id}
                      href={`/community/question/${q.id}`}
                      className="block bg-white hover:border-pesofts-gray-300 border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-pesofts-gray-150 flex items-center justify-center font-bold text-sm text-pesofts-gray-700 bg-pesofts-gray-100 border border-pesofts-gray-200 flex-shrink-0">
                          {q.profiles?.avatar_url ? (
                            <Image
                              src={q.profiles.avatar_url}
                              alt={q.profiles.full_name || ""}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(q.profiles?.full_name || null, q.profiles?.id || null)
                          )}
                        </div>

                        {/* Card Contents */}
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {q.is_pinned && (
                              <span className="inline-flex items-center text-[10px] font-extrabold text-pesofts-red bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                <Pin className="h-3 w-3 mr-0.5" /> Pinned
                              </span>
                            )}
                            {q.is_solved ? (
                              <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 mr-0.5" /> Solved
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] font-extrabold text-pesofts-gray-500 bg-pesofts-gray-100 border border-pesofts-gray-200 px-2 py-0.5 rounded-full">
                                Open
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-pesofts-gray-500">
                              · {q.category}
                            </span>
                          </div>

                          <h3 className="font-bold text-pesofts-gray-900 text-base mb-1.5 hover:text-pesofts-red leading-snug break-words">
                            {q.title}
                          </h3>

                          <div className="text-xs text-pesofts-gray-500 flex flex-wrap items-center gap-1 leading-none">
                            <span className="font-semibold text-pesofts-gray-700">
                              {q.profiles?.full_name || "Community Member"}
                            </span>
                            {q.profiles?.title && (
                              <>
                                <span>·</span>
                                <span>{q.profiles.title}</span>
                              </>
                            )}
                            {q.profiles?.organization && (
                              <>
                                <span>·</span>
                                <span>{q.profiles.organization}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right stats and Time */}
                        <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0 text-right text-xs text-pesofts-gray-400 pl-2">
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="flex items-center">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" /> {replyCount}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-1" /> {q.views}
                            </span>
                          </div>

                          <span className="text-[10px] font-semibold text-pesofts-gray-400">
                            Last: {timeAgo(q.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Vote Footer Action */}
                      <div className="mt-4 pt-4 border-t border-pesofts-gray-100 flex items-center justify-between">
                        <button
                          onClick={(e) => handleUpvote(e, q.id)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            hasUpvoted
                              ? "bg-pesofts-red text-white border-transparent"
                              : "bg-white hover:bg-pesofts-gray-50 text-pesofts-gray-600 border-pesofts-gray-200"
                          }`}
                        >
                          <ArrowUp className="h-3.5 w-3.5 mr-1" />
                          <span>Upvote {upvoteCount > 0 ? `(${upvoteCount})` : ""}</span>
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column - Stats & Trending */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Card */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-widest mb-6">
                Community Stats
              </h3>
              <div className="space-y-5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-pesofts-red flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-pesofts-gray-900">
                      {totalMembers.toLocaleString()}
                    </div>
                    <div className="text-xs text-pesofts-gray-400 font-semibold">Members</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-pesofts-gray-950">
                      {totalDiscussions.toLocaleString()}
                    </div>
                    <div className="text-xs text-pesofts-gray-400 font-semibold">Discussions</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-pesofts-gray-900">
                      {totalSolved.toLocaleString()}
                    </div>
                    <div className="text-xs text-pesofts-gray-400 font-semibold">Solved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-widest mb-4">
                Trending Topics
              </h3>
              <div className="space-y-4">
                {[
                  { rank: 1, title: "Live proctoring alerts" },
                  { rank: 2, title: "Multi-language exams" },
                  { rank: 3, title: "Bulk candidate import" },
                ].map((topic) => (
                  <button
                    key={topic.rank}
                    onClick={() => setSearchQuery(topic.title)}
                    className="w-full text-left flex items-start space-x-3 group"
                  >
                    <span className="text-xs font-bold text-pesofts-gray-400 bg-pesofts-gray-100 px-2 py-0.5 rounded">
                      {topic.rank}
                    </span>
                    <span className="text-sm font-semibold text-pesofts-gray-700 group-hover:text-pesofts-red group-hover:underline leading-tight transition-colors">
                      {topic.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
