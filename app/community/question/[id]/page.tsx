"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, MessageSquare, Eye, Pin, CheckCircle2, ArrowUp, Send, Check } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  title: string | null;
  organization: string | null;
  avatar_url: string | null;
}

interface Reply {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

interface Upvote {
  id: string;
  question_id: string;
  user_id: string;
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
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [questionId, setQuestionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [upvotes, setUpvotes] = useState<Upvote[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  const loadThreadDetails = useCallback(async () => {
    if (!questionId) return;
    setLoading(true);
    try {
      // 1. Fetch Question + Profile
      const { data: qData, error: qError } = await supabase
        .from("community_questions")
        .select("*, profiles:user_id(*)")
        .eq("id", questionId)
        .single();

      if (qError || !qData) {
        console.error("Error loading question:", qError);
        setLoading(false);
        return;
      }

      const currentQuestion = qData as Question;
      setQuestion(currentQuestion);

      // 2. Fetch Replies + Profiles
      const { data: rData, error: rError } = await supabase
        .from("community_replies")
        .select("*, profiles:user_id(*)")
        .eq("question_id", questionId)
        .order("created_at", { ascending: true });

      if (!rError && rData) {
        setReplies(rData as Reply[]);
      }

      // 3. Fetch Upvotes
      const { data: uData, error: uError } = await supabase
        .from("community_upvotes")
        .select("*")
        .eq("question_id", questionId);

      if (!uError && uData) {
        setUpvotes(uData as Upvote[]);
      }

      // 4. Increment view count client-side (non-blocking)
      await supabase
        .from("community_questions")
        .update({ views: currentQuestion.views + 1 })
        .eq("id", questionId);

    } catch (err) {
      console.error("Failed to load thread details:", err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  // Resolve Next.js 15 async page params
  useEffect(() => {
    params.then((p) => setQuestionId(p.id));
  }, [params]);

  useEffect(() => {
    if (questionId) {
      loadThreadDetails();
    }
  }, [questionId, loadThreadDetails]);

  const handleUpvote = async () => {
    if (!user || !questionId) {
      router.push("/login");
      return;
    }

    const userUpvote = upvotes.find((u) => u.user_id === user.id);

    if (userUpvote) {
      // Remove upvote
      const { error } = await supabase
        .from("community_upvotes")
        .delete()
        .eq("id", userUpvote.id);

      if (!error) {
        setUpvotes((prev) => prev.filter((u) => u.id !== userUpvote.id));
      }
    } else {
      // Add upvote
      const { data, error } = await supabase
        .from("community_upvotes")
        .insert({ question_id: questionId, user_id: user.id })
        .select()
        .single();

      if (!error && data) {
        setUpvotes((prev) => [...prev, data]);
      }
    }
  };

  const handleMarkSolved = async () => {
    if (!user || !question || !questionId) return;

    // Check auth permission (must be owner or admin)
    const isOwner = question.user_id === user.id;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) return;

    const newSolvedState = !question.is_solved;

    const { error } = await supabase
      .from("community_questions")
      .update({ is_solved: newSolvedState })
      .eq("id", questionId);

    if (!error) {
      setQuestion((prev) => (prev ? { ...prev, is_solved: newSolvedState } : null));
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !questionId) return;

    if (!replyContent.trim()) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    setSubmittingReply(true);
    setReplyError("");

    try {
      const { data, error } = await supabase
        .from("community_replies")
        .insert({
          question_id: questionId,
          user_id: user.id,
          content: replyContent.trim(),
        })
        .select("*, profiles:user_id(*)")
        .single();

      if (error) {
        console.error("Error creating reply:", error);
        setReplyError(error.message || "Failed to post reply.");
      } else if (data) {
        setReplies((prev) => [...prev, data as Reply]);
        setReplyContent("");
      }
    } catch (err: any) {
      console.error("Exception posting reply:", err);
      setReplyError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmittingReply(false);
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

  const hasUpvoted = user && upvotes.some((u) => u.user_id === user.id);
  const isQuestionOwner = user && question && (question.user_id === user.id || user.role === "admin");

  if (loading || !question) {
    return (
      <div className="bg-pesofts-gray-50 flex-grow flex items-center justify-center py-20">
        {loading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pesofts-red"></div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-pesofts-gray-900 mb-2">Discussion Not Found</h2>
            <p className="text-sm text-pesofts-gray-500 mb-4">
              The requested discussion thread could not be found or has been deleted.
            </p>
            <Button href="/community" variant="primary">
              Return to community
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-pesofts-gray-50 flex-grow font-sans py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Back Link */}
        <button
          onClick={() => router.push("/community")}
          className="inline-flex items-center text-sm font-bold text-pesofts-gray-500 hover:text-pesofts-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to discussions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Thread & Replies */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Question Card */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-start space-x-4 mb-6">
                {/* Author Avatar */}
                <div className="w-12 h-12 rounded-full bg-pesofts-gray-100 border border-pesofts-gray-200 flex items-center justify-center font-bold text-base text-pesofts-gray-700 flex-shrink-0">
                  {question.profiles?.avatar_url ? (
                    <Image
                      src={question.profiles.avatar_url}
                      alt={question.profiles.full_name || ""}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(question.profiles?.full_name || null, question.profiles?.id || null)
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {question.is_pinned && (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-pesofts-red bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                        <Pin className="h-3 w-3 mr-0.5" /> Pinned
                      </span>
                    )}
                    {question.is_solved ? (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 mr-0.5" /> Solved
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-extrabold text-pesofts-gray-500 bg-pesofts-gray-100 border border-pesofts-gray-200 px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-pesofts-gray-500">
                      · {question.category}
                    </span>
                  </div>

                  <h1 className="text-xl md:text-2xl font-black text-pesofts-gray-950 tracking-tight mb-2 leading-snug break-words">
                    {question.title}
                  </h1>

                  <div className="text-xs text-pesofts-gray-500 flex flex-wrap items-center gap-1.5 font-medium leading-none">
                    <span className="font-bold text-pesofts-gray-800">
                      {question.profiles?.full_name || "Community Member"}
                    </span>
                    {question.profiles?.title && (
                      <>
                        <span>·</span>
                        <span>{question.profiles.title}</span>
                      </>
                    )}
                    {question.profiles?.organization && (
                      <>
                        <span>·</span>
                        <span>{question.profiles.organization}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="text-pesofts-gray-400 font-semibold">{timeAgo(question.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="text-sm text-pesofts-gray-700 leading-relaxed whitespace-pre-wrap mb-6 border-t border-pesofts-gray-100 pt-6">
                {question.content}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-pesofts-gray-100 pt-6">
                <button
                  onClick={handleUpvote}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    hasUpvoted
                      ? "bg-pesofts-red text-white border-transparent shadow-sm"
                      : "bg-white hover:bg-pesofts-gray-50 text-pesofts-gray-600 border-pesofts-gray-200"
                  }`}
                >
                  <ArrowUp className="h-4 w-4 mr-1.5" />
                  <span>Upvote ({upvotes.length})</span>
                </button>

                {isQuestionOwner && (
                  <button
                    onClick={handleMarkSolved}
                    className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      question.is_solved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-white hover:bg-pesofts-gray-50 text-pesofts-gray-600 border-pesofts-gray-200"
                    }`}
                  >
                    {question.is_solved ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5" /> Marked as Solved
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark as Solved
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Replies Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-pesofts-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 text-pesofts-gray-400 mr-2" />
                Replies ({replies.length})
              </h2>
            </div>

            {/* Replies List */}
            {replies.length === 0 ? (
              <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-8 text-center text-sm text-pesofts-gray-500 shadow-sm">
                No replies yet. Be the first to reply to this question!
              </div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm flex items-start space-x-4"
                  >
                    {/* Reply Author Avatar */}
                    <div className="w-10 h-10 rounded-full bg-pesofts-gray-100 border border-pesofts-gray-200 flex items-center justify-center font-bold text-sm text-pesofts-gray-700 flex-shrink-0">
                      {reply.profiles?.avatar_url ? (
                        <Image
                          src={reply.profiles.avatar_url}
                          alt={reply.profiles.full_name || ""}
                          width={40}
                          height={40}
                          unoptimized
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(reply.profiles?.full_name || null, reply.profiles?.id || null)
                      )}
                    </div>

                    {/* Reply Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-pesofts-gray-500 font-medium">
                          <span className="font-bold text-pesofts-gray-800">
                            {reply.profiles?.full_name || "Community Member"}
                          </span>
                          {reply.profiles?.title && ` · ${reply.profiles.title}`}
                          {reply.profiles?.organization && ` · ${reply.profiles.organization}`}
                        </div>
                        <span className="text-[10px] text-pesofts-gray-400 font-semibold">
                          {timeAgo(reply.created_at)}
                        </span>
                      </div>
                      <div className="text-sm text-pesofts-gray-700 leading-relaxed whitespace-pre-wrap">
                        {reply.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post Reply Editor */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-pesofts-gray-900 mb-4">Post a Reply</h3>

              {user ? (
                <form onSubmit={handlePostReply} className="space-y-4">
                  {replyError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-pesofts-red font-semibold">
                      {replyError}
                    </div>
                  )}
                  <textarea
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your reply here..."
                    required
                    className="block w-full px-4 py-3 text-sm text-pesofts-gray-900 placeholder-pesofts-gray-400 bg-white border border-pesofts-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pesofts-red focus:border-transparent transition-all"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" disabled={submittingReply} className="min-w-[100px] !py-2">
                      {submittingReply ? "Posting..." : <><Send className="h-3.5 w-3.5 mr-1.5" /> Post Reply</>}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-6 bg-pesofts-gray-50 border border-pesofts-gray-150 rounded-xl text-center">
                  <p className="text-sm text-pesofts-gray-500 mb-3">
                    You must be logged in to reply to this discussion.
                  </p>
                  <Button href="/login" variant="outline" className="bg-white !py-1.5 !px-4">
                    Login
                  </Button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Meta Info / Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Thread Details Info Card */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-widest mb-4">
                Discussion Meta
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-pesofts-gray-150 pb-3">
                  <span className="text-pesofts-gray-400 font-semibold">Category</span>
                  <span className="font-bold text-pesofts-gray-700">{question.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-pesofts-gray-150 pb-3">
                  <span className="text-pesofts-gray-400 font-semibold">Views</span>
                  <span className="font-bold text-pesofts-gray-700 flex items-center">
                    <Eye className="h-4 w-4 text-pesofts-gray-400 mr-1.5" />
                    {question.views}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-pesofts-gray-150 pb-3">
                  <span className="text-pesofts-gray-400 font-semibold">Replies</span>
                  <span className="font-bold text-pesofts-gray-700 flex items-center">
                    <MessageSquare className="h-4 w-4 text-pesofts-gray-400 mr-1.5" />
                    {replies.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-pesofts-gray-150 pb-3">
                  <span className="text-pesofts-gray-400 font-semibold">Upvotes</span>
                  <span className="font-bold text-pesofts-gray-700 flex items-center">
                    <ArrowUp className="h-4 w-4 text-pesofts-gray-400 mr-1.5" />
                    {upvotes.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-pesofts-gray-400 font-semibold">Status</span>
                  {question.is_solved ? (
                    <span className="inline-flex items-center text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Solved
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-extrabold text-pesofts-gray-500 bg-pesofts-gray-100 border border-pesofts-gray-200 px-2 py-0.5 rounded-full">
                      Open
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Author Profile Summary */}
            <div className="bg-white border border-pesofts-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold text-pesofts-gray-400 uppercase tracking-widest mb-4">
                Author
              </h3>

              <div className="flex items-center space-x-3.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-pesofts-gray-100 border border-pesofts-gray-200 flex items-center justify-center font-bold text-sm text-pesofts-gray-700 flex-shrink-0">
                  {question.profiles?.avatar_url ? (
                    <Image
                      src={question.profiles.avatar_url}
                      alt={question.profiles.full_name || ""}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(question.profiles?.full_name || null, question.profiles?.id || null)
                  )}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-pesofts-gray-900 leading-tight">
                    {question.profiles?.full_name || "Community Member"}
                  </div>
                  <div className="text-[10px] text-pesofts-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {question.profiles?.role || "user"}
                  </div>
                </div>
              </div>

              {question.profiles?.title && (
                <div className="text-xs text-pesofts-gray-600 mb-2 font-medium">
                  <span className="font-semibold text-pesofts-gray-400">Title:</span> {question.profiles.title}
                </div>
              )}
              {question.profiles?.organization && (
                <div className="text-xs text-pesofts-gray-600 font-medium">
                  <span className="font-semibold text-pesofts-gray-400">Org:</span> {question.profiles.organization}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
